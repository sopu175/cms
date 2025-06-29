import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Globe, 
  Mail, 
  FileText, 
  Database, 
  Image, 
  DollarSign, 
  Truck, 
  ShoppingBag, 
  Bell, 
  Lock, 
  Users,
  Search,
  BarChart,
  Code,
  Smartphone,
  Zap,
  Sliders,
  X,
  Download,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../hooks/useSettings';
import { useSiteInfo } from '../hooks/useSiteInfo';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { settings, updateSettings } = useSettings();
  const { siteInfo, updateSiteInfo } = useSiteInfo();
  const [activeTab, setActiveTab] = useState('general');
  const [showDocModal, setShowDocModal] = useState(false);
  const [docType, setDocType] = useState<'cms' | 'api'>('cms');
  
  const [generalForm, setGeneralForm] = useState({
    site_name: '',
    site_description: '',
    logo_url: '',
    favicon_url: '',
    contact_email: '',
    phone: '',
    address: '',
    social_links: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    }
  });
  
  const [ecommerceForm, setEcommerceForm] = useState({
    currency: 'BDT',
    currency_symbol: '৳',
    currency_position: 'left',
    thousand_separator: ',',
    decimal_separator: '.',
    decimal_places: 2,
    tax_rate: 0,
    enable_taxes: false,
    enable_shipping: true,
    free_shipping_threshold: 100,
    default_shipping_cost: 10
  });
  
  const [seoForm, setSeoForm] = useState({
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
  
  const [emailForm, setEmailForm] = useState({
    smtp_host: '',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    smtp_encryption: 'tls',
    from_email: '',
    from_name: '',
    enable_email_notifications: true
  });
  
  const [securityForm, setSecurityForm] = useState({
    enable_registration: true,
    enable_social_login: false,
    enable_captcha: true,
    enable_2fa: false,
    password_min_length: 8,
    password_requires_special: true,
    password_requires_number: true,
    session_timeout: 60
  });

  const currencyOptions = [
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
  ];

  // Load settings from database
  useEffect(() => {
    if (settings) {
      // General settings
      if (siteInfo) {
        setGeneralForm({
          site_name: siteInfo.site_name || '',
          site_description: siteInfo.description || '',
          logo_url: siteInfo.logo_url || '',
          favicon_url: settings.favicon_url || '',
          contact_email: siteInfo.contact_email || '',
          phone: siteInfo.phone || '',
          address: siteInfo.address || '',
          social_links: settings.social_links || {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: ''
          }
        });
      }
      
      // Ecommerce settings
      setEcommerceForm({
        currency: settings.default_currency || 'BDT',
        currency_symbol: settings.currency_symbol || '৳',
        currency_position: settings.currency_position || 'left',
        thousand_separator: settings.thousand_separator || ',',
        decimal_separator: settings.decimal_separator || '.',
        decimal_places: settings.decimal_places || 2,
        tax_rate: settings.tax_rate || 0,
        enable_taxes: settings.enable_taxes || false,
        enable_shipping: settings.enable_shipping || true,
        free_shipping_threshold: settings.free_shipping_threshold || 100,
        default_shipping_cost: settings.default_shipping_cost || 10
      });
      
      // SEO settings
      setSeoForm({
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
      
      // Email settings
      setEmailForm({
        smtp_host: settings.smtp_host || '',
        smtp_port: settings.smtp_port || 587,
        smtp_username: settings.smtp_username || '',
        smtp_password: settings.smtp_password || '',
        smtp_encryption: settings.smtp_encryption || 'tls',
        from_email: settings.from_email || '',
        from_name: settings.from_name || '',
        enable_email_notifications: settings.enable_email_notifications !== false
      });
      
      // Security settings
      setSecurityForm({
        enable_registration: settings.allow_registration !== false,
        enable_social_login: settings.social_login_enabled || false,
        enable_captcha: settings.enable_captcha !== false,
        enable_2fa: settings.enable_2fa || false,
        password_min_length: settings.password_min_length || 8,
        password_requires_special: settings.password_requires_special !== false,
        password_requires_number: settings.password_requires_number !== false,
        session_timeout: settings.session_timeout || 60
      });
    }
  }, [settings, siteInfo]);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currencyCode = e.target.value;
    const currency = currencyOptions.find(c => c.code === currencyCode);
    
    if (currency) {
      setEcommerceForm({
        ...ecommerceForm,
        currency: currency.code,
        currency_symbol: currency.symbol
      });
    }
  };

  const saveGeneralSettings = async () => {
    // Update site info
    await updateSiteInfo({
      site_name: generalForm.site_name,
      description: generalForm.site_description,
      logo_url: generalForm.logo_url,
      contact_email: generalForm.contact_email,
      phone: generalForm.phone,
      address: generalForm.address
    });
    
    // Update settings
    await updateSettings({
      favicon_url: generalForm.favicon_url,
      social_links: generalForm.social_links
    });
    
    alert('General settings saved successfully!');
  };

  const saveEcommerceSettings = async () => {
    await updateSettings({
      default_currency: ecommerceForm.currency,
      currency_symbol: ecommerceForm.currency_symbol,
      currency_position: ecommerceForm.currency_position,
      thousand_separator: ecommerceForm.thousand_separator,
      decimal_separator: ecommerceForm.decimal_separator,
      decimal_places: ecommerceForm.decimal_places,
      tax_rate: ecommerceForm.tax_rate,
      enable_taxes: ecommerceForm.enable_taxes,
      enable_shipping: ecommerceForm.enable_shipping,
      free_shipping_threshold: ecommerceForm.free_shipping_threshold,
      default_shipping_cost: ecommerceForm.default_shipping_cost
    });
    
    alert('Ecommerce settings saved successfully!');
  };

  const saveSeoSettings = async () => {
    await updateSettings({
      meta_title: seoForm.meta_title,
      meta_description: seoForm.meta_description,
      meta_keywords: seoForm.meta_keywords,
      google_analytics_id: seoForm.google_analytics_id,
      facebook_pixel_id: seoForm.facebook_pixel_id,
      google_tag_manager_id: seoForm.google_tag_manager_id,
      robots_txt: seoForm.robots_txt,
      enable_sitemap: seoForm.enable_sitemap,
      sitemap_frequency: seoForm.sitemap_frequency,
      sitemap_priority: seoForm.sitemap_priority
    });
    
    alert('SEO settings saved successfully!');
  };

  const saveEmailSettings = async () => {
    await updateSettings({
      smtp_host: emailForm.smtp_host,
      smtp_port: emailForm.smtp_port,
      smtp_username: emailForm.smtp_username,
      smtp_password: emailForm.smtp_password,
      smtp_encryption: emailForm.smtp_encryption,
      from_email: emailForm.from_email,
      from_name: emailForm.from_name,
      enable_email_notifications: emailForm.enable_email_notifications
    });
    
    alert('Email settings saved successfully!');
  };

  const saveSecuritySettings = async () => {
    await updateSettings({
      allow_registration: securityForm.enable_registration,
      social_login_enabled: securityForm.enable_social_login,
      enable_captcha: securityForm.enable_captcha,
      enable_2fa: securityForm.enable_2fa,
      password_min_length: securityForm.password_min_length,
      password_requires_special: securityForm.password_requires_special,
      password_requires_number: securityForm.password_requires_number,
      session_timeout: securityForm.session_timeout
    });
    
    alert('Security settings saved successfully!');
  };

  const openDocumentation = (type: 'cms' | 'api') => {
    setDocType(type);
    setShowDocModal(true);
  };

  const canEdit = user?.role === 'admin';

  if (!canEdit) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Access Restricted</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Only administrators can access settings.
          </p>
        </div>
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
        <div className="flex items-center space-x-3">
          <button
            onClick={() => openDocumentation('cms')}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            <FileText className="w-4 h-4" />
            <span>CMS Documentation</span>
          </button>
          <button
            onClick={() => openDocumentation('api')}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            <Code className="w-4 h-4" />
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

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'general' && (
          <>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Site Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={generalForm.site_name}
                      onChange={(e) => setGeneralForm({ ...generalForm, site_name: e.target.value })}
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
                      value={generalForm.site_description}
                      onChange={(e) => setGeneralForm({ ...generalForm, site_description: e.target.value })}
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
                      type="url"
                      value={generalForm.logo_url}
                      onChange={(e) => setGeneralForm({ ...generalForm, logo_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Favicon URL
                    </label>
                    <input
                      type="url"
                      value={generalForm.favicon_url}
                      onChange={(e) => setGeneralForm({ ...generalForm, favicon_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="https://example.com/favicon.ico"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={generalForm.contact_email}
                      onChange={(e) => setGeneralForm({ ...generalForm, contact_email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="contact@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={generalForm.phone}
                      onChange={(e) => setGeneralForm({ ...generalForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  <textarea
                    value={generalForm.address}
                    onChange={(e) => setGeneralForm({ ...generalForm, address: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="123 Main St, City, Country"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Social Media</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={generalForm.social_links.facebook}
                      onChange={(e) => setGeneralForm({ 
                        ...generalForm, 
                        social_links: { ...generalForm.social_links, facebook: e.target.value } 
                      })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Twitter
                    </label>
                    <input
                      type="url"
                      value={generalForm.social_links.twitter}
                      onChange={(e) => setGeneralForm({ 
                        ...generalForm, 
                        social_links: { ...generalForm.social_links, twitter: e.target.value } 
                      })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={generalForm.social_links.instagram}
                      onChange={(e) => setGeneralForm({ 
                        ...generalForm, 
                        social_links: { ...generalForm.social_links, instagram: e.target.value } 
                      })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="https://instagram.com/yourhandle"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={generalForm.social_links.linkedin}
                      onChange={(e) => setGeneralForm({ 
                        ...generalForm, 
                        social_links: { ...generalForm.social_links, linkedin: e.target.value } 
                      })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={saveGeneralSettings}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <Save className="w-4 h-4" />
                <span>Save General Settings</span>
              </button>
            </div>
          </>
        )}

        {activeTab === 'ecommerce' && (
          <>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Currency Settings</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency
                    </label>
                    <select
                      value={ecommerceForm.currency}
                      onChange={handleCurrencyChange}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      {currencyOptions.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.name} ({currency.code}) {currency.symbol}
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
                      value={ecommerceForm.currency_symbol}
                      onChange={(e) => setEcommerceForm({ ...ecommerceForm, currency_symbol: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Symbol Position
                    </label>
                    <select
                      value={ecommerceForm.currency_position}
                      onChange={(e) => setEcommerceForm({ ...ecommerceForm, currency_position: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="left">Left (৳99.99)</option>
                      <option value="right">Right (99.99৳)</option>
                      <option value="left_space">Left with space (৳ 99.99)</option>
                      <option value="right_space">Right with space (99.99 ৳)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Thousand Separator
                    </label>
                    <input
                      type="text"
                      value={ecommerceForm.thousand_separator}
                      onChange={(e) => setEcommerceForm({ ...ecommerceForm, thousand_separator: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      maxLength={1}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Decimal Separator
                    </label>
                    <input
                      type="text"
                      value={ecommerceForm.decimal_separator}
                      onChange={(e) => setEcommerceForm({ ...ecommerceForm, decimal_separator: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      maxLength={1}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Decimal Places
                  </label>
                  <input
                    type="number"
                    value={ecommerceForm.decimal_places}
                    onChange={(e) => setEcommerceForm({ ...ecommerceForm, decimal_places: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    min={0}
                    max={4}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Tax & Shipping</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Taxes
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Apply taxes to product prices
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ecommerceForm.enable_taxes}
                      onChange={(e) => setEcommerceForm({ ...ecommerceForm, enable_taxes: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {ecommerceForm.enable_taxes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={ecommerceForm.tax_rate}
                      onChange={(e) => setEcommerceForm({ ...ecommerceForm, tax_rate: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      min={0}
                      max={100}
                      step={0.01}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Shipping
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Apply shipping costs to orders
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ecommerceForm.enable_shipping}
                      onChange={(e) => setEcommerceForm({ ...ecommerceForm, enable_shipping: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {ecommerceForm.enable_shipping && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Default Shipping Cost
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                          {ecommerceForm.currency_symbol}
                        </span>
                        <input
                          type="number"
                          value={ecommerceForm.default_shipping_cost}
                          onChange={(e) => setEcommerceForm({ ...ecommerceForm, default_shipping_cost: parseFloat(e.target.value) })}
                          className="w-full pl-7 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          min={0}
                          step={0.01}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Free Shipping Threshold
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                          {ecommerceForm.currency_symbol}
                        </span>
                        <input
                          type="number"
                          value={ecommerceForm.free_shipping_threshold}
                          onChange={(e) => setEcommerceForm({ ...ecommerceForm, free_shipping_threshold: parseFloat(e.target.value) })}
                          className="w-full pl-7 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          min={0}
                          step={0.01}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={saveEcommerceSettings}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <Save className="w-4 h-4" />
                <span>Save Ecommerce Settings</span>
              </button>
            </div>
          </>
        )}

        {activeTab === 'seo' && (
          <>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default Meta Title
                  </label>
                  <input
                    type="text"
                    value={seoForm.meta_title}
                    onChange={(e) => setSeoForm({ ...seoForm, meta_title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Your Site Name | Tagline"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default Meta Description
                  </label>
                  <textarea
                    value={seoForm.meta_description}
                    onChange={(e) => setSeoForm({ ...seoForm, meta_description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="A brief description of your site (150-160 characters recommended)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default Meta Keywords
                  </label>
                  <input
                    type="text"
                    value={seoForm.meta_keywords}
                    onChange={(e) => setSeoForm({ ...seoForm, meta_keywords: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Analytics</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    value={seoForm.google_analytics_id}
                    onChange={(e) => setSeoForm({ ...seoForm, google_analytics_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Facebook Pixel ID
                  </label>
                  <input
                    type="text"
                    value={seoForm.facebook_pixel_id}
                    onChange={(e) => setSeoForm({ ...seoForm, facebook_pixel_id: e.target.value })}
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
                    value={seoForm.google_tag_manager_id}
                    onChange={(e) => setSeoForm({ ...seoForm, google_tag_manager_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="GTM-XXXXXXX"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Advanced SEO</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Robots.txt Content
                  </label>
                  <textarea
                    value={seoForm.robots_txt}
                    onChange={(e) => setSeoForm({ ...seoForm, robots_txt: e.target.value })}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                    placeholder="User-agent: *\nDisallow: /admin/\nSitemap: https://example.com/sitemap.xml"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable XML Sitemap
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Automatically generate and update XML sitemap
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={seoForm.enable_sitemap}
                      onChange={(e) => setSeoForm({ ...seoForm, enable_sitemap: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {seoForm.enable_sitemap && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sitemap Change Frequency
                      </label>
                      <select
                        value={seoForm.sitemap_frequency}
                        onChange={(e) => setSeoForm({ ...seoForm, sitemap_frequency: e.target.value })}
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
                        Sitemap Priority
                      </label>
                      <input
                        type="number"
                        value={seoForm.sitemap_priority}
                        onChange={(e) => setSeoForm({ ...seoForm, sitemap_priority: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        min={0}
                        max={1}
                        step={0.1}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={saveSeoSettings}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <Save className="w-4 h-4" />
                <span>Save SEO Settings</span>
              </button>
            </div>
          </>
        )}

        {activeTab === 'email' && (
          <>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Email Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Email Notifications
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Send email notifications for orders, form submissions, etc.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailForm.enable_email_notifications}
                      onChange={(e) => setEmailForm({ ...emailForm, enable_email_notifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {emailForm.enable_email_notifications && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          From Email
                        </label>
                        <input
                          type="email"
                          value={emailForm.from_email}
                          onChange={(e) => setEmailForm({ ...emailForm, from_email: e.target.value })}
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
                          value={emailForm.from_name}
                          onChange={(e) => setEmailForm({ ...emailForm, from_name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Your Site Name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        value={emailForm.smtp_host}
                        onChange={(e) => setEmailForm({ ...emailForm, smtp_host: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="smtp.example.com"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          SMTP Port
                        </label>
                        <input
                          type="number"
                          value={emailForm.smtp_port}
                          onChange={(e) => setEmailForm({ ...emailForm, smtp_port: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="587"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Encryption
                        </label>
                        <select
                          value={emailForm.smtp_encryption}
                          onChange={(e) => setEmailForm({ ...emailForm, smtp_encryption: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="tls">TLS</option>
                          <option value="ssl">SSL</option>
                          <option value="none">None</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          SMTP Username
                        </label>
                        <input
                          type="text"
                          value={emailForm.smtp_username}
                          onChange={(e) => setEmailForm({ ...emailForm, smtp_username: e.target.value })}
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
                          value={emailForm.smtp_password}
                          onChange={(e) => setEmailForm({ ...emailForm, smtp_password: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="••••••••••••"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={saveEmailSettings}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <Save className="w-4 h-4" />
                <span>Save Email Settings</span>
              </button>
            </div>
          </>
        )}

        {activeTab === 'security' && (
          <>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Authentication Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable User Registration
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Allow new users to register on your site
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securityForm.enable_registration}
                      onChange={(e) => setSecurityForm({ ...securityForm, enable_registration: e.target.checked })}
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Allow users to login with social media accounts
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securityForm.enable_social_login}
                      onChange={(e) => setSecurityForm({ ...securityForm, enable_social_login: e.target.checked })}
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Protect forms from spam and bots
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securityForm.enable_captcha}
                      onChange={(e) => setSecurityForm({ ...securityForm, enable_captcha: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Two-Factor Authentication
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Add an extra layer of security to user accounts
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securityForm.enable_2fa}
                      onChange={(e) => setSecurityForm({ ...securityForm, enable_2fa: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Password Policy</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Password Length
                  </label>
                  <input
                    type="number"
                    value={securityForm.password_min_length}
                    onChange={(e) => setSecurityForm({ ...securityForm, password_min_length: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    min={6}
                    max={32}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Require Special Characters
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Passwords must contain at least one special character
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securityForm.password_requires_special}
                      onChange={(e) => setSecurityForm({ ...securityForm, password_requires_special: e.target.checked })}
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Passwords must contain at least one number
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securityForm.password_requires_number}
                      onChange={(e) => setSecurityForm({ ...securityForm, password_requires_number: e.target.checked })}
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
                    value={securityForm.session_timeout}
                    onChange={(e) => setSecurityForm({ ...securityForm, session_timeout: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    min={5}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={saveSecuritySettings}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <Save className="w-4 h-4" />
                <span>Save Security Settings</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Documentation Modal */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowDocModal(false)} />
            
            <div className="inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {docType === 'cms' ? 'CMS Documentation' : 'API Documentation'}
                </h3>
                <button
                  onClick={() => setShowDocModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[70vh] pr-2">
                {docType === 'cms' ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <h1>DC CMS Documentation</h1>
                    
                    <h2>Introduction</h2>
                    <p>
                      DC CMS is a comprehensive content management system and ecommerce platform built with React, TypeScript, and Supabase.
                      This documentation will guide you through the features and functionality of the CMS.
                    </p>

                    <h2>Getting Started</h2>
                    <h3>Logging In</h3>
                    <p>
                      To access the CMS, navigate to the login page and enter your credentials. If you don't have an account,
                      you can register for one if registration is enabled.
                    </p>
                    <p>
                      Default admin credentials:
                    </p>
                    <ul>
                      <li>Email: admin@dccms.com</li>
                      <li>Password: admin123</li>
                    </ul>

                    <h3>Dashboard</h3>
                    <p>
                      After logging in, you'll be taken to the dashboard, which provides an overview of your site's content,
                      including recent posts, analytics, and quick access to common tasks.
                    </p>

                    <h2>Content Management</h2>
                    <h3>Posts</h3>
                    <p>
                      The Posts section allows you to create, edit, and manage blog posts. Each post can have:
                    </p>
                    <ul>
                      <li>Title and slug</li>
                      <li>Content (rich text editor)</li>
                      <li>Featured image</li>
                      <li>Category</li>
                      <li>Status (draft, published, scheduled, archived)</li>
                      <li>SEO metadata</li>
                      <li>Content blocks for advanced layouts</li>
                    </ul>

                    <h3>Categories</h3>
                    <p>
                      Categories help organize your content. You can create hierarchical categories with:
                    </p>
                    <ul>
                      <li>Name and slug</li>
                      <li>Description</li>
                      <li>Color</li>
                      <li>Parent category (for hierarchical organization)</li>
                    </ul>

                    <h3>Content Pages</h3>
                    <p>
                      Content Pages are static pages with flexible layouts. Each page can have:
                    </p>
                    <ul>
                      <li>Title and HTML name (for the URL)</li>
                      <li>Description</li>
                      <li>Background image or color</li>
                      <li>Sections with various content types</li>
                      <li>SEO metadata</li>
                    </ul>

                    <h3>Media Library</h3>
                    <p>
                      The Media Library allows you to upload, organize, and manage media files such as images, videos, and documents.
                      Features include:
                    </p>
                    <ul>
                      <li>File upload</li>
                      <li>Folder organization</li>
                      <li>Search and filtering</li>
                      <li>Image metadata (alt text, captions)</li>
                    </ul>

                    <h2>Ecommerce</h2>
                    <h3>Products</h3>
                    <p>
                      Manage your product catalog with detailed product information:
                    </p>
                    <ul>
                      <li>Name, slug, and description</li>
                      <li>Images</li>
                      <li>Price</li>
                      <li>Category</li>
                      <li>Status (active, inactive, archived)</li>
                      <li>Specifications</li>
                      <li>Content blocks for rich product descriptions</li>
                    </ul>

                    <h3>Product Variations</h3>
                    <p>
                      Create variations of products with different attributes:
                    </p>
                    <ul>
                      <li>SKU</li>
                      <li>Options (color, size, material, etc.)</li>
                      <li>Price</li>
                      <li>Stock</li>
                      <li>Status</li>
                    </ul>

                    <h3>Orders</h3>
                    <p>
                      Manage customer orders with comprehensive order management:
                    </p>
                    <ul>
                      <li>Order details</li>
                      <li>Customer information</li>
                      <li>Order items</li>
                      <li>Shipping information</li>
                      <li>Status tracking</li>
                      <li>Payment status</li>
                    </ul>

                    <h3>Coupons</h3>
                    <p>
                      Create and manage discount coupons:
                    </p>
                    <ul>
                      <li>Code</li>
                      <li>Type (percentage or fixed amount)</li>
                      <li>Value</li>
                      <li>Minimum order amount</li>
                      <li>Usage limits</li>
                      <li>Expiration date</li>
                    </ul>

                    <h2>Site Management</h2>
                    <h3>Menus</h3>
                    <p>
                      Create and manage navigation menus for your site:
                    </p>
                    <ul>
                      <li>Menu name and location</li>
                      <li>Menu items with links</li>
                      <li>Hierarchical menu structure</li>
                      <li>Custom links and page links</li>
                    </ul>

                    <h3>Forms</h3>
                    <p>
                      Build custom forms for your site:
                    </p>
                    <ul>
                      <li>Form name and description</li>
                      <li>Custom fields with various types</li>
                      <li>Validation rules</li>
                      <li>Email notifications</li>
                      <li>Success messages and redirects</li>
                    </ul>

                    <h3>Users</h3>
                    <p>
                      Manage user accounts and permissions:
                    </p>
                    <ul>
                      <li>User profiles</li>
                      <li>Role management (admin, editor, author, customer)</li>
                      <li>Account status</li>
                    </ul>

                    <h2>Settings</h2>
                    <h3>General Settings</h3>
                    <p>
                      Configure basic site information:
                    </p>
                    <ul>
                      <li>Site name and description</li>
                      <li>Logo and favicon</li>
                      <li>Contact information</li>
                      <li>Social media links</li>
                    </ul>

                    <h3>Ecommerce Settings</h3>
                    <p>
                      Configure your store settings:
                    </p>
                    <ul>
                      <li>Currency and formatting</li>
                      <li>Tax settings</li>
                      <li>Shipping options</li>
                    </ul>

                    <h3>SEO & Analytics</h3>
                    <p>
                      Optimize your site for search engines:
                    </p>
                    <ul>
                      <li>Default meta tags</li>
                      <li>Google Analytics integration</li>
                      <li>Facebook Pixel</li>
                      <li>Robots.txt and sitemap configuration</li>
                    </ul>

                    <h3>Email Settings</h3>
                    <p>
                      Configure email notifications:
                    </p>
                    <ul>
                      <li>SMTP settings</li>
                      <li>Email templates</li>
                      <li>Notification preferences</li>
                    </ul>

                    <h3>Security Settings</h3>
                    <p>
                      Enhance your site's security:
                    </p>
                    <ul>
                      <li>Authentication options</li>
                      <li>Password policies</li>
                      <li>CAPTCHA and 2FA</li>
                      <li>Session management</li>
                    </ul>

                    <h2>Advanced Features</h2>
                    <h3>Content Blocks</h3>
                    <p>
                      Create rich, flexible layouts with content blocks:
                    </p>
                    <ul>
                      <li>Text and rich text</li>
                      <li>Images and galleries</li>
                      <li>Videos and audio</li>
                      <li>Lists and tables</li>
                      <li>Custom HTML and embeds</li>
                    </ul>

                    <h3>Sections</h3>
                    <p>
                      Build page layouts with reusable sections:
                    </p>
                    <ul>
                      <li>Hero sections</li>
                      <li>Feature grids</li>
                      <li>Testimonials</li>
                      <li>Product showcases</li>
                      <li>Contact forms</li>
                    </ul>

                    <h2>Support</h2>
                    <p>
                      If you need help with DC CMS, please contact our support team at support@dccms.com.
                    </p>
                  </div>
                ) : (
                  <div className="prose dark:prose-invert max-w-none">
                    <h1>DC CMS API Documentation</h1>
                    
                    <h2>Introduction</h2>
                    <p>
                      The DC CMS API allows you to interact with your content programmatically. This documentation provides
                      information on available endpoints, authentication, and example requests.
                    </p>

                    <h2>Base URL</h2>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      https://your-api-domain.com/api
                    </pre>

                    <h2>Authentication</h2>
                    <p>
                      Most API endpoints require authentication. The API uses JWT (JSON Web Token) for authentication.
                    </p>

                    <h3>Obtaining a Token</h3>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      POST /auth/login
                    </pre>

                    <p>Request Body:</p>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
{`{
  "email": "user@example.com",
  "password": "your-password"
}`}
                    </pre>

                    <p>Response:</p>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
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
                    <p>
                      Include the token in the Authorization header for all protected requests:
                    </p>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      Authorization: Bearer your-jwt-token
                    </pre>

                    <h2>API Endpoints</h2>

                    <h3>Authentication</h3>
                    <h4>Register a new user</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      POST /auth/register
                    </pre>

                    <h4>Login</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      POST /auth/login
                    </pre>

                    <h4>Get User Profile</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      GET /auth/profile
                    </pre>

                    <h4>Update User Profile</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      PUT /auth/profile
                    </pre>

                    <h3>Content Management</h3>
                    <h4>Get All Posts</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      GET /posts
                    </pre>

                    <p>Query Parameters:</p>
                    <ul>
                      <li><code>page</code> (default: 1): Page number</li>
                      <li><code>limit</code> (default: 10): Items per page</li>
                      <li><code>status</code> (default: published): Filter by status (published, draft, archived, all)</li>
                      <li><code>category</code>: Filter by category ID</li>
                      <li><code>search</code>: Search term</li>
                      <li><code>sort</code> (default: created_at): Field to sort by</li>
                      <li><code>order</code> (default: desc): Sort order (asc, desc)</li>
                    </ul>

                    <h4>Get Single Post</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      GET /posts/:id
                    </pre>

                    <h4>Create Post</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      POST /posts
                    </pre>

                    <h4>Update Post</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      PUT /posts/:id
                    </pre>

                    <h4>Delete Post</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      DELETE /posts/:id
                    </pre>

                    <h3>Categories</h3>
                    <h4>Get All Categories</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      GET /categories
                    </pre>

                    <h4>Get Single Category</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      GET /categories/:id
                    </pre>

                    <h4>Create Category</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      POST /categories
                    </pre>

                    <h4>Update Category</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      PUT /categories/:id
                    </pre>

                    <h4>Delete Category</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      DELETE /categories/:id
                    </pre>

                    <h3>Content Pages</h3>
                    <h4>Get All Content Pages</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      GET /content
                    </pre>

                    <h4>Get Content Page by ID</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      GET /content/:id
                    </pre>

                    <h4>Get Content Page by HTML Name</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      GET /content/page/:htmlName
                    </pre>

                    <h4>Create Content Page</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      POST /content
                    </pre>

                    <h4>Update Content Page</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      PUT /content/:id
                    </pre>

                    <h4>Delete Content Page</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      DELETE /content/:id
                    </pre>

                    <h3>Products</h3>
                    <h4>Get All Products</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      GET /products
                    </pre>

                    <h4>Get Single Product</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      GET /products/:id
                    </pre>

                    <h4>Create Product</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      POST /products
                    </pre>

                    <h4>Update Product</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      PUT /products/:id
                    </pre>

                    <h4>Delete Product</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      DELETE /products/:id
                    </pre>

                    <h3>Orders</h3>
                    <h4>Get All Orders</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      GET /orders
                    </pre>

                    <h4>Get Single Order</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      GET /orders/:id
                    </pre>

                    <h4>Create Order</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      POST /orders
                    </pre>

                    <h4>Update Order Status</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      PUT /orders/:id/status
                    </pre>

                    <h4>Cancel Order</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      PUT /orders/:id/cancel
                    </pre>

                    <h3>Settings</h3>
                    <h4>Get All Settings</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      GET /settings
                    </pre>

                    <h4>Get Specific Setting</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      GET /settings/:key
                    </pre>

                    <h4>Update Setting</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      PUT /settings/:key
                    </pre>

                    <h4>Update Multiple Settings</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      PUT /settings
                    </pre>

                    <h2>Error Handling</h2>
                    <p>
                      All API endpoints return a consistent error format:
                    </p>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
{`{
  "success": false,
  "error": "Error message description"
}`}
                    </pre>

                    <p>Common HTTP status codes:</p>
                    <ul>
                      <li><code>200 OK</code>: Request succeeded</li>
                      <li><code>201 Created</code>: Resource created successfully</li>
                      <li><code>400 Bad Request</code>: Invalid request parameters</li>
                      <li><code>401 Unauthorized</code>: Missing or invalid authentication</li>
                      <li><code>403 Forbidden</code>: Insufficient permissions</li>
                      <li><code>404 Not Found</code>: Resource not found</li>
                      <li><code>500 Internal Server Error</code>: Server error</li>
                    </ul>

                    <h2>Pagination</h2>
                    <p>
                      Endpoints that return multiple items support pagination with the following response format:
                    </p>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
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
                    <p>
                      The API implements rate limiting to prevent abuse. Current limits:
                    </p>
                    <ul>
                      <li>100 requests per 15-minute window per IP address</li>
                    </ul>
                    <p>
                      When rate limited, you'll receive a <code>429 Too Many Requests</code> response.
                    </p>

                    <h2>Example Requests</h2>
                    <h3>JavaScript/TypeScript</h3>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
{`// Get all products
const getProducts = async () => {
  try {
    const response = await fetch('https://your-api-domain.com/api/products', {
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN'
      }
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

// Create a new post
const createPost = async () => {
  try {
    const response = await fetch('https://your-api-domain.com/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_JWT_TOKEN'
      },
      body: JSON.stringify({
        title: 'New Post',
        content: 'Post content',
        status: 'published'
      })
    });
    const data = await response.json();
    console.log('Post created:', data);
  } catch (error) {
    console.error('Error creating post:', error);
  }
};`}
                    </pre>

                    <h2>Support</h2>
                    <p>
                      If you need help with the API, please contact our support team at api-support@dccms.com.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDocModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Close
                </button>
                <a
                  href={docType === 'cms' ? '/docs/cms-documentation.pdf' : '/docs/api-documentation.pdf'}
                  download
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Documentation</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;