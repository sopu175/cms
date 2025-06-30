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

-- Add documentation settings if they don't exist
INSERT INTO settings (key, value, type, description) VALUES
  ('cms_documentation_version', '"1.0"', 'string', 'CMS documentation version'),
  ('api_documentation_version', '"1.0"', 'string', 'API documentation version'),
  ('show_documentation_links', 'true', 'boolean', 'Show documentation links in the UI')
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
    {"code": "SAR", "name": "Saudi Riyal", "symbol": "﷼"}
  ]', 'json', 'Available currencies')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  description = EXCLUDED.description;

-- Add ecommerce settings if they don't exist
INSERT INTO settings (key, value, type, description) VALUES
  ('tax_rate', '0.08', 'number', 'Default tax rate'),
  ('enable_taxes', 'false', 'boolean', 'Enable taxes'),
  ('enable_shipping', 'true', 'boolean', 'Enable shipping'),
  ('free_shipping_threshold', '100', 'number', 'Free shipping threshold'),
  ('default_shipping_cost', '10', 'number', 'Default shipping cost')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  description = EXCLUDED.description;

-- Add SEO settings if they don't exist
INSERT INTO settings (key, value, type, description) VALUES
  ('meta_title', '""', 'string', 'Default meta title'),
  ('meta_description', '""', 'string', 'Default meta description'),
  ('meta_keywords', '""', 'string', 'Default meta keywords'),
  ('google_analytics_id', '""', 'string', 'Google Analytics ID'),
  ('facebook_pixel_id', '""', 'string', 'Facebook Pixel ID'),
  ('google_tag_manager_id', '""', 'string', 'Google Tag Manager ID'),
  ('robots_txt', '""', 'string', 'Robots.txt content'),
  ('enable_sitemap', 'true', 'boolean', 'Enable XML sitemap'),
  ('sitemap_frequency', '"weekly"', 'string', 'Sitemap change frequency'),
  ('sitemap_priority', '0.7', 'number', 'Sitemap priority')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  description = EXCLUDED.description;

-- Add email settings if they don't exist
INSERT INTO settings (key, value, type, description) VALUES
  ('smtp_host', '""', 'string', 'SMTP host'),
  ('smtp_port', '587', 'number', 'SMTP port'),
  ('smtp_username', '""', 'string', 'SMTP username'),
  ('smtp_password', '""', 'string', 'SMTP password'),
  ('smtp_encryption', '"tls"', 'string', 'SMTP encryption'),
  ('from_email', '""', 'string', 'From email address'),
  ('from_name', '""', 'string', 'From name'),
  ('enable_email_notifications', 'true', 'boolean', 'Enable email notifications')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  description = EXCLUDED.description;

-- Add security settings if they don't exist
INSERT INTO settings (key, value, type, description) VALUES
  ('allow_registration', 'true', 'boolean', 'Allow user registration'),
  ('social_login_enabled', 'false', 'boolean', 'Enable social login'),
  ('enable_captcha', 'true', 'boolean', 'Enable CAPTCHA'),
  ('enable_2fa', 'false', 'boolean', 'Enable two-factor authentication'),
  ('password_min_length', '8', 'number', 'Minimum password length'),
  ('password_requires_special', 'true', 'boolean', 'Require special characters in passwords'),
  ('password_requires_number', 'true', 'boolean', 'Require numbers in passwords'),
  ('session_timeout', '60', 'number', 'Session timeout in minutes')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  description = EXCLUDED.description;