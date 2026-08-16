export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  category: "Women" | "Men" | "Accessories" | "Collections";
  subcategory: string;
  price: number;
  originalPrice?: number;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  description: string;
  details: string[];
  materials: string;
  care: string;
  badge?: "NEW ARRIVAL" | "LIMITED EDITION" | "ICONIC" | "BESPOKE" | "BESTSELLER";
  inStock: boolean;
  featured?: boolean;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  season: string;
  description: string;
  image: string;
  itemCount: number;
}

export interface PressMention {
  id: string;
  publication: string;
  quote: string;
  date: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  verified: boolean;
}
