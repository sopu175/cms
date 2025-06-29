import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Plus, 
  Trash2, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Image, 
  FileText, 
  DollarSign, 
  ShieldCheck, 
  Bell, 
  Search,
  Upload,
  X,
  ExternalLink,
  Info,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Dribbble,
  Twitch,
  Slack,
  Discord,
  Pinterest,
  TikTok,
  Snapchat,
  Whatsapp,
  Telegram
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useSiteInfo } from '../hooks/useSiteInfo';
import { useAuth } from '../contexts/AuthContext';
import { useMedia } from '../hooks/useMedia';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { settings, loading: settingsLoading, updateSettings } = useSettings();
  const { siteInfo, loading: siteInfoLoading, updateSiteInfo } = useSiteInfo();
  const { media, uploadMedia } = useMedia();
  const [activeTab, setActiveTab] = useState('general');
  const [showDocModal, setShowDocModal] = useState(false);
  const [docType, setDocType] = useState<'cms' | 'api'>('cms');
  const [uploading, setUploading] = useState(false);
  
  const [generalSettings, setGeneralSettings] = useState({
    site_name: '',
    tagline: '',
    description: '',
    logo_url: '',
    logo_light: '',
    logo_dark: '',
    favicon: '',
    copyright_text: '',
    maintenance_mode: false,
    maintenance_message: ''
  });
  
  const [contactSettings, setContactSettings] = useState({
    contact_info: [] as any[]
  });
  
  const [socialSettings, setSocialSettings] = useState({
    social_icons: [] as any[]
  });
  
  const [currencySettings, setCurrencySettings] = useState({
    default_currency: 'BDT',
    currency_symbol: '৳',
    currency_position: 'left',
    thousand_separator: ',',
    decimal_separator: '.',
    decimal_places: 2,
    available_currencies: [] as any[]
  });
  
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

  const canEdit = user?.role === 'admin';
  const loading = settingsLoading || siteInfoLoading;

  // Social media platforms
  const socialPlatforms = [
    { value: 'facebook', label: 'Facebook', icon: Facebook },
    { value: 'twitter', label: 'Twitter', icon: Twitter },
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { value: 'youtube', label: 'YouTube', icon: Youtube },
    { value: 'github', label: 'GitHub', icon: Github },
    { value: 'dribbble', label: 'Dribbble', icon: Dribbble },
    { value: 'twitch', label: 'Twitch', icon: Twitch },
    { value: 'slack', label: 'Slack', icon: Slack },
    { value: 'discord', label: 'Discord', icon: Discord },
    { value: 'pinterest', label: 'Pinterest', icon: Pinterest },
    { value: 'tiktok', label: 'TikTok', icon: TikTok },
    { value: 'snapchat', label: 'Snapchat', icon: Snapchat },
    { value: 'whatsapp', label: 'WhatsApp', icon: Whatsapp },
    { value: 'telegram', label: 'Telegram', icon: Telegram }
  ];

  // Available currencies
  const availableCurrencies = settings?.available_currencies || [
    { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' }
  ];

  // Load settings from API
  useEffect(() => {
    if (!loading && settings && siteInfo) {
      // General settings
      setGeneralSettings({
        site_name: siteInfo.site_name || '',
        tagline: siteInfo.tagline || '',
        description: siteInfo.description || '',
        logo_url: siteInfo.logo_url || '',
        logo_light: siteInfo.logo_light || '',
        logo_dark: siteInfo.logo_dark || '',
        favicon: siteInfo.favicon || '',
        copyright_text: siteInfo.copyright_text || '',
        maintenance_mode: siteInfo.maintenance_mode || false,
        maintenance_message: siteInfo.maintenance_message || ''
      });
      
      // Contact settings
      setContactSettings({
        contact_info: siteInfo.contact_info || [{
          id: '1',
          label: 'Main Office',
          address: '',
          map_url: '',
          emails: [{ label: 'Contact', link: '' }],
          phones: [{ label: 'Main', link: '' }]
        }]
      });
      
      // Social settings
      setSocialSettings({
        social_icons: siteInfo.social_icons || []
      });
      
      // Currency settings
      setCurrencySettings({
        default_currency: settings.default_currency || 'BDT',
        currency_symbol: settings.currency_symbol || '৳',
        currency_position: settings.currency_position || 'left',
        thousand_separator: settings.thousand_separator || ',',
        decimal_separator: settings.decimal_separator || '.',
        decimal_places: settings.decimal_places || 2,
        available_currencies: settings.available_currencies || availableCurrencies
      });
      
      // SEO settings
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
      
      // Email settings
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
      
      // Security settings
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
    }
  }, [loading, settings, siteInfo]);

  const handleSaveSettings = async () => {
    if (!canEdit) return;
    
    try {
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
        maintenance_mode: generalSettings.maintenance_mode,
        maintenance_message: generalSettings.maintenance_message,
        contact_info: contactSettings.contact_info,
        social_icons: socialSettings.social_icons
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
        available_currencies: currencySettings.available_currencies,
        
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
    }
  };

  const handleFileUpload = async (file: File, callback: (url: string) => void) => {
    try {
      setUploading(true);
      const result = await uploadMedia(file);
      if (result.success && result.data) {
        callback(result.data.url);
      } else {
        console.error('Upload failed:', result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

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

  // Add a new contact info entry
  const addContactInfo = () => {
    setContactSettings(prev => ({
      ...prev,
      contact_info: [
        ...prev.contact_info,
        {
          id: Date.now().toString(),
          label: 'New Location',
          address: '',
          map_url: '',
          emails: [{ label: 'Contact', link: '' }],
          phones: [{ label: 'Main', link: '' }]
        }
      ]
    }));
  };

  // Remove a contact info entry
  const removeContactInfo = (index: number) => {
    setContactSettings(prev => ({
      ...prev,
      contact_info: prev.contact_info.filter((_, i) => i !== index)
    }));
  };

  // Add a new email to a contact info entry
  const addContactEmail = (contactIndex: number) => {
    setContactSettings(prev => {
      const newContactInfo = [...prev.contact_info];
      newContactInfo[contactIndex].emails.push({ label: 'Email', link: '' });
      return { ...prev, contact_info: newContactInfo };
    });
  };

  // Remove an email from a contact info entry
  const removeContactEmail = (contactIndex: number, emailIndex: number) => {
    setContactSettings(prev => {
      const newContactInfo = [...prev.contact_info];
      newContactInfo[contactIndex].emails = newContactInfo[contactIndex].emails.filter((_, i) => i !== emailIndex);
      return { ...prev, contact_info: newContactInfo };
    });
  };

  // Add a new phone to a contact info entry
  const addContactPhone = (contactIndex: number) => {
    setContactSettings(prev => {
      const newContactInfo = [...prev.contact_info];
      newContactInfo[contactIndex].phones.push({ label: 'Phone', link: '' });
      return { ...prev, contact_info: newContactInfo };
    });
  };

  // Remove a phone from a contact info entry
  const removeContactPhone = (contactIndex: number, phoneIndex: number) => {
    setContactSettings(prev => {
      const newContactInfo = [...prev.contact_info];
      newContactInfo[contactIndex].phones = newContactInfo[contactIndex].phones.filter((_, i) => i !== phoneIndex);
      return { ...prev, contact_info: newContactInfo };
    });
  };

  // Update contact info field
  const updateContactInfo = (contactIndex: number, field: string, value: string) => {
    setContactSettings(prev => {
      const newContactInfo = [...prev.contact_info];
      newContactInfo[contactIndex][field] = value;
      return { ...prev, contact_info: newContactInfo };
    });
  };

  // Update contact email
  const updateContactEmail = (contactIndex: number, emailIndex: number, field: string, value: string) => {
    setContactSettings(prev => {
      const newContactInfo = [...prev.contact_info];
      newContactInfo[contactIndex].emails[emailIndex][field] = value;
      return { ...prev, contact_info: newContactInfo };
    });
  };

  // Update contact phone
  const updateContactPhone = (contactIndex: number, phoneIndex: number, field: string, value: string) => {
    setContactSettings(prev => {
      const newContactInfo = [...prev.contact_info];
      newContactInfo[contactIndex].phones[phoneIndex][field] = value;
      return { ...prev, contact_info: newContactInfo };
    });
  };

  // Add a new social icon
  const addSocialIcon = () => {
    setSocialSettings(prev => ({
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

  // Remove a social icon
  const removeSocialIcon = (index: number) => {
    setSocialSettings(prev => ({
      ...prev,
      social_icons: prev.social_icons.filter((_, i) => i !== index)
    }));
  };

  // Update social icon
  const updateSocialIcon = (index: number, field: string, value: string) => {
    setSocialSettings(prev => {
      const newSocialIcons = [...prev.social_icons];
      newSocialIcons[index][field] = value;
      if (field === 'platform') {
        newSocialIcons[index].icon = value;
      }
      return { ...prev, social_icons: newSocialIcons };
    });
  };

  // Format currency for preview
  const formatCurrency = (amount: number) => {
    const { currency_symbol, currency_position, thousand_separator, decimal_separator, decimal_places } = currencySettings;
    
    const formattedAmount = amount.toFixed(decimal_places)
      .replace('.', decimal_separator)
      .replace(/\B(?=(\d{3})+(?!\d))/g, thousand_separator);
    
    return currency_position === 'left'
      ? `${currency_symbol}${formattedAmount}`
      : `${formattedAmount}${currency_symbol}`;
  };

  // Get social icon component
  const getSocialIcon = (platform: string) => {
    const socialPlatform = socialPlatforms.find(p => p.value === platform);
    if (socialPlatform) {
      const Icon = socialPlatform.icon;
      return <Icon className="w-5 h-5" />;
    }
    return <Globe className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
        <ShieldCheck className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300 mb-2">Admin Access Required</h3>
        <p className="text-yellow-600 dark:text-yellow-400">
          You need administrator privileges to access the settings page.
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
            onClick={() => {
              setDocType('cms');
              setShowDocModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            <FileText className="w-4 h-4" />
            <span>CMS Docs</span>
          </button>
          <button
            onClick={() => {
              setDocType('api');
              setShowDocModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            <FileText className="w-4 h-4" />
            <span>API Docs</span>
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={uploading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg"
          >
            <Save className="w-4 h-4" />
            <span>{uploading ? 'Uploading...' : 'Save Settings'}</span>
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
          Contact
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
            
            <div className="space-y-6">
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
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={generalSettings.tagline}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, tagline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Just another awesome website"
                  />
                </div>
              </div>
              
              <div>
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
                    disabled={uploading}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                </div>
                {generalSettings.logo_url && (
                  <div className="mt-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center">
                    <img 
                      src={generalSettings.logo_url} 
                      alt="Logo" 
                      className="max-h-16 max-w-full object-contain" 
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
                      disabled={uploading}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload</span>
                    </button>
                  </div>
                  {generalSettings.logo_light && (
                    <div className="mt-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-800 flex items-center justify-center">
                      <img 
                        src={generalSettings.logo_light} 
                        alt="Light Logo" 
                        className="max-h-16 max-w-full object-contain" 
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
                      disabled={uploading}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload</span>
                    </button>
                  </div>
                  {generalSettings.logo_dark && (
                    <div className="mt-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white flex items-center justify-center">
                      <img 
                        src={generalSettings.logo_dark} 
                        alt="Dark Logo" 
                        className="max-h-16 max-w-full object-contain" 
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
                    disabled={uploading}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                </div>
                {generalSettings.favicon && (
                  <div className="mt-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center">
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
          
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Maintenance Mode</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Maintenance Mode
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    When enabled, visitors will see a maintenance message instead of your site
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generalSettings.maintenance_mode}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, maintenance_mode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              {generalSettings.maintenance_mode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maintenance Message
                  </label>
                  <textarea
                    value={generalSettings.maintenance_message}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, maintenance_message: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="We're currently performing maintenance. Please check back soon."
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contact Settings */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h3>
              <button
                type="button"
                onClick={addContactInfo}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Location</span>
              </button>
            </div>
            
            <div className="space-y-8">
              {contactSettings.contact_info.map((contact, contactIndex) => (
                <div 
                  key={contact.id} 
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Location #{contactIndex + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeContactInfo(contactIndex)}
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
                        value={contact.label}
                        onChange={(e) => updateContactInfo(contactIndex, 'label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Main Office, Branch Office, etc."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address
                      </label>
                      <textarea
                        value={contact.address}
                        onChange={(e) => updateContactInfo(contactIndex, 'address', e.target.value)}
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
                        value={contact.map_url}
                        onChange={(e) => updateContactInfo(contactIndex, 'map_url', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="https://maps.google.com/?q=..."
                      />
                    </div>
                    
                    {/* Email Addresses */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email Addresses
                        </label>
                        <button
                          type="button"
                          onClick={() => addContactEmail(contactIndex)}
                          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          + Add Email
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {contact.emails.map((email, emailIndex) => (
                          <div key={emailIndex} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={email.label}
                              onChange={(e) => updateContactEmail(contactIndex, emailIndex, 'label', e.target.value)}
                              className="w-1/3 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              placeholder="Label"
                            />
                            <input
                              type="email"
                              value={email.link}
                              onChange={(e) => updateContactEmail(contactIndex, emailIndex, 'link', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              placeholder="email@example.com"
                            />
                            <button
                              type="button"
                              onClick={() => removeContactEmail(contactIndex, emailIndex)}
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
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Phone Numbers
                        </label>
                        <button
                          type="button"
                          onClick={() => addContactPhone(contactIndex)}
                          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          + Add Phone
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {contact.phones.map((phone, phoneIndex) => (
                          <div key={phoneIndex} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={phone.label}
                              onChange={(e) => updateContactPhone(contactIndex, phoneIndex, 'label', e.target.value)}
                              className="w-1/3 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              placeholder="Label"
                            />
                            <input
                              type="tel"
                              value={phone.link}
                              onChange={(e) => updateContactPhone(contactIndex, phoneIndex, 'link', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              placeholder="+1234567890"
                            />
                            <button
                              type="button"
                              onClick={() => removeContactPhone(contactIndex, phoneIndex)}
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
              
              {contactSettings.contact_info.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No contact information added yet</p>
                  <button
                    type="button"
                    onClick={addContactInfo}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    + Add Contact Information
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Social Media Settings */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Social Media</h3>
              <button
                type="button"
                onClick={addSocialIcon}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Social Media</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {socialSettings.social_icons.map((social, index) => (
                <div 
                  key={social.id} 
                  className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                    {getSocialIcon(social.platform)}
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <select
                        value={social.platform}
                        onChange={(e) => updateSocialIcon(index, 'platform', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        {socialPlatforms.map(platform => (
                          <option key={platform.value} value={platform.value}>
                            {platform.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
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
                  </div>
                </div>
              ))}
              
              {socialSettings.social_icons.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  <Globe className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No social media links added yet</p>
                  <button
                    type="button"
                    onClick={addSocialIcon}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    + Add Social Media Link
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
                    const selectedCurrency = availableCurrencies.find(c => c.code === e.target.value);
                    setCurrencySettings({
                      ...currencySettings,
                      default_currency: e.target.value,
                      currency_symbol: selectedCurrency?.symbol || currencySettings.currency_symbol
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
                  Decimal Places
                </label>
                <select
                  value={currencySettings.decimal_places}
                  onChange={(e) => setCurrencySettings({ ...currencySettings, decimal_places: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thousand Separator
                </label>
                <select
                  value={currencySettings.thousand_separator}
                  onChange={(e) => setCurrencySettings({ ...currencySettings, thousand_separator: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value=",">Comma (,)</option>
                  <option value=".">Dot (.)</option>
                  <option value=" ">Space ( )</option>
                  <option value="">None</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Decimal Separator
                </label>
                <select
                  value={currencySettings.decimal_separator}
                  onChange={(e) => setCurrencySettings({ ...currencySettings, decimal_separator: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value=".">Dot (.)</option>
                  <option value=",">Comma (,)</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Currency Format Preview</h4>
              <div className="flex items-center space-x-4">
                <div className="text-lg font-bold text-blue-700 dark:text-blue-400">
                  {formatCurrency(1234.56)}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-500">
                  {currencySettings.default_currency}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO & Analytics Settings */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">SEO Settings</h3>
            
            <div className="space-y-6">
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
                  Meta Keywords
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
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable XML Sitemap
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Automatically generate an XML sitemap for search engines
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
            
            <div className="space-y-6">
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
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Email Notifications
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Send email notifications for new orders, form submissions, etc.
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </>
              )}
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
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Allow User Registration
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Allow visitors to create accounts on your site
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Password Length
                </label>
                <input
                  type="number"
                  value={securitySettings.password_min_length}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, password_min_length: parseInt(e.target.value) })}
                  min="6"
                  max="32"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Require Special Characters
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Require passwords to include special characters
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
                    Require passwords to include numbers
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
                  min="5"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documentation Modal */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowDocModal(false)} />
            
            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
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
              
              <div className="max-h-[70vh] overflow-y-auto pr-2">
                {docType === 'cms' ? (
                  <div className="prose prose-blue dark:prose-invert max-w-none">
                    <h2>DC CMS Documentation</h2>
                    <p>Welcome to the DC CMS documentation. This guide will help you understand how to use and configure your content management system.</p>
                    
                    <h3>Getting Started</h3>
                    <p>DC CMS is a powerful content management system that allows you to create, manage, and publish content on your website. Here's how to get started:</p>
                    
                    <h4>Dashboard</h4>
                    <p>The dashboard provides an overview of your site's activity, including recent posts, page views, and other important metrics.</p>
                    
                    <h4>Content Management</h4>
                    <ul>
                      <li><strong>Posts</strong>: Create and manage blog posts or articles.</li>
                      <li><strong>Pages</strong>: Create and manage static pages.</li>
                      <li><strong>Categories</strong>: Organize your content with categories.</li>
                      <li><strong>Media Library</strong>: Upload and manage images and other media files.</li>
                    </ul>
                    
                    <h4>E-commerce</h4>
                    <p>If you're using the e-commerce features, you can manage:</p>
                    <ul>
                      <li><strong>Products</strong>: Add, edit, and manage your product catalog.</li>
                      <li><strong>Orders</strong>: View and process customer orders.</li>
                      <li><strong>Coupons</strong>: Create discount codes for your customers.</li>
                    </ul>
                    
                    <h3>Configuration</h3>
                    <p>The Settings section allows you to configure various aspects of your site:</p>
                    
                    <h4>General Settings</h4>
                    <p>Configure your site name, description, logo, and other basic information.</p>
                    
                    <h4>Contact Information</h4>
                    <p>Manage your contact details, including multiple locations, email addresses, and phone numbers.</p>
                    
                    <h4>Social Media</h4>
                    <p>Add and manage links to your social media profiles.</p>
                    
                    <h4>Currency Settings</h4>
                    <p>Configure your currency settings, including symbol, format, and decimal places.</p>
                    
                    <h4>SEO & Analytics</h4>
                    <p>Configure SEO settings and integrate with analytics tools like Google Analytics.</p>
                    
                    <h4>Email Settings</h4>
                    <p>Configure email notifications and SMTP settings.</p>
                    
                    <h4>Security Settings</h4>
                    <p>Configure security features like password requirements and two-factor authentication.</p>
                    
                    <h3>Advanced Features</h3>
                    
                    <h4>Custom Forms</h4>
                    <p>Create and manage custom forms for your website.</p>
                    
                    <h4>Menus</h4>
                    <p>Create and manage navigation menus for your website.</p>
                    
                    <h4>User Management</h4>
                    <p>Manage user accounts and permissions.</p>
                    
                    <h3>Need Help?</h3>
                    <p>If you need further assistance, please contact our support team.</p>
                  </div>
                ) : (
                  <div className="prose prose-blue dark:prose-invert max-w-none">
                    <h2>DC CMS API Documentation</h2>
                    <p>Welcome to the DC CMS API documentation. This guide will help you understand how to interact with the API to access and manage your content programmatically.</p>
                    
                    <h3>Authentication</h3>
                    <p>All API requests require authentication. You can authenticate using JWT (JSON Web Tokens).</p>
                    
                    <h4>Obtaining a Token</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                      <code>
                        POST /api/auth/login<br />
                        Content-Type: application/json<br /><br />
                        {`{
  "email": "your-email@example.com",
  "password": "your-password"
}`}
                      </code>
                    </pre>
                    
                    <h4>Using the Token</h4>
                    <p>Include the token in the Authorization header of your requests:</p>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                      <code>
                        Authorization: Bearer your-token-here
                      </code>
                    </pre>
                    
                    <h3>API Endpoints</h3>
                    
                    <h4>Posts</h4>
                    <ul>
                      <li><code>GET /api/posts</code> - Get all posts</li>
                      <li><code>GET /api/posts/:id</code> - Get a specific post</li>
                      <li><code>POST /api/posts</code> - Create a new post</li>
                      <li><code>PUT /api/posts/:id</code> - Update a post</li>
                      <li><code>DELETE /api/posts/:id</code> - Delete a post</li>
                    </ul>
                    
                    <h4>Categories</h4>
                    <ul>
                      <li><code>GET /api/categories</code> - Get all categories</li>
                      <li><code>GET /api/categories/:id</code> - Get a specific category</li>
                      <li><code>POST /api/categories</code> - Create a new category</li>
                      <li><code>PUT /api/categories/:id</code> - Update a category</li>
                      <li><code>DELETE /api/categories/:id</code> - Delete a category</li>
                    </ul>
                    
                    <h4>Products</h4>
                    <ul>
                      <li><code>GET /api/products</code> - Get all products</li>
                      <li><code>GET /api/products/:id</code> - Get a specific product</li>
                      <li><code>POST /api/products</code> - Create a new product</li>
                      <li><code>PUT /api/products/:id</code> - Update a product</li>
                      <li><code>DELETE /api/products/:id</code> - Delete a product</li>
                    </ul>
                    
                    <h4>Orders</h4>
                    <ul>
                      <li><code>GET /api/orders</code> - Get all orders</li>
                      <li><code>GET /api/orders/:id</code> - Get a specific order</li>
                      <li><code>POST /api/orders</code> - Create a new order</li>
                      <li><code>PUT /api/orders/:id</code> - Update an order</li>
                    </ul>
                    
                    <h4>Users</h4>
                    <ul>
                      <li><code>GET /api/users</code> - Get all users (admin only)</li>
                      <li><code>GET /api/users/:id</code> - Get a specific user</li>
                      <li><code>POST /api/users</code> - Create a new user (admin only)</li>
                      <li><code>PUT /api/users/:id</code> - Update a user</li>
                      <li><code>DELETE /api/users/:id</code> - Delete a user (admin only)</li>
                    </ul>
                    
                    <h4>Settings</h4>
                    <ul>
                      <li><code>GET /api/settings</code> - Get all settings</li>
                      <li><code>GET /api/settings/:key</code> - Get a specific setting</li>
                      <li><code>PUT /api/settings/:key</code> - Update a setting (admin only)</li>
                    </ul>
                    
                    <h3>Response Format</h3>
                    <p>All API responses follow a standard format:</p>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                      <code>
                        {`{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}`}
                      </code>
                    </pre>
                    
                    <p>For errors:</p>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                      <code>
                        {`{
  "success": false,
  "error": "Error message"
}`}
                      </code>
                    </pre>
                    
                    <h3>Pagination</h3>
                    <p>Endpoints that return multiple items support pagination:</p>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                      <code>
                        GET /api/posts?page=1&limit=10
                      </code>
                    </pre>
                    
                    <p>Paginated responses include pagination metadata:</p>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                      <code>
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
                      </code>
                    </pre>
                    
                    <h3>Rate Limiting</h3>
                    <p>The API implements rate limiting to prevent abuse. Current limits are 100 requests per 15-minute window per IP address.</p>
                    
                    <h3>Need Help?</h3>
                    <p>If you need further assistance with the API, please contact our developer support team.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;