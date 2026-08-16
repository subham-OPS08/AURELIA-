import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { Product } from "@/types/product";
import { PRODUCTS as FALLBACK_PRODUCTS } from "@/lib/data/products";

// Use public client for catalog queries to allow optimal static/ISR generation without cookie dependencies
function getPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function mapCatalogToProduct(row: any): Product {
  const images: string[] = [];
  if (row.primary_image) images.push(row.primary_image);
  if (row.secondary_image) images.push(row.secondary_image);
  if (images.length === 0) {
    images.push("https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop");
  }

  const colors = Array.isArray(row.colors)
    ? row.colors.filter((c: any) => c && typeof c === "object" && c.name && c.hex)
    : [{ name: "Standard", hex: "#181818" }];

  const sizes = Array.isArray(row.sizes) && row.sizes.length > 0
    ? row.sizes
    : ["XS", "S", "M", "L"];

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline || undefined,
    category: row.category as any,
    subcategory: row.subcategory || "Haute Couture",
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    images,
    colors: colors.length > 0 ? colors : [{ name: "Obsidian", hex: "#181818" }],
    sizes: sizes.length > 0 ? sizes : ["One Size"],
    description: row.description || "",
    details: Array.isArray(row.details) ? row.details : [],
    materials: row.materials || "Pure Natural Fibers",
    care: row.care || "Specialist dry clean only",
    badge: row.badge as any,
    inStock: row.in_stock ?? true,
    featured: row.featured ?? false,
  };
}

export async function getProductCatalog(category?: string): Promise<Product[]> {
  try {
    const supabase = getPublicClient();
    let query = supabase.from("product_catalog").select("*");

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn("Product catalog query fallback to local data:", error?.message);
      return FALLBACK_PRODUCTS;
    }

    return data.map(mapCatalogToProduct);
  } catch (err) {
    console.error("Exception fetching product catalog, fallback to local:", err);
    return FALLBACK_PRODUCTS;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from("product_catalog")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return FALLBACK_PRODUCTS.filter((p) => p.featured);
    }

    return data.map(mapCatalogToProduct);
  } catch {
    return FALLBACK_PRODUCTS.filter((p) => p.featured);
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const supabase = getPublicClient();

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (productError || !product) {
      const fallback = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
      return fallback || null;
    }

    const [variantsResult, imagesResult] = await Promise.all([
      supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", product.id)
        .order("size", { ascending: true }),
      supabase
        .from("product_images")
        .select("*")
        .eq("product_id", product.id)
        .order("position", { ascending: true }),
    ]);

    return {
      ...product,
      variants: variantsResult.data || [],
      images: imagesResult.data || [],
    };
  } catch (err) {
    console.error("Error in getProductBySlug:", err);
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) || null;
  }
}

export async function getCollections() {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data;
  } catch {
    return [];
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from("product_catalog")
      .select("*")
      .or(`name.ilike.%${query}%,tagline.ilike.%${query}%,category.ilike.%${query}%,subcategory.ilike.%${query}%`)
      .limit(20);

    if (error || !data) {
      return FALLBACK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    return data.map(mapCatalogToProduct);
  } catch {
    return [];
  }
}
