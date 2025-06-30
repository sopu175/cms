-- Create custom types only if they don't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'editor', 'author', 'customer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived', 'scheduled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE content_type AS ENUM (
      'text', 'rich_text', 'image', 'gallery', 'video', 'audio',
      'table', 'list', 'link', 'button', 'form', 'post_list',
      'product_list', 'hero', 'testimonial', 'faq', 'contact'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE field_type AS ENUM (
      'text', 'email', 'password', 'number', 'tel', 'url',
      'textarea', 'select', 'radio', 'checkbox', 'file',
      'date', 'time', 'datetime', 'color', 'range'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a function to check admin role without recursion
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
$$;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  role user_role DEFAULT 'author',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  color text DEFAULT '#6B7280',
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text,
  excerpt text,
  featured_image text,
  status post_status DEFAULT 'draft',
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz,
  seo_title text,
  seo_description text,
  seo_keywords text[],
  canonical_url text,
  og_image text,
  scheduled_at timestamptz,
  content_blocks jsonb DEFAULT '[]'::jsonb,
  gallery_images jsonb DEFAULT '[]'::jsonb,
  video_url text,
  audio_url text
);

-- Create content_pages table
CREATE TABLE IF NOT EXISTS content_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  html_name text UNIQUE NOT NULL,
  description text,
  background_image text,
  background_color text DEFAULT '#FFFFFF',
  sections jsonb DEFAULT '[]'::jsonb,
  status post_status DEFAULT 'draft',
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  seo_title text,
  seo_description text,
  seo_keywords text[],
  canonical_url text,
  og_image text,
  robots text DEFAULT 'index,follow',
  schema_markup jsonb
);

-- Create sections table
CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_page_id uuid REFERENCES content_pages(id) ON DELETE CASCADE,
  type content_type NOT NULL DEFAULT 'text',
  "order" integer NOT NULL DEFAULT 0,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  settings jsonb DEFAULT '{}'::jsonb,
  styles jsonb DEFAULT '{}'::jsonb
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  images jsonb DEFAULT '[]'::jsonb,
  price decimal(10,2) NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product_variations table
CREATE TABLE IF NOT EXISTS product_variations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  sku text UNIQUE NOT NULL,
  options jsonb NOT NULL DEFAULT '{}'::jsonb,
  price decimal(10,2) NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  order_number text UNIQUE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  shipping_info jsonb NOT NULL DEFAULT '{}'::jsonb,
  total_amount decimal(10,2) NOT NULL,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  variation_id uuid REFERENCES product_variations(id) ON DELETE SET NULL,
  quantity integer NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  type text DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'json')),
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create site_info table
CREATE TABLE IF NOT EXISTS site_info (
  id text PRIMARY KEY DEFAULT '1',
  site_name text NOT NULL,
  logo_url text,
  description text,
  contact_email text,
  phone text,
  address text,
  social_icons jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, user_id)
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value decimal(10,2) NOT NULL,
  min_amount decimal(10,2),
  max_uses integer,
  used_count integer DEFAULT 0,
  expires_at timestamptz,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create media table
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_name text NOT NULL,
  mime_type text NOT NULL,
  file_size integer NOT NULL,
  url text NOT NULL,
  alt_text text,
  caption text,
  folder text DEFAULT 'uploads',
  uploaded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create menus table
CREATE TABLE IF NOT EXISTS menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  location text NOT NULL,
  items jsonb DEFAULT '[]'::jsonb,
  settings jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create forms table
CREATE TABLE IF NOT EXISTS forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  settings jsonb DEFAULT '{}'::jsonb,
  fields jsonb DEFAULT '[]'::jsonb,
  notifications jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create form_submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid REFERENCES forms(id) ON DELETE CASCADE,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_address inet,
  user_agent text,
  submitted_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create seo_meta table
CREATE TABLE IF NOT EXISTS seo_meta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  meta_title text,
  meta_description text,
  meta_keywords text[],
  og_title text,
  og_description text,
  og_image text,
  og_type text DEFAULT 'website',
  twitter_card text DEFAULT 'summary',
  twitter_title text,
  twitter_description text,
  twitter_image text,
  canonical_url text,
  robots text DEFAULT 'index,follow',
  schema_markup jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(entity_type, entity_id)
);

