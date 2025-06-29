import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Upload, Globe, Mail, Phone, MapPin, FileText, Code, DollarSign, Settings as SettingsIcon, Image, X, Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Dribbble, Figma, Twitch, Pointer as Pinterest, Slack, Disc as Discord, Bean as Behance, Codepen, Atom as Tiktok, Wheat as Whatsapp, Instagram as Telegram, Link } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../hooks/useSettings';
import { useSiteInfo } from '../hooks/useSiteInfo';
import { useCategories } from '../hooks/useCategories';
import { useMedia } from '../hooks/useMedia';

// Social platform icons mapping
const socialIcons: Record<string, React.FC<{className?: string}>> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
  dribbble: Dribbble,
  figma: Figma,
  twitch: Twitch,
  pinterest: Pinterest,
  slack: Slack,
  discord: Discord,
  behance: Behance,
  codepen: Codepen,
  tiktok: Tiktok,
  whatsapp: Whatsapp,
  telegram: Telegram
};

// Social platform options
const socialPlatforms = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'github', label: 'GitHub' },
  { value: 'dribbble', label: 'Dribbble' },
  { value: 'figma', label: 'Figma' },
  { value: 'twitch', label: 'Twitch' },
  { value: 'pinterest', label: 'Pinterest' },
  { value: 'slack', label: 'Slack' },
  { value: 'discord', label: 'Discord' },
  { value: 'behance', label: 'Behance' },
  { value: 'codepen', label: 'CodePen' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telegram', label: 'Telegram' }
];

