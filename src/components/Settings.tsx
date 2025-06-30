import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Globe, 
  Image, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Plus,
  Trash2,
  DollarSign,
  Percent,
  Truck,
  Tag,
  ShoppingBag,
  Star,
  Heart,
  Package,
  AlertTriangle,
  Lock,
  Shield,
  Eye,
  EyeOff,
  Code,
  FileCode,
  BarChart,
  Search,
  X
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useSiteInfo } from '../hooks/useSiteInfo';

const Settings: React.FC = () => {
  const { settings, loading: settingsLoading, updateSettings } = useSettings();
  const { siteInfo, loading: siteInfoLoading, updateSiteInfo } = useSiteInfo();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    site_name: '',
    tagline: '',
    timezone: 'UTC',
    date_format: 'MM/DD/YYYY',
    time_format: '12h',
    week_starts_on: 'sunday',
    language: 'en',
    enable_registration: true,
    default_role: 'customer'
  });
  
  // Logo & Branding
  const [brandingSettings, setBrandingSettings] = useState({
    logo_url: '',
    logo_light: '',
    logo_dark: '',
    favicon: '',
    primary_color: '#3B82F6',
    secondary_color: '#10B981',
    font_heading: 'Inter',
    font_body: 'Inter'
  });
  
  // Contact Info
  const [contactInfo, setContactInfo] = useState({
    contact_email: [] as string[],
    phone: [] as string[],
    address: '',
    business_hours: '',
    google_maps_embed: ''
  });
  
  // Social Media
  const [socialMedia, setSocialMedia] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    pinterest: '',
    tiktok: ''
  });
  
  // SEO & Analytics
  const [seoSettings, setSeoSettings] = useState({
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    google_analytics_id: '',
    facebook_pixel_id: '',
    google_tag_manager_id: '',
    enable_sitemap: true,
    robots_txt: '',
    enable_schema_markup: true
  });
  
  // Ecommerce
  const [ecommerceSettings, setEcommerceSettings] = useState({
    enable_ecommerce: true,
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
  
  // Email
  const [emailSettings, setEmailSettings] = useState({
    smtp_host: '',
    smtp_port: '',
    smtp_username: '',
    smtp_password: '',
    smtp_encryption: 'tls',
    from_email: '',
    from_name: '',
    email_header: '',
    email_footer: '',
    enable_email_notifications: true
  });
  
  // Security
  const [securitySettings, setSecuritySettings] = useState({
    enable_recaptcha: false,
    recaptcha_site_key: '',
    recaptcha_secret_key: '',
    enable_2fa: false,
    password_min_length: 8,
    password_requires_uppercase: true,
    password_requires_number: true,
    password_requires_special: false,
    max_login_attempts: 5,
    lockout_time: 30
  });
  
  // Maintenance
  const [maintenanceSettings, setMaintenanceSettings] = useState({
    maintenance_mode: false,
    maintenance_message: 'We are currently performing maintenance. Please check back soon.',
    maintenance_end_time: '',
    allowed_ips: '',
    show_countdown: true
  });

  // Load settings
  useEffect(() => {
    if (!settingsLoading && settings) {
      // General
      setGeneralSettings({
        site_name: settings.site_name || siteInfo?.site_name || '',
        tagline: settings.tagline || siteInfo?.tagline || '',
        timezone: settings.timezone || 'UTC',
        date_format: settings.date_format || 'MM/DD/YYYY',
        time_format: settings.time_format || '12h',
        week_starts_on: settings.week_starts_on || 'sunday',
        language: settings.language || 'en',
        enable_registration: settings.enable_registration !== false,
        default_role: settings.default_role || 'customer'
      });
      
      // Branding
      setBrandingSettings({
        logo_url: settings.logo_url || siteInfo?.logo_url || '',
        logo_light: settings.logo_light || siteInfo?.logo_light || '',
        logo_dark: settings.logo_dark || siteInfo?.logo_dark || '',
        favicon: settings.favicon || siteInfo?.favicon || '',
        primary_color: settings.primary_color || '#3B82F6',
        secondary_color: settings.secondary_color || '#10B981',
        font_heading: settings.font_heading || 'Inter',
        font_body: settings.font_body || 'Inter'
      });
      
      // Contact
      const contactEmails = Array.isArray(settings.contact_email) 
        ? settings.contact_email 
        : (settings.contact_email ? [settings.contact_email] : []);
      
      const phoneNumbers = Array.isArray(settings.phone) 
        ? settings.phone 
        : (settings.phone ? [settings.phone] : []);
      
      setContactInfo({
        contact_email: contactEmails,
        phone: phoneNumbers,
        address: settings.address || siteInfo?.address || '',
        business_hours: settings.business_hours || '',
        google_maps_embed: settings.google_maps_embed || ''
      });
      
      // Social
      const socialIcons = siteInfo?.social_icons || [];
      const socialData = socialIcons.reduce((acc: any, icon: any) => {
        if (icon.name && icon.url) {
          acc[icon.name.toLowerCase()] = icon.url;
        }
        return acc;
      }, {});
      
      setSocialMedia({
        facebook: settings.facebook || socialData.facebook || '',
        twitter: settings.twitter || socialData.twitter || '',
        instagram: settings.instagram || socialData.instagram || '',
        linkedin: settings.linkedin || socialData.linkedin || '',
        youtube: settings.youtube || socialData.youtube || '',
        pinterest: settings.pinterest || socialData.pinterest || '',
        tiktok: settings.tiktok || socialData.tiktok || ''
      });
      
      // SEO
      setSeoSettings({
        seo_title: settings.seo_title || siteInfo?.seo_title || '',
        seo_description: settings.seo_description || siteInfo?.seo_description || '',
        seo_keywords: settings.seo_keywords || siteInfo?.seo_keywords || '',
        google_analytics_id: settings.google_analytics_id || siteInfo?.google_analytics || '',
        facebook_pixel_id: settings.facebook_pixel_id || siteInfo?.facebook_pixel || '',
        google_tag_manager_id: settings.google_tag_manager_id || siteInfo?.google_tag_manager || '',
        enable_sitemap: settings.enable_sitemap !== false,
        robots_txt: settings.robots_txt || siteInfo?.robots_txt || '',
        enable_schema_markup: settings.enable_schema_markup !== false
      });
      
      // Ecommerce
      setEcommerceSettings({
        enable_ecommerce: settings.enable_ecommerce !== false,
        currency: settings.currency || 'BDT',
        currency_symbol: settings.currency_symbol || '৳',
        currency_position: settings.currency_position || 'left',
        thousand_separator: settings.thousand_separator || ',',
        decimal_separator: settings.decimal_separator || '.',
        decimal_places: settings.decimal_places || 2,
        enable_taxes: settings.enable_taxes === true,
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
      
      // Email
      setEmailSettings({
        smtp_host: settings.smtp_host || '',
        smtp_port: settings.smtp_port || '',
        smtp_username: settings.smtp_username || '',
        smtp_password: settings.smtp_password || '',
        smtp_encryption: settings.smtp_encryption || 'tls',
        from_email: settings.from_email || '',
        from_name: settings.from_name || '',
        email_header: settings.email_header || '',
        email_footer: settings.email_footer || '',
        enable_email_notifications: settings.enable_email_notifications !== false
      });
      
      // Security
      setSecuritySettings({
        enable_recaptcha: settings.enable_recaptcha === true,
        recaptcha_site_key: settings.recaptcha_site_key || '',
        recaptcha_secret_key: settings.recaptcha_secret_key || '',
        enable_2fa: settings.enable_2fa === true,
        password_min_length: settings.password_min_length || 8,
        password_requires_uppercase: settings.password_requires_uppercase !== false,
        password_requires_number: settings.password_requires_number !== false,
        password_requires_special: settings.password_requires_special === true,
        max_login_attempts: settings.max_login_attempts || 5,
        lockout_time: settings.lockout_time || 30
      });
      
      // Maintenance
      setMaintenanceSettings({
        maintenance_mode: settings.maintenance_mode === true || siteInfo?.maintenance_mode === true,
        maintenance_message: settings.maintenance_message || siteInfo?.maintenance_message || 'We are currently performing maintenance. Please check back soon.',
        maintenance_end_time: settings.maintenance_end_time || '',
        allowed_ips: settings.allowed_ips || '',
        show_countdown: settings.show_countdown !== false
      });
    }
  }, [settings, siteInfo, settingsLoading, siteInfoLoading]);

  const handleSaveSettings = async () => {
    setSaving(true);
    
    try {
      // Prepare social icons for site info
      const socialIcons = Object.entries(socialMedia)
        .filter(([_, url]) => url)
        .map(([name, url]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          icon: name.toLowerCase(),
          url
        }));
      
      // Update site info
      await updateSiteInfo({
        site_name: generalSettings.site_name,
        tagline: generalSettings.tagline,
        logo_url: brandingSettings.logo_url,
        logo_light: brandingSettings.logo_light,
        logo_dark: brandingSettings.logo_dark,
        favicon: brandingSettings.favicon,
        description: seoSettings.seo_description,
        contact_email: contactInfo.contact_email.length > 0 ? contactInfo.contact_email[0] : '',
        phone: contactInfo.phone.length > 0 ? contactInfo.phone[0] : '',
        address: contactInfo.address,
        social_icons: socialIcons,
        seo_title: seoSettings.seo_title,
        seo_description: seoSettings.seo_description,
        seo_keywords: seoSettings.seo_keywords,
        google_analytics: seoSettings.google_analytics_id,
        facebook_pixel: seoSettings.facebook_pixel_id,
        google_tag_manager: seoSettings.google_tag_manager_id,
        robots_txt: seoSettings.robots_txt,
        maintenance_mode: maintenanceSettings.maintenance_mode,
        maintenance_message: maintenanceSettings.maintenance_message
      });
      
      // Update settings
      await updateSettings({
        // General
        ...generalSettings,
        
        // Branding
        ...brandingSettings,
        
        // Contact
        contact_email: contactInfo.contact_email,
        phone: contactInfo.phone,
        address: contactInfo.address,
        business_hours: contactInfo.business_hours,
        google_maps_embed: contactInfo.google_maps_embed,
        
        // Social
        ...socialMedia,
        
        // SEO
        ...seoSettings,
        
        // Ecommerce
        ...ecommerceSettings,
        
        // Email
        ...emailSettings,
        
        // Security
        ...securitySettings,
        
        // Maintenance
        ...maintenanceSettings
      });
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addContactEmail = () => {
    setContactInfo(prev => ({
      ...prev,
      contact_email: [...prev.contact_email, '']
    }));
  };

  const updateContactEmail = (index: number, value: string) => {
    setContactInfo(prev => {
      const newEmails = [...prev.contact_email];
      newEmails[index] = value;
      return {
        ...prev,
        contact_email: newEmails
      };
    });
  };

  const removeContactEmail = (index: number) => {
    setContactInfo(prev => ({
      ...prev,
      contact_email: prev.contact_email.filter((_, i) => i !== index)
    }));
  };

  const addPhoneNumber = () => {
    setContactInfo(prev => ({
      ...prev,
      phone: [...prev.phone, '']
    }));
  };

  const updatePhoneNumber = (index: number, value: string) => {
    setContactInfo(prev => {
      const newPhones = [...prev.phone];
      newPhones[index] = value;
      return {
        ...prev,
        phone: newPhones
      };
    });
  };

  const removePhoneNumber = (index: number) => {
    setContactInfo(prev => ({
      ...prev,
      phone: prev.phone.filter((_, i) => i !== index)
    }));
  };

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
          <p className="text-gray-600 dark:text-gray-400">Configure your site settings</p>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'general'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('logo')}
            className={`pb-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'logo'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            Logo & Branding
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`pb-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'contact'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            Contact Info
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`pb-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'social'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            Social Media
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`pb-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'seo'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            SEO & Analytics
          </button>
          <button
            onClick={() => setActiveTab('ecommerce')}
            className={`pb-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'ecommerce'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            Ecommerce
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`pb-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'email'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`pb-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'maintenance'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            Maintenance
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
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
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timezone
                </label>
                <select
                  value={generalSettings.timezone}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Asia/Dhaka">Bangladesh (GMT+6)</option>
                  <option value="Europe/London">London (GMT)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Format
                </label>
                <select
                  value={generalSettings.date_format}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, date_format: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="MMMM D, YYYY">MMMM D, YYYY</option>
                  <option value="D MMMM, YYYY">D MMMM, YYYY</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Format
                </label>
                <select
                  value={generalSettings.time_format}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, time_format: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="12h">12-hour (1:30 PM)</option>
                  <option value="24h">24-hour (13:30)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Week Starts On
                </label>
                <select
                  value={generalSettings.week_starts_on}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, week_starts_on: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="sunday">Sunday</option>
                  <option value="monday">Monday</option>
                  <option value="saturday">Saturday</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={generalSettings.language}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="bn">Bengali</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default User Role
                </label>
                <select
                  value={generalSettings.default_role}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, default_role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="customer">Customer</option>
                  <option value="author">Author</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable User Registration
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Allow visitors to create an account on your site
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={generalSettings.enable_registration}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, enable_registration: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'logo' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Logo & Branding</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={brandingSettings.logo_url}
                  onChange={(e) => setBrandingSettings({ ...brandingSettings, logo_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://example.com/logo.png"
                />
                {brandingSettings.logo_url && (
                  <div className="mt-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 w-32 h-32 flex items-center justify-center">
                    <img src={brandingSettings.logo_url} alt="Logo" className="max-w-full max-h-full" />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Favicon URL
                </label>
                <input
                  type="url"
                  value={brandingSettings.favicon}
                  onChange={(e) => setBrandingSettings({ ...brandingSettings, favicon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://example.com/favicon.ico"
                />
                {brandingSettings.favicon && (
                  <div className="mt-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 w-16 h-16 flex items-center justify-center">
                    <img src={brandingSettings.favicon} alt="Favicon" className="max-w-full max-h-full" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Light Mode Logo URL
                </label>
                <input
                  type="url"
                  value={brandingSettings.logo_light}
                  onChange={(e) => setBrandingSettings({ ...brandingSettings, logo_light: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://example.com/logo-light.png"
                />
                {brandingSettings.logo_light && (
                  <div className="mt-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-800 w-32 h-32 flex items-center justify-center">
                    <img src={brandingSettings.logo_light} alt="Light Logo" className="max-w-full max-h-full" />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dark Mode Logo URL
                </label>
                <input
                  type="url"
                  value={brandingSettings.logo_dark}
                  onChange={(e) => setBrandingSettings({ ...brandingSettings, logo_dark: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://example.com/logo-dark.png"
                />
                {brandingSettings.logo_dark && (
                  <div className="mt-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 w-32 h-32 flex items-center justify-center">
                    <img src={brandingSettings.logo_dark} alt="Dark Logo" className="max-w-full max-h-full" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={brandingSettings.primary_color}
                    onChange={(e) => setBrandingSettings({ ...brandingSettings, primary_color: e.target.value })}
                    className="w-10 h-10 rounded-lg border-0"
                  />
                  <input
                    type="text"
                    value={brandingSettings.primary_color}
                    onChange={(e) => setBrandingSettings({ ...brandingSettings, primary_color: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={brandingSettings.secondary_color}
                    onChange={(e) => setBrandingSettings({ ...brandingSettings, secondary_color: e.target.value })}
                    className="w-10 h-10 rounded-lg border-0"
                  />
                  <input
                    type="text"
                    value={brandingSettings.secondary_color}
                    onChange={(e) => setBrandingSettings({ ...brandingSettings, secondary_color: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Heading Font
                </label>
                <select
                  value={brandingSettings.font_heading}
                  onChange={(e) => setBrandingSettings({ ...brandingSettings, font_heading: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Lato">Lato</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Body Font
                </label>
                <select
                  value={brandingSettings.font_body}
                  onChange={(e) => setBrandingSettings({ ...brandingSettings, font_body: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Lato">Lato</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Email
                </label>
                <button
                  type="button"
                  onClick={addContactEmail}
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Email</span>
                </button>
              </div>
              
              {contactInfo.contact_email.length > 0 ? (
                <div className="space-y-2">
                  {contactInfo.contact_email.map((email, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex-1 relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => updateContactEmail(index, e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="contact@example.com"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeContactEmail(index)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={addContactEmail}
                  className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-center">
                    <Plus className="w-5 h-5 mr-2" />
                    <span>Add Contact Email</span>
                  </div>
                </button>
              )}
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <button
                  type="button"
                  onClick={addPhoneNumber}
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Phone</span>
                </button>
              </div>
              
              {contactInfo.phone.length > 0 ? (
                <div className="space-y-2">
                  {contactInfo.phone.map((phone, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex-1 relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => updatePhoneNumber(index, e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removePhoneNumber(index)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={addPhoneNumber}
                  className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-center">
                    <Plus className="w-5 h-5 mr-2" />
                    <span>Add Phone Number</span>
                  </div>
                </button>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  value={contactInfo.address}
                  onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                  rows={3}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="123 Main St, City, State, Zip"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Hours
              </label>
              <textarea
                value={contactInfo.business_hours}
                onChange={(e) => setContactInfo({ ...contactInfo, business_hours: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Monday-Friday: 9am-5pm&#10;Saturday: 10am-3pm&#10;Sunday: Closed"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Google Maps Embed Code
              </label>
              <textarea
                value={contactInfo.google_maps_embed}
                onChange={(e) => setContactInfo({ ...contactInfo, google_maps_embed: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                placeholder="<iframe src='https://www.google.com/maps/embed?...'></iframe>"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Paste the embed code from Google Maps to display a map on your contact page.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Media</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Facebook
                </label>
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    value={socialMedia.facebook}
                    onChange={(e) => setSocialMedia({ ...socialMedia, facebook: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Twitter
                </label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    value={socialMedia.twitter}
                    onChange={(e) => setSocialMedia({ ...socialMedia, twitter: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Instagram
                </label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    value={socialMedia.instagram}
                    onChange={(e) => setSocialMedia({ ...socialMedia, instagram: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="https://instagram.com/yourhandle"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  LinkedIn
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    value={socialMedia.linkedin}
                    onChange={(e) => setSocialMedia({ ...socialMedia, linkedin: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  YouTube
                </label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    value={socialMedia.youtube}
                    onChange={(e) => setSocialMedia({ ...socialMedia, youtube: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="https://youtube.com/c/yourchannel"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pinterest
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 10C13.1046 10 14 9.10457 14 8C14 6.89543 13.1046 6 12 6C10.8954 6 10 6.89543 10 8C10 9.10457 10.8954 10 12 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 22C8 22 10 18 12 18C14 18 16 22 16 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 14H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    type="url"
                    value={socialMedia.pinterest}
                    onChange={(e) => setSocialMedia({ ...socialMedia, pinterest: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="https://pinterest.com/yourprofile"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  TikTok
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 9.5C21 9.5 22 8.3 22 6.5C22 4.7 21 3.5 19 3.5C17 3.5 16 4.7 16 6.5C16 8.3 17 9.5 19 9.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 20.5C12 20.5 13 19.3 13 17.5C13 15.7 12 14.5 10 14.5C8 14.5 7 15.7 7 17.5C7 19.3 8 20.5 10 20.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 9.5V17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 13.5C13 13.5 13 14.5 10 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    type="url"
                    value={socialMedia.tiktok}
                    onChange={(e) => setSocialMedia({ ...socialMedia, tiktok: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="https://tiktok.com/@yourhandle"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SEO & Analytics</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SEO Title
              </label>
              <input
                type="text"
                value={seoSettings.seo_title}
                onChange={(e) => setSeoSettings({ ...seoSettings, seo_title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Your Site Name - Tagline"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                This will appear in search engine results and browser tabs.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meta Description
              </label>
              <textarea
                value={seoSettings.seo_description}
                onChange={(e) => setSeoSettings({ ...seoSettings, seo_description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="A brief description of your site for search engines"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Keep it under 160 characters for best results.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meta Keywords
              </label>
              <input
                type="text"
                value={seoSettings.seo_keywords}
                onChange={(e) => setSeoSettings({ ...seoSettings, seo_keywords: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="keyword1, keyword2, keyword3"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Comma-separated keywords (less important for modern SEO).
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  value={seoSettings.google_analytics_id}
                  onChange={(e) => setSeoSettings({ ...seoSettings, google_analytics_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="G-XXXXXXXXXX or UA-XXXXXXXX-X"
                />
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Robots.txt Content
              </label>
              <textarea
                value={seoSettings.robots_txt}
                onChange={(e) => setSeoSettings({ ...seoSettings, robots_txt: e.target.value })}
                rows={5}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                placeholder="User-agent: *&#10;Allow: /&#10;Disallow: /admin/&#10;Sitemap: https://example.com/sitemap.xml"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable XML Sitemap
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Automatically generate and update XML sitemap for search engines
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
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable Schema Markup
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Add JSON-LD structured data to improve search results
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={seoSettings.enable_schema_markup}
                  onChange={(e) => setSeoSettings({ ...seoSettings, enable_schema_markup: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'ecommerce' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ecommerce Settings</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable Ecommerce
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Turn on ecommerce features for your site
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={ecommerceSettings.enable_ecommerce}
                  onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, enable_ecommerce: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {ecommerceSettings.enable_ecommerce && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency
                    </label>
                    <select
                      value={ecommerceSettings.currency}
                      onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, currency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="GBP">British Pound (GBP)</option>
                      <option value="BDT">Bangladeshi Taka (BDT)</option>
                      <option value="INR">Indian Rupee (INR)</option>
                      <option value="JPY">Japanese Yen (JPY)</option>
                      <option value="CAD">Canadian Dollar (CAD)</option>
                      <option value="AUD">Australian Dollar (AUD)</option>
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
                      placeholder="$"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency Position
                    </label>
                    <select
                      value={ecommerceSettings.currency_position}
                      onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, currency_position: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="left">Left ($99.99)</option>
                      <option value="right">Right (99.99$)</option>
                      <option value="left_space">Left with space ($ 99.99)</option>
                      <option value="right_space">Right with space (99.99 $)</option>
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
                      maxLength={1}
                      placeholder=","
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
                      maxLength={1}
                      placeholder="."
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
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Enable Taxes
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Apply tax to product prices
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
                </div>
                
                {ecommerceSettings.enable_taxes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={ecommerceSettings.tax_rate}
                      onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, tax_rate: parseFloat(e.target.value) })}
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">
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
                
                {ecommerceSettings.enable_shipping && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Free Shipping Threshold
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                          {ecommerceSettings.currency_symbol}
                        </span>
                        <input
                          type="number"
                          value={ecommerceSettings.free_shipping_threshold}
                          onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, free_shipping_threshold: parseFloat(e.target.value) })}
                          className="w-full pl-7 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Orders above this amount qualify for free shipping
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Default Shipping Cost
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                          {ecommerceSettings.currency_symbol}
                        </span>
                        <input
                          type="number"
                          value={ecommerceSettings.default_shipping_cost}
                          onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, default_shipping_cost: parseFloat(e.target.value) })}
                          className="w-full pl-7 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Enable Coupons
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Allow discount coupons at checkout
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
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Allow customers to leave product reviews
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
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Allow customers to save products to wishlist
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
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Stock Management
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Track inventory and manage stock levels
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
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Get notified when product stock falls below this number
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'email' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Email Settings</h3>
            
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
                  type="text"
                  value={emailSettings.smtp_port}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtp_port: e.target.value })}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SMTP Encryption
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Header
              </label>
              <textarea
                value={emailSettings.email_header}
                onChange={(e) => setEmailSettings({ ...emailSettings, email_header: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="HTML content for email header"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Footer
              </label>
              <textarea
                value={emailSettings.email_footer}
                onChange={(e) => setEmailSettings({ ...emailSettings, email_footer: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="HTML content for email footer"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable Email Notifications
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Send email notifications for orders, comments, etc.
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
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable reCAPTCHA
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Protect forms from spam and abuse
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={securitySettings.enable_recaptcha}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, enable_recaptcha: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {securitySettings.enable_recaptcha && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    reCAPTCHA Site Key
                  </label>
                  <input
                    type="text"
                    value={securitySettings.recaptcha_site_key}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, recaptcha_site_key: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    reCAPTCHA Secret Key
                  </label>
                  <input
                    type="password"
                    value={securitySettings.recaptcha_secret_key}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, recaptcha_secret_key: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable Two-Factor Authentication
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Add an extra layer of security for user accounts
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
            
            <div>
              <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">Password Requirements</h4>
              
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
                      Require Uppercase Letters
                    </label>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.password_requires_uppercase}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, password_requires_uppercase: e.target.checked })}
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
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Require Special Characters
                    </label>
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
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  value={securitySettings.max_login_attempts}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, max_login_attempts: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  min="1"
                  max="20"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Number of failed attempts before account lockout
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lockout Time (minutes)
                </label>
                <input
                  type="number"
                  value={securitySettings.lockout_time}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, lockout_time: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  min="1"
                  max="1440"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Duration of account lockout after too many failed attempts
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Maintenance Mode</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable Maintenance Mode
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Show a maintenance page to visitors
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintenanceSettings.maintenance_mode}
                  onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, maintenance_mode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {maintenanceSettings.maintenance_mode && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maintenance Message
                  </label>
                  <textarea
                    value={maintenanceSettings.maintenance_message}
                    onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, maintenance_message: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="We are currently performing maintenance. Please check back soon."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maintenance End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={maintenanceSettings.maintenance_end_time}
                    onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, maintenance_end_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Leave empty for indefinite maintenance
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Allowed IP Addresses
                  </label>
                  <textarea
                    value={maintenanceSettings.allowed_ips}
                    onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, allowed_ips: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="127.0.0.1&#10;192.168.1.1"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    One IP address per line. These IPs will bypass maintenance mode.
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Show Countdown Timer
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Display a countdown to maintenance end time
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={maintenanceSettings.show_countdown}
                      onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, show_countdown: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;