-- Drop existing views to recreate them
DROP VIEW IF EXISTS posts_with_details;
DROP VIEW IF EXISTS products_with_details;

-- Create view for posts with details
CREATE VIEW posts_with_details AS
SELECT 
  p.*,
  pr.username as author_name,
  pr.email as author_email,
  c.name as category_name,
  c.color as category_color
FROM posts p
LEFT JOIN profiles pr ON p.author_id = pr.id
LEFT JOIN categories c ON p.category_id = c.id;

-- Create view for products with details
CREATE VIEW products_with_details AS
SELECT 
  p.*,
  c.name as category_name,
  COUNT(pv.id) as variations_count,
  COALESCE(AVG(r.rating), 0) as average_rating,
  COUNT(r.id) as reviews_count
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_variations pv ON p.id = pv.product_id
LEFT JOIN reviews r ON p.id = r.product_id AND r.status = 'approved'
GROUP BY p.id, c.name;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_content_pages_updated_at ON content_pages;
CREATE TRIGGER update_content_pages_updated_at
  BEFORE UPDATE ON content_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_variations_updated_at ON product_variations;
CREATE TRIGGER update_product_variations_updated_at
  BEFORE UPDATE ON product_variations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_info_updated_at ON site_info;
CREATE TRIGGER update_site_info_updated_at
  BEFORE UPDATE ON site_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coupons_updated_at ON coupons;
CREATE TRIGGER update_coupons_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_media_updated_at ON media;
CREATE TRIGGER update_media_updated_at
  BEFORE UPDATE ON media
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_menus_updated_at ON menus;
CREATE TRIGGER update_menus_updated_at
  BEFORE UPDATE ON menus
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_forms_updated_at ON forms;
CREATE TRIGGER update_forms_updated_at
  BEFORE UPDATE ON forms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_seo_meta_updated_at ON seo_meta;
CREATE TRIGGER update_seo_meta_updated_at
  BEFORE UPDATE ON seo_meta
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_meta ENABLE ROW LEVEL SECURITY;

-- Check if policies exist before creating them
DO $$ 
DECLARE
  policy_exists boolean;
BEGIN
  -- Profiles policies
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Public can read profiles'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Public can read profiles"
      ON profiles
      FOR SELECT
      TO public
      USING (true);
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Users can insert own profile"
      ON profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Users can update own profile"
      ON profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can delete own profile'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Users can delete own profile"
      ON profiles
      FOR DELETE
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Admins can manage all profiles'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Admins can manage all profiles"
      ON profiles
      FOR ALL
      TO authenticated
      USING (is_admin())
      WITH CHECK (is_admin());
  END IF;

  -- Categories policies
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'categories' AND policyname = 'Public can read categories'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Public can read categories"
      ON categories
      FOR SELECT
      TO public
      USING (true);
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'categories' AND policyname = 'Admins can manage all categories'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Admins can manage all categories"
      ON categories
      FOR ALL
      TO authenticated
      USING (is_admin());
  END IF;

  -- Posts policies
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'posts' AND policyname = 'Public can read published posts'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Public can read published posts"
      ON posts
      FOR SELECT
      TO public
      USING (status = 'published');
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'posts' AND policyname = 'Authenticated users can read all posts'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Authenticated users can read all posts"
      ON posts
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'posts' AND policyname = 'Authors can manage own posts'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Authors can manage own posts"
      ON posts
      FOR ALL
      TO authenticated
      USING (author_id = auth.uid());
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'posts' AND policyname = 'Editors and admins can manage all posts'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Editors and admins can manage all posts"
      ON posts
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
      );
  END IF;
END $$;

-- Create remaining policies with IF NOT EXISTS checks
DO $$ 
DECLARE
  policy_exists boolean;
