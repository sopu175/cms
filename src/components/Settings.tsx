import React, { useState, useEffect } from 'react';
import { Save, X, Upload, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, Github as GitHub, Globe, Plus, Trash2, ShoppingBag, DollarSign, Truck, Tag, BarChart, Search, Code, FileText, Server, Shield, Settings as SettingsIcon, Image, Eye } from 'lucide-react';
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
  const [formData, setFormData] = useState({
    site_name: '',
    tagline: '',
    description: '',
    logo_url: '',
    logo_light: '',
    logo_dark: '',
    favicon: '',
    contact_info: [] as any[],
    social_icons: [] as any[],
    copyright_text: '',
    
    // SEO & Analytics
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    google_analytics: '',
    facebook_pixel: '',
    google_tag_manager: '',
    robots_txt: '',
    enable_sitemap: true,
    structured_data: '',
    og_image: '',
    
    // Ecommerce
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
    
    // Email
    smtp_host: '',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    smtp_encryption: 'tls',
    from_email: '',
    from_name: '',
    enable_email_notifications: true,
    
    // Security
    allow_registration: true,
    social_login_enabled: false,
    enable_captcha: true,
    enable_2fa: false,
    password_min_length: 8,
    password_requires_special: true,
    password_requires_number: true,
    session_timeout: 60,
    
    // Maintenance
    maintenance_mode: false,
    maintenance_message: 'We are currently performing maintenance. Please check back soon.'
  });

  const isAdmin = user?.role === 'admin';

  // Load settings and site info
  useEffect(() => {
    if (!settingsLoading && settings) {
      setFormData(prev => ({
        ...prev,
        // Ecommerce settings
        enable_ecommerce: settings.enable_ecommerce === true,
        currency: settings.default_currency || 'BDT',
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
        
        // SEO & Analytics
        seo_title: settings.meta_title || '',
        seo_description: settings.meta_description || '',
        seo_keywords: settings.meta_keywords || '',
        google_analytics: settings.google_analytics_id || '',
        facebook_pixel: settings.facebook_pixel_id || '',
        google_tag_manager: settings.google_tag_manager_id || '',
        robots_txt: settings.robots_txt || '',
        enable_sitemap: settings.enable_sitemap !== false,
        structured_data: settings.structured_data || '',
        
        // Email settings
        smtp_host: settings.smtp_host || '',
        smtp_port: settings.smtp_port || 587,
        smtp_username: settings.smtp_username || '',
        smtp_password: settings.smtp_password || '',
        smtp_encryption: settings.smtp_encryption || 'tls',
        from_email: settings.from_email || '',
        from_name: settings.from_name || '',
        enable_email_notifications: settings.enable_email_notifications !== false,
        
        // Security settings
        allow_registration: settings.allow_registration !== false,
        social_login_enabled: settings.social_login_enabled === true,
        enable_captcha: settings.enable_captcha !== false,
        enable_2fa: settings.enable_2fa === true,
        password_min_length: settings.password_min_length || 8,
        password_requires_special: settings.password_requires_special !== false,
        password_requires_number: settings.password_requires_number !== false,
        session_timeout: settings.session_timeout || 60,
        
        // Maintenance settings
        maintenance_mode: settings.site_maintenance === true,
        maintenance_message: settings.maintenance_message || 'We are currently performing maintenance. Please check back soon.'
      }));
    }
  }, [settings, settingsLoading]);

  useEffect(() => {
    if (!siteInfoLoading && siteInfo) {
      setFormData(prev => ({
        ...prev,
        site_name: siteInfo.site_name || '',
        tagline: siteInfo.tagline || '',
        description: siteInfo.description || '',
        logo_url: siteInfo.logo_url || '',
        logo_light: siteInfo.logo_light || '',
        logo_dark: siteInfo.logo_dark || '',
        favicon: siteInfo.favicon || '',
        contact_info: siteInfo.contact_info || [],
        social_icons: siteInfo.social_icons || [],
        copyright_text: siteInfo.copyright_text || '',
        seo_title: siteInfo.seo_title || prev.seo_title,
        seo_description: siteInfo.seo_description || prev.seo_description,
        seo_keywords: siteInfo.seo_keywords || prev.seo_keywords,
        google_analytics: siteInfo.google_analytics || prev.google_analytics,
        facebook_pixel: siteInfo.facebook_pixel || prev.facebook_pixel,
        google_tag_manager: siteInfo.google_tag_manager || prev.google_tag_manager,
        robots_txt: siteInfo.robots_txt || prev.robots_txt,
        structured_data: siteInfo.structured_data || prev.structured_data,
        og_image: siteInfo.og_image || '',
        maintenance_mode: siteInfo.maintenance_mode === true,
        maintenance_message: siteInfo.maintenance_message || prev.maintenance_message
      }));
    }
  }, [siteInfo, siteInfoLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Update site info
      const siteInfoData = {
        site_name: formData.site_name,
        tagline: formData.tagline,
        description: formData.description,
        logo_url: formData.logo_url,
        logo_light: formData.logo_light,
        logo_dark: formData.logo_dark,
        favicon: formData.favicon,
        contact_info: formData.contact_info,
        social_icons: formData.social_icons,
        copyright_text: formData.copyright_text,
        seo_title: formData.seo_title,
        seo_description: formData.seo_description,
        seo_keywords: formData.seo_keywords,
        google_analytics: formData.google_analytics,
        facebook_pixel: formData.facebook_pixel,
        google_tag_manager: formData.google_tag_manager,
        robots_txt: formData.robots_txt,
        structured_data: formData.structured_data,
        og_image: formData.og_image,
        maintenance_mode: formData.maintenance_mode,
        maintenance_message: formData.maintenance_message
      };
      
      await updateSiteInfo(siteInfoData);
      
      // Update settings
      const settingsData = {
        // Ecommerce settings
        enable_ecommerce: formData.enable_ecommerce,
        default_currency: formData.currency,
        currency_symbol: formData.currency_symbol,
        currency_position: formData.currency_position,
        thousand_separator: formData.thousand_separator,
        decimal_separator: formData.decimal_separator,
        decimal_places: formData.decimal_places,
        enable_taxes: formData.enable_taxes,
        tax_rate: formData.tax_rate,
        enable_shipping: formData.enable_shipping,
        free_shipping_threshold: formData.free_shipping_threshold,
        default_shipping_cost: formData.default_shipping_cost,
        
        // SEO & Analytics
        meta_title: formData.seo_title,
        meta_description: formData.seo_description,
        meta_keywords: formData.seo_keywords,
        google_analytics_id: formData.google_analytics,
        facebook_pixel_id: formData.facebook_pixel,
        google_tag_manager_id: formData.google_tag_manager,
        robots_txt: formData.robots_txt,
        enable_sitemap: formData.enable_sitemap,
        structured_data: formData.structured_data,
        
        // Email settings
        smtp_host: formData.smtp_host,
        smtp_port: formData.smtp_port,
        smtp_username: formData.smtp_username,
        smtp_password: formData.smtp_password,
        smtp_encryption: formData.smtp_encryption,
        from_email: formData.from_email,
        from_name: formData.from_name,
        enable_email_notifications: formData.enable_email_notifications,
        
        // Security settings
        allow_registration: formData.allow_registration,
        social_login_enabled: formData.social_login_enabled,
        enable_captcha: formData.enable_captcha,
        enable_2fa: formData.enable_2fa,
        password_min_length: formData.password_min_length,
        password_requires_special: formData.password_requires_special,
        password_requires_number: formData.password_requires_number,
        session_timeout: formData.session_timeout,
        
        // Maintenance settings
        site_maintenance: formData.maintenance_mode,
        maintenance_message: formData.maintenance_message
      };
      
      await updateSettings(settingsData);
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSocialIconChange = (index: number, field: string, value: string) => {
    const updatedIcons = [...formData.social_icons];
    updatedIcons[index] = { ...updatedIcons[index], [field]: value };
    setFormData({ ...formData, social_icons: updatedIcons });
  };

  const addSocialIcon = () => {
    const newIcon = {
      id: Date.now().toString(),
      platform: 'facebook',
      url: '',
      icon: 'facebook'
    };
    setFormData({ ...formData, social_icons: [...formData.social_icons, newIcon] });
  };

  const removeSocialIcon = (index: number) => {
    const updatedIcons = [...formData.social_icons];
    updatedIcons.splice(index, 1);
    setFormData({ ...formData, social_icons: updatedIcons });
  };

  const handleContactInfoChange = (index: number, field: string, value: any) => {
    const updatedContactInfo = [...formData.contact_info];
    updatedContactInfo[index] = { ...updatedContactInfo[index], [field]: value };
    setFormData({ ...formData, contact_info: updatedContactInfo });
  };

  const addContactLocation = () => {
    const newLocation = {
      id: Date.now().toString(),
      label: 'New Location',
      address: '',
      map_url: '',
      emails: [{ label: 'Email', link: '' }],
      phones: [{ label: 'Phone', link: '' }]
    };
    setFormData({ ...formData, contact_info: [...formData.contact_info, newLocation] });
  };

  const removeContactLocation = (index: number) => {
    const updatedContactInfo = [...formData.contact_info];
    updatedContactInfo.splice(index, 1);
    setFormData({ ...formData, contact_info: updatedContactInfo });
  };

  const addEmail = (locationIndex: number) => {
    const updatedContactInfo = [...formData.contact_info];
    const location = updatedContactInfo[locationIndex];
    
    if (!location.emails) {
      location.emails = [];
    }
    
    location.emails.push({ label: 'Email', link: '' });
    setFormData({ ...formData, contact_info: updatedContactInfo });
  };

  const updateEmail = (locationIndex: number, emailIndex: number, field: string, value: string) => {
    const updatedContactInfo = [...formData.contact_info];
    const location = updatedContactInfo[locationIndex];
    
    if (!location.emails) {
      location.emails = [];
    }
    
    location.emails[emailIndex] = { 
      ...location.emails[emailIndex], 
      [field]: value 
    };
    
    setFormData({ ...formData, contact_info: updatedContactInfo });
  };

  const removeEmail = (locationIndex: number, emailIndex: number) => {
    const updatedContactInfo = [...formData.contact_info];
    updatedContactInfo[locationIndex].emails.splice(emailIndex, 1);
    setFormData({ ...formData, contact_info: updatedContactInfo });
  };

  const addPhone = (locationIndex: number) => {
    const updatedContactInfo = [...formData.contact_info];
    const location = updatedContactInfo[locationIndex];
    
    if (!location.phones) {
      location.phones = [];
    }
    
    location.phones.push({ label: 'Phone', link: '' });
    setFormData({ ...formData, contact_info: updatedContactInfo });
  };

  const updatePhone = (locationIndex: number, phoneIndex: number, field: string, value: string) => {
    const updatedContactInfo = [...formData.contact_info];
    const location = updatedContactInfo[locationIndex];
    
    if (!location.phones) {
      location.phones = [];
    }
    
    location.phones[phoneIndex] = { 
      ...location.phones[phoneIndex], 
      [field]: value 
    };
    
    setFormData({ ...formData, contact_info: updatedContactInfo });
  };

  const removePhone = (locationIndex: number, phoneIndex: number) => {
    const updatedContactInfo = [...formData.contact_info];
    updatedContactInfo[locationIndex].phones.splice(phoneIndex, 1);
    setFormData({ ...formData, contact_info: updatedContactInfo });
  };

  const handleFileUpload = async (field: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const result = await uploadMedia(file);
          if (result.success && result.data) {
            setFormData({ ...formData, [field]: result.data.url });
          }
        } catch (error) {
          console.error('Upload failed:', error);
          alert('Failed to upload file. Please try again.');
        }
      }
    };
    
    input.click();
  };

  const getSocialIconComponent = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return <Facebook className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      case 'github': return <GitHub className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

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
        <SettingsIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Access Restricted</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Only administrators can access settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">Configure your site settings</p>
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
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === 'branding' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Logo & Branding
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
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === 'maintenance' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Maintenance
        </button>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">General Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={formData.site_name}
                  onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
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
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Your site's tagline"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Brief description of your site"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Copyright Text
                </label>
                <input
                  type="text"
                  value={formData.copyright_text}
                  onChange={(e) => setFormData({ ...formData, copyright_text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="© 2025 Your Company. All rights reserved."
                />
              </div>
            </div>
          </div>
        )}

        {/* Logo & Branding */}
        {activeTab === 'branding' && (
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
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Logo URL"
                  />
                  <button
                    type="button"
                    onClick={() => handleFileUpload('logo_url')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                </div>
                {formData.logo_url && (
                  <div className="mt-2">
                    <img src={formData.logo_url} alt="Logo" className="h-12 object-contain" />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Light Mode Logo
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={formData.logo_light}
                    onChange={(e) => setFormData({ ...formData, logo_light: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Light logo URL"
                  />
                  <button
                    type="button"
                    onClick={() => handleFileUpload('logo_light')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                </div>
                {formData.logo_light && (
                  <div className="mt-2">
                    <img src={formData.logo_light} alt="Light Logo" className="h-12 object-contain" />
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
                    value={formData.logo_dark}
                    onChange={(e) => setFormData({ ...formData, logo_dark: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Dark logo URL"
                  />
                  <button
                    type="button"
                    onClick={() => handleFileUpload('logo_dark')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                </div>
                {formData.logo_dark && (
                  <div className="mt-2 bg-gray-800 p-2 rounded">
                    <img src={formData.logo_dark} alt="Dark Logo" className="h-12 object-contain" />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Favicon
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={formData.favicon}
                    onChange={(e) => setFormData({ ...formData, favicon: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Favicon URL"
                  />
                  <button
                    type="button"
                    onClick={() => handleFileUpload('favicon')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                </div>
                {formData.favicon && (
                  <div className="mt-2">
                    <img src={formData.favicon} alt="Favicon" className="h-8 w-8 object-contain" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contact Info */}
        {activeTab === 'contact' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h3>
              <button
                type="button"
                onClick={addContactLocation}
                className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Location</span>
              </button>
            </div>
            
            <div className="space-y-6">
              {formData.contact_info.map((location, locationIndex) => (
                <div key={location.id || locationIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Location {locationIndex + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeContactLocation(locationIndex)}
                      className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
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
                        value={location.label || ''}
                        onChange={(e) => handleContactInfoChange(locationIndex, 'label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Main Office"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address
                      </label>
                      <textarea
                        value={location.address || ''}
                        onChange={(e) => handleContactInfoChange(locationIndex, 'address', e.target.value)}
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
                        value={location.map_url || ''}
                        onChange={(e) => handleContactInfoChange(locationIndex, 'map_url', e.target.value)}
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
                          onClick={() => addEmail(locationIndex)}
                          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          + Add Email
                        </button>
                      </div>
                      
                      {location.emails && location.emails.length > 0 ? (
                        <div className="space-y-2">
                          {location.emails.map((email: any, emailIndex: number) => (
                            <div key={emailIndex} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={email.label || ''}
                                onChange={(e) => updateEmail(locationIndex, emailIndex, 'label', e.target.value)}
                                className="w-1/3 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                placeholder="Label"
                              />
                              <input
                                type="email"
                                value={email.link || ''}
                                onChange={(e) => updateEmail(locationIndex, emailIndex, 'link', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                placeholder="email@example.com"
                              />
                              <button
                                type="button"
                                onClick={() => removeEmail(locationIndex, emailIndex)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addEmail(locationIndex)}
                          className="w-full py-2 px-3 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 text-sm text-center hover:border-gray-400 dark:hover:border-gray-600"
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
                          onClick={() => addPhone(locationIndex)}
                          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          + Add Phone
                        </button>
                      </div>
                      
                      {location.phones && location.phones.length > 0 ? (
                        <div className="space-y-2">
                          {location.phones.map((phone: any, phoneIndex: number) => (
                            <div key={phoneIndex} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={phone.label || ''}
                                onChange={(e) => updatePhone(locationIndex, phoneIndex, 'label', e.target.value)}
                                className="w-1/3 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                placeholder="Label"
                              />
                              <input
                                type="tel"
                                value={phone.link || ''}
                                onChange={(e) => updatePhone(locationIndex, phoneIndex, 'link', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                placeholder="+1234567890"
                              />
                              <button
                                type="button"
                                onClick={() => removePhone(locationIndex, phoneIndex)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addPhone(locationIndex)}
                          className="w-full py-2 px-3 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 text-sm text-center hover:border-gray-400 dark:hover:border-gray-600"
                        >
                          + Add Phone Number
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {formData.contact_info.length === 0 && (
                <button
                  type="button"
                  onClick={addContactLocation}
                  className="w-full py-4 px-3 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 text-center hover:border-gray-400 dark:hover:border-gray-600"
                >
                  + Add Contact Location
                </button>
              )}
            </div>
          </div>
        )}

        {/* Social Media */}
        {activeTab === 'social' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Social Media</h3>
              <button
                type="button"
                onClick={addSocialIcon}
                className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Social Media</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.social_icons.map((icon, index) => (
                <div key={icon.id || index} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    {getSocialIconComponent(icon.platform)}
                  </div>
                  
                  <select
                    value={icon.platform}
                    onChange={(e) => handleSocialIconChange(index, 'platform', e.target.value)}
                    className="w-1/4 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="facebook">Facebook</option>
                    <option value="twitter">Twitter</option>
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="youtube">YouTube</option>
                    <option value="github">GitHub</option>
                    <option value="other">Other</option>
                  </select>
                  
                  <input
                    type="url"
                    value={icon.url}
                    onChange={(e) => handleSocialIconChange(index, 'url', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="https://..."
                  />
                  
                  <button
                    type="button"
                    onClick={() => removeSocialIcon(index)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {formData.social_icons.length === 0 && (
                <button
                  type="button"
                  onClick={addSocialIcon}
                  className="w-full py-4 px-3 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 text-center hover:border-gray-400 dark:hover:border-gray-600"
                >
                  + Add Social Media Links
                </button>
              )}
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
                    value={formData.seo_title}
                    onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Your Site Name - Tagline"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default Meta Description
                  </label>
                  <textarea
                    value={formData.seo_description}
                    onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Brief description of your site for search engines"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default Meta Keywords
                  </label>
                  <input
                    type="text"
                    value={formData.seo_keywords}
                    onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Open Graph Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={formData.og_image}
                      onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Image URL for social sharing"
                    />
                    <button
                      type="button"
                      onClick={() => handleFileUpload('og_image')}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload</span>
                    </button>
                  </div>
                  {formData.og_image && (
                    <div className="mt-2">
                      <img src={formData.og_image} alt="OG Image" className="h-20 object-cover rounded" />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Robots.txt Content
                  </label>
                  <textarea
                    value={formData.robots_txt}
                    onChange={(e) => setFormData({ ...formData, robots_txt: e.target.value })}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                    placeholder="User-agent: *\nDisallow: /admin/\nSitemap: https://example.com/sitemap.xml"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enable_sitemap"
                    checked={formData.enable_sitemap}
                    onChange={(e) => setFormData({ ...formData, enable_sitemap: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="enable_sitemap" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Enable XML Sitemap
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Structured Data (JSON-LD)
                  </label>
                  <textarea
                    value={formData.structured_data}
                    onChange={(e) => setFormData({ ...formData, structured_data: e.target.value })}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                    placeholder='{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Your Organization",\n  "url": "https://example.com"\n}'
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Analytics Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    value={formData.google_analytics}
                    onChange={(e) => setFormData({ ...formData, google_analytics: e.target.value })}
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
                    value={formData.facebook_pixel}
                    onChange={(e) => setFormData({ ...formData, facebook_pixel: e.target.value })}
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
                    value={formData.google_tag_manager}
                    onChange={(e) => setFormData({ ...formData, google_tag_manager: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="GTM-XXXXXXX"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ecommerce Settings */}
        {activeTab === 'ecommerce' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Ecommerce Settings</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Enable Ecommerce</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Turn on/off all ecommerce features (products, orders, reviews, coupons)
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enable_ecommerce}
                      onChange={(e) => setFormData({ ...formData, enable_ecommerce: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Default Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="BDT">Bangladeshi Taka (৳)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="GBP">British Pound (£)</option>
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="JPY">Japanese Yen (¥)</option>
                      <option value="CNY">Chinese Yuan (¥)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency Symbol
                    </label>
                    <input
                      type="text"
                      value={formData.currency_symbol}
                      onChange={(e) => setFormData({ ...formData, currency_symbol: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="৳"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency Position
                    </label>
                    <select
                      value={formData.currency_position}
                      onChange={(e) => setFormData({ ...formData, currency_position: e.target.value })}
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
                      Decimal Places
                    </label>
                    <select
                      value={formData.decimal_places}
                      onChange={(e) => setFormData({ ...formData, decimal_places: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Tax Settings</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enable_taxes"
                        checked={formData.enable_taxes}
                        onChange={(e) => setFormData({ ...formData, enable_taxes: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="enable_taxes" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Enable taxes
                      </label>
                    </div>
                    
                    {formData.enable_taxes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Default Tax Rate (%)
                        </label>
                        <input
                          type="number"
                          value={formData.tax_rate}
                          onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="8"
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Shipping Settings</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enable_shipping"
                        checked={formData.enable_shipping}
                        onChange={(e) => setFormData({ ...formData, enable_shipping: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="enable_shipping" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Enable shipping
                      </label>
                    </div>
                    
                    {formData.enable_shipping && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Default Shipping Cost
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                              {formData.currency_symbol}
                            </span>
                            <input
                              type="number"
                              value={formData.default_shipping_cost}
                              onChange={(e) => setFormData({ ...formData, default_shipping_cost: parseFloat(e.target.value) })}
                              className="w-full pl-7 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              placeholder="10"
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
                              {formData.currency_symbol}
                            </span>
                            <input
                              type="number"
                              value={formData.free_shipping_threshold}
                              onChange={(e) => setFormData({ ...formData, free_shipping_threshold: parseFloat(e.target.value) })}
                              className="w-full pl-7 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              placeholder="100"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Settings */}
        {activeTab === 'email' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Email Settings</h3>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enable_email_notifications"
                  checked={formData.enable_email_notifications}
                  onChange={(e) => setFormData({ ...formData, enable_email_notifications: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="enable_email_notifications" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Enable email notifications
                </label>
              </div>
              
              {formData.enable_email_notifications && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        From Name
                      </label>
                      <input
                        type="text"
                        value={formData.from_name}
                        onChange={(e) => setFormData({ ...formData, from_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Your Site Name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        From Email
                      </label>
                      <input
                        type="email"
                        value={formData.from_email}
                        onChange={(e) => setFormData({ ...formData, from_email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="noreply@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">SMTP Settings</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          SMTP Host
                        </label>
                        <input
                          type="text"
                          value={formData.smtp_host}
                          onChange={(e) => setFormData({ ...formData, smtp_host: e.target.value })}
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
                          value={formData.smtp_port}
                          onChange={(e) => setFormData({ ...formData, smtp_port: parseInt(e.target.value) })}
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
                          value={formData.smtp_username}
                          onChange={(e) => setFormData({ ...formData, smtp_username: e.target.value })}
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
                          value={formData.smtp_password}
                          onChange={(e) => setFormData({ ...formData, smtp_password: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="••••••••"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Encryption
                        </label>
                        <select
                          value={formData.smtp_encryption}
                          onChange={(e) => setFormData({ ...formData, smtp_encryption: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="tls">TLS</option>
                          <option value="ssl">SSL</option>
                          <option value="none">None</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Security Settings</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">User Registration</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Allow new users to register on your site
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allow_registration}
                    onChange={(e) => setFormData({ ...formData, allow_registration: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Social Login</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Allow users to sign in with social media accounts
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.social_login_enabled}
                    onChange={(e) => setFormData({ ...formData, social_login_enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">CAPTCHA Protection</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Enable CAPTCHA on forms to prevent spam
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enable_captcha}
                    onChange={(e) => setFormData({ ...formData, enable_captcha: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Require two-factor authentication for all users
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enable_2fa}
                    onChange={(e) => setFormData({ ...formData, enable_2fa: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Password Requirements</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Minimum Password Length
                    </label>
                    <input
                      type="number"
                      value={formData.password_min_length}
                      onChange={(e) => setFormData({ ...formData, password_min_length: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      min="6"
                      max="32"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="password_requires_special"
                      checked={formData.password_requires_special}
                      onChange={(e) => setFormData({ ...formData, password_requires_special: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="password_requires_special" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Require special characters
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="password_requires_number"
                      checked={formData.password_requires_number}
                      onChange={(e) => setFormData({ ...formData, password_requires_number: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="password_requires_number" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Require numbers
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={formData.session_timeout}
                  onChange={(e) => setFormData({ ...formData, session_timeout: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  min="5"
                  max="1440"
                />
              </div>
            </div>
          </div>
        )}

        {/* Maintenance Mode */}
        {activeTab === 'maintenance' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Maintenance Mode</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
                <div>
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Enable Maintenance Mode</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    When enabled, visitors will see a maintenance message instead of your site
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.maintenance_mode}
                    onChange={(e) => setFormData({ ...formData, maintenance_mode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
                </label>
              </div>
              
              {formData.maintenance_mode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maintenance Message
                  </label>
                  <textarea
                    value={formData.maintenance_message}
                    onChange={(e) => setFormData({ ...formData, maintenance_message: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="We are currently performing maintenance. Please check back soon."
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              saving
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:shadow-blue-600/25'
            }`}
          >
            <Save className={`w-5 h-5 ${saving ? 'animate-pulse' : ''}`} />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;