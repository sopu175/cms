-- Update site_info table with new fields
ALTER TABLE site_info 
ADD COLUMN IF NOT EXISTS logo_light text,
ADD COLUMN IF NOT EXISTS logo_dark text,
ADD COLUMN IF NOT EXISTS favicon text,
ADD COLUMN IF NOT EXISTS tagline text,
ADD COLUMN IF NOT EXISTS contact_info jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS copyright_text text,
ADD COLUMN IF NOT EXISTS google_analytics text,
ADD COLUMN IF NOT EXISTS facebook_pixel text,
ADD COLUMN IF NOT EXISTS google_tag_manager text,
ADD COLUMN IF NOT EXISTS custom_head_code text,
ADD COLUMN IF NOT EXISTS custom_footer_code text,
ADD COLUMN IF NOT EXISTS maintenance_mode boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS maintenance_message text,
ADD COLUMN IF NOT EXISTS seo_title text,
ADD COLUMN IF NOT EXISTS seo_description text,
ADD COLUMN IF NOT EXISTS seo_keywords text,
ADD COLUMN IF NOT EXISTS og_image text,
ADD COLUMN IF NOT EXISTS robots_txt text,
ADD COLUMN IF NOT EXISTS structured_data text,
ADD COLUMN IF NOT EXISTS enable_sitemap boolean DEFAULT true;

-- Update social_icons to use a more structured format if it doesn't exist
DO $$
BEGIN
  -- Check if social_icons exists and is empty or null
  IF EXISTS (
    SELECT 1 FROM site_info 
    WHERE id = '1' AND (social_icons IS NULL OR social_icons = '[]'::jsonb)
  ) THEN
    -- Update with default structure
    UPDATE site_info
    SET social_icons = '[
      {"id": "1", "platform": "facebook", "url": "", "icon": "facebook"},
      {"id": "2", "platform": "twitter", "url": "", "icon": "twitter"},
      {"id": "3", "platform": "instagram", "url": "", "icon": "instagram"}
    ]'::jsonb
    WHERE id = '1';
  END IF;
END $$;

-- Add default contact_info if it doesn't exist
DO $$
BEGIN
  -- Check if contact_info exists and is empty or null
  IF EXISTS (
    SELECT 1 FROM site_info 
    WHERE id = '1' AND (contact_info IS NULL OR contact_info = '[]'::jsonb)
  ) THEN
    -- Update with default structure
    UPDATE site_info
    SET contact_info = '[
      {
        "id": "1",
        "label": "Main Office",
        "address": "",
        "map_url": "",
        "emails": [{"label": "Contact", "link": ""}],
        "phones": [{"label": "Main", "link": ""}]
      }
    ]'::jsonb
    WHERE id = '1';
  END IF;
END $$;

-- Add currency settings if they don't exist
INSERT INTO settings (key, value, type, description) VALUES
  ('default_currency', '"BDT"', 'string', 'Default currency code'),
  ('currency_symbol', '"৳"', 'string', 'Default currency symbol'),
  ('currency_position', '"left"', 'string', 'Position of currency symbol'),
  ('thousand_separator', '","', 'string', 'Thousand separator character'),
  ('decimal_separator', '"."', 'string', 'Decimal separator character'),
  ('decimal_places', '2', 'number', 'Number of decimal places')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  description = EXCLUDED.description;

-- Add additional currency options
INSERT INTO settings (key, value, type, description) VALUES
  ('available_currencies', '[
    {"code": "BDT", "name": "Bangladeshi Taka", "symbol": "৳"},
    {"code": "USD", "name": "US Dollar", "symbol": "$"},
    {"code": "EUR", "name": "Euro", "symbol": "€"},
    {"code": "GBP", "name": "British Pound", "symbol": "£"},
    {"code": "INR", "name": "Indian Rupee", "symbol": "₹"},
    {"code": "JPY", "name": "Japanese Yen", "symbol": "¥"},
    {"code": "CNY", "name": "Chinese Yuan", "symbol": "¥"},
    {"code": "AUD", "name": "Australian Dollar", "symbol": "A$"},
    {"code": "CAD", "name": "Canadian Dollar", "symbol": "C$"},
    {"code": "SGD", "name": "Singapore Dollar", "symbol": "S$"},
    {"code": "MYR", "name": "Malaysian Ringgit", "symbol": "RM"},
    {"code": "THB", "name": "Thai Baht", "symbol": "฿"},
    {"code": "PKR", "name": "Pakistani Rupee", "symbol": "₨"},
    {"code": "NPR", "name": "Nepalese Rupee", "symbol": "रू"},
    {"code": "LKR", "name": "Sri Lankan Rupee", "symbol": "රු"},
    {"code": "AED", "name": "UAE Dirham", "symbol": "د.إ"},
    {"code": "SAR", "name": "Saudi Riyal", "symbol": "﷼"},
    {"code": "IDR", "name": "Indonesian Rupiah", "symbol": "Rp"},
    {"code": "VND", "name": "Vietnamese Dong", "symbol": "₫"},
    {"code": "PHP", "name": "Philippine Peso", "symbol": "₱"},
    {"code": "KRW", "name": "South Korean Won", "symbol": "₩"},
    {"code": "EGP", "name": "Egyptian Pound", "symbol": "E£"},
    {"code": "NGN", "name": "Nigerian Naira", "symbol": "₦"},
    {"code": "ZAR", "name": "South African Rand", "symbol": "R"},
    {"code": "BRL", "name": "Brazilian Real", "symbol": "R$"}
  ]', 'json', 'Available currencies')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  description = EXCLUDED.description;

-- Add documentation settings if they don't exist
INSERT INTO settings (key, value, type, description) VALUES
  ('cms_documentation_version', '"1.0"', 'string', 'CMS documentation version'),
  ('api_documentation_version', '"1.0"', 'string', 'API documentation version'),
  ('show_documentation_links', 'true', 'boolean', 'Show documentation links in the UI')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  description = EXCLUDED.description;