// Currency options
const currencies = [
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
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' }
];

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { settings, loading: settingsLoading, updateSettings } = useSettings();
  const { siteInfo, loading: siteInfoLoading, updateSiteInfo } = useSiteInfo();
  const { categories } = useCategories();
  const { media, uploadMedia } = useMedia();
  
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [showCmsDocumentation, setShowCmsDocumentation] = useState(false);
  const [showApiDocumentation, setShowApiDocumentation] = useState(false);
  
  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    site_name: '',
    tagline: '',
    description: '',
    logo_url: '',
    logo_light: '',
    logo_dark: '',
    favicon: '',
    copyright_text: ''
  });
  
  // Contact settings
  const [contactInfo, setContactInfo] = useState<any[]>([]);
  
  // Social media settings
  const [socialIcons, setSocialIcons] = useState<any[]>([]);
  
  // Currency settings
  const [currencySettings, setCurrencySettings] = useState({
    default_currency: 'BDT',
    currency_symbol: '৳',
    currency_position: 'left',
    thousand_separator: ',',
    decimal_separator: '.',
    decimal_places: 2
  });
  
  // SEO settings
  const [seoSettings, setSeoSettings] = useState({
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    google_analytics_id: '',
    facebook_pixel_id: '',
    google_tag_manager_id: '',
    robots_txt: '',
    enable_sitemap: true
  });
  
  // Email settings
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
  
  // Security settings
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
  
  // Load settings
  useEffect(() => {
    if (!settingsLoading && settings) {
      // Load currency settings
      setCurrencySettings({
        default_currency: settings.default_currency || 'BDT',
        currency_symbol: settings.currency_symbol || '৳',
        currency_position: settings.currency_position || 'left',
        thousand_separator: settings.thousand_separator || ',',
        decimal_separator: settings.decimal_separator || '.',
        decimal_places: settings.decimal_places || 2
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
        enable_sitemap: settings.enable_sitemap !== false
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
        social_login_enabled: settings.social_login_enabled === true,
        enable_captcha: settings.enable_captcha !== false,
        enable_2fa: settings.enable_2fa === true,
        password_min_length: settings.password_min_length || 8,
        password_requires_special: settings.password_requires_special !== false,
        password_requires_number: settings.password_requires_number !== false,
        session_timeout: settings.session_timeout || 60
      });
    }
  }, [settings, settingsLoading]);
  
  // Load site info
  useEffect(() => {
    if (!siteInfoLoading && siteInfo) {
      setGeneralSettings({
        site_name: siteInfo.site_name || '',
        tagline: siteInfo.tagline || '',
        description: siteInfo.description || '',
        logo_url: siteInfo.logo_url || '',
        logo_light: siteInfo.logo_light || '',
        logo_dark: siteInfo.logo_dark || '',
        favicon: siteInfo.favicon || '',
        copyright_text: siteInfo.copyright_text || ''
      });
      
      // Load contact info with proper structure
      if (siteInfo.contact_info && Array.isArray(siteInfo.contact_info)) {
        setContactInfo(siteInfo.contact_info);
      } else {
        // Create default contact info structure
        setContactInfo([{
          id: '1',
          label: 'Main Office',
          address: '',
          map_url: '',
          emails: [{ label: 'Contact', link: '' }],
          phones: [{ label: 'Main', link: '' }]
        }]);
      }
      
      // Load social icons with proper structure
      if (siteInfo.social_icons && Array.isArray(siteInfo.social_icons)) {
        setSocialIcons(siteInfo.social_icons);
      } else {
        // Create default social icons structure
        setSocialIcons([
          { id: '1', platform: 'facebook', url: '', icon: 'facebook' },
          { id: '2', platform: 'twitter', url: '', icon: 'twitter' },
          { id: '3', platform: 'instagram', url: '', icon: 'instagram' }
        ]);
      }
    }
  }, [siteInfo, siteInfoLoading]);
  
  // Save all settings
  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      
      // Update site info
      await updateSiteInfo({
        site_name: generalSettings.site_name,
        tagline: generalSettings.tagline,
        description: generalSettings.description,
        logo_url: generalSettings.logo_url,
        logo_light: generalSettings.logo_light,
        logo_dark: generalSettings.logo_dark,
        favicon: generalSettings.favicon,
        copyright_text: generalSettings.copyright_text,
        contact_info: contactInfo,
        social_icons: socialIcons
      });
      
      // Update settings
      await updateSettings({
        // Currency settings
        default_currency: currencySettings.default_currency,
        currency_symbol: currencySettings.currency_symbol,
        currency_position: currencySettings.currency_position,
        thousand_separator: currencySettings.thousand_separator,
        decimal_separator: currencySettings.decimal_separator,
        decimal_places: currencySettings.decimal_places,
        
        // SEO settings
        meta_title: seoSettings.meta_title,
        meta_description: seoSettings.meta_description,
        meta_keywords: seoSettings.meta_keywords,
        google_analytics_id: seoSettings.google_analytics_id,
        facebook_pixel_id: seoSettings.facebook_pixel_id,
        google_tag_manager_id: seoSettings.google_tag_manager_id,
        robots_txt: seoSettings.robots_txt,
        enable_sitemap: seoSettings.enable_sitemap,
        
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
        session_timeout: securitySettings.session_timeout
      });
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle file upload
  const handleFileUpload = async (file: File, callback: (url: string) => void) => {
    try {
      const result = await uploadMedia(file);
      if (result.success && result.data) {
        callback(result.data.url);
      } else {
        alert('Failed to upload file');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('An error occurred during upload');
    }
  };
  
  // Handle upload button click
  const handleUploadClick = (callback: (url: string) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileUpload(file, callback);
      }
    };
    input.click();
  };
  
  // Add contact location
  const addContactLocation = () => {
    setContactInfo([
      ...contactInfo,
      {
        id: Date.now().toString(),
        label: 'New Location',
        address: '',
        map_url: '',
        emails: [{ label: 'Contact', link: '' }],
        phones: [{ label: 'Main', link: '' }]
      }
    ]);
  };
  
  // Remove contact location
  const removeContactLocation = (index: number) => {
    setContactInfo(contactInfo.filter((_, i) => i !== index));
  };
  
  // Add email to contact location
  const addEmail = (locationIndex: number) => {
    const updatedContactInfo = [...contactInfo];
    if (!updatedContactInfo[locationIndex].emails) {
      updatedContactInfo[locationIndex].emails = [];
    }
    updatedContactInfo[locationIndex].emails.push({ label: 'Email', link: '' });
    setContactInfo(updatedContactInfo);
  };
  
  // Remove email from contact location
  const removeEmail = (locationIndex: number, emailIndex: number) => {
    const updatedContactInfo = [...contactInfo];
    updatedContactInfo[locationIndex].emails.splice(emailIndex, 1);
    setContactInfo(updatedContactInfo);
  };
  
  // Update email in contact location
  const updateEmail = (locationIndex: number, emailIndex: number, field: 'label' | 'link', value: string) => {
    const updatedContactInfo = [...contactInfo];
    updatedContactInfo[locationIndex].emails[emailIndex][field] = value;
    setContactInfo(updatedContactInfo);
  };
  
  // Add phone to contact location
  const addPhone = (locationIndex: number) => {
    const updatedContactInfo = [...contactInfo];
    if (!updatedContactInfo[locationIndex].phones) {
      updatedContactInfo[locationIndex].phones = [];
    }
    updatedContactInfo[locationIndex].phones.push({ label: 'Phone', link: '' });
    setContactInfo(updatedContactInfo);
  };
  
  // Remove phone from contact location
  const removePhone = (locationIndex: number, phoneIndex: number) => {
    const updatedContactInfo = [...contactInfo];
    updatedContactInfo[locationIndex].phones.splice(phoneIndex, 1);
    setContactInfo(updatedContactInfo);
  };
  
  // Update phone in contact location
  const updatePhone = (locationIndex: number, phoneIndex: number, field: 'label' | 'link', value: string) => {
    const updatedContactInfo = [...contactInfo];
    updatedContactInfo[locationIndex].phones[phoneIndex][field] = value;
    setContactInfo(updatedContactInfo);
  };
  
  // Update contact location
  const updateContactLocation = (index: number, field: string, value: string) => {
    const updatedContactInfo = [...contactInfo];
    updatedContactInfo[index][field] = value;
    setContactInfo(updatedContactInfo);
  };
  
  // Add social icon
  const addSocialIcon = () => {
    setSocialIcons([
      ...socialIcons,
      {
        id: Date.now().toString(),
        platform: 'facebook',
        url: '',
        icon: 'facebook'
      }
    ]);
  };
  
  // Remove social icon
  const removeSocialIcon = (index: number) => {
    setSocialIcons(socialIcons.filter((_, i) => i !== index));
  };
  
  // Update social icon
  const updateSocialIcon = (index: number, field: string, value: string) => {
    const updatedSocialIcons = [...socialIcons];
    updatedSocialIcons[index][field] = value;
    
    // Update icon based on platform
    if (field === 'platform') {
      updatedSocialIcons[index].icon = value;
    }
    
    setSocialIcons(updatedSocialIcons);
  };
  
  // Format currency example
  const formatCurrencyExample = (amount: number) => {
    const { currency_symbol, currency_position, thousand_separator, decimal_separator, decimal_places } = currencySettings;
    
    // Format the number
    const parts = amount.toFixed(decimal_places).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousand_separator);
    const formattedAmount = parts.join(decimal_separator);
    
    // Add currency symbol in the correct position
    return currency_position === 'left'
      ? `${currency_symbol}${formattedAmount}`
      : `${formattedAmount}${currency_symbol}`;
  };
  
  // Render CMS documentation modal
  const renderCmsDocumentation = () => {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowCmsDocumentation(false)} />
          
          <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">CMS Documentation</h3>
              <button
                onClick={() => setShowCmsDocumentation(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[70vh] pr-2">
              <div className="prose prose-blue dark:prose-invert max-w-none">
                <h2>Getting Started with DC CMS</h2>
                <p>Welcome to DC CMS, a comprehensive content management system designed for modern websites and e-commerce applications. This guide will help you understand the core features and how to use them effectively.</p>
                
                <h3>Dashboard</h3>
                <p>The dashboard provides an overview of your site's performance, including:</p>
                <ul>
                  <li>Content statistics (posts, pages, products)</li>
                  <li>Recent activity</li>
                  <li>Quick access to common tasks</li>
                  <li>Analytics overview (if configured)</li>
                </ul>
                
                <h3>Content Management</h3>
                <h4>Posts</h4>
                <p>Posts are chronological content entries typically used for blogs, news, or updates.</p>
                <ul>
                  <li><strong>Creating Posts:</strong> Click "New Post" to create a new entry</li>
                  <li><strong>Editing:</strong> Use the rich text editor to format content</li>
                  <li><strong>Media:</strong> Add images, galleries, videos, and other media</li>
                  <li><strong>Categories:</strong> Organize posts into categories</li>
                  <li><strong>SEO:</strong> Optimize each post with custom meta data</li>
                </ul>
                
                <h4>Pages</h4>
                <p>Pages are static content that typically don't change often, like About Us or Contact pages.</p>
                <ul>
                  <li><strong>Page Builder:</strong> Create custom layouts with sections</li>
                  <li><strong>Templates:</strong> Use pre-designed templates for common pages</li>
                  <li><strong>Custom Fields:</strong> Add specialized content blocks</li>
                </ul>
                
                <h3>E-commerce Features</h3>
                <h4>Products</h4>
                <p>Manage your product catalog with comprehensive options:</p>
                <ul>
                  <li><strong>Product Details:</strong> Name, description, pricing, images</li>
                  <li><strong>Variations:</strong> Create options like size, color, material</li>
                  <li><strong>Inventory:</strong> Track stock levels</li>
                  <li><strong>Categories:</strong> Organize products into categories</li>
                </ul>
                
                <h4>Orders</h4>
                <p>Process and manage customer orders:</p>
                <ul>
                  <li><strong>Order Status:</strong> Track orders from pending to delivered</li>
                  <li><strong>Customer Information:</strong> View shipping and contact details</li>
                  <li><strong>Payment Status:</strong> Monitor payment processing</li>
                </ul>
                
                <h3>User Management</h3>
                <p>Control access to your CMS with role-based permissions:</p>
                <ul>
                  <li><strong>Admin:</strong> Full access to all features</li>
                  <li><strong>Editor:</strong> Can manage content and products</li>
                  <li><strong>Author:</strong> Can create and edit their own content</li>
                  <li><strong>Customer:</strong> Can view their orders and account</li>
                </ul>
                
                <h3>Settings</h3>
                <p>Configure your site with these key settings:</p>
                <ul>
                  <li><strong>General:</strong> Site name, logo, description</li>
                  <li><strong>Contact:</strong> Contact information and locations</li>
                  <li><strong>Social Media:</strong> Connect your social platforms</li>
                  <li><strong>Currency:</strong> Set up payment and display options</li>
                  <li><strong>SEO:</strong> Configure global SEO settings</li>
                  <li><strong>Email:</strong> Set up email notifications</li>
                  <li><strong>Security:</strong> Manage authentication options</li>
                </ul>
                
                <h3>Advanced Features</h3>
                <ul>
                  <li><strong>Media Library:</strong> Centralized management of all uploaded files</li>
                  <li><strong>Menus:</strong> Create and manage navigation menus</li>
                  <li><strong>Forms:</strong> Build custom forms for data collection</li>
                  <li><strong>Reviews:</strong> Manage product reviews and ratings</li>
                  <li><strong>Coupons:</strong> Create discount codes and promotions</li>
                </ul>
                
                <h3>Need Help?</h3>
                <p>If you need additional assistance, please refer to:</p>
                <ul>
                  <li>The API documentation for developer integration</li>
                  <li>Contact support at support@dccms.com</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render API documentation modal
  const renderApiDocumentation = () => {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowApiDocumentation(false)} />
          
          <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">API Documentation</h3>
              <button
                onClick={() => setShowApiDocumentation(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[70vh] pr-2">
              <div className="prose prose-blue dark:prose-invert max-w-none">
                <h2>DC CMS API Reference</h2>
                <p>This documentation provides details on how to interact with the DC CMS API programmatically.</p>
                
                <h3>Authentication</h3>
                <p>All API requests require authentication using JWT tokens.</p>
                
                <h4>Obtaining a Token</h4>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  <code>
                    POST /api/auth/login<br/>
                    {`{
  "email": "user@example.com",
  "password": "your-password"
}`}
                  </code>
                </pre>
                
                <p>Response:</p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  <code>
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
                  </code>
                </pre>
                
                <h4>Using the Token</h4>
                <p>Include the token in the Authorization header for all protected requests:</p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  <code>
                    Authorization: Bearer your-jwt-token
                  </code>
                </pre>
                
                <h3>Content Endpoints</h3>
                
                <h4>Posts</h4>
                <p>Get all posts:</p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  <code>
                    GET /api/posts
                  </code>
                </pre>
                
                <p>Get a single post:</p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  <code>
                    GET /api/posts/:id
                  </code>
                </pre>
                
                <p>Create a post:</p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  <code>
                    POST /api/posts<br/>
                    {`{
  "title": "New Post",
  "content": "Post content",
  "status": "published",
  "category_id": "category-uuid"
}`}
                  </code>
                </pre>
                
                <h4>Products</h4>
                <p>Get all products:</p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  <code>
                    GET /api/products
                  </code>
                </pre>
                
                <p>Get a single product:</p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  <code>
                    GET /api/products/:id
                  </code>
                </pre>
                
                <p>Create a product:</p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  <code>
                    POST /api/products<br/>
                    {`{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "category_id": "category-uuid",
  "status": "active"
}`}
                  </code>
                </pre>
                
                <h4>Orders</h4>
                <p>Get all orders:</p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  <code>
                    GET /api/orders
                  </code>
                </pre>
                
                <p>Create an order:</p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  <code>
                    POST /api/orders<br/>
                    {`{
  "items": [
    {
      "product_id": "product-uuid",
      "quantity": 2
    }
  ],
  "shipping_info": {
    "name": "Customer Name",
    "address": "123 Main St",
    "city": "New York",
    "postal_code": "10001",
    "country": "USA"
  }
}`}
                  </code>
                </pre>
                
                <h3>Response Format</h3>
                <p>All API responses follow a consistent format:</p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  <code>
                    {`{
  "success": true|false,
  "data": {...},  // On success
  "error": "Error message",  // On failure
  "pagination": {  // For list endpoints
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}`}
                  </code>
                </pre>
                
                <h3>Error Handling</h3>
                <p>Error responses include an error message and appropriate HTTP status code:</p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  <code>
                    {`{
  "success": false,
  "error": "Detailed error message"
}`}
                  </code>
                </pre>
                
                <h3>Rate Limiting</h3>
                <p>API requests are limited to 100 requests per 15-minute window per IP address. When rate limited, you'll receive a 429 Too Many Requests response.</p>
                
                <h3>Webhooks</h3>
                <p>You can configure webhooks to receive notifications for events like:</p>
                <ul>
                  <li>New orders</li>
                  <li>Order status changes</li>
                  <li>Low inventory alerts</li>
                  <li>New user registrations</li>
                </ul>
                
                <h3>SDK Examples</h3>
                <p>JavaScript example:</p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  <code>
                    {`import { createClient } from 'dc-cms-client';

const client = createClient({
  apiUrl: 'https://your-api-domain.com/api',
  token: 'your-jwt-token'
});

// Get all products
const getProducts = async () => {
  try {
    const response = await client.products.list({
      limit: 20,
      status: 'active'
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Check if user has permission to access settings
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <SettingsIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Access Restricted</h3>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to access settings. Please contact an administrator.
          </p>
        </div>
      </div>
    );
  }
  
  if (settingsLoading || siteInfoLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">Configure your site settings and preferences</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCmsDocumentation(true)}
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            CMS Documentation
          </button>
          <button
            onClick={() => setShowApiDocumentation(true)}
            className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            API Documentation
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
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
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === 'contact' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Contact Information
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === 'social' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Social Media
        </button>
        <button
          onClick={() => setActiveTab('currency')}
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === 'currency' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Currency
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

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Site Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={generalSettings.site_name}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, site_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="My Website"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  value={generalSettings.tagline}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, tagline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Your site's tagline"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={generalSettings.description}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Brief description of your website"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Copyright Text
                </label>
                <input
                  type="text"
                  value={generalSettings.copyright_text}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, copyright_text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="© 2025 Your Company. All rights reserved."
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Logo & Branding</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Logo
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={generalSettings.logo_url}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, logo_url: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Logo URL"
                  />
                  <button
                    type="button"
                    onClick={() => handleUploadClick((url) => setGeneralSettings({ ...generalSettings, logo_url: url }))}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                </div>
                {generalSettings.logo_url && (
                  <div className="mt-2">
                    <img 
                      src={generalSettings.logo_url} 
                      alt="Logo" 
                      className="h-12 object-contain bg-gray-100 dark:bg-gray-800 rounded p-2"
                    />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Light Mode Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={generalSettings.logo_light}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, logo_light: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Light logo URL"
                    />
                    <button
                      type="button"
                      onClick={() => handleUploadClick((url) => setGeneralSettings({ ...generalSettings, logo_light: url }))}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload</span>
                    </button>
                  </div>
                  {generalSettings.logo_light && (
                    <div className="mt-2">
                      <img 
                        src={generalSettings.logo_light} 
                        alt="Light Logo" 
                        className="h-12 object-contain bg-gray-800 rounded p-2"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dark Mode Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={generalSettings.logo_dark}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, logo_dark: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Dark logo URL"
                    />
                    <button
                      type="button"
                      onClick={() => handleUploadClick((url) => setGeneralSettings({ ...generalSettings, logo_dark: url }))}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload</span>
                    </button>
                  </div>
                  {generalSettings.logo_dark && (
                    <div className="mt-2">
                      <img 
                        src={generalSettings.logo_dark} 
                        alt="Dark Logo" 
                        className="h-12 object-contain bg-gray-100 rounded p-2"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Favicon
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={generalSettings.favicon}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, favicon: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Favicon URL"
                  />
                  <button
                    type="button"
                    onClick={() => handleUploadClick((url) => setGeneralSettings({ ...generalSettings, favicon: url }))}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                </div>
                {generalSettings.favicon && (
                  <div className="mt-2">
                    <img 
                      src={generalSettings.favicon} 
                      alt="Favicon" 
                      className="h-8 w-8 object-contain bg-gray-100 dark:bg-gray-800 rounded p-1"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Information */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Locations</h3>
              <button
                type="button"
                onClick={addContactLocation}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Location</span>
              </button>
            </div>
            
            <div className="space-y-8">
              {contactInfo.map((location, locationIndex) => (
                <div 
                  key={location.id} 
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Location #{locationIndex + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeContactLocation(locationIndex)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location Label
                      </label>
                      <input
                        type="text"
                        value={location.label}
                        onChange={(e) => updateContactLocation(locationIndex, 'label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Main Office, Branch Office, etc."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address
                      </label>
                      <textarea
                        value={location.address}
                        onChange={(e) => updateContactLocation(locationIndex, 'address', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="123 Main St, City, Country"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Google Maps URL
                      </label>
                      <input
                        type="url"
                        value={location.map_url}
                        onChange={(e) => updateContactLocation(locationIndex, 'map_url', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="https://maps.google.com/?q=..."
                      />
                    </div>
                    
                    {/* Email Addresses */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email Addresses
                        </label>
                        <button
                          type="button"
                          onClick={() => addEmail(locationIndex)}
                          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          + Add Email
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {location.emails && location.emails.map((email, emailIndex) => (
                          <div key={emailIndex} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={email.label}
                              onChange={(e) => updateEmail(locationIndex, emailIndex, 'label', e.target.value)}
                              className="w-1/3 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              placeholder="Label (e.g. Support)"
                            />
                            <input
                              type="email"
                              value={email.link}
                              onChange={(e) => updateEmail(locationIndex, emailIndex, 'link', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              placeholder="email@example.com"
                            />
                            <button
                              type="button"
                              onClick={() => removeEmail(locationIndex, emailIndex)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Phone Numbers */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Phone Numbers
                        </label>
                        <button
                          type="button"
                          onClick={() => addPhone(locationIndex)}
                          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          + Add Phone
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {location.phones && location.phones.map((phone, phoneIndex) => (
                          <div key={phoneIndex} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={phone.label}
                              onChange={(e) => updatePhone(locationIndex, phoneIndex, 'label', e.target.value)}
                              className="w-1/3 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              placeholder="Label (e.g. Sales)"
                            />
                            <input
                              type="tel"
                              value={phone.link}
                              onChange={(e) => updatePhone(locationIndex, phoneIndex, 'link', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              placeholder="+1234567890"
                            />
                            <button
                              type="button"
                              onClick={() => removePhone(locationIndex, phoneIndex)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {contactInfo.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No contact locations added yet</p>
                  <button
                    type="button"
                    onClick={addContactLocation}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    + Add Contact Location
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Social Media */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Social Media Profiles</h3>
              <button
                type="button"
                onClick={addSocialIcon}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Social Profile</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {socialIcons.map((social, index) => {
                const SocialIcon = socialIcons[social.platform] || Link;
                
                return (
                  <div key={social.id} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <SocialIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    
                    <select
                      value={social.platform}
                      onChange={(e) => updateSocialIcon(index, 'platform', e.target.value)}
                      className="w-1/4 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      {socialPlatforms.map(platform => (
                        <option key={platform.value} value={platform.value}>{platform.label}</option>
                      ))}
                    </select>
                    
                    <input
                      type="url"
                      value={social.url}
                      onChange={(e) => updateSocialIcon(index, 'url', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder={`https://${social.platform}.com/yourusername`}
                    />
                    
                    <button
                      type="button"
                      onClick={() => removeSocialIcon(index)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
              
              {socialIcons.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  <Globe className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No social profiles added yet</p>
                  <button
                    type="button"
                    onClick={addSocialIcon}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    + Add Social Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Currency Settings */}
      {activeTab === 'currency' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Currency Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Currency
                </label>
                <select
                  value={currencySettings.default_currency}
                  onChange={(e) => {
                    const selectedCurrency = currencies.find(c => c.code === e.target.value);
                    setCurrencySettings({
                      ...currencySettings,
                      default_currency: e.target.value,
                      currency_symbol: selectedCurrency?.symbol || currencySettings.currency_symbol
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {currencies.map(currency => (
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
                  value={currencySettings.currency_symbol}
                  onChange={(e) => setCurrencySettings({ ...currencySettings, currency_symbol: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="$"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Symbol Position
                </label>
                <select
                  value={currencySettings.currency_position}
                  onChange={(e) => setCurrencySettings({ ...currencySettings, currency_position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="left">Left ($99.99)</option>
                  <option value="right">Right (99.99$)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thousand Separator
                </label>
                <input
                  type="text"
                  value={currencySettings.thousand_separator}
                  onChange={(e) => setCurrencySettings({ ...currencySettings, thousand_separator: e.target.value })}
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
                  value={currencySettings.decimal_separator}
                  onChange={(e) => setCurrencySettings({ ...currencySettings, decimal_separator: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="."
                  maxLength={1}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Decimal Places
                </label>
                <input
                  type="number"
                  value={currencySettings.decimal_places}
                  onChange={(e) => setCurrencySettings({ ...currencySettings, decimal_places: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  min="0"
                  max="4"
                />
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Currency Format Preview</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-400">Small amount:</p>
                  <p className="text-lg font-medium text-blue-900 dark:text-blue-200">{formatCurrencyExample(99.99)}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-400">Large amount:</p>
                  <p className="text-lg font-medium text-blue-900 dark:text-blue-200">{formatCurrencyExample(1234567.89)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO & Analytics */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">SEO Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Meta Title
                </label>
                <input
                  type="text"
                  value={seoSettings.meta_title}
                  onChange={(e) => setSeoSettings({ ...seoSettings, meta_title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Your Site Name - Tagline"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  If left empty, the site name will be used
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Meta Description
                </label>
                <textarea
                  value={seoSettings.meta_description}
                  onChange={(e) => setSeoSettings({ ...seoSettings, meta_description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Brief description of your website for search engines"
                />
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
                  Comma-separated list of keywords
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enable-sitemap"
                  checked={seoSettings.enable_sitemap}
                  onChange={(e) => setSeoSettings({ ...seoSettings, enable_sitemap: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="enable-sitemap"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Generate XML sitemap
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Robots.txt Content
                </label>
                <textarea
                  value={seoSettings.robots_txt}
                  onChange={(e) => setSeoSettings({ ...seoSettings, robots_txt: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                  placeholder="User-agent: *\nDisallow: /admin/\nSitemap: https://example.com/sitemap.xml"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Analytics Tracking</h3>
            
            <div className="space-y-4">
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
                  Enter your Google Analytics 4 Measurement ID
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
          </div>
        </div>
      )}

      {/* Email Settings */}
      {activeTab === 'email' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Email Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="enable-email-notifications"
                  checked={emailSettings.enable_email_notifications}
                  onChange={(e) => setEmailSettings({ ...emailSettings, enable_email_notifications: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="enable-email-notifications"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Enable email notifications
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    From Name
                  </label>
                  <input
                    type="text"
                    value={emailSettings.from_name}
                    onChange={(e) => setEmailSettings({ ...emailSettings, from_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Your Company Name"
                  />
                </div>
                
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
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">SMTP Configuration</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtp_port: parseInt(e.target.value) || 587 })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="587"
                    />
                  </div>
                  
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
                      placeholder="••••••••"
                    />
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
                </div>
                
                <div className="mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  >
                    Test SMTP Connection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Security Settings</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">Authentication</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Allow User Registration
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Enable users to register accounts on your site
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
                        Social Login
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Allow users to sign in with social media accounts
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
                        CAPTCHA Protection
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Protect forms from spam and bots
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
                        Two-Factor Authentication
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Add an extra layer of security to user accounts
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
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">Password Policy</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Minimum Password Length
                    </label>
                    <input
                      type="number"
                      value={securitySettings.password_min_length}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, password_min_length: parseInt(e.target.value) || 8 })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      min="6"
                      max="32"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={securitySettings.session_timeout}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, session_timeout: parseInt(e.target.value) || 60 })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      min="5"
                    />
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="require-special"
                      checked={securitySettings.password_requires_special}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, password_requires_special: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="require-special"
                      className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Require special characters in passwords
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="require-number"
                      checked={securitySettings.password_requires_number}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, password_requires_number: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="require-number"
                      className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Require numbers in passwords
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Documentation Modals */}
      {showCmsDocumentation && renderCmsDocumentation()}
      {showApiDocumentation && renderApiDocumentation()}
    </div>
  );
};

export default Settings;