-- ================================================================
-- THE GIOI LINH KIEN & PCB - SUPABASE DATABASE SCHEMA MIGRATION
-- Generated for PostgreSQL / Supabase
-- ================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SYSTEM SETTINGS
CREATE TABLE IF NOT EXISTS public.system_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    shop_name TEXT NOT NULL DEFAULT 'Thế Giới Linh Kiện & PCB',
    hotline TEXT DEFAULT '0392.733.577',
    zalo_phone TEXT DEFAULT '0392733577',
    facebook_url TEXT DEFAULT 'https://www.facebook.com/nhan.votan.395',
    email TEXT DEFAULT 'contact@thegioilinhkienpcb.vn',
    address TEXT DEFAULT 'Hà Nội & TP. Hồ Chí Minh',
    bank_name TEXT DEFAULT 'MBBank',
    bank_account TEXT DEFAULT '0392733577',
    bank_owner TEXT DEFAULT 'VO TAN NHAN',
    default_shipping_fee NUMERIC DEFAULT 30000,
    free_shipping_threshold NUMERIC DEFAULT 500000,
    announcement_text TEXT DEFAULT 'Khuyến mãi gia công PCB: Đặt mạch 2 lớp chỉ từ 150.000đ - Miễn phí DFM!',
    show_announcement BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. PRODUCTS (Linh kiện điện tử)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    category_slug TEXT NOT NULL,
    brand TEXT NOT NULL,
    price NUMERIC NOT NULL CHECK (price >= 0),
    compare_price NUMERIC CHECK (compare_price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    unit TEXT DEFAULT 'Cái',
    thumbnail TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    datasheet_url TEXT,
    attributes JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. COMMERCE ORDERS (Đơn hàng linh kiện)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    customer_address TEXT NOT NULL,
    notes TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC NOT NULL,
    shipping_fee NUMERIC NOT NULL DEFAULT 0,
    discount NUMERIC NOT NULL DEFAULT 0,
    total_amount NUMERIC NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'cod',
    payment_status TEXT NOT NULL DEFAULT 'pending',
    order_status TEXT NOT NULL DEFAULT 'pending_payment',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. PCB REQUESTS (Yêu cầu gia công mạch in & lắp ráp)
CREATE TABLE IF NOT EXISTS public.pcb_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    customer_address TEXT,
    notes TEXT,
    specs JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending_quote',
    status_text TEXT DEFAULT 'Chờ báo giá',
    quote_price NUMERIC,
    admin_notes TEXT,
    estimated_price NUMERIC,
    files JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pcb_requests ENABLE ROW LEVEL SECURITY;

-- Public can read settings, categories, and active products
CREATE POLICY "Public read settings" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (status = 'active');

-- Public can insert orders and pcb_requests
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own orders by phone/code" ON public.orders FOR SELECT USING (true);

CREATE POLICY "Public insert pcb requests" ON public.pcb_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own pcb requests" ON public.pcb_requests FOR SELECT USING (true);

-- Admin full access
CREATE POLICY "Admin manage products" ON public.products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage orders" ON public.orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage pcb requests" ON public.pcb_requests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage settings" ON public.system_settings FOR ALL USING (auth.role() = 'authenticated');
