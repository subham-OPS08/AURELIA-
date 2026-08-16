-- =====================================================
-- AURÉLIA Haute Atelier — Supabase Schema
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES (extends auth.users)
-- =====================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  default_address_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 2. PRODUCTS
-- =====================================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  category TEXT NOT NULL CHECK (category IN ('Women', 'Men', 'Accessories', 'Collections')),
  subcategory TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  description TEXT,
  details JSONB DEFAULT '[]'::jsonb,
  materials TEXT,
  care TEXT,
  badge TEXT CHECK (badge IN ('NEW ARRIVAL', 'LIMITED EDITION', 'ICONIC', 'BESPOKE', 'BESTSELLER')),
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_featured ON public.products(featured) WHERE featured = true;

-- =====================================================
-- 3. PRODUCT VARIANTS (size + color combos)
-- =====================================================
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  color_name TEXT NOT NULL,
  color_hex TEXT NOT NULL,
  sku TEXT UNIQUE,
  stock_quantity INTEGER DEFAULT 10,
  price_override NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_variants_product ON public.product_variants(product_id);

-- =====================================================
-- 4. PRODUCT IMAGES
-- =====================================================
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_images_product ON public.product_images(product_id);

-- =====================================================
-- 5. COLLECTIONS
-- =====================================================
CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  season TEXT,
  description TEXT,
  image TEXT,
  item_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. ADDRESSES
-- =====================================================
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT DEFAULT 'Home',
  full_name TEXT NOT NULL,
  phone TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT DEFAULT 'India',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_addresses_user ON public.addresses(user_id);

-- =====================================================
-- 7. ORDERS
-- =====================================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL DEFAULT '',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_email TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'failed')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_cost NUMERIC(10,2) DEFAULT 0,
  discount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  gift_card_id UUID,
  gift_card_amount_used NUMERIC(10,2) DEFAULT 0,
  shipping_address JSONB,
  delivery_method TEXT DEFAULT 'standard',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_order_number ON public.orders(order_number);
CREATE INDEX idx_orders_razorpay ON public.orders(razorpay_order_id);

-- =====================================================
-- 8. ORDER ITEMS
-- =====================================================
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_variant_id UUID REFERENCES public.product_variants(id),
  product_name TEXT NOT NULL,
  variant_info JSONB,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON public.order_items(order_id);

-- =====================================================
-- 9. GIFT CARDS
-- =====================================================
CREATE TABLE public.gift_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  original_amount NUMERIC(10,2) NOT NULL,
  balance NUMERIC(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gift_cards_code ON public.gift_cards(code);

-- =====================================================
-- 10. WISHLIST ITEMS
-- =====================================================
CREATE TABLE public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlist_user ON public.wishlist_items(user_id);

-- =====================================================
-- 11. PRODUCT CATALOG VIEW
-- =====================================================
CREATE OR REPLACE VIEW public.product_catalog AS
SELECT
  p.id,
  p.slug,
  p.name,
  p.tagline,
  p.category,
  p.subcategory,
  p.price,
  p.original_price,
  p.materials,
  p.badge,
  p.in_stock,
  p.featured,
  p.created_at,
  (SELECT url FROM public.product_images pi WHERE pi.product_id = p.id ORDER BY pi.position ASC LIMIT 1) AS primary_image,
  (SELECT url FROM public.product_images pi WHERE pi.product_id = p.id ORDER BY pi.position ASC OFFSET 1 LIMIT 1) AS secondary_image,
  (SELECT COUNT(*)::int FROM public.product_variants pv WHERE pv.product_id = p.id) AS variant_count,
  (
    SELECT jsonb_agg(DISTINCT jsonb_build_object('name', pv.color_name, 'hex', pv.color_hex))
    FROM public.product_variants pv
    WHERE pv.product_id = p.id
  ) AS colors,
  (
    SELECT jsonb_agg(DISTINCT pv.size)
    FROM public.product_variants pv
    WHERE pv.product_id = p.id
  ) AS sizes
FROM public.products p
WHERE p.in_stock = true;

-- =====================================================
-- 12. ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT USING (true);
CREATE POLICY "Product variants are viewable by everyone"
  ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Product images are viewable by everyone"
  ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Collections are viewable by everyone"
  ON public.collections FOR SELECT USING (true);

-- Profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Addresses
CREATE POLICY "Users can view own addresses"
  ON public.addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own addresses"
  ON public.addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own addresses"
  ON public.addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own addresses"
  ON public.addresses FOR DELETE USING (auth.uid() = user_id);

-- Orders
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT USING (auth.uid() = user_id);

-- Order items
CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
      AND o.user_id = auth.uid()
    )
  );

-- Wishlist
CREATE POLICY "Users can view own wishlist"
  ON public.wishlist_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to wishlist"
  ON public.wishlist_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from wishlist"
  ON public.wishlist_items FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 13. UPDATED_AT TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 14. ORDER NUMBER GENERATION
-- =====================================================
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'AUR-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 99999)::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION public.generate_order_number();
