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
  -- Check if "Public can read profiles" policy exists
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Public can read profiles'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    EXECUTE $POLICY$
      CREATE POLICY "Public can read profiles"
        ON profiles
        FOR SELECT
        TO public
        USING (true);
    $POLICY$;
  END IF;

  -- Check if "Users can insert own profile" policy exists
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    EXECUTE $POLICY$
      CREATE POLICY "Users can insert own profile"
        ON profiles
        FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = id);
    $POLICY$;
  END IF;

  -- Check if "Users can update own profile" policy exists
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    EXECUTE $POLICY$
      CREATE POLICY "Users can update own profile"
        ON profiles
        FOR UPDATE
        TO authenticated
        USING (auth.uid() = id)
        WITH CHECK (auth.uid() = id);
    $POLICY$;
  END IF;

  -- Check if "Users can delete own profile" policy exists
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can delete own profile'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    EXECUTE $POLICY$
      CREATE POLICY "Users can delete own profile"
        ON profiles
        FOR DELETE
        TO authenticated
        USING (auth.uid() = id);
    $POLICY$;
  END IF;

  -- Check if "Admins can manage all profiles" policy exists
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Admins can manage all profiles'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    EXECUTE $POLICY$
      CREATE POLICY "Admins can manage all profiles"
        ON profiles
        FOR ALL
        TO authenticated
        USING (is_admin())
        WITH CHECK (is_admin());
    $POLICY$;
  END IF;

  -- Check if "Public can read categories" policy exists
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'categories' AND policyname = 'Public can read categories'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    EXECUTE $POLICY$
      CREATE POLICY "Public can read categories"
        ON categories
        FOR SELECT
        TO public
        USING (true);
    $POLICY$;
  END IF;

  -- Check if "Admins can manage all categories" policy exists
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'categories' AND policyname = 'Admins can manage all categories'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    EXECUTE $POLICY$
      CREATE POLICY "Admins can manage all categories"
        ON categories
        FOR ALL
        TO authenticated
        USING (is_admin());
    $POLICY$;
  END IF;
END $$;

-- Create remaining policies with IF NOT EXISTS checks
DO $$ 
DECLARE
  policy_exists boolean;
BEGIN
  -- Posts policies
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'posts' AND policyname = 'Public can read published posts'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    EXECUTE $POLICY$
      CREATE POLICY "Public can read published posts"
        ON posts
        FOR SELECT
        TO public
        USING (status = 'published');
    $POLICY$;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'posts' AND policyname = 'Authenticated users can read all posts'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    EXECUTE $POLICY$
      CREATE POLICY "Authenticated users can read all posts"
        ON posts
        FOR SELECT
        TO authenticated
        USING (true);
    $POLICY$;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'posts' AND policyname = 'Authors can manage own posts'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    EXECUTE $POLICY$
      CREATE POLICY "Authors can manage own posts"
        ON posts
        FOR ALL
        TO authenticated
        USING (author_id = auth.uid());
    $POLICY$;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'posts' AND policyname = 'Editors and admins can manage all posts'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    EXECUTE $POLICY$
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
    $POLICY$;
  END IF;
END $$;

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