BEGIN
  -- Content pages policies
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'content_pages' AND policyname = 'Anyone can read published content pages'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Anyone can read published content pages"
      ON content_pages
      FOR SELECT
      USING (status = 'published');
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'content_pages' AND policyname = 'Authors can manage own content pages'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Authors can manage own content pages"
      ON content_pages
      FOR ALL
      TO authenticated
      USING (author_id = auth.uid());
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'content_pages' AND policyname = 'Editors and admins can manage all content pages'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Editors and admins can manage all content pages"
      ON content_pages
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
      );
  END IF;

  -- Sections policies
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sections' AND policyname = 'Anyone can read sections of published pages'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Anyone can read sections of published pages"
      ON sections
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM content_pages
          WHERE id = sections.content_page_id AND status = 'published'
        )
      );
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sections' AND policyname = 'Authors can manage sections of own pages'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Authors can manage sections of own pages"
      ON sections
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM content_pages
          WHERE id = sections.content_page_id AND author_id = auth.uid()
        )
      );
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sections' AND policyname = 'Editors and admins can manage all sections'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Editors and admins can manage all sections"
      ON sections
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
      );
  END IF;
END $$;

-- Create remaining policies for other tables
DO $$ 
DECLARE
  policy_exists boolean;
BEGIN
  -- Products policies
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' AND policyname = 'Anyone can read active products'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Anyone can read active products"
      ON products
      FOR SELECT
      USING (status = 'active');
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' AND policyname = 'Editors and admins can manage products'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Editors and admins can manage products"
      ON products
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
      );
  END IF;

  -- Product variations policies
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'product_variations' AND policyname = 'Anyone can read active product variations'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Anyone can read active product variations"
      ON product_variations
      FOR SELECT
      USING (
        status = 'active' AND
        EXISTS (
          SELECT 1 FROM products
          WHERE id = product_variations.product_id AND status = 'active'
        )
      );
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'product_variations' AND policyname = 'Editors and admins can manage product variations'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Editors and admins can manage product variations"
      ON product_variations
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
      );
  END IF;
END $$;

-- Create remaining policies for orders and related tables
DO $$ 
DECLARE
  policy_exists boolean;
BEGIN
  -- Orders policies
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'orders' AND policyname = 'Users can read own orders'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Users can read own orders"
      ON orders
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'orders' AND policyname = 'Users can create own orders'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Users can create own orders"
      ON orders
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'orders' AND policyname = 'Users can update own pending orders'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Users can update own pending orders"
      ON orders
      FOR UPDATE
      TO authenticated
      USING (user_id = auth.uid() AND status = 'pending');
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'orders' AND policyname = 'Admins and editors can manage all orders'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Admins and editors can manage all orders"
      ON orders
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
      );
  END IF;
END $$;

-- Create remaining policies for other tables
DO $$ 
DECLARE
  policy_exists boolean;
BEGIN
  -- Order items policies
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'order_items' AND policyname = 'Users can read own order items'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Users can read own order items"
      ON order_items
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM orders
          WHERE id = order_items.order_id AND user_id = auth.uid()
        )
      );
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'order_items' AND policyname = 'Users can create order items for own orders'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Users can create order items for own orders"
      ON order_items
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM orders
          WHERE id = order_items.order_id AND user_id = auth.uid()
        )
      );
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'order_items' AND policyname = 'Admins and editors can manage all order items'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Admins and editors can manage all order items"
      ON order_items
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
      );
  END IF;
END $$;

-- Create remaining policies for settings and site_info
DO $$ 
DECLARE
  policy_exists boolean;
BEGIN
  -- Settings policies
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'settings' AND policyname = 'Anyone can read settings'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Anyone can read settings"
      ON settings
      FOR SELECT
      USING (true);
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'settings' AND policyname = 'Only admins can manage settings'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Only admins can manage settings"
      ON settings
      FOR ALL
      TO authenticated
      USING (is_admin());
  END IF;

  -- Site info policies
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'site_info' AND policyname = 'Anyone can read site info'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Anyone can read site info"
      ON site_info
      FOR SELECT
      USING (true);
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'site_info' AND policyname = 'Only admins can manage site info'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Only admins can manage site info"
      ON site_info
      FOR ALL
      TO authenticated
      USING (is_admin());
  END IF;
END $$;

