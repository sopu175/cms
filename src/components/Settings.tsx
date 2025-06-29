import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Globe, 
  DollarSign, 
  Search, 
  Mail, 
  Shield, 
  FileText,
  ExternalLink,
  Download,
  Check,
  X,
  Info,
  AlertCircle,
  Settings as SettingsIcon,
  Upload,
  Image,
  Link,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../hooks/useSettings';
import { useSiteInfo } from '../hooks/useSiteInfo';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { settings, updateSettings } = useSettings();
  const { siteInfo, updateSiteInfo } = useSiteInfo();
  const [activeTab, setActiveTab] = useState('general');
  const [showDocumentation, setShowDocumentation] = useState<'cms' | 'api' | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    site_name: '',
    site_description: '',
    logo_url: '',
    favicon_url: '',
    contact_email: '',
    phone: '',
    address: '',
    social_media: [] as {platform: string, url: string, icon: string}[]
  });

  const [ecommerceSettings, setEcommerceSettings] = useState({
    currency: 'BDT',
    currency_symbol: '৳',
    currency_position: 'left',
    thousand_separator: ',',
    decimal_separator: '.',
    decimal_places: 2,
    enable_taxes: false,
    tax_rate: 0,
    enable_shipping: true,
    free_shipping_threshold: 100,
    default_shipping_cost: 10,
    enable_coupons: true,
    enable_reviews: true,
    enable_wishlist: true,
    stock_management: true,
    low_stock_threshold: 5
  });

  const [seoSettings, setSeoSettings] = useState({
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    google_analytics_id: '',
    facebook_pixel_id: '',
    google_tag_manager_id: '',
    robots_txt: '',
    enable_sitemap: true,
    sitemap_frequency: 'weekly',
    sitemap_priority: 0.7
  });

  const [emailSettings, setEmailSettings] = useState({
    smtp_host: '',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    smtp_encryption: 'tls',
    from_email: '',
    from_name: '',
    enable_email_notifications: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    allow_registration: true,
    social_login_enabled: false,
    enable_captcha: true,
    enable_2fa: false,
    password_min_length: 8,
    password_requires_special: true,
    password_requires_number: true,
    session_timeout: 60
  });

  // Available currencies
  const [availableCurrencies, setAvailableCurrencies] = useState([
    { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿' },
    { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨' },
    { code: 'NPR', name: 'Nepalese Rupee', symbol: 'रू' },
    { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'රු' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' }
  ]);

  // Load settings from database
  useEffect(() => {
    if (settings) {
      // Load ecommerce settings
      setEcommerceSettings({
        currency: settings.default_currency || 'BDT',
        currency_symbol: settings.currency_symbol || '৳',
        currency_position: settings.currency_position || 'left',
        thousand_separator: settings.thousand_separator || ',',
        decimal_separator: settings.decimal_separator || '.',
        decimal_places: settings.decimal_places || 2,
        enable_taxes: settings.enable_taxes || false,
        tax_rate: settings.tax_rate || 0,
        enable_shipping: settings.enable_shipping !== false,
        free_shipping_threshold: settings.free_shipping_threshold || 100,
        default_shipping_cost: settings.default_shipping_cost || 10,
        enable_coupons: settings.enable_coupons !== false,
        enable_reviews: settings.enable_reviews !== false,
        enable_wishlist: settings.enable_wishlist !== false,
        stock_management: settings.stock_management !== false,
        low_stock_threshold: settings.low_stock_threshold || 5
      });

      // Load SEO settings
      setSeoSettings({
        meta_title: settings.meta_title || '',
        meta_description: settings.meta_description || '',
        meta_keywords: settings.meta_keywords || '',
        google_analytics_id: settings.google_analytics_id || '',
        facebook_pixel_id: settings.facebook_pixel_id || '',
        google_tag_manager_id: settings.google_tag_manager_id || '',
        robots_txt: settings.robots_txt || '',
        enable_sitemap: settings.enable_sitemap !== false,
        sitemap_frequency: settings.sitemap_frequency || 'weekly',
        sitemap_priority: settings.sitemap_priority || 0.7
      });

      // Load email settings
      setEmailSettings({
        smtp_host: settings.smtp_host || '',
        smtp_port: settings.smtp_port || 587,
        smtp_username: settings.smtp_username || '',
        smtp_password: settings.smtp_password || '',
        smtp_encryption: settings.smtp_encryption || 'tls',
        from_email: settings.from_email || '',
        from_name: settings.from_name || '',
        enable_email_notifications: settings.enable_email_notifications !== false
      });

      // Load security settings
      setSecuritySettings({
        allow_registration: settings.allow_registration !== false,
        social_login_enabled: settings.social_login_enabled || false,
        enable_captcha: settings.enable_captcha !== false,
        enable_2fa: settings.enable_2fa || false,
        password_min_length: settings.password_min_length || 8,
        password_requires_special: settings.password_requires_special !== false,
        password_requires_number: settings.password_requires_number !== false,
        session_timeout: settings.session_timeout || 60
      });

      // Load available currencies if present
      if (settings.available_currencies) {
        setAvailableCurrencies(settings.available_currencies);
      }
    }

    // Load site info
    if (siteInfo) {
      setGeneralSettings({
        site_name: siteInfo.site_name || '',
        site_description: siteInfo.description || '',
        logo_url: siteInfo.logo_url || '',
        favicon_url: siteInfo.favicon || '',
        contact_email: siteInfo.contact_email || '',
        phone: siteInfo.phone || '',
        address: siteInfo.address || '',
        social_media: siteInfo.social_icons || []
      });
    }
  }, [settings, siteInfo]);

  const handleSaveSettings = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      // Save general settings to site_info table
      await updateSiteInfo({
        site_name: generalSettings.site_name,
        description: generalSettings.site_description,
        logo_url: generalSettings.logo_url,
        favicon: generalSettings.favicon_url,
        contact_email: generalSettings.contact_email,
        phone: generalSettings.phone,
        address: generalSettings.address,
        social_icons: generalSettings.social_media
      });

      // Save other settings to settings table
      await updateSettings({
        // Ecommerce settings
        default_currency: ecommerceSettings.currency,
        currency_symbol: ecommerceSettings.currency_symbol,
        currency_position: ecommerceSettings.currency_position,
        thousand_separator: ecommerceSettings.thousand_separator,
        decimal_separator: ecommerceSettings.decimal_separator,
        decimal_places: ecommerceSettings.decimal_places,
        enable_taxes: ecommerceSettings.enable_taxes,
        tax_rate: ecommerceSettings.tax_rate,
        enable_shipping: ecommerceSettings.enable_shipping,
        free_shipping_threshold: ecommerceSettings.free_shipping_threshold,
        default_shipping_cost: ecommerceSettings.default_shipping_cost,
        enable_coupons: ecommerceSettings.enable_coupons,
        enable_reviews: ecommerceSettings.enable_reviews,
        enable_wishlist: ecommerceSettings.enable_wishlist,
        stock_management: ecommerceSettings.stock_management,
        low_stock_threshold: ecommerceSettings.low_stock_threshold,
        
        // SEO settings
        meta_title: seoSettings.meta_title,
        meta_description: seoSettings.meta_description,
        meta_keywords: seoSettings.meta_keywords,
        google_analytics_id: seoSettings.google_analytics_id,
        facebook_pixel_id: seoSettings.facebook_pixel_id,
        google_tag_manager_id: seoSettings.google_tag_manager_id,
        robots_txt: seoSettings.robots_txt,
        enable_sitemap: seoSettings.enable_sitemap,
        sitemap_frequency: seoSettings.sitemap_frequency,
        sitemap_priority: seoSettings.sitemap_priority,
        
        // Email settings
        smtp_host: emailSettings.smtp_host,
        smtp_port: emailSettings.smtp_port,
        smtp_username: emailSettings.smtp_username,
        smtp_password: emailSettings.smtp_password,
        smtp_encryption: emailSettings.smtp_encryption,
        from_email: emailSettings.from_email,
        from_name: emailSettings.from_name,
        enable_email_notifications: emailSettings.enable_email_notifications,
        
        // Security settings
        allow_registration: securitySettings.allow_registration,
        social_login_enabled: securitySettings.social_login_enabled,
        enable_captcha: securitySettings.enable_captcha,
        enable_2fa: securitySettings.enable_2fa,
        password_min_length: securitySettings.password_min_length,
        password_requires_special: securitySettings.password_requires_special,
        password_requires_number: securitySettings.password_requires_number,
        session_timeout: securitySettings.session_timeout,
        
        // Store available currencies
        available_currencies: availableCurrencies
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSocialMedia = () => {
    setGeneralSettings({
      ...generalSettings,
      social_media: [
        ...generalSettings.social_media,
        { platform: 'facebook', url: '', icon: 'facebook' }
      ]
    });
  };

  const handleRemoveSocialMedia = (index: number) => {
    const newSocialMedia = [...generalSettings.social_media];
    newSocialMedia.splice(index, 1);
    setGeneralSettings({
      ...generalSettings,
      social_media: newSocialMedia
    });
  };

  const updateSocialMedia = (index: number, field: string, value: string) => {
    const newSocialMedia = [...generalSettings.social_media];
    newSocialMedia[index] = {
      ...newSocialMedia[index],
      [field]: value
    };
    setGeneralSettings({
      ...generalSettings,
      social_media: newSocialMedia
    });
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return Facebook;
      case 'twitter': return Twitter;
      case 'instagram': return Instagram;
      case 'linkedin': return Linkedin;
      case 'youtube': return Youtube;
      case 'github': return Github;
      default: return Link;
    }
  };

  // Only admin can access settings
  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to access settings. Please contact an administrator.
        </p>
      </div>
    );
  }

  // Render documentation modal
  const renderDocumentation = () => {
    if (!showDocumentation) return null;

    const isApiDocs = showDocumentation === 'api';
    const title = isApiDocs ? 'API Documentation' : 'CMS Documentation';
    const version = isApiDocs ? '1.0' : '1.0';

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowDocumentation(null)} />
          
          <div className="inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400">Version {version}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    // In a real app, this would download the documentation
                    alert('Documentation download would be implemented here');
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setShowDocumentation(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 overflow-y-auto max-h-[70vh]">
              {isApiDocs ? (
                <div className="prose dark:prose-invert max-w-none">
                  <h1>DC CMS API Documentation</h1>
                  
                  <h2>Base URL</h2>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                    https://your-api-domain.com/api
                  </pre>
                  
                  <h2>Authentication</h2>
                  <p>Most API endpoints require authentication. The API uses JWT (JSON Web Token) for authentication.</p>
                  
                  <h3>Obtaining a Token</h3>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                    POST /auth/login
                  </pre>
                  
                  <p><strong>Request Body:</strong></p>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
{`{
  "email": "user@example.com",
  "password": "your-password"
}`}
                  </pre>
                  
                  <p><strong>Response:</strong></p>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
{`{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "username": "username",
      "email": "user@example.com",
      "role": "admin"
    },
    "token": "your-jwt-token"
  },
  "message": "Login successful"
}`}
                  </pre>
                  
                  <h3>Using the Token</h3>
                  <p>Include the token in the Authorization header for all protected requests:</p>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                    Authorization: Bearer your-jwt-token
                  </pre>
                  
                  <h2>API Endpoints</h2>
                  
                  <h3>Authentication</h3>
                  <ul>
                    <li><code>POST /auth/register</code> - Register a new user</li>
                    <li><code>POST /auth/login</code> - User login</li>
                    <li><code>GET /auth/profile</code> - Get user profile</li>
                    <li><code>PUT /auth/profile</code> - Update user profile</li>
                  </ul>
                  
                  <h3>Posts</h3>
                  <ul>
                    <li><code>GET /posts</code> - Get all posts (with filtering, pagination)</li>
                    <li><code>GET /posts/:id</code> - Get single post</li>
                    <li><code>POST /posts</code> - Create post (admin/editor/author)</li>
                    <li><code>PUT /posts/:id</code> - Update post (admin/editor/author)</li>
                    <li><code>DELETE /posts/:id</code> - Delete post (admin/editor)</li>
                  </ul>
                  
                  <h3>Categories</h3>
                  <ul>
                    <li><code>GET /categories</code> - Get all categories</li>
                    <li><code>GET /categories/:id</code> - Get single category</li>
                    <li><code>POST /categories</code> - Create category (admin/editor)</li>
                    <li><code>PUT /categories/:id</code> - Update category (admin/editor)</li>
                    <li><code>DELETE /categories/:id</code> - Delete category (admin/editor)</li>
                  </ul>
                  
                  <h3>Content Pages</h3>
                  <ul>
                    <li><code>GET /content</code> - Get all content pages</li>
                    <li><code>GET /content/:id</code> - Get content page by ID</li>
                    <li><code>GET /content/page/:htmlName</code> - Get content page by HTML name</li>
                    <li><code>POST /content</code> - Create content page (admin/editor/author)</li>
                    <li><code>PUT /content/:id</code> - Update content page (admin/editor/author)</li>
                    <li><code>DELETE /content/:id</code> - Delete content page (admin/editor)</li>
                  </ul>
                  
                  <h3>Products</h3>
                  <ul>
                    <li><code>GET /products</code> - Get all products (with filtering, pagination)</li>
                    <li><code>GET /products/:id</code> - Get single product</li>
                    <li><code>POST /products</code> - Create product (admin/editor)</li>
                    <li><code>PUT /products/:id</code> - Update product (admin/editor)</li>
                    <li><code>DELETE /products/:id</code> - Delete product (admin/editor)</li>
                  </ul>
                  
                  <h3>Product Variations</h3>
                  <ul>
                    <li><code>GET /products/:productId/variations</code> - Get product variations</li>
                    <li><code>POST /products/variations</code> - Create variation (admin/editor)</li>
                    <li><code>PUT /products/variations/:id</code> - Update variation (admin/editor)</li>
                    <li><code>DELETE /products/variations/:id</code> - Delete variation (admin/editor)</li>
                  </ul>
                  
                  <h3>Orders</h3>
                  <ul>
                    <li><code>GET /orders</code> - Get orders (own orders for users, all for admin)</li>
                    <li><code>GET /orders/:id</code> - Get single order</li>
                    <li><code>POST /orders</code> - Create new order</li>
                    <li><code>PUT /orders/:id/status</code> - Update order status (admin/editor)</li>
                    <li><code>PUT /orders/:id/cancel</code> - Cancel order</li>
                  </ul>
                  
                  <h3>Settings</h3>
                  <ul>
                    <li><code>GET /settings</code> - Get all settings</li>
                    <li><code>GET /settings/:key</code> - Get specific setting</li>
                    <li><code>PUT /settings/:key</code> - Update setting (admin)</li>
                    <li><code>PUT /settings</code> - Update multiple settings (admin)</li>
                    <li><code>DELETE /settings/:key</code> - Delete setting (admin)</li>
                  </ul>
                  
                  <h3>Site Information</h3>
                  <ul>
                    <li><code>GET /settings/site/info</code> - Get site information</li>
                    <li><code>PUT /settings/site/info</code> - Update site information (admin)</li>
                  </ul>
                  
                  <h2>Error Handling</h2>
                  <p>All API endpoints return a consistent error format:</p>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
{`{
  "success": false,
  "error": "Error message description"
}`}
                  </pre>
                  
                  <h2>Pagination</h2>
                  <p>Endpoints that return multiple items support pagination with the following response format:</p>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
{`{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}`}
                  </pre>
                  
                  <h2>Rate Limiting</h2>
                  <p>The API implements rate limiting to prevent abuse. Current limits:</p>
                  <ul>
                    <li>100 requests per 15-minute window per IP address</li>
                  </ul>
                  
                  <h2>Example Requests</h2>
                  
                  <h3>Create a Product</h3>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
{`curl -X POST http://localhost:3001/api/products \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{
    "name": "Awesome Product",
    "description": "This is an awesome product",
    "price": 99.99,
    "category_id": "category-uuid",
    "images": ["https://example.com/image1.jpg"],
    "status": "active"
  }'`}
                  </pre>
                  
                  <h3>Create an Order</h3>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
{`curl -X POST http://localhost:3001/api/orders \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{
    "items": [
      {
        "product_id": "product-uuid",
        "variation_id": "variation-uuid",
        "quantity": 2,
        "unit_price": 99.99
      }
    ],
    "shipping_info": {
      "name": "John Doe",
      "address": "123 Main St",
      "city": "New York",
      "postal_code": "10001",
      "country": "USA",
      "phone": "+1234567890"
    }
  }'`}
                  </pre>
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  <h1>DC CMS Documentation</h1>
                  
                  <h2>Introduction</h2>
                  <p>
                    DC CMS is a comprehensive content management system and ecommerce platform built with React, TypeScript, and Supabase.
                    It provides a modern admin interface with full content management, product catalog, order management, and extensive customization options.
                  </p>
                  
                  <h2>Getting Started</h2>
                  
                  <h3>Dashboard</h3>
                  <p>
                    The dashboard provides an overview of your site's performance, including post statistics, ecommerce data, and recent activity.
                    From here, you can quickly access all major sections of the CMS.
                  </p>
                  
                  <h3>Content Management</h3>
                  <h4>Posts</h4>
                  <p>
                    The Posts section allows you to create, edit, and manage blog posts. Each post can have:
                  </p>
                  <ul>
                    <li>Title and slug</li>
                    <li>Content (rich text editor)</li>
                    <li>Featured image</li>
                    <li>Category assignment</li>
                    <li>Status (draft, published, scheduled, archived)</li>
                    <li>SEO metadata</li>
                    <li>Content blocks for advanced layouts</li>
                  </ul>
                  
                  <h4>Categories</h4>
                  <p>
                    Categories help organize your content and products. You can create a hierarchical structure with parent and child categories.
                    Each category has:
                  </p>
                  <ul>
                    <li>Name and slug</li>
                    <li>Description</li>
                    <li>Color (for visual identification)</li>
                    <li>Optional parent category</li>
                  </ul>
                  
                  <h4>Content Pages</h4>
                  <p>
                    Content Pages are static pages with flexible layouts. Unlike posts, they're not date-based and are ideal for pages like "About Us" or "Contact".
                    Each page can have:
                  </p>
                  <ul>
                    <li>Title and HTML name (for the URL)</li>
                    <li>Content sections with various layouts</li>
                    <li>Background image or color</li>
                    <li>SEO metadata</li>
                  </ul>
                  
                  <h4>Media Library</h4>
                  <p>
                    The Media Library centralizes all your uploaded files. Features include:
                  </p>
                  <ul>
                    <li>File upload and management</li>
                    <li>Image optimization</li>
                    <li>Folder organization</li>
                    <li>Search and filtering</li>
                  </ul>
                  
                  <h3>Ecommerce</h3>
                  
                  <h4>Products</h4>
                  <p>
                    The Products section allows you to manage your product catalog. Each product can have:
                  </p>
                  <ul>
                    <li>Name, slug, and description</li>
                    <li>Price</li>
                    <li>Images</li>
                    <li>Category assignment</li>
                    <li>Variations (size, color, etc.)</li>
                    <li>Inventory management</li>
                  </ul>
                  
                  <h4>Orders</h4>
                  <p>
                    The Orders section lets you manage customer orders with features like:
                  </p>
                  <ul>
                    <li>Order status management</li>
                    <li>Payment tracking</li>
                    <li>Order details and history</li>
                    <li>Customer information</li>
                  </ul>
                  
                  <h4>Coupons</h4>
                  <p>
                    Create and manage discount coupons with:
                  </p>
                  <ul>
                    <li>Percentage or fixed amount discounts</li>
                    <li>Usage limits</li>
                    <li>Expiration dates</li>
                    <li>Minimum order requirements</li>
                  </ul>
                  
                  <h3>User Management</h3>
                  <p>
                    The Users section allows you to manage user accounts with different permission levels:
                  </p>
                  <ul>
                    <li><strong>Admin:</strong> Full access to all features</li>
                    <li><strong>Editor:</strong> Can manage content and products, but not settings</li>
                    <li><strong>Author:</strong> Can create and manage their own content</li>
                    <li><strong>Customer:</strong> Can place orders and manage their profile</li>
                  </ul>
                  
                  <h3>Settings</h3>
                  <p>
                    The Settings section provides extensive customization options:
                  </p>
                  
                  <h4>General</h4>
                  <ul>
                    <li>Site name and description</li>
                    <li>Logo and favicon</li>
                    <li>Contact information</li>
                    <li>Social media links</li>
                  </ul>
                  
                  <h4>Ecommerce</h4>
                  <ul>
                    <li>Currency settings</li>
                    <li>Tax configuration</li>
                    <li>Shipping options</li>
                    <li>Inventory management</li>
                  </ul>
                  
                  <h4>SEO & Analytics</h4>
                  <ul>
                    <li>Default meta tags</li>
                    <li>Google Analytics integration</li>
                    <li>Facebook Pixel</li>
                    <li>Robots.txt and sitemap configuration</li>
                  </ul>
                  
                  <h4>Email</h4>
                  <ul>
                    <li>SMTP configuration</li>
                    <li>Email templates</li>
                    <li>Notification settings</li>
                  </ul>
                  
                  <h4>Security</h4>
                  <ul>
                    <li>User registration settings</li>
                    <li>Password policies</li>
                    <li>CAPTCHA and 2FA options</li>
                    <li>Session management</li>
                  </ul>
                  
                  <h2>Advanced Features</h2>
                  
                  <h3>Content Blocks</h3>
                  <p>
                    Content blocks allow for flexible page layouts with various content types:
                  </p>
                  <ul>
                    <li>Text and rich text</li>
                    <li>Images and galleries</li>
                    <li>Videos and audio</li>
                    <li>Tables and lists</li>
                    <li>Custom HTML</li>
                  </ul>
                  
                  <h3>Form Builder</h3>
                  <p>
                    Create custom forms with:
                  </p>
                  <ul>
                    <li>Drag-and-drop field arrangement</li>
                    <li>Various field types (text, email, select, etc.)</li>
                    <li>Validation rules</li>
                    <li>Email notifications</li>
                    <li>Submission storage</li>
                  </ul>
                  
                  <h3>Menu Builder</h3>
                  <p>
                    Create and manage navigation menus with:
                  </p>
                  <ul>
                    <li>Drag-and-drop ordering</li>
                    <li>Nested menu items</li>
                    <li>Custom links</li>
                    <li>Multiple menu locations</li>
                  </ul>
                  
                  <h2>Technical Information</h2>
                  
                  <h3>Technology Stack</h3>
                  <ul>
                    <li><strong>Frontend:</strong> React, TypeScript, Tailwind CSS</li>
                    <li><strong>Backend:</strong> Supabase (PostgreSQL, Auth, Storage)</li>
                    <li><strong>Build Tool:</strong> Vite</li>
                  </ul>
                  
                  <h3>Database Schema</h3>
                  <p>
                    The system uses a PostgreSQL database with the following main tables:
                  </p>
                  <ul>
                    <li><strong>profiles:</strong> User accounts and permissions</li>
                    <li><strong>posts:</strong> Blog posts and articles</li>
                    <li><strong>categories:</strong> Content and product categories</li>
                    <li><strong>content_pages:</strong> Static pages</li>
                    <li><strong>products:</strong> Product catalog</li>
                    <li><strong>orders:</strong> Customer orders</li>
                    <li><strong>settings:</strong> System configuration</li>
                  </ul>
                  
                  <h3>API</h3>
                  <p>
                    The system provides a comprehensive REST API for integration with other systems.
                    See the API Documentation for details.
                  </p>
                  
                  <h2>Troubleshooting</h2>
                  
                  <h3>Common Issues</h3>
                  
                  <h4>Content not appearing on the frontend</h4>
                  <ul>
                    <li>Check that the content is published (not in draft status)</li>
                    <li>Verify that the slug is correct</li>
                    <li>Check for any caching issues</li>
                  </ul>
                  
                  <h4>Image upload failures</h4>
                  <ul>
                    <li>Ensure the file size is within limits</li>
                    <li>Check that the file type is supported</li>
                    <li>Verify storage permissions</li>
                  </ul>
                  
                  <h4>Order processing issues</h4>
                  <ul>
                    <li>Check inventory levels</li>
                    <li>Verify payment gateway configuration</li>
                    <li>Check for validation errors in shipping information</li>
                  </ul>
                  
                  <h3>Getting Help</h3>
                  <p>
                    If you encounter issues not covered in this documentation:
                  </p>
                  <ul>
                    <li>Check the error logs</li>
                    <li>Search the knowledge base</li>
                    <li>Contact support at support@dccms.com</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">Configure your site and application settings</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowDocumentation('cms')}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            <FileText className="w-4 h-4" />
            <span>CMS Documentation</span>
          </button>
          <button
            onClick={() => setShowDocumentation('api')}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            <FileText className="w-4 h-4" />
            <span>API Documentation</span>
          </button>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === 'general' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab('ecommerce')}
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === 'ecommerce' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Ecommerce
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === 'seo' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          SEO & Analytics
        </button>
        <button
          onClick={() => setActiveTab('email')}
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === 'email' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Email
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === 'security' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Security
        </button>
      </div>

      {/* Settings Content */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">General Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={generalSettings.site_name}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, site_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="My Awesome Site"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Description
                </label>
                <input
                  type="text"
                  value={generalSettings.site_description}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, site_description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="A brief description of your site"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Logo URL
                </label>
                <input
                  type="text"
                  value={generalSettings.logo_url}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, logo_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Favicon URL
                </label>
                <input
                  type="text"
                  value={generalSettings.favicon_url}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, favicon_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://example.com/favicon.ico"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={generalSettings.contact_email}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, contact_email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="contact@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={generalSettings.phone}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="+1 (123) 456-7890"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={generalSettings.address}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="123 Main St, City, Country"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Social Media
                </label>
                <button
                  type="button"
                  onClick={handleAddSocialMedia}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  + Add Social Media
                </button>
              </div>
              
              {generalSettings.social_media.length > 0 ? (
                <div className="space-y-3">
                  {generalSettings.social_media.map((social, index) => {
                    const SocialIcon = getSocialIcon(social.platform);
                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <select
                          value={social.platform}
                          onChange={(e) => updateSocialMedia(index, 'platform', e.target.value)}
                          className="w-40 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="facebook">Facebook</option>
                          <option value="twitter">Twitter</option>
                          <option value="instagram">Instagram</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="youtube">YouTube</option>
                          <option value="github">GitHub</option>
                        </select>
                        
                        <div className="flex-1 relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <SocialIcon className="w-4 h-4 text-gray-400" />
                          </div>
                          <input
                            type="url"
                            value={social.url}
                            onChange={(e) => updateSocialMedia(index, 'url', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="https://example.com"
                          />
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => handleRemoveSocialMedia(index)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">No social media links added</p>
                  <button
                    type="button"
                    onClick={handleAddSocialMedia}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    + Add Social Media
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ecommerce Settings */}
        {activeTab === 'ecommerce' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ecommerce Settings</h3>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mb-6">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  These settings control how prices and currencies are displayed throughout your store.
                  The default currency is set to Bangladeshi Taka (৳).
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  value={ecommerceSettings.currency}
                  onChange={(e) => {
                    const selectedCurrency = availableCurrencies.find(c => c.code === e.target.value);
                    setEcommerceSettings({ 
                      ...ecommerceSettings, 
                      currency: e.target.value,
                      currency_symbol: selectedCurrency?.symbol || '৳'
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {availableCurrencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.name} ({currency.symbol})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value={ecommerceSettings.currency_symbol}
                  onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, currency_symbol: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="৳"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Symbol Position
                </label>
                <select
                  value={ecommerceSettings.currency_position}
                  onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, currency_position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="left">Left (৳100)</option>
                  <option value="right">Right (100৳)</option>
                  <option value="left_space">Left with space (৳ 100)</option>
                  <option value="right_space">Right with space (100 ৳)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thousand Separator
                </label>
                <input
                  type="text"
                  value={ecommerceSettings.thousand_separator}
                  onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, thousand_separator: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder=","
                  maxLength={1}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Decimal Separator
                </label>
                <input
                  type="text"
                  value={ecommerceSettings.decimal_separator}
                  onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, decimal_separator: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="."
                  maxLength={1}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Decimal Places
                </label>
                <input
                  type="number"
                  value={ecommerceSettings.decimal_places}
                  onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, decimal_places: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  min="0"
                  max="4"
                />
              </div>
              
              <div className="flex items-center">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">
                    Preview: 
                    <span className="ml-2 font-medium">
                      {ecommerceSettings.currency_position === 'left' && ecommerceSettings.currency_symbol}
                      {ecommerceSettings.currency_position === 'left_space' && `${ecommerceSettings.currency_symbol} `}
                      {(1234.56).toFixed(ecommerceSettings.decimal_places)
                        .replace('.', ecommerceSettings.decimal_separator)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ecommerceSettings.thousand_separator)}
                      {ecommerceSettings.currency_position === 'right' && ecommerceSettings.currency_symbol}
                      {ecommerceSettings.currency_position === 'right_space' && ` ${ecommerceSettings.currency_symbol}`}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-700 my-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Taxes
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Apply taxes to product prices
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ecommerceSettings.enable_taxes}
                      onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, enable_taxes: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                {ecommerceSettings.enable_taxes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={ecommerceSettings.tax_rate * 100}
                      onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, tax_rate: parseFloat(e.target.value) / 100 })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Shipping
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Calculate shipping costs for orders
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ecommerceSettings.enable_shipping}
                      onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, enable_shipping: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              
              <div className="space-y-4">
                {ecommerceSettings.enable_shipping && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Default Shipping Cost
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-gray-500 dark:text-gray-400">{ecommerceSettings.currency_symbol}</span>
                        </div>
                        <input
                          type="number"
                          value={ecommerceSettings.default_shipping_cost}
                          onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, default_shipping_cost: parseFloat(e.target.value) })}
                          className="w-full pl-8 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Free Shipping Threshold
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-gray-500 dark:text-gray-400">{ecommerceSettings.currency_symbol}</span>
                        </div>
                        <input
                          type="number"
                          value={ecommerceSettings.free_shipping_threshold}
                          onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, free_shipping_threshold: parseFloat(e.target.value) })}
                          className="w-full pl-8 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Orders above this amount qualify for free shipping
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-700 my-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Coupons
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Allow discount coupons
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ecommerceSettings.enable_coupons}
                    onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, enable_coupons: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Reviews
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Allow product reviews
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ecommerceSettings.enable_reviews}
                    onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, enable_reviews: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Wishlist
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Allow users to save favorites
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ecommerceSettings.enable_wishlist}
                    onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, enable_wishlist: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-700 my-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Stock Management
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Track product inventory
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ecommerceSettings.stock_management}
                      onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, stock_management: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                {ecommerceSettings.stock_management && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Low Stock Threshold
                    </label>
                    <input
                      type="number"
                      value={ecommerceSettings.low_stock_threshold}
                      onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, low_stock_threshold: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Get notified when stock falls below this level
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SEO & Analytics Settings */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SEO & Analytics Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Meta Title
                </label>
                <input
                  type="text"
                  value={seoSettings.meta_title}
                  onChange={(e) => setSeoSettings({ ...seoSettings, meta_title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Your Site Name | Tagline"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Used when no specific title is set
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Meta Description
                </label>
                <textarea
                  value={seoSettings.meta_description}
                  onChange={(e) => setSeoSettings({ ...seoSettings, meta_description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="A brief description of your site (150-160 characters recommended)"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Meta Keywords
              </label>
              <input
                type="text"
                value={seoSettings.meta_keywords}
                onChange={(e) => setSeoSettings({ ...seoSettings, meta_keywords: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="keyword1, keyword2, keyword3"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Comma-separated keywords (less important for modern SEO)
              </p>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-700 my-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  value={seoSettings.google_analytics_id}
                  onChange={(e) => setSeoSettings({ ...seoSettings, google_analytics_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="G-XXXXXXXXXX"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Google Analytics 4 measurement ID
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Facebook Pixel ID
                </label>
                <input
                  type="text"
                  value={seoSettings.facebook_pixel_id}
                  onChange={(e) => setSeoSettings({ ...seoSettings, facebook_pixel_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="XXXXXXXXXXXXXXXXXX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Google Tag Manager ID
                </label>
                <input
                  type="text"
                  value={seoSettings.google_tag_manager_id}
                  onChange={(e) => setSeoSettings({ ...seoSettings, google_tag_manager_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="GTM-XXXXXXX"
                />
              </div>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-700 my-6" />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Robots.txt Content
              </label>
              <textarea
                value={seoSettings.robots_txt}
                onChange={(e) => setSeoSettings({ ...seoSettings, robots_txt: e.target.value })}
                rows={5}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                placeholder={`User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: https://example.com/sitemap.xml`}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Sitemap
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Generate XML sitemap
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={seoSettings.enable_sitemap}
                    onChange={(e) => setSeoSettings({ ...seoSettings, enable_sitemap: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              {seoSettings.enable_sitemap && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Change Frequency
                    </label>
                    <select
                      value={seoSettings.sitemap_frequency}
                      onChange={(e) => setSeoSettings({ ...seoSettings, sitemap_frequency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="always">Always</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <input
                      type="number"
                      value={seoSettings.sitemap_priority}
                      onChange={(e) => setSeoSettings({ ...seoSettings, sitemap_priority: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      min="0"
                      max="1"
                      step="0.1"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Value between 0.0 and 1.0
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Email Settings */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Email Settings</h3>
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable Email Notifications
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Send automated emails for orders, registrations, etc.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailSettings.enable_email_notifications}
                  onChange={(e) => setEmailSettings({ ...emailSettings, enable_email_notifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {emailSettings.enable_email_notifications && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      From Email
                    </label>
                    <input
                      type="email"
                      value={emailSettings.from_email}
                      onChange={(e) => setEmailSettings({ ...emailSettings, from_email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="noreply@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      From Name
                    </label>
                    <input
                      type="text"
                      value={emailSettings.from_name}
                      onChange={(e) => setEmailSettings({ ...emailSettings, from_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Your Site Name"
                    />
                  </div>
                </div>
                
                <hr className="border-gray-200 dark:border-gray-700 my-6" />
                
                <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">SMTP Settings</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      value={emailSettings.smtp_host}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtp_host: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="smtp.example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      SMTP Port
                    </label>
                    <input
                      type="number"
                      value={emailSettings.smtp_port}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtp_port: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="587"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      SMTP Username
                    </label>
                    <input
                      type="text"
                      value={emailSettings.smtp_username}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtp_username: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="username@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      SMTP Password
                    </label>
                    <input
                      type="password"
                      value={emailSettings.smtp_password}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtp_password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Encryption
                  </label>
                  <select
                    value={emailSettings.smtp_encryption}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtp_encryption: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="tls">TLS</option>
                    <option value="ssl">SSL</option>
                    <option value="none">None</option>
                  </select>
                </div>
                
                <div className="mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    onClick={() => {
                      alert('Test email would be sent here');
                    }}
                  >
                    Send Test Email
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Allow User Registration
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Enable public user registration
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.allow_registration}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, allow_registration: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Social Login
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Allow login with social accounts
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.social_login_enabled}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, social_login_enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable CAPTCHA
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Protect forms from spam
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.enable_captcha}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, enable_captcha: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Two-Factor Auth
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Additional security layer
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.enable_2fa}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, enable_2fa: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Password Length
                  </label>
                  <input
                    type="number"
                    value={securitySettings.password_min_length}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, password_min_length: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    min="6"
                    max="32"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Require Special Characters
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Passwords must include symbols
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.password_requires_special}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, password_requires_special: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Require Numbers
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Passwords must include digits
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.password_requires_number}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, password_requires_number: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    value={securitySettings.session_timeout}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, session_timeout: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    min="5"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Automatically log out inactive users
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center justify-end space-x-4 mt-8">
          {saveSuccess && (
            <div className="flex items-center text-green-600 dark:text-green-400">
              <Check className="w-5 h-5 mr-2" />
              <span>Settings saved successfully!</span>
            </div>
          )}
          
          {saveError && (
            <div className="flex items-center text-red-600 dark:text-red-400">
              <X className="w-5 h-5 mr-2" />
              <span>{saveError}</span>
            </div>
          )}
          
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              saving
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Save className={`w-5 h-5 ${saving ? 'animate-pulse' : ''}`} />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* Documentation Modal */}
      {renderDocumentation()}
    </div>
  );
};

export default Settings;