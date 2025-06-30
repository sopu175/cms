import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Image, 
  Settings as SettingsIcon, 
  ShoppingBag, 
  DollarSign,
  Percent,
  Truck,
  Star,
  Heart,
  Package,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useSiteInfo } from '../hooks/useSiteInfo';
import { useAuth } from '../contexts/AuthContext';

interface ContactEntry {
  id: string;
  label: string;
  value: string;
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { settings, loading: settingsLoading, updateSettings } = useSettings();
  const { siteInfo, loading: siteInfoLoading, updateSiteInfo } = useSiteInfo();
  
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [generalForm, setGeneralForm] = useState({
    site_name: '',
    tagline: '',
    description: '',
    timezone: 'UTC',
    date_format: 'MM/DD/YYYY',
    time_format: '12h',
    week_starts_on: 'sunday',
    enable_user_registration: true
  });
  
  const [contactForm, setContactForm] = useState({
    emails: [] as ContactEntry[],
    phones: [] as ContactEntry[],
    address: ''
  });
  
  const [brandingForm, setBrandingForm] = useState({
    logo_url: '',
    logo_light: '',
    logo_dark: '',
    favicon: '',
    primary_color: '#3B82F6',
    secondary_color: '#10B981',
    accent_color: '#8B5CF6'
  });
  
  const [socialForm, setSocialForm] = useState({
    social_icons: [] as {name: string, icon: string, url: string}[]
  });
  
  const [seoForm, setSeoForm] = useState({
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    google_analytics: '',
    facebook_pixel: '',
    google_tag_manager: '',
    robots_txt: '',
    enable_sitemap: true
  });
  
  const [ecommerceForm, setEcommerceForm] = useState({
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
  
  const [emailForm, setEmailForm] = useState({
    smtp_host: '',
    smtp_port: '',
    smtp_username: '',
    smtp_password: '',
    smtp_encryption: 'tls',
    from_email: '',
    from_name: '',
    email_header: '',
    email_footer: ''
  });
  
  const [securityForm, setSecurityForm] = useState({
    enable_recaptcha: false,
    recaptcha_site_key: '',
    recaptcha_secret_key: '',
    enable_2fa: false,
    password_min_length: 8,
    password_requires_uppercase: true,
    password_requires_lowercase: true,
    password_requires_number: true,
    password_requires_symbol: false
  });
  
  const [maintenanceForm, setMaintenanceForm] = useState({
    maintenance_mode: false,
    maintenance_message: 'We are currently performing maintenance. Please check back soon.',
    maintenance_end_time: '',
    allowed_ips: ''
  });

  const canEdit = user?.role === 'admin';

  // Load settings and site info
  useEffect(() => {
    if (settings) {
      setEcommerceForm({
        enable_ecommerce: settings.enable_ecommerce !== false,
        currency: settings.currency || 'BDT',
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
      
      setSeoForm({
        seo_title: settings.seo_title || '',
        seo_description: settings.seo_description || '',
        seo_keywords: settings.seo_keywords || '',
        google_analytics: settings.google_analytics || '',
        facebook_pixel: settings.facebook_pixel || '',
        google_tag_manager: settings.google_tag_manager || '',
        robots_txt: settings.robots_txt || '',
        enable_sitemap: settings.enable_sitemap !== false
      });
    }
    
    if (siteInfo) {
      setGeneralForm({
        site_name: siteInfo.site_name || '',
        tagline: siteInfo.tagline || '',
        description: siteInfo.description || '',
        timezone: 'UTC',
        date_format: 'MM/DD/YYYY',
        time_format: '12h',
        week_starts_on: 'sunday',
        enable_user_registration: true
      });
      
      setBrandingForm({
        logo_url: siteInfo.logo_url || '',
        logo_light: siteInfo.logo_light || '',
        logo_dark: siteInfo.logo_dark || '',
        favicon: siteInfo.favicon || '',
        primary_color: '#3B82F6',
        secondary_color: '#10B981',
        accent_color: '#8B5CF6'
      });
      
      setSocialForm({
        social_icons: siteInfo.social_icons || []
      });
      
      // Initialize contact form with multiple entries
      const contactInfo = siteInfo.contact_info || [];
      const emails: ContactEntry[] = [];
      const phones: ContactEntry[] = [];
      
      // If contact_info exists and is an array, process it
      if (Array.isArray(contactInfo)) {
        contactInfo.forEach(item => {
          if (item.type === 'email') {
            emails.push({
              id: item.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
              label: item.label || 'Email',
              value: item.value || ''
            });
          } else if (item.type === 'phone') {
            phones.push({
              id: item.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
              label: item.label || 'Phone',
              value: item.value || ''
            });
          }
        });
      }
      
      // If no entries were found, add default empty ones
      if (emails.length === 0) {
        emails.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          label: 'Email',
          value: siteInfo.contact_email || ''
        });
      }
      
      if (phones.length === 0) {
        phones.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          label: 'Phone',
          value: siteInfo.phone || ''
        });
      }
      
      setContactForm({
        emails,
        phones,
        address: siteInfo.address || ''
      });
      
      setMaintenanceForm({
        maintenance_mode: siteInfo.maintenance_mode || false,
        maintenance_message: siteInfo.maintenance_message || 'We are currently performing maintenance. Please check back soon.',
        maintenance_end_time: '',
        allowed_ips: ''
      });
    }
  }, [settings, siteInfo]);

