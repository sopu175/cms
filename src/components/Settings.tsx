import React, { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Upload,
  Settings as SettingsIcon,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  DollarSign,
  CreditCard,
  ShoppingCart,
  Truck,
  Tag,
  BarChart,
  Search,
  Code,
  FileText,
  AlertCircle,
  Image
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useSiteInfo } from '../hooks/useSiteInfo';
import { useAuth } from '../contexts/AuthContext';
import { useMedia } from '../hooks/useMedia';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { settings, updateSettings } = useSettings();
  const { siteInfo, updateSiteInfo } = useSiteInfo();
  const { uploadMedia } = useMedia();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
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
  
  const [contactSettings, setContactSettings] = useState({
    contact_info: [] as any[]
  });
  
  const [socialSettings, setSocialSettings] = useState({
    social_icons: [] as any[]
  });
  
  const [ecommerceSettings, setEcommerceSettings] = useState({
    currency: 'BDT',
    currency_symbol: '৳',
    currency_position: 'left',
    enable_taxes: false,
    tax_rate: 0,
    enable_shipping: true,
    free_shipping_threshold: 100,
    default_shipping_cost: 10
  });
  
  const [seoSettings, setSeoSettings] = useState({
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    google_analytics: '',
    facebook_pixel: '',
    google_tag_manager: '',
    robots_txt: '',
    enable_sitemap: true,
    sitemap_frequency: 'weekly',
    sitemap_priority: 0.7,
    og_image: '',
    structured_data: ''
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    maintenance_mode: false,
    maintenance_message: '',
    allow_registration: true,
    enable_captcha: true,
    password_min_length: 8
  });

  const canEdit = user?.role === 'admin';

  // Normalize contact info to ensure proper structure
  const normalizeContactInfo = (contactInfo: any[] = []) => {
    return contactInfo.map(info => ({
      ...info,
      emails: Array.isArray(info.emails) 
        ? info.emails.map((email: any) => typeof email === 'object' ? email : { label: 'Email', link: email })
        : [{ label: 'Email', link: '' }],
      phones: Array.isArray(info.phones)
        ? info.phones.map((phone: any) => typeof phone === 'object' ? phone : { label: 'Phone', link: phone })
        : [{ label: 'Phone', link: '' }]
    }));
  };

  // Load settings
  useEffect(() => {
    if (siteInfo) {
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
      
      // Normalize contact info to ensure proper structure
      setContactSettings({
        contact_info: normalizeContactInfo(siteInfo.contact_info)
      });
      
      setSocialSettings({
        social_icons: siteInfo.social_icons || []
      });
      
      // Load SEO settings
      setSeoSettings({
        seo_title: siteInfo.seo_title || '',
        seo_description: siteInfo.seo_description || '',
        seo_keywords: siteInfo.seo_keywords || '',
        google_analytics: siteInfo.google_analytics || '',
        facebook_pixel: siteInfo.facebook_pixel || '',
        google_tag_manager: siteInfo.google_tag_manager || '',
        robots_txt: siteInfo.robots_txt || '',
        enable_sitemap: siteInfo.enable_sitemap !== false,
        sitemap_frequency: 'weekly',
        sitemap_priority: 0.7,
        og_image: siteInfo.og_image || '',
        structured_data: siteInfo.structured_data || ''
      });
      
      // Load security settings
      setSecuritySettings({
        maintenance_mode: siteInfo.maintenance_mode || false,
        maintenance_message: siteInfo.maintenance_message || '',
        allow_registration: true,
        enable_captcha: true,
        password_min_length: 8
      });
    }
    
    if (settings) {
      setEcommerceSettings({
        currency: settings.currency || 'BDT',
        currency_symbol: settings.currency_symbol || '৳',
        currency_position: settings.currency_position || 'left',
        enable_taxes: settings.enable_taxes === true,
        tax_rate: settings.tax_rate || 0,
        enable_shipping: settings.enable_shipping !== false,
        free_shipping_threshold: settings.free_shipping_threshold || 100,
        default_shipping_cost: settings.default_shipping_cost || 10
      });
      
      // Update security settings from settings table
      if (settings.allow_registration !== undefined) {
        setSecuritySettings(prev => ({
          ...prev,
          allow_registration: settings.allow_registration === true,
          enable_captcha: settings.enable_captcha === true,
          password_min_length: settings.password_min_length || 8
        }));
      }
      
      // Update SEO settings from settings table
      if (settings.google_analytics_id) {
        setSeoSettings(prev => ({
          ...prev,
          google_analytics: settings.google_analytics_id,
          facebook_pixel: settings.facebook_pixel_id || '',
          google_tag_manager: settings.google_tag_manager_id || '',
          robots_txt: settings.robots_txt || '',
          enable_sitemap: settings.enable_sitemap !== false,
          sitemap_frequency: settings.sitemap_frequency || 'weekly',
          sitemap_priority: settings.sitemap_priority || 0.7
        }));
      }
    }
  }, [siteInfo, settings]);

  const handleSaveSettings = async () => {
    if (!canEdit) return;
    
    setLoading(true);
    
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
        contact_info: contactSettings.contact_info,
        social_icons: socialSettings.social_icons,
        seo_title: seoSettings.seo_title,
        seo_description: seoSettings.seo_description,
        seo_keywords: seoSettings.seo_keywords,
        google_analytics: seoSettings.google_analytics,
        facebook_pixel: seoSettings.facebook_pixel,
        google_tag_manager: seoSettings.google_tag_manager,
        robots_txt: seoSettings.robots_txt,
        og_image: seoSettings.og_image,
        structured_data: seoSettings.structured_data,
        enable_sitemap: seoSettings.enable_sitemap,
        maintenance_mode: securitySettings.maintenance_mode,
        maintenance_message: securitySettings.maintenance_message
      });
      
      // Update settings table
      await updateSettings({
        currency: ecommerceSettings.currency,
        currency_symbol: ecommerceSettings.currency_symbol,
        currency_position: ecommerceSettings.currency_position,
        enable_taxes: ecommerceSettings.enable_taxes,
        tax_rate: ecommerceSettings.tax_rate,
        enable_shipping: ecommerceSettings.enable_shipping,
        free_shipping_threshold: ecommerceSettings.free_shipping_threshold,
        default_shipping_cost: ecommerceSettings.default_shipping_cost,
        allow_registration: securitySettings.allow_registration,
        enable_captcha: securitySettings.enable_captcha,
        password_min_length: securitySettings.password_min_length,
        google_analytics_id: seoSettings.google_analytics,
        facebook_pixel_id: seoSettings.facebook_pixel,
        google_tag_manager_id: seoSettings.google_tag_manager,
        robots_txt: seoSettings.robots_txt,
        enable_sitemap: seoSettings.enable_sitemap,
        sitemap_frequency: seoSettings.sitemap_frequency,
        sitemap_priority: seoSettings.sitemap_priority
      });
      
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, callback: (url: string) => void) => {
    try {
      const result = await uploadMedia(file);
      if (result.success && result.data) {
        callback(result.data.url);
      }
    } catch (error) {
      console.error('Upload failed:', error);
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

  // Contact Info Management
  const addContactInfo = () => {
    setContactSettings({
      ...contactSettings,
      contact_info: [
        ...contactSettings.contact_info,
        {
          id: Date.now().toString(),
          label: 'New Location',
          address: '',
          map_url: '',
          emails: [{ label: 'Email', link: '' }],
          phones: [{ label: 'Phone', link: '' }]
        }
      ]
    });
  };

  const updateContactInfo = (index: number, field: string, value: any) => {
    const updatedInfo = [...contactSettings.contact_info];
    updatedInfo[index] = {
      ...updatedInfo[index],
      [field]: value
    };
    setContactSettings({
      ...contactSettings,
      contact_info: updatedInfo
    });
  };

  const removeContactInfo = (index: number) => {
    const updatedInfo = [...contactSettings.contact_info];
    updatedInfo.splice(index, 1);
    setContactSettings({
      ...contactSettings,
      contact_info: updatedInfo
    });
  };

  // Email Management
  const addEmail = (contactIndex: number) => {
    const updatedInfo = [...contactSettings.contact_info];
    if (!updatedInfo[contactIndex].emails) {
      updatedInfo[contactIndex].emails = [];
    }
    updatedInfo[contactIndex].emails.push({ label: 'Email', link: '' });
    setContactSettings({
      ...contactSettings,
      contact_info: updatedInfo
    });
  };

  const updateEmail = (contactIndex: number, emailIndex: number, field: string, value: string) => {
    const updatedInfo = [...contactSettings.contact_info];
    const emails = [...updatedInfo[contactIndex].emails];
    
    // Ensure the email at emailIndex is an object
    if (typeof emails[emailIndex] !== 'object') {
      emails[emailIndex] = { label: 'Email', link: emails[emailIndex] || '' };
    }
    
    emails[emailIndex] = {
      ...emails[emailIndex],
      [field]: value
    };
    
    updatedInfo[contactIndex].emails = emails;
    setContactSettings({
      ...contactSettings,
      contact_info: updatedInfo
    });
  };

  const removeEmail = (contactIndex: number, emailIndex: number) => {
    const updatedInfo = [...contactSettings.contact_info];
    updatedInfo[contactIndex].emails.splice(emailIndex, 1);
    setContactSettings({
      ...contactSettings,
      contact_info: updatedInfo
    });
  };

  // Phone Management
  const addPhone = (contactIndex: number) => {
    const updatedInfo = [...contactSettings.contact_info];
    if (!updatedInfo[contactIndex].phones) {
      updatedInfo[contactIndex].phones = [];
    }
    updatedInfo[contactIndex].phones.push({ label: 'Phone', link: '' });
    setContactSettings({
      ...contactSettings,
      contact_info: updatedInfo
    });
  };

  const updatePhone = (contactIndex: number, phoneIndex: number, field: string, value: string) => {
    const updatedInfo = [...contactSettings.contact_info];
    const phones = [...updatedInfo[contactIndex].phones];
    
    // Ensure the phone at phoneIndex is an object
    if (typeof phones[phoneIndex] !== 'object') {
      phones[phoneIndex] = { label: 'Phone', link: phones[phoneIndex] || '' };
    }
    
    phones[phoneIndex] = {
      ...phones[phoneIndex],
      [field]: value
    };
    
    updatedInfo[contactIndex].phones = phones;
    setContactSettings({
      ...contactSettings,
      contact_info: updatedInfo
    });
  };

  const removePhone = (contactIndex: number, phoneIndex: number) => {
    const updatedInfo = [...contactSettings.contact_info];
    updatedInfo[contactIndex].phones.splice(phoneIndex, 1);
    setContactSettings({
      ...contactSettings,
      contact_info: updatedInfo
    });
  };

  // Social Icons Management
  const addSocialIcon = () => {
    setSocialSettings({
      ...socialSettings,
      social_icons: [
        ...socialSettings.social_icons,
        {
          id: Date.now().toString(),
          platform: 'facebook',
          url: '',
          icon: 'facebook'
        }
      ]
    });
  };

  const updateSocialIcon = (index: number, field: string, value: string) => {
    const updatedIcons = [...socialSettings.social_icons];
    updatedIcons[index] = {
      ...updatedIcons[index],
      [field]: value
    };
    
    // If platform changes, update icon too
    if (field === 'platform') {
      updatedIcons[index].icon = value;
    }
    
    setSocialSettings({
      ...socialSettings,
      social_icons: updatedIcons
    });
  };

  const removeSocialIcon = (index: number) => {
    const updatedIcons = [...socialSettings.social_icons];
    updatedIcons.splice(index, 1);
    setSocialSettings({
      ...socialSettings,
      social_icons: updatedIcons
    });
  };

  if (!canEdit) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <SettingsIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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
        <button
          onClick={handleSaveSettings}
          disabled={loading}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {showSuccessMessage && (
        <div className="bg-green-100 border border-green-200 text-green-700 dark:bg-green-800/30 dark:border-green-700 dark:text-green-400 px-4 py-3 rounded-lg">
          Settings saved successfully!
        </div>
      )}

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
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === 'contact' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Contact Info
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
          onClick={() => setActiveTab('ecommerce')}
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === 'ecommerce' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          E-commerce
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site Description
              </label>
              <textarea
                value={generalSettings.description}
                onChange={(e) => setGeneralSettings({ ...generalSettings, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
            
            <div className="space-y-6">
              <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Logo & Branding</h4>
              
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
                    <img src={generalSettings.logo_url} alt="Logo" className="h-12 object-contain" />
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
                    <div className="mt-2 p-2 bg-gray-100 rounded">
                      <img src={generalSettings.logo_light} alt="Light Logo" className="h-10 object-contain" />
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
                    <div className="mt-2 p-2 bg-gray-800 rounded">
                      <img src={generalSettings.logo_dark} alt="Dark Logo" className="h-10 object-contain" />
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
                    <img src={generalSettings.favicon} alt="Favicon" className="h-8 w-8 object-contain" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Contact Info Settings */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h3>
              <button
                type="button"
                onClick={addContactInfo}
                className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Location</span>
              </button>
            </div>
            
            {contactSettings.contact_info.length === 0 ? (
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
            ) : (
              <div className="space-y-8">
                {contactSettings.contact_info.map((info, index) => (
                  <div key={info.id || index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 relative">
                    <button
                      type="button"
                      onClick={() => removeContactInfo(index)}
                      className="absolute top-4 right-4 p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Location Label
                        </label>
                        <input
                          type="text"
                          value={info.label || ''}
                          onChange={(e) => updateContactInfo(index, 'label', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="e.g. Main Office, Branch Office"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address
                      </label>
                      <textarea
                        value={info.address || ''}
                        onChange={(e) => updateContactInfo(index, 'address', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Full address"
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Map URL
                      </label>
                      <input
                        type="text"
                        value={info.map_url || ''}
                        onChange={(e) => updateContactInfo(index, 'map_url', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Google Maps URL"
                      />
                    </div>
                    
                    {/* Email Addresses */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email Addresses
                        </label>
                        <button
                          type="button"
                          onClick={() => addEmail(index)}
                          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          + Add Email
                        </button>
                      </div>
                      
                      {info.emails && info.emails.length > 0 ? (
                        <div className="space-y-3">
                          {info.emails.map((email: any, emailIndex: number) => (
                            <div key={emailIndex} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={typeof email === 'object' ? email.label || '' : 'Email'}
                                onChange={(e) => updateEmail(index, emailIndex, 'label', e.target.value)}
                                className="w-1/3 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                placeholder="Label"
                              />
                              <input
                                type="email"
                                value={typeof email === 'object' ? email.link || '' : email || ''}
                                onChange={(e) => updateEmail(index, emailIndex, 'link', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                placeholder="email@example.com"
                              />
                              <button
                                type="button"
                                onClick={() => removeEmail(index, emailIndex)}
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
                          onClick={() => addEmail(index)}
                          className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          + Add Email Address
                        </button>
                      )}
                    </div>
                    
                    {/* Phone Numbers */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Phone Numbers
                        </label>
                        <button
                          type="button"
                          onClick={() => addPhone(index)}
                          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          + Add Phone
                        </button>
                      </div>
                      
                      {info.phones && info.phones.length > 0 ? (
                        <div className="space-y-3">
                          {info.phones.map((phone: any, phoneIndex: number) => (
                            <div key={phoneIndex} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={typeof phone === 'object' ? phone.label || '' : 'Phone'}
                                onChange={(e) => updatePhone(index, phoneIndex, 'label', e.target.value)}
                                className="w-1/3 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                placeholder="Label"
                              />
                              <input
                                type="tel"
                                value={typeof phone === 'object' ? phone.link || '' : phone || ''}
                                onChange={(e) => updatePhone(index, phoneIndex, 'link', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                placeholder="+1234567890"
                              />
                              <button
                                type="button"
                                onClick={() => removePhone(index, phoneIndex)}
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
                          onClick={() => addPhone(index)}
                          className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          + Add Phone Number
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Social Media Settings */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Social Media</h3>
              <button
                type="button"
                onClick={addSocialIcon}
                className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Social Media</span>
              </button>
            </div>
            
            {socialSettings.social_icons.length === 0 ? (
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
            ) : (
              <div className="space-y-4">
                {socialSettings.social_icons.map((icon, index) => (
                  <div key={icon.id || index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                      {icon.platform === 'facebook' && <Facebook className="w-5 h-5 text-blue-600" />}
                      {icon.platform === 'twitter' && <Twitter className="w-5 h-5 text-blue-400" />}
                      {icon.platform === 'instagram' && <Instagram className="w-5 h-5 text-pink-600" />}
                      {icon.platform === 'linkedin' && <Linkedin className="w-5 h-5 text-blue-700" />}
                      {icon.platform === 'youtube' && <Youtube className="w-5 h-5 text-red-600" />}
                      {!['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].includes(icon.platform) && (
                        <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                    
                    <select
                      value={icon.platform}
                      onChange={(e) => updateSocialIcon(index, 'platform', e.target.value)}
                      className="w-1/4 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="facebook">Facebook</option>
                      <option value="twitter">Twitter</option>
                      <option value="instagram">Instagram</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="youtube">YouTube</option>
                      <option value="pinterest">Pinterest</option>
                      <option value="tiktok">TikTok</option>
                      <option value="snapchat">Snapchat</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="telegram">Telegram</option>
                      <option value="other">Other</option>
                    </select>
                    
                    <input
                      type="url"
                      value={icon.url}
                      onChange={(e) => updateSocialIcon(index, 'url', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="https://example.com"
                    />
                    
                    <button
                      type="button"
                      onClick={() => removeSocialIcon(index)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* E-commerce Settings */}
        {activeTab === 'ecommerce' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">E-commerce Settings</h3>
            
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
                  <option value="BDT">Bangladeshi Taka (BDT)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                  <option value="INR">Indian Rupee (INR)</option>
                  <option value="JPY">Japanese Yen (JPY)</option>
                  <option value="CNY">Chinese Yuan (CNY)</option>
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
                  placeholder="৳, $, €, etc."
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
                  <option value="left">Left (৳100)</option>
                  <option value="right">Right (100৳)</option>
                  <option value="left_space">Left with space (৳ 100)</option>
                  <option value="right_space">Right with space (100 ৳)</option>
                </select>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                Tax Settings
              </h4>
              
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="enable_taxes"
                  checked={ecommerceSettings.enable_taxes}
                  onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, enable_taxes: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="enable_taxes" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Enable taxes
                </label>
              </div>
              
              {ecommerceSettings.enable_taxes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={ecommerceSettings.tax_rate}
                    onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, tax_rate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                Shipping Settings
              </h4>
              
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="enable_shipping"
                  checked={ecommerceSettings.enable_shipping}
                  onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, enable_shipping: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="enable_shipping" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Enable shipping
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
                        onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, default_shipping_cost: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-7 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                        {ecommerceSettings.currency_symbol}
                      </span>
                      <input
                        type="number"
                        value={ecommerceSettings.free_shipping_threshold}
                        onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, free_shipping_threshold: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-7 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Orders above this amount qualify for free shipping
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* SEO & Analytics Settings */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SEO & Analytics Settings</h3>
            
            <div className="space-y-6">
              <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                SEO Settings
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={seoSettings.seo_title}
                    onChange={(e) => setSeoSettings({ ...seoSettings, seo_title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Default page title"
                  />
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
                </div>
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
                  placeholder="Brief description of your site for search engines"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Open Graph Image
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={seoSettings.og_image}
                    onChange={(e) => setSeoSettings({ ...seoSettings, og_image: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Image URL for social sharing"
                  />
                  <button
                    type="button"
                    onClick={() => handleUploadClick((url) => setSeoSettings({ ...seoSettings, og_image: url }))}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                </div>
                {seoSettings.og_image && (
                  <div className="mt-2">
                    <img src={seoSettings.og_image} alt="OG Image" className="h-20 object-cover rounded" />
                  </div>
                )}
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
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enable_sitemap"
                  checked={seoSettings.enable_sitemap}
                  onChange={(e) => setSeoSettings({ ...seoSettings, enable_sitemap: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="enable_sitemap" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Enable XML Sitemap
                </label>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                <BarChart className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                Analytics Settings
              </h4>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    value={seoSettings.google_analytics}
                    onChange={(e) => setSeoSettings({ ...seoSettings, google_analytics: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="G-XXXXXXXXXX or UA-XXXXXXXX-X"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Enter your Google Analytics Measurement ID (starts with G-) or Tracking ID (starts with UA-)
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Facebook Pixel ID
                  </label>
                  <input
                    type="text"
                    value={seoSettings.facebook_pixel}
                    onChange={(e) => setSeoSettings({ ...seoSettings, facebook_pixel: e.target.value })}
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
                    value={seoSettings.google_tag_manager}
                    onChange={(e) => setSeoSettings({ ...seoSettings, google_tag_manager: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="GTM-XXXXXXX"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Structured Data (JSON-LD)
                  </label>
                  <textarea
                    value={seoSettings.structured_data}
                    onChange={(e) => setSeoSettings({ ...seoSettings, structured_data: e.target.value })}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                    placeholder='{"@context":"https://schema.org","@type":"Organization","name":"Your Company","url":"https://example.com"}'
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Enter JSON-LD structured data for rich search results
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Maintenance Mode</h4>
                    <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                      When enabled, your site will display a maintenance message to visitors.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securitySettings.maintenance_mode}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, maintenance_mode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              {securitySettings.maintenance_mode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maintenance Message
                  </label>
                  <textarea
                    value={securitySettings.maintenance_message}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, maintenance_message: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="We're currently performing maintenance. Please check back soon."
                  />
                </div>
              )}
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">User Authentication</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allow_registration"
                      checked={securitySettings.allow_registration}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, allow_registration: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="allow_registration" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Allow user registration
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enable_captcha"
                      checked={securitySettings.enable_captcha}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, enable_captcha: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="enable_captcha" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Enable CAPTCHA on forms
                    </label>
                  </div>
                </div>
                
                <div className="mt-4">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;