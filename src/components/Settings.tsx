import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  Globe, 
  DollarSign, 
  Search, 
  Mail, 
  Shield, 
  FileText,
  Download,
  Trash2,
  Plus,
  X,
  Upload,
  ExternalLink,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Link as LinkIcon
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useSiteInfo } from '../hooks/useSiteInfo';
import { useAuth } from '../contexts/AuthContext';
import { useMedia } from '../hooks/useMedia';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { settings, loading: settingsLoading, updateSettings } = useSettings();
  const { siteInfo, loading: siteInfoLoading, updateSiteInfo } = useSiteInfo();
  const { uploadMedia } = useMedia();
  
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState<'cms' | 'api' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoLightInputRef = useRef<HTMLInputElement>(null);
  const logoDarkInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  
  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    site_name: '',
    tagline: '',
    logo_url: '',
    logo_light: '',
    logo_dark: '',
    favicon: '',
    description: '',
    contact_info: [] as {
      id: string;
      label: string;
      address: string;
      map_url: string;
      emails: string[];
      phones: string[];
    }[],
    social_icons: [] as {
      id: string;
      platform: string;
      url: string;
      icon: string;
    }[]
  });
  
  // Ecommerce settings
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
    default_shipping_cost: 10
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
    enable_sitemap: true,
    sitemap_frequency: 'weekly',
    sitemap_priority: 0.7
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
  
  // Available currencies
  const [availableCurrencies, setAvailableCurrencies] = useState<{
    code: string;
    name: string;
    symbol: string;
  }[]>([
    { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' }
  ]);
  
  // Social media platforms
  const socialPlatforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook },
    { id: 'twitter', name: 'Twitter', icon: Twitter },
    { id: 'instagram', name: 'Instagram', icon: Instagram },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
    { id: 'youtube', name: 'YouTube', icon: Youtube },
    { id: 'github', name: 'GitHub', icon: Github },
    { id: 'other', name: 'Other', icon: LinkIcon }
  ];

  // Load settings from database
  useEffect(() => {
    if (!settingsLoading && settings) {
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
        enable_shipping: settings.enable_shipping || true,
        free_shipping_threshold: settings.free_shipping_threshold || 100,
        default_shipping_cost: settings.default_shipping_cost || 10
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
      
      // Load available currencies
      if (settings.available_currencies) {
        setAvailableCurrencies(settings.available_currencies);
      }
    }
  }, [settings, settingsLoading]);
  
  // Load site info from database
  useEffect(() => {
    if (!siteInfoLoading && siteInfo) {
      setGeneralSettings({
        site_name: siteInfo.site_name || '',
        tagline: siteInfo.tagline || '',
        logo_url: siteInfo.logo_url || '',
        logo_light: siteInfo.logo_light || '',
        logo_dark: siteInfo.logo_dark || '',
        favicon: siteInfo.favicon || '',
        description: siteInfo.description || '',
        contact_info: siteInfo.contact_info || [{
          id: '1',
          label: 'Main Office',
          address: '',
          map_url: '',
          emails: [''],
          phones: ['']
        }],
        social_icons: siteInfo.social_icons || []
      });
    }
  }, [siteInfo, siteInfoLoading]);

  const handleSaveSettings = async () => {
    setSaving(true);
    
    try {
      // Save general settings to site_info table
      await updateSiteInfo({
        site_name: generalSettings.site_name,
        tagline: generalSettings.tagline,
        logo_url: generalSettings.logo_url,
        logo_light: generalSettings.logo_light,
        logo_dark: generalSettings.logo_dark,
        favicon: generalSettings.favicon,
        description: generalSettings.description,
        contact_info: generalSettings.contact_info,
        social_icons: generalSettings.social_icons
      });
      
      // Save other settings to settings table
      const settingsToUpdate = {
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
        
        // Available currencies
        available_currencies: availableCurrencies
      };
      
      await updateSettings(settingsToUpdate);
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleFileUpload = async (file: File, type: 'logo' | 'logo_light' | 'logo_dark' | 'favicon') => {
    try {
      const result = await uploadMedia(file);
      if (result.success && result.data) {
        switch (type) {
          case 'logo':
            setGeneralSettings(prev => ({ ...prev, logo_url: result.data.url }));
            break;
          case 'logo_light':
            setGeneralSettings(prev => ({ ...prev, logo_light: result.data.url }));
            break;
          case 'logo_dark':
            setGeneralSettings(prev => ({ ...prev, logo_dark: result.data.url }));
            break;
          case 'favicon':
            setGeneralSettings(prev => ({ ...prev, favicon: result.data.url }));
            break;
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload file. Please try again.');
    }
  };
  
  const handleAddContactInfo = () => {
    setGeneralSettings(prev => ({
      ...prev,
      contact_info: [
        ...prev.contact_info,
        {
          id: Date.now().toString(),
          label: `Office ${prev.contact_info.length + 1}`,
          address: '',
          map_url: '',
          emails: [''],
          phones: ['']
        }
      ]
    }));
  };
  
  const handleRemoveContactInfo = (id: string) => {
    setGeneralSettings(prev => ({
      ...prev,
      contact_info: prev.contact_info.filter(info => info.id !== id)
    }));
  };
  
  const handleUpdateContactInfo = (id: string, field: string, value: any) => {
    setGeneralSettings(prev => ({
      ...prev,
      contact_info: prev.contact_info.map(info => 
        info.id === id ? { ...info, [field]: value } : info
      )
    }));
  };
  
  const handleAddContactEmail = (contactId: string) => {
    setGeneralSettings(prev => ({
      ...prev,
      contact_info: prev.contact_info.map(info => 
        info.id === contactId 
          ? { ...info, emails: [...info.emails, ''] } 
          : info
      )
    }));
  };
  
  const handleUpdateContactEmail = (contactId: string, index: number, value: string) => {
    setGeneralSettings(prev => ({
      ...prev,
      contact_info: prev.contact_info.map(info => {
        if (info.id === contactId) {
          const newEmails = [...info.emails];
          newEmails[index] = value;
          return { ...info, emails: newEmails };
        }
        return info;
      })
    }));
  };
  
  const handleRemoveContactEmail = (contactId: string, index: number) => {
    setGeneralSettings(prev => ({
      ...prev,
      contact_info: prev.contact_info.map(info => {
        if (info.id === contactId) {
          const newEmails = [...info.emails];
          newEmails.splice(index, 1);
          return { ...info, emails: newEmails };
        }
        return info;
      })
    }));
  };
  
  const handleAddContactPhone = (contactId: string) => {
    setGeneralSettings(prev => ({
      ...prev,
      contact_info: prev.contact_info.map(info => 
        info.id === contactId 
          ? { ...info, phones: [...info.phones, ''] } 
          : info
      )
    }));
  };
  
  const handleUpdateContactPhone = (contactId: string, index: number, value: string) => {
    setGeneralSettings(prev => ({
      ...prev,
      contact_info: prev.contact_info.map(info => {
        if (info.id === contactId) {
          const newPhones = [...info.phones];
          newPhones[index] = value;
          return { ...info, phones: newPhones };
        }
        return info;
      })
    }));
  };
  
  const handleRemoveContactPhone = (contactId: string, index: number) => {
    setGeneralSettings(prev => ({
      ...prev,
      contact_info: prev.contact_info.map(info => {
        if (info.id === contactId) {
          const newPhones = [...info.phones];
          newPhones.splice(index, 1);
          return { ...info, phones: newPhones };
        }
        return info;
      })
    }));
  };
  
  const handleAddSocialIcon = () => {
    setGeneralSettings(prev => ({
      ...prev,
      social_icons: [
        ...prev.social_icons,
        {
          id: Date.now().toString(),
          platform: 'facebook',
          url: '',
          icon: 'facebook'
        }
      ]
    }));
  };
  
  const handleRemoveSocialIcon = (id: string) => {
    setGeneralSettings(prev => ({
      ...prev,
      social_icons: prev.social_icons.filter(icon => icon.id !== id)
    }));
  };
  
  const handleUpdateSocialIcon = (id: string, field: string, value: string) => {
    setGeneralSettings(prev => ({
      ...prev,
      social_icons: prev.social_icons.map(icon => 
        icon.id === id ? { ...icon, [field]: value } : icon
      )
    }));
  };
  
  const formatCurrency = (amount: number) => {
    const { currency_symbol, currency_position, thousand_separator, decimal_separator, decimal_places } = ecommerceSettings;
    
    const formattedAmount = amount.toFixed(decimal_places)
      .replace('.', decimal_separator)
      .replace(/\B(?=(\d{3})+(?!\d))/g, thousand_separator);
    
    return currency_position === 'left'
      ? `${currency_symbol}${formattedAmount}`
      : `${formattedAmount}${currency_symbol}`;
  };
  
  const getSocialIcon = (platform: string) => {
    const found = socialPlatforms.find(p => p.id === platform);
    if (found) {
      const Icon = found.icon;
      return <Icon className="w-4 h-4" />;
    }
    return <LinkIcon className="w-4 h-4" />;
  };
  
  const isAdmin = user?.role === 'admin';
  
  if (settingsLoading || siteInfoLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Access Restricted</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Only administrators can access the settings page.
        </p>
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
            onClick={() => setShowDocsModal('cms')}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>CMS Documentation</span>
          </button>
          <button
            onClick={() => setShowDocsModal('api')}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>API Documentation</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
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
      <div className="space-y-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <>
            {/* Site Information */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Site Information</h3>
              
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
                    placeholder="Just another website"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Description
                </label>
                <textarea
                  value={generalSettings.description}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Brief description of your website"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Logo (Default)
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={generalSettings.logo_url}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, logo_url: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="https://example.com/logo.png"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0], 'logo');
                      }
                    }}
                  />
                  {generalSettings.logo_url && (
                    <div className="mt-2">
                      <img
                        src={generalSettings.logo_url}
                        alt="Logo"
                        className="h-12 object-contain"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Logo (Light Mode)
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={generalSettings.logo_light}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, logo_light: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="https://example.com/logo-light.png"
                    />
                    <button
                      type="button"
                      onClick={() => logoLightInputRef.current?.click()}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    ref={logoLightInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0], 'logo_light');
                      }
                    }}
                  />
                  {generalSettings.logo_light && (
                    <div className="mt-2 bg-white p-2 rounded">
                      <img
                        src={generalSettings.logo_light}
                        alt="Logo Light"
                        className="h-12 object-contain"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Logo (Dark Mode)
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={generalSettings.logo_dark}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, logo_dark: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="https://example.com/logo-dark.png"
                    />
                    <button
                      type="button"
                      onClick={() => logoDarkInputRef.current?.click()}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    ref={logoDarkInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0], 'logo_dark');
                      }
                    }}
                  />
                  {generalSettings.logo_dark && (
                    <div className="mt-2 bg-gray-800 p-2 rounded">
                      <img
                        src={generalSettings.logo_dark}
                        alt="Logo Dark"
                        className="h-12 object-contain"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Favicon
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={generalSettings.favicon}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, favicon: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="https://example.com/favicon.ico"
                    />
                    <button
                      type="button"
                      onClick={() => faviconInputRef.current?.click()}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    ref={faviconInputRef}
                    type="file"
                    accept="image/x-icon,image/png,image/svg+xml"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0], 'favicon');
                      }
                    }}
                  />
                  {generalSettings.favicon && (
                    <div className="mt-2">
                      <img
                        src={generalSettings.favicon}
                        alt="Favicon"
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h3>
                <button
                  type="button"
                  onClick={handleAddContactInfo}
                  className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Contact</span>
                </button>
              </div>
              
              <div className="space-y-6">
                {generalSettings.contact_info.map((contact, index) => (
                  <div key={contact.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Contact #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveContactInfo(contact.id)}
                        className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Contact Label
                        </label>
                        <input
                          type="text"
                          value={contact.label}
                          onChange={(e) => handleUpdateContactInfo(contact.id, 'label', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Main Office"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Address
                        </label>
                        <textarea
                          value={contact.address}
                          onChange={(e) => handleUpdateContactInfo(contact.id, 'address', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="123 Main St, City, Country"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Map URL
                        </label>
                        <input
                          type="url"
                          value={contact.map_url}
                          onChange={(e) => handleUpdateContactInfo(contact.id, 'map_url', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="https://maps.google.com/..."
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
                            onClick={() => handleAddContactEmail(contact.id)}
                            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            + Add Email
                          </button>
                        </div>
                        
                        {contact.emails.map((email, emailIndex) => (
                          <div key={emailIndex} className="flex items-center space-x-2 mb-2">
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => handleUpdateContactEmail(contact.id, emailIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              placeholder="contact@example.com"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveContactEmail(contact.id, emailIndex)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      {/* Phone Numbers */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Phone Numbers
                          </label>
                          <button
                            type="button"
                            onClick={() => handleAddContactPhone(contact.id)}
                            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            + Add Phone
                          </button>
                        </div>
                        
                        {contact.phones.map((phone, phoneIndex) => (
                          <div key={phoneIndex} className="flex items-center space-x-2 mb-2">
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => handleUpdateContactPhone(contact.id, phoneIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              placeholder="+1234567890"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveContactPhone(contact.id, phoneIndex)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                
                {generalSettings.contact_info.length === 0 && (
                  <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No contact information added yet</p>
                    <button
                      type="button"
                      onClick={handleAddContactInfo}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      + Add Contact Information
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Social Media */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Social Media</h3>
                <button
                  type="button"
                  onClick={handleAddSocialIcon}
                  className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Social Media</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {generalSettings.social_icons.map((social) => (
                  <div key={social.id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      {getSocialIcon(social.platform)}
                    </div>
                    
                    <select
                      value={social.platform}
                      onChange={(e) => handleUpdateSocialIcon(social.id, 'platform', e.target.value)}
                      className="w-40 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      {socialPlatforms.map(platform => (
                        <option key={platform.id} value={platform.id}>{platform.name}</option>
                      ))}
                    </select>
                    
                    <input
                      type="url"
                      value={social.url}
                      onChange={(e) => handleUpdateSocialIcon(social.id, 'url', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="https://example.com/profile"
                    />
                    
                    <button
                      type="button"
                      onClick={() => handleRemoveSocialIcon(social.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {generalSettings.social_icons.length === 0 && (
                  <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    <LinkIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No social media links added yet</p>
                    <button
                      type="button"
                      onClick={handleAddSocialIcon}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      + Add Social Media Link
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        
        {/* Ecommerce Settings */}
        {activeTab === 'ecommerce' && (
          <>
            {/* Currency Settings */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Currency Settings</h3>
              
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
                        currency_symbol: selectedCurrency?.symbol || ecommerceSettings.currency_symbol
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
                    placeholder="$"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Symbol Position
                  </label>
                  <select
                    value={ecommerceSettings.currency_position}
                    onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, currency_position: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="left">Left (৳100.00)</option>
                    <option value="right">Right (100.00৳)</option>
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
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Decimal Places
                  </label>
                  <input
                    type="number"
                    value={ecommerceSettings.decimal_places}
                    onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, decimal_places: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    min={0}
                    max={4}
                  />
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(1234.56)}
                </p>
              </div>
            </div>
            
            {/* Tax & Shipping */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Tax & Shipping</h3>
              
              <div className="space-y-6">
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
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Apply shipping costs to orders
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
                          {ecommerceSettings.currency_symbol}
                        </span>
                        <input
                          type="number"
                          value={ecommerceSettings.free_shipping_threshold}
                          onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, free_shipping_threshold: parseFloat(e.target.value) })}
                          className="w-full pl-7 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          min={0}
                          step={0.01}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Set to 0 to disable free shipping
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        
        {/* SEO & Analytics Settings */}
        {activeTab === 'seo' && (
          <>
            {/* Meta Tags */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Meta Tags</h3>
              
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
                    placeholder="My Website - Official Site"
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
                    placeholder="A brief description of your website for search engines"
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
              </div>
            </div>
            
            {/* Analytics */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Analytics</h3>
              
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
                    Your Google Analytics measurement ID (starts with G-)
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
                    placeholder="XXXXXXXXXX"
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
                    placeholder="GTM-XXXXXX"
                  />
                </div>
              </div>
            </div>
            
            {/* Sitemap & Robots */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Sitemap & Robots</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable XML Sitemap
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Generate an XML sitemap for search engines
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        min={0}
                        max={1}
                        step={0.1}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Value between 0.0 and 1.0
                      </p>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Robots.txt Content
                  </label>
                  <textarea
                    value={seoSettings.robots_txt}
                    onChange={(e) => setSeoSettings({ ...seoSettings, robots_txt: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                    placeholder="User-agent: *\nDisallow: /admin/\nSitemap: https://example.com/sitemap.xml"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Leave empty to use the default robots.txt
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Email Settings */}
        {activeTab === 'email' && (
          <>
            {/* SMTP Settings */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">SMTP Settings</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Email Notifications
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Send email notifications for orders, form submissions, etc.
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
                        placeholder="My Website"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Email Templates */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Email Templates</h3>
              
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Email templates can be customized in the Email Templates section.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Order Confirmation</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Sent when a customer places an order
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Order Shipped</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Sent when an order is shipped
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Form Submission</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Sent when a form is submitted
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Password Reset</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Sent when a user requests a password reset
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Security Settings */}
        {activeTab === 'security' && (
          <>
            {/* Authentication */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Authentication</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Allow User Registration
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Allow visitors to create accounts
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
                      Allow login with social media accounts
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
                      Enable Two-Factor Authentication
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Add an extra layer of security
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
            
            {/* Password Policy */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Password Policy</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Password Length
                  </label>
                  <input
                    type="number"
                    value={securitySettings.password_min_length}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, password_min_length: parseInt(e.target.value) })}
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
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Passwords must contain special characters
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
                      Passwords must contain numbers
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
                    min={5}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Time in minutes before an inactive session expires
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={saving}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              saving
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
      
      {/* Documentation Modals */}
      {showDocsModal === 'cms' && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowDocsModal(null)} />
            
            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">CMS Documentation</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => window.open('/docs/cms-documentation.pdf', '_blank')}
                    className="flex items-center space-x-2 px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => setShowDocsModal(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="overflow-y-auto max-h-[70vh] pr-2 space-y-6">
                <div className="prose prose-blue dark:prose-invert max-w-none">
                  <h1>DC CMS Documentation</h1>
                  
                  <h2>Introduction</h2>
                  <p>
                    Welcome to the DC CMS documentation. This guide will help you understand how to use and configure your content management system effectively.
                  </p>
                  
                  <h2>Getting Started</h2>
                  <h3>Dashboard Overview</h3>
                  <p>
                    The dashboard provides an overview of your site's performance, recent content, and quick access to common tasks.
                  </p>
                  
                  <h3>Content Management</h3>
                  <p>
                    DC CMS allows you to manage various types of content:
                  </p>
                  <ul>
                    <li><strong>Posts</strong>: Blog posts and articles</li>
                    <li><strong>Pages</strong>: Static content pages</li>
                    <li><strong>Products</strong>: Ecommerce products and variations</li>
                    <li><strong>Categories</strong>: Organize your content and products</li>
                    <li><strong>Media</strong>: Images, videos, and other files</li>
                  </ul>
                  
                  <h2>Content Creation</h2>
                  <h3>Creating Posts</h3>
                  <p>
                    To create a new post:
                  </p>
                  <ol>
                    <li>Navigate to the Posts section</li>
                    <li>Click "New Post"</li>
                    <li>Fill in the title, content, and other fields</li>
                    <li>Set the status (Draft, Published, Scheduled)</li>
                    <li>Click "Save Post"</li>
                  </ol>
                  
                  <h3>Content Blocks</h3>
                  <p>
                    Content blocks allow you to create rich, structured content:
                  </p>
                  <ul>
                    <li><strong>Text Block</strong>: Regular text content</li>
                    <li><strong>Image Block</strong>: Single image with caption</li>
                    <li><strong>Gallery Block</strong>: Multiple images</li>
                    <li><strong>Video Block</strong>: Embed videos</li>
                    <li><strong>Quote Block</strong>: Highlighted quotations</li>
                    <li><strong>List Block</strong>: Ordered or unordered lists</li>
                  </ul>
                  
                  <h2>Ecommerce</h2>
                  <h3>Product Management</h3>
                  <p>
                    To manage products:
                  </p>
                  <ol>
                    <li>Navigate to the Products section</li>
                    <li>Create or edit products</li>
                    <li>Add variations (size, color, etc.)</li>
                    <li>Set pricing and inventory</li>
                    <li>Manage categories</li>
                  </ol>
                  
                  <h3>Order Management</h3>
                  <p>
                    The Orders section allows you to:
                  </p>
                  <ul>
                    <li>View all orders</li>
                    <li>Update order status</li>
                    <li>Process payments</li>
                    <li>Manage shipping</li>
                  </ul>
                  
                  <h2>User Management</h2>
                  <p>
                    DC CMS supports multiple user roles:
                  </p>
                  <ul>
                    <li><strong>Admin</strong>: Full access to all features</li>
                    <li><strong>Editor</strong>: Can manage content and products</li>
                    <li><strong>Author</strong>: Can create and manage own content</li>
                    <li><strong>Customer</strong>: Can make purchases and manage account</li>
                  </ul>
                  
                  <h2>Settings</h2>
                  <h3>General Settings</h3>
                  <p>
                    Configure basic site information, logos, and contact details.
                  </p>
                  
                  <h3>Ecommerce Settings</h3>
                  <p>
                    Set up currency, tax rates, and shipping options.
                  </p>
                  
                  <h3>SEO & Analytics</h3>
                  <p>
                    Configure meta tags, analytics tracking, and sitemap settings.
                  </p>
                  
                  <h3>Email Settings</h3>
                  <p>
                    Set up SMTP for sending notifications and customize email templates.
                  </p>
                  
                  <h3>Security Settings</h3>
                  <p>
                    Configure authentication options, password policies, and session management.
                  </p>
                  
                  <h2>Advanced Features</h2>
                  <h3>Forms</h3>
                  <p>
                    Create custom forms for contact, feedback, and more.
                  </p>
                  
                  <h3>Menus</h3>
                  <p>
                    Build and manage navigation menus for your site.
                  </p>
                  
                  <h3>Media Library</h3>
                  <p>
                    Organize and manage all your media files.
                  </p>
                  
                  <h2>Troubleshooting</h2>
                  <p>
                    If you encounter issues:
                  </p>
                  <ol>
                    <li>Check the error logs</li>
                    <li>Verify your settings</li>
                    <li>Ensure your database connection is working</li>
                    <li>Contact support if problems persist</li>
                  </ol>
                  
                  <h2>Support</h2>
                  <p>
                    For additional help, please contact our support team at support@dccms.com.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showDocsModal === 'api' && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowDocsModal(null)} />
            
            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">API Documentation</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => window.open('/docs/api-documentation.pdf', '_blank')}
                    className="flex items-center space-x-2 px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => setShowDocsModal(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="overflow-y-auto max-h-[70vh] pr-2 space-y-6">
                <div className="prose prose-blue dark:prose-invert max-w-none">
                  <h1>DC CMS API Documentation</h1>
                  
                  <h2>Introduction</h2>
                  <p>
                    The DC CMS API allows you to interact with your content programmatically. This documentation provides details on available endpoints, authentication, and example usage.
                  </p>
                  
                  <h2>Authentication</h2>
                  <p>
                    All API requests require authentication using JWT (JSON Web Token).
                  </p>
                  
                  <h3>Obtaining a Token</h3>
                  <pre><code>
                    POST /api/auth/login<br/>
                    {`{
  "email": "user@example.com",
  "password": "your-password"
}`}
                  </code></pre>
                  
                  <h3>Using the Token</h3>
                  <p>
                    Include the token in the Authorization header:
                  </p>
                  <pre><code>
                    Authorization: Bearer your-jwt-token
                  </code></pre>
                  
                  <h2>Endpoints</h2>
                  
                  <h3>Posts</h3>
                  <ul>
                    <li><code>GET /api/posts</code> - Get all posts</li>
                    <li><code>GET /api/posts/:id</code> - Get a specific post</li>
                    <li><code>POST /api/posts</code> - Create a new post</li>
                    <li><code>PUT /api/posts/:id</code> - Update a post</li>
                    <li><code>DELETE /api/posts/:id</code> - Delete a post</li>
                  </ul>
                  
                  <h4>Example: Get Posts</h4>
                  <pre><code>
                    GET /api/posts?limit=10&page=1&status=published
                  </code></pre>
                  
                  <h4>Example: Create Post</h4>
                  <pre><code>
                    POST /api/posts<br/>
                    {`{
  "title": "New Post",
  "slug": "new-post",
  "content": "Post content here...",
  "status": "published",
  "category_id": "category-uuid"
}`}
                  </code></pre>
                  
                  <h3>Products</h3>
                  <ul>
                    <li><code>GET /api/products</code> - Get all products</li>
                    <li><code>GET /api/products/:id</code> - Get a specific product</li>
                    <li><code>POST /api/products</code> - Create a new product</li>
                    <li><code>PUT /api/products/:id</code> - Update a product</li>
                    <li><code>DELETE /api/products/:id</code> - Delete a product</li>
                  </ul>
                  
                  <h3>Orders</h3>
                  <ul>
                    <li><code>GET /api/orders</code> - Get all orders</li>
                    <li><code>GET /api/orders/:id</code> - Get a specific order</li>
                    <li><code>POST /api/orders</code> - Create a new order</li>
                    <li><code>PUT /api/orders/:id/status</code> - Update order status</li>
                  </ul>
                  
                  <h3>Categories</h3>
                  <ul>
                    <li><code>GET /api/categories</code> - Get all categories</li>
                    <li><code>GET /api/categories/:id</code> - Get a specific category</li>
                    <li><code>POST /api/categories</code> - Create a new category</li>
                    <li><code>PUT /api/categories/:id</code> - Update a category</li>
                    <li><code>DELETE /api/categories/:id</code> - Delete a category</li>
                  </ul>
                  
                  <h3>Users</h3>
                  <ul>
                    <li><code>GET /api/users</code> - Get all users (admin only)</li>
                    <li><code>GET /api/users/:id</code> - Get a specific user</li>
                    <li><code>POST /api/users</code> - Create a new user (admin only)</li>
                    <li><code>PUT /api/users/:id</code> - Update a user</li>
                    <li><code>DELETE /api/users/:id</code> - Delete a user (admin only)</li>
                  </ul>
                  
                  <h2>Response Format</h2>
                  <p>
                    All API responses follow a consistent format:
                  </p>
                  <pre><code>
                    {`{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}`}
                  </code></pre>
                  
                  <p>
                    For errors:
                  </p>
                  <pre><code>
                    {`{
  "success": false,
  "error": "Error message"
}`}
                  </code></pre>
                  
                  <h2>Pagination</h2>
                  <p>
                    Endpoints that return multiple items support pagination:
                  </p>
                  <pre><code>
                    {`{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}`}
                  </code></pre>
                  
                  <h2>Rate Limits</h2>
                  <p>
                    The API has rate limits to prevent abuse:
                  </p>
                  <ul>
                    <li>100 requests per minute for authenticated users</li>
                    <li>30 requests per minute for unauthenticated users</li>
                  </ul>
                  
                  <h2>Webhooks</h2>
                  <p>
                    DC CMS supports webhooks for real-time notifications:
                  </p>
                  <ul>
                    <li><code>order.created</code> - When a new order is created</li>
                    <li><code>order.updated</code> - When an order status changes</li>
                    <li><code>form.submitted</code> - When a form is submitted</li>
                  </ul>
                  
                  <h2>SDK Examples</h2>
                  <h3>JavaScript</h3>
                  <pre><code>
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
                  </code></pre>
                  
                  <h2>Support</h2>
                  <p>
                    For API support, please contact our development team at api-support@dccms.com.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;