  const handleSaveSettings = async () => {
    if (!canEdit) return;
    
    setSaving(true);
    
    try {
      // Update site info
      const siteInfoData = {
        site_name: generalForm.site_name,
        tagline: generalForm.tagline,
        description: generalForm.description,
        logo_url: brandingForm.logo_url,
        logo_light: brandingForm.logo_light,
        logo_dark: brandingForm.logo_dark,
        favicon: brandingForm.favicon,
        address: contactForm.address,
        social_icons: socialForm.social_icons,
        maintenance_mode: maintenanceForm.maintenance_mode,
        maintenance_message: maintenanceForm.maintenance_message
      };
      
      // Convert contact form data to contact_info array
      const contactInfo = [
        ...contactForm.emails.map(email => ({
          id: email.id,
          type: 'email',
          label: email.label,
          value: email.value
        })),
        ...contactForm.phones.map(phone => ({
          id: phone.id,
          type: 'phone',
          label: phone.label,
          value: phone.value
        }))
      ];
      
      // Add contact_info to siteInfoData
      const updatedSiteInfo = {
        ...siteInfoData,
        contact_info: contactInfo
      };
      
      // Update settings
      const settingsData = {
        ...ecommerceForm,
        ...seoForm
      };
      
      await Promise.all([
        updateSiteInfo(updatedSiteInfo),
        updateSettings(settingsData)
      ]);
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addContactEmail = () => {
    setContactForm(prev => ({
      ...prev,
      emails: [
        ...prev.emails,
        {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          label: 'Email',
          value: ''
        }
      ]
    }));
  };

  const updateContactEmail = (id: string, field: 'label' | 'value', value: string) => {
    setContactForm(prev => ({
      ...prev,
      emails: prev.emails.map(email => 
        email.id === id ? { ...email, [field]: value } : email
      )
    }));
  };

  const removeContactEmail = (id: string) => {
    setContactForm(prev => ({
      ...prev,
      emails: prev.emails.filter(email => email.id !== id)
    }));
  };

  const addContactPhone = () => {
    setContactForm(prev => ({
      ...prev,
      phones: [
        ...prev.phones,
        {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          label: 'Phone',
          value: ''
        }
      ]
    }));
  };

  const updateContactPhone = (id: string, field: 'label' | 'value', value: string) => {
    setContactForm(prev => ({
      ...prev,
      phones: prev.phones.map(phone => 
        phone.id === id ? { ...phone, [field]: value } : phone
      )
    }));
  };

  const removeContactPhone = (id: string) => {
    setContactForm(prev => ({
      ...prev,
      phones: prev.phones.filter(phone => phone.id !== id)
    }));
  };

  const addSocialIcon = () => {
    setSocialForm(prev => ({
      social_icons: [
        ...prev.social_icons,
        { name: '', icon: '', url: '' }
      ]
    }));
  };

  const updateSocialIcon = (index: number, field: string, value: string) => {
    setSocialForm(prev => {
      const newIcons = [...prev.social_icons];
      newIcons[index] = { ...newIcons[index], [field]: value };
      return { social_icons: newIcons };
    });
  };

  const removeSocialIcon = (index: number) => {
    setSocialForm(prev => ({
      social_icons: prev.social_icons.filter((_, i) => i !== index)
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
        {canEdit && (
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        )}
      </div>

      {/* Settings Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'general'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('logo')}
            className={`pb-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'logo'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            Logo & Branding
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`pb-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'contact'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            Contact Info
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`pb-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'social'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            Social Media
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`pb-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'seo'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            SEO & Analytics
          </button>
          <button
            onClick={() => setActiveTab('ecommerce')}
            className={`pb-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'ecommerce'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            Ecommerce
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`pb-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'email'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`pb-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'maintenance'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            Maintenance
          </button>
        </div>
      </div>

      {/* Settings Content */}
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
                  value={generalForm.site_name}
                  onChange={(e) => setGeneralForm({ ...generalForm, site_name: e.target.value })}
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
                  value={generalForm.tagline}
                  onChange={(e) => setGeneralForm({ ...generalForm, tagline: e.target.value })}
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
                value={generalForm.description}
                onChange={(e) => setGeneralForm({ ...generalForm, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="A brief description of your site"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timezone
                </label>
                <select
                  value={generalForm.timezone}
                  onChange={(e) => setGeneralForm({ ...generalForm, timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Asia/Dhaka">Bangladesh Time (BDT)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Format
                </label>
                <select
                  value={generalForm.date_format}
                  onChange={(e) => setGeneralForm({ ...generalForm, date_format: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  User Registration
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Allow users to register on your site
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={generalForm.enable_user_registration}
                  onChange={(e) => setGeneralForm({ ...generalForm, enable_user_registration: e.target.checked })}
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
                  Main Logo URL
                </label>
                <input
                  type="url"
                  value={brandingForm.logo_url}
                  onChange={(e) => setBrandingForm({ ...brandingForm, logo_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://example.com/logo.png"
                />
                {brandingForm.logo_url && (
                  <div className="mt-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 w-32 h-32 flex items-center justify-center">
                    <img src={brandingForm.logo_url} alt="Logo" className="max-w-full max-h-full" />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Favicon URL
                </label>
                <input
                  type="url"
                  value={brandingForm.favicon}
                  onChange={(e) => setBrandingForm({ ...brandingForm, favicon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://example.com/favicon.ico"
                />
                {brandingForm.favicon && (
                  <div className="mt-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 w-16 h-16 flex items-center justify-center">
                    <img src={brandingForm.favicon} alt="Favicon" className="max-w-full max-h-full" />
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
                  value={brandingForm.logo_light}
                  onChange={(e) => setBrandingForm({ ...brandingForm, logo_light: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://example.com/logo-light.png"
                />
                {brandingForm.logo_light && (
                  <div className="mt-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white w-32 h-32 flex items-center justify-center">
                    <img src={brandingForm.logo_light} alt="Light Logo" className="max-w-full max-h-full" />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dark Mode Logo URL
                </label>
                <input
                  type="url"
                  value={brandingForm.logo_dark}
                  onChange={(e) => setBrandingForm({ ...brandingForm, logo_dark: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://example.com/logo-dark.png"
                />
                {brandingForm.logo_dark && (
                  <div className="mt-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-900 w-32 h-32 flex items-center justify-center">
                    <img src={brandingForm.logo_dark} alt="Dark Logo" className="max-w-full max-h-full" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={brandingForm.primary_color}
                    onChange={(e) => setBrandingForm({ ...brandingForm, primary_color: e.target.value })}
                    className="w-10 h-10 rounded-lg border-0"
                  />
                  <input
                    type="text"
                    value={brandingForm.primary_color}
                    onChange={(e) => setBrandingForm({ ...brandingForm, primary_color: e.target.value })}
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
                    value={brandingForm.secondary_color}
                    onChange={(e) => setBrandingForm({ ...brandingForm, secondary_color: e.target.value })}
                    className="w-10 h-10 rounded-lg border-0"
                  />
                  <input
                    type="text"
                    value={brandingForm.secondary_color}
                    onChange={(e) => setBrandingForm({ ...brandingForm, secondary_color: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Accent Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={brandingForm.accent_color}
                    onChange={(e) => setBrandingForm({ ...brandingForm, accent_color: e.target.value })}
                    className="w-10 h-10 rounded-lg border-0"
                  />
                  <input
                    type="text"
                    value={brandingForm.accent_color}
                    onChange={(e) => setBrandingForm({ ...brandingForm, accent_color: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Email
                </label>
                <button
                  type="button"
                  onClick={addContactEmail}
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Email</span>
                </button>
              </div>
              
              {contactForm.emails.map((email, index) => (
                <div key={email.id} className="flex items-center space-x-2 mb-3">
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={email.label}
                      onChange={(e) => updateContactEmail(email.id, 'label', e.target.value)}
                      className="col-span-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Label"
                    />
                    <input
                      type="email"
                      value={email.value}
                      onChange={(e) => updateContactEmail(email.id, 'value', e.target.value)}
                      className="col-span-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="email@example.com"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeContactEmail(email.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                    disabled={contactForm.emails.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <button
                  type="button"
                  onClick={addContactPhone}
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Phone</span>
                </button>
              </div>
              
              {contactForm.phones.map((phone, index) => (
                <div key={phone.id} className="flex items-center space-x-2 mb-3">
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={phone.label}
                      onChange={(e) => updateContactPhone(phone.id, 'label', e.target.value)}
                      className="col-span-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Label"
                    />
                    <input
                      type="tel"
                      value={phone.value}
                      onChange={(e) => updateContactPhone(phone.id, 'value', e.target.value)}
                      className="col-span-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="+1234567890"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeContactPhone(phone.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                    disabled={contactForm.phones.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <textarea
                value={contactForm.address}
                onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="123 Main St, City, Country"
              />
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
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
            
            {socialForm.social_icons.map((icon, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    value={icon.name}
                    onChange={(e) => updateSocialIcon(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Facebook"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Icon Name
                  </label>
                  <input
                    type="text"
                    value={icon.icon}
                    onChange={(e) => updateSocialIcon(index, 'icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="facebook"
                  />
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile URL
                  </label>
                  <div className="flex items-center">
                    <input
                      type="url"
                      value={icon.url}
                      onChange={(e) => updateSocialIcon(index, 'url', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="https://facebook.com/yourpage"
                    />
                    <button
                      type="button"
                      onClick={() => removeSocialIcon(index)}
                      className="ml-2 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {socialForm.social_icons.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">No social media links added yet</p>
                <button
                  type="button"
                  onClick={addSocialIcon}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  + Add Social Media
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SEO & Analytics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={seoForm.seo_title}
                  onChange={(e) => setSeoForm({ ...seoForm, seo_title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Site Title | Tagline"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  value={seoForm.seo_keywords}
                  onChange={(e) => setSeoForm({ ...seoForm, seo_keywords: e.target.value })}
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
                value={seoForm.seo_description}
                onChange={(e) => setSeoForm({ ...seoForm, seo_description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="A brief description of your site (150-160 characters recommended)"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  value={seoForm.google_analytics}
                  onChange={(e) => setSeoForm({ ...seoForm, google_analytics: e.target.value })}
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
                  value={seoForm.facebook_pixel}
                  onChange={(e) => setSeoForm({ ...seoForm, facebook_pixel: e.target.value })}
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
                value={seoForm.google_tag_manager}
                onChange={(e) => setSeoForm({ ...seoForm, google_tag_manager: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="GTM-XXXXXXX"
              />
            </div>
            
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
                  Automatically generate an XML sitemap for search engines
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
          </div>
        )}

        {activeTab === 'ecommerce' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ecommerce Settings</h3>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 mb-6">
              <div>
                <h4 className="text-md font-medium text-blue-800 dark:text-blue-300">Enable Ecommerce</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Turn on ecommerce features for your site
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={ecommerceForm.enable_ecommerce}
                  onChange={(e) => setEcommerceForm({ ...ecommerceForm, enable_ecommerce: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {ecommerceForm.enable_ecommerce && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency
                    </label>
                    <select
                      value={ecommerceForm.currency}
                      onChange={(e) => setEcommerceForm({ ...ecommerceForm, currency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="GBP">British Pound (GBP)</option>
                      <option value="BDT">Bangladeshi Taka (BDT)</option>
                      <option value="INR">Indian Rupee (INR)</option>
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
                      placeholder="$"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Symbol Position
                    </label>
                    <select
                      value={ecommerceForm.currency_position}
                      onChange={(e) => setEcommerceForm({ ...ecommerceForm, currency_position: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="left">Left ($99.99)</option>
                      <option value="right">Right (99.99$)</option>
                      <option value="left_space">Left with space ($ 99.99)</option>
                      <option value="right_space">Right with space (99.99 $)</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Thousand Separator
                    </label>
                    <input
                      type="text"
                      value={ecommerceForm.thousand_separator}
                      onChange={(e) => setEcommerceForm({ ...ecommerceForm, thousand_separator: e.target.value })}
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
                      value={ecommerceForm.decimal_separator}
                      onChange={(e) => setEcommerceForm({ ...ecommerceForm, decimal_separator: e.target.value })}
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
                      value={ecommerceForm.decimal_places}
                      onChange={(e) => setEcommerceForm({ ...ecommerceForm, decimal_places: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      min={0}
                      max={4}
                    />
                  </div>
                </div>
                
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
                        step={0.01}
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
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
                        checked={ecommerceForm.enable_shipping}
                        onChange={(e) => setEcommerceForm({ ...ecommerceForm, enable_shipping: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  {ecommerceForm.enable_shipping && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>
                  )}
                </div>
                
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
                        checked={ecommerceForm.enable_coupons}
                        onChange={(e) => setEcommerceForm({ ...ecommerceForm, enable_coupons: e.target.checked })}
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
                        Allow customers to review products
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ecommerceForm.enable_reviews}
                        onChange={(e) => setEcommerceForm({ ...ecommerceForm, enable_reviews: e.target.checked })}
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
                        checked={ecommerceForm.enable_wishlist}
                        onChange={(e) => setEcommerceForm({ ...ecommerceForm, enable_wishlist: e.target.checked })}
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
                        checked={ecommerceForm.stock_management}
                        onChange={(e) => setEcommerceForm({ ...ecommerceForm, stock_management: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                
                {ecommerceForm.stock_management && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Low Stock Threshold
                    </label>
                    <input
                      type="number"
                      value={ecommerceForm.low_stock_threshold}
                      onChange={(e) => setEcommerceForm({ ...ecommerceForm, low_stock_threshold: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      min={1}
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
                  value={emailForm.smtp_host}
                  onChange={(e) => setEmailForm({ ...emailForm, smtp_host: e.target.value })}
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
                  value={emailForm.smtp_port}
                  onChange={(e) => setEmailForm({ ...emailForm, smtp_port: e.target.value })}
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
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={emailForm.smtp_password}
                    onChange={(e) => setEmailForm({ ...emailForm, smtp_password: e.target.value })}
                    className="w-full px-3 py-2 pr-10 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SMTP Encryption
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
                Email Header
              </label>
              <textarea
                value={emailForm.email_header}
                onChange={(e) => setEmailForm({ ...emailForm, email_header: e.target.value })}
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
                value={emailForm.email_footer}
                onChange={(e) => setEmailForm({ ...emailForm, email_footer: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="HTML content for email footer"
              />
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h3>
            
            <div className="space-y-4">
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
                    checked={securityForm.enable_recaptcha}
                    onChange={(e) => setSecurityForm({ ...securityForm, enable_recaptcha: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              {securityForm.enable_recaptcha && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      reCAPTCHA Site Key
                    </label>
                    <input
                      type="text"
                      value={securityForm.recaptcha_site_key}
                      onChange={(e) => setSecurityForm({ ...securityForm, recaptcha_site_key: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      reCAPTCHA Secret Key
                    </label>
                    <input
                      type="text"
                      value={securityForm.recaptcha_secret_key}
                      onChange={(e) => setSecurityForm({ ...securityForm, recaptcha_secret_key: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>
            
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
                  checked={securityForm.enable_2fa}
                  onChange={(e) => setSecurityForm({ ...securityForm, enable_2fa: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">Password Requirements</h4>
              
              <div className="space-y-3">
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
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="req-uppercase"
                    checked={securityForm.password_requires_uppercase}
                    onChange={(e) => setSecurityForm({ ...securityForm, password_requires_uppercase: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="req-uppercase"
                    className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Require uppercase letter
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="req-lowercase"
                    checked={securityForm.password_requires_lowercase}
                    onChange={(e) => setSecurityForm({ ...securityForm, password_requires_lowercase: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="req-lowercase"
                    className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Require lowercase letter
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="req-number"
                    checked={securityForm.password_requires_number}
                    onChange={(e) => setSecurityForm({ ...securityForm, password_requires_number: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="req-number"
                    className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Require number
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="req-symbol"
                    checked={securityForm.password_requires_symbol}
                    onChange={(e) => setSecurityForm({ ...securityForm, password_requires_symbol: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="req-symbol"
                    className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Require special character
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Maintenance Mode</h3>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800 mb-6">
              <div>
                <h4 className="text-md font-medium text-yellow-800 dark:text-yellow-300">Enable Maintenance Mode</h4>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  When enabled, visitors will see a maintenance message instead of your site
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintenanceForm.maintenance_mode}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, maintenance_mode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
              </label>
            </div>
            
            {maintenanceForm.maintenance_mode && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maintenance Message
                  </label>
                  <textarea
                    value={maintenanceForm.maintenance_message}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, maintenance_message: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="We are currently performing maintenance. Please check back soon."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Maintenance End Time (optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={maintenanceForm.maintenance_end_time}
                      onChange={(e) => setMaintenanceForm({ ...maintenanceForm, maintenance_end_time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Allowed IP Addresses (one per line)
                    </label>
                    <textarea
                      value={maintenanceForm.allowed_ips}
                      onChange={(e) => setMaintenanceForm({ ...maintenanceForm, allowed_ips: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="127.0.0.1&#10;192.168.1.1"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      These IPs will still be able to access the site
                    </p>
                  </div>
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