-- Create remaining policies for other tables
DO $$ 
DECLARE
  policy_exists boolean;
BEGIN
  -- Wishlists policies
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'wishlists' AND policyname = 'Users can manage own wishlists'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Users can manage own wishlists"
      ON wishlists
      FOR ALL
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  -- Reviews policies
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reviews' AND policyname = 'Anyone can read approved reviews'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Anyone can read approved reviews"
      ON reviews
      FOR SELECT
      USING (status = 'approved');
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reviews' AND policyname = 'Users can create own reviews'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Users can create own reviews"
      ON reviews
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reviews' AND policyname = 'Users can update own pending reviews'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Users can update own pending reviews"
      ON reviews
      FOR UPDATE
      TO authenticated
      USING (user_id = auth.uid() AND status = 'pending');
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reviews' AND policyname = 'Admins and editors can manage all reviews'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Admins and editors can manage all reviews"
      ON reviews
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
      );
  END IF;
END $$;

-- Create remaining policies for coupons and media
DO $$ 
DECLARE
  policy_exists boolean;
BEGIN
  -- Coupons policies
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'coupons' AND policyname = 'Anyone can read active coupons'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Anyone can read active coupons"
      ON coupons
      FOR SELECT
      USING (status = 'active' AND (expires_at IS NULL OR expires_at > now()));
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'coupons' AND policyname = 'Only admins can manage coupons'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Only admins can manage coupons"
      ON coupons
      FOR ALL
      TO authenticated
      USING (is_admin());
  END IF;

  -- Media policies
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'media' AND policyname = 'Anyone can read media'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Anyone can read media"
      ON media
      FOR SELECT
      USING (true);
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'media' AND policyname = 'Authenticated users can upload media'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Authenticated users can upload media"
      ON media
      FOR INSERT
      TO authenticated
      WITH CHECK (uploaded_by = auth.uid());
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'media' AND policyname = 'Users can manage own media'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Users can manage own media"
      ON media
      FOR ALL
      TO authenticated
      USING (uploaded_by = auth.uid());
  END IF;
END $$;

-- Create remaining policies for menus, forms, and seo_meta
DO $$ 
DECLARE
  policy_exists boolean;
BEGIN
  -- Menus policies
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'menus' AND policyname = 'Anyone can read active menus'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Anyone can read active menus"
      ON menus
      FOR SELECT
      USING (status = 'active');
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'menus' AND policyname = 'Authenticated users can manage menus'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Authenticated users can manage menus"
      ON menus
      FOR ALL
      TO authenticated
      USING (true);
  END IF;

  -- Forms policies
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'forms' AND policyname = 'Anyone can read active forms'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Anyone can read active forms"
      ON forms
      FOR SELECT
      USING (status = 'active');
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'forms' AND policyname = 'Authenticated users can manage forms'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Authenticated users can manage forms"
      ON forms
      FOR ALL
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create remaining policies for form_submissions and seo_meta
DO $$ 
DECLARE
  policy_exists boolean;
BEGIN
  -- Form submissions policies
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'form_submissions' AND policyname = 'Users can submit forms'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Users can submit forms"
      ON form_submissions
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'form_submissions' AND policyname = 'Users can read own submissions'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Users can read own submissions"
      ON form_submissions
      FOR SELECT
      TO authenticated
      USING (submitted_by = auth.uid());
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'form_submissions' AND policyname = 'Authenticated users can manage all submissions'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Authenticated users can manage all submissions"
      ON form_submissions
      FOR ALL
      TO authenticated
      USING (true);
  END IF;

  -- SEO meta policies
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'seo_meta' AND policyname = 'Anyone can read seo meta'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Anyone can read seo meta"
      ON seo_meta
      FOR SELECT
      USING (true);
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'seo_meta' AND policyname = 'Authenticated users can manage seo meta'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Authenticated users can manage seo meta"
      ON seo_meta
      FOR ALL
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create functions for stock management
CREATE OR REPLACE FUNCTION decrement_variation_stock(variation_id uuid, quantity integer)
RETURNS void AS $$
BEGIN
  UPDATE product_variations
  SET stock = stock - quantity
  WHERE id = variation_id AND stock >= quantity;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for variation %', variation_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_variation_stock(variation_id uuid, quantity integer)
RETURNS void AS $$
BEGIN
  UPDATE product_variations
  SET stock = stock + quantity
  WHERE id = variation_id;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_folder ON media(folder);
CREATE INDEX IF NOT EXISTS idx_media_mime_type ON media(mime_type);
CREATE INDEX IF NOT EXISTS idx_menus_location ON menus(location);
CREATE INDEX IF NOT EXISTS idx_forms_status ON forms(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_id ON form_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_seo_meta_entity ON seo_meta(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_at ON posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_sections_type ON sections(type);

-- Insert default categories
INSERT INTO categories (name, slug, description, color) VALUES
  ('General', 'general', 'General posts and articles', '#6B7280'),
  ('Technology', 'technology', 'Tech news and tutorials', '#3B82F6'),
  ('Business', 'business', 'Business insights and strategies', '#10B981'),
  ('Lifestyle', 'lifestyle', 'Lifestyle and personal content', '#F59E0B')
ON CONFLICT (slug) DO NOTHING;

-- Insert default site info
INSERT INTO site_info (site_name, description) VALUES
  ('DC CMS', 'A modern headless CMS and ecommerce platform')
ON CONFLICT (id) DO NOTHING;

-- Insert default settings
INSERT INTO settings (key, value, type, description) VALUES
  ('site_maintenance', 'false', 'boolean', 'Enable maintenance mode'),
  ('allow_registration', 'true', 'boolean', 'Allow user registration'),
  ('default_currency', '"USD"', 'string', 'Default currency code'),
  ('tax_rate', '0.08', 'number', 'Default tax rate'),
  ('shipping_cost', '10.00', 'number', 'Default shipping cost'),
  ('free_shipping_threshold', '100.00', 'number', 'Free shipping threshold'),
  ('max_order_items', '50', 'number', 'Maximum items per order'),
  ('email_notifications', 'true', 'boolean', 'Enable email notifications'),
  ('analytics_tracking_id', '""', 'string', 'Google Analytics tracking ID'),
  ('social_login_enabled', 'false', 'boolean', 'Enable social login')
ON CONFLICT (key) DO NOTHING;

-- Insert default menus
INSERT INTO menus (name, slug, location, items) VALUES
  ('Main Navigation', 'main-nav', 'header', '[
    {"label": "Home", "url": "/", "type": "page"},
    {"label": "About", "url": "/about", "type": "page"},
    {"label": "Products", "url": "/products", "type": "page"},
    {"label": "Contact", "url": "/contact", "type": "page"}
  ]'::jsonb),
  ('Footer Menu', 'footer-menu', 'footer', '[
    {"label": "Privacy Policy", "url": "/privacy", "type": "page"},
    {"label": "Terms of Service", "url": "/terms", "type": "page"},
    {"label": "Support", "url": "/support", "type": "page"}
  ]'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample form
INSERT INTO forms (name, slug, description, fields, settings) VALUES
  ('Contact Form', 'contact', 'General contact form for inquiries', '[
    {
      "id": "name",
      "type": "text",
      "label": "Full Name",
      "placeholder": "Enter your full name",
      "required": true,
      "order": 1
    },
    {
      "id": "email",
      "type": "email",
      "label": "Email Address",
      "placeholder": "Enter your email",
      "required": true,
      "order": 2
    },
    {
      "id": "subject",
      "type": "text",
      "label": "Subject",
      "placeholder": "What is this about?",
      "required": true,
      "order": 3
    },
    {
      "id": "message",
      "type": "textarea",
      "label": "Message",
      "placeholder": "Your message here...",
      "required": true,
      "rows": 5,
      "order": 4
    }
  ]'::jsonb, '{
    "submit_text": "Send Message",
    "success_message": "Thank you for your message! We will get back to you soon.",
    "email_notifications": true,
    "notification_email": "admin@dccms.com"
  }'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    CASE 
      WHEN NEW.email = 'admin@dccms.com' THEN 'admin'::user_role
      ELSE 'customer'::user_role
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();