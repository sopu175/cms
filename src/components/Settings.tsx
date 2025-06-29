import React, { useState } from 'react';
import { 
  Settings as SettingsIcon,
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  Image,
  Code,
  Palette,
  Share2,
  Shield,
  Bell,
  CreditCard,
  Truck,
  FileText,
  Eye,
  Upload,
  X,
  Plus,
  Trash2,
  BarChart,
  LineChart,
  PieChart,
  Search,
  Zap
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useSiteInfo } from '../hooks/useSiteInfo';

const Settings: React.FC = () => {
  const { settings, loading: settingsLoading, updateSettings } = useSettings();
  const { siteInfo, loading: siteLoading, updateSiteInfo } = useSiteInfo();
  const [activeTab, setActiveTab] = useState('general');
  
  const [siteData, setSiteData] = useState({
    site_name: siteInfo?.site_name || '',
    tagline: siteInfo?.tagline || '',
    description: siteInfo?.description || '',
    contact_email: siteInfo?.contact_email || '',
    phone: siteInfo?.phone || '',
    address: siteInfo?.address || '',
    logo_light: siteInfo?.logo_light || '',
    logo_dark: siteInfo?.logo_dark || '',
    favicon: siteInfo?.favicon || '',
    copyright_text: siteInfo?.copyright_text || '',
    google_analytics: siteInfo?.google_analytics || '',
    facebook_pixel: siteInfo?.facebook_pixel || '',
    google_tag_manager: siteInfo?.google_tag_manager || '',
    custom_head_code: siteInfo?.custom_head_code || '',
    custom_footer_code: siteInfo?.custom_footer_code || '',
    maintenance_mode: siteInfo?.maintenance_mode || false,
    maintenance_message: siteInfo?.maintenance_message || '',
    social_icons: siteInfo?.social_icons || []
  });

  const [generalSettings, setGeneralSettings] = useState({
    allow_registration: settings?.allow_registration || true,
    email_notifications: settings?.email_notifications || true,
    comment_moderation: settings?.comment_moderation || true,
    auto_approve_comments: settings?.auto_approve_comments || false,
    posts_per_page: settings?.posts_per_page || 10,
    date_format: settings?.date_format || 'Y-m-d',
    time_format: settings?.time_format || 'H:i',
    timezone: settings?.timezone || 'UTC',
    default_user_role: settings?.default_user_role || 'customer'
  });

  const [ecommerceSettings, setEcommerceSettings] = useState({
    currency: settings?.currency || 'USD',
    currency_symbol: settings?.currency_symbol || '$',
    currency_position: settings?.currency_position || 'left',
    thousand_separator: settings?.thousand_separator || ',',
    decimal_separator: settings?.decimal_separator || '.',
    decimal_places: settings?.decimal_places || 2,
    enable_taxes: settings?.enable_taxes || false,
    tax_rate: settings?.tax_rate || 0,
    enable_shipping: settings?.enable_shipping || true,
    free_shipping_threshold: settings?.free_shipping_threshold || 100,
    default_shipping_cost: settings?.default_shipping_cost || 10,
    enable_coupons: settings?.enable_coupons || true,
    enable_reviews: settings?.enable_reviews || true,
    enable_wishlist: settings?.enable_wishlist || true,
    stock_management: settings?.stock_management || true,
    low_stock_threshold: settings?.low_stock_threshold || 5
  });

  const [paymentSettings, setPaymentSettings] = useState({
    payment_methods: settings?.payment_methods || {
      stripe: {
        enabled: true,
        test_mode: true,
        public_key: settings?.stripe_public_key || '',
        secret_key: settings?.stripe_secret_key || '',
        webhook_secret: settings?.stripe_webhook_secret || '',
        payment_description: 'Payment for order'
      },
      paypal: {
        enabled: false,
        test_mode: true,
        client_id: settings?.paypal_client_id || '',
        client_secret: settings?.paypal_client_secret || '',
        payment_description: 'Payment for order'
      },
      bank_transfer: {
        enabled: false,
        account_details: settings?.bank_account_details || '',
        payment_instructions: 'Please transfer the total amount to our bank account.'
      }
    }
  });

  const [analyticsSettings, setAnalyticsSettings] = useState({
    google_analytics_id: settings?.google_analytics_id || '',
    google_analytics_v4: settings?.google_analytics_v4 || true,
    enable_enhanced_ecommerce: settings?.enable_enhanced_ecommerce || false,
    facebook_pixel_id: settings?.facebook_pixel_id || '',
    enable_facebook_events: settings?.enable_facebook_events || false,
    hotjar_id: settings?.hotjar_id || '',
    microsoft_clarity_id: settings?.microsoft_clarity_id || '',
    enable_page_view_tracking: settings?.enable_page_view_tracking || true,
    enable_event_tracking: settings?.enable_event_tracking || true,
    enable_user_tracking: settings?.enable_user_tracking || false,
    cookie_consent_required: settings?.cookie_consent_required || true,
    anonymize_ip: settings?.anonymize_ip || true
  });

  React.useEffect(() => {
    if (siteInfo) {
      setSiteData({
        site_name: siteInfo.site_name || '',
        tagline: siteInfo.tagline || '',
        description: siteInfo.description || '',
        contact_email: siteInfo.contact_email || '',
        phone: siteInfo.phone || '',
        address: siteInfo.address || '',
        logo_light: siteInfo.logo_light || '',
        logo_dark: siteInfo.logo_dark || '',
        favicon: siteInfo.favicon || '',
        copyright_text: siteInfo.copyright_text || '',
        google_analytics: siteInfo.google_analytics || '',
        facebook_pixel: siteInfo.facebook_pixel || '',
        google_tag_manager: siteInfo.google_tag_manager || '',
        custom_head_code: siteInfo.custom_head_code || '',
        custom_footer_code: siteInfo.custom_footer_code || '',
        maintenance_mode: siteInfo.maintenance_mode || false,
        maintenance_message: siteInfo.maintenance_message || '',
        social_icons: siteInfo.social_icons || []
      });
    }
  }, [siteInfo]);

  const handleSiteInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateSiteInfo(siteData);
    if (result.success) {
      alert('Site information updated successfully');
    } else {
      alert(result.error || 'Failed to update site information');
    }
  };

  const handleGeneralSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateSettings(generalSettings);
    if (result.success) {
      alert('General settings updated successfully');
    } else {
      alert(result.error || 'Failed to update settings');
    }
  };

  const handleEcommerceSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateSettings(ecommerceSettings);
    if (result.success) {
      alert('Ecommerce settings updated successfully');
    } else {
      alert(result.error || 'Failed to update ecommerce settings');
    }
  };

  const handlePaymentSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateSettings({ payment_methods: paymentSettings.payment_methods });
    if (result.success) {
      alert('Payment settings updated successfully');
    } else {
      alert(result.error || 'Failed to update payment settings');
    }
  };

  const handleAnalyticsSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateSettings(analyticsSettings);
    if (result.success) {
      alert('Analytics settings updated successfully');
    } else {
      alert(result.error || 'Failed to update analytics settings');
    }
  };

  const addSocialIcon = () => {
    setSiteData(prev => ({
      ...prev,
      social_icons: [...prev.social_icons, { platform: '', url: '', icon: '', order: prev.social_icons.length }]
    }));
  };

  const removeSocialIcon = (index: number) => {
    setSiteData(prev => ({
      ...prev,
      social_icons: prev.social_icons.filter((_, i) => i !== index)
    }));
  };

  const updateSocialIcon = (index: number, field: string, value: string) => {
    setSiteData(prev => ({
      ...prev,
      social_icons: prev.social_icons.map((icon, i) => 
        i === index ? { ...icon, [field]: value } : icon
      )
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'site', label: 'Site Info', icon: Globe },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'ecommerce', label: 'Ecommerce', icon: CreditCard },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'advanced', label: 'Advanced', icon: Code }
  ];

  if (settingsLoading || siteLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage your site configuration</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl">
        {activeTab === 'general' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">General Settings</h3>
            <form onSubmit={handleGeneralSettingsSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Posts per page
                  </label>
                  <input
                    type="number"
                    value={generalSettings.posts_per_page}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, posts_per_page: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    min="1"
                    max="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default user role
                  </label>
                  <select
                    value={generalSettings.default_user_role}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, default_user_role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="customer">Customer</option>
                    <option value="author">Author</option>
                    <option value="editor">Editor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date format
                  </label>
                  <select
                    value={generalSettings.date_format}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, date_format: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="Y-m-d">2024-01-15</option>
                    <option value="m/d/Y">01/15/2024</option>
                    <option value="d/m/Y">15/01/2024</option>
                    <option value="F j, Y">January 15, 2024</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time format
                  </label>
                  <select
                    value={generalSettings.time_format}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, time_format: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="H:i">24:00</option>
                    <option value="g:i A">12:00 AM</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Allow user registration
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Allow new users to create accounts
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={generalSettings.allow_registration}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, allow_registration: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email notifications
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Send email notifications for important events
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={generalSettings.email_notifications}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, email_notifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Comment moderation
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Require approval for new comments
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={generalSettings.comment_moderation}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, comment_moderation: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save General Settings</span>
              </button>
            </form>
          </div>
        )}

        {activeTab === 'site' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Site Information</h3>
            <form onSubmit={handleSiteInfoSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={siteData.site_name}
                    onChange={(e) => setSiteData({ ...siteData, site_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={siteData.tagline}
                    onChange={(e) => setSiteData({ ...siteData, tagline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Just another CMS site"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={siteData.description}
                  onChange={(e) => setSiteData({ ...siteData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={siteData.contact_email}
                    onChange={(e) => setSiteData({ ...siteData, contact_email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={siteData.phone}
                    onChange={(e) => setSiteData({ ...siteData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Address
                </label>
                <textarea
                  value={siteData.address}
                  onChange={(e) => setSiteData({ ...siteData, address: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Copyright Text
                </label>
                <input
                  type="text"
                  value={siteData.copyright_text}
                  onChange={(e) => setSiteData({ ...siteData, copyright_text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="© 2024 Your Company Name. All rights reserved."
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Maintenance Mode
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Put the site in maintenance mode
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={siteData.maintenance_mode}
                    onChange={(e) => setSiteData({ ...siteData, maintenance_mode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                </label>
              </div>

              {siteData.maintenance_mode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maintenance Message
                  </label>
                  <textarea
                    value={siteData.maintenance_message}
                    onChange={(e) => setSiteData({ ...siteData, maintenance_message: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="We're currently performing scheduled maintenance. Please check back soon."
                  />
                </div>
              )}

              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Site Info</span>
              </button>
            </form>
          </div>
        )}

        {activeTab === 'branding' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Branding</h3>
            <form onSubmit={handleSiteInfoSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Light Logo
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="url"
                      value={siteData.logo_light}
                      onChange={(e) => setSiteData({ ...siteData, logo_light: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Logo URL for light theme"
                    />
                    <button
                      type="button"
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                  {siteData.logo_light && (
                    <div className="mt-2">
                      <img src={siteData.logo_light} alt="Light Logo" className="h-12 object-contain" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dark Logo
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="url"
                      value={siteData.logo_dark}
                      onChange={(e) => setSiteData({ ...siteData, logo_dark: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Logo URL for dark theme"
                    />
                    <button
                      type="button"
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                  {siteData.logo_dark && (
                    <div className="mt-2 bg-gray-900 p-2 rounded">
                      <img src={siteData.logo_dark} alt="Dark Logo" className="h-12 object-contain" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Favicon
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="url"
                    value={siteData.favicon}
                    onChange={(e) => setSiteData({ ...siteData, favicon: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Favicon URL (16x16 or 32x32 pixels)"
                  />
                  <button
                    type="button"
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
                {siteData.favicon && (
                  <div className="mt-2">
                    <img src={siteData.favicon} alt="Favicon" className="w-8 h-8 object-contain" />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Branding</span>
              </button>
            </form>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Social Media</h3>
            <form onSubmit={handleSiteInfoSubmit} className="space-y-6">
              <div className="space-y-4">
                {siteData.social_icons.map((icon, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <select
                      value={icon.platform}
                      onChange={(e) => updateSocialIcon(index, 'platform', e.target.value)}
                      className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Platform</option>
                      <option value="facebook">Facebook</option>
                      <option value="twitter">Twitter</option>
                      <option value="instagram">Instagram</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="youtube">YouTube</option>
                      <option value="tiktok">TikTok</option>
                      <option value="pinterest">Pinterest</option>
                      <option value="github">GitHub</option>
                    </select>
                    <input
                      type="url"
                      value={icon.url}
                      onChange={(e) => updateSocialIcon(index, 'url', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Social media URL"
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

              <button
                type="button"
                onClick={addSocialIcon}
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg border border-blue-200 dark:border-blue-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Social Icon</span>
              </button>

              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Social Media</span>
              </button>
            </form>
          </div>
        )}

        {activeTab === 'ecommerce' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Ecommerce Settings</h3>
            <form onSubmit={handleEcommerceSettingsSubmit} className="space-y-6">
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
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
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
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={ecommerceSettings.tax_rate}
                    onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, tax_rate: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    step="0.01"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default Shipping Cost
                  </label>
                  <input
                    type="number"
                    value={ecommerceSettings.default_shipping_cost}
                    onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, default_shipping_cost: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Free Shipping Threshold
                  </label>
                  <input
                    type="number"
                    value={ecommerceSettings.free_shipping_threshold}
                    onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, free_shipping_threshold: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    step="0.01"
                    min="0"
                  />
                </div>

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
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Taxes
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Apply taxes to products
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

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Shipping
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Calculate shipping costs
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

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Coupons
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Allow discount codes
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
                      Stock Management
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
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
              </div>

              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Ecommerce Settings</span>
              </button>
            </form>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Payment Gateway Settings</h3>
            <form onSubmit={handlePaymentSettingsSubmit} className="space-y-6">
              {/* Stripe Settings */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="currentColor">
                        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Stripe</h4>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentSettings.payment_methods.stripe.enabled}
                      onChange={(e) => setPaymentSettings({
                        ...paymentSettings,
                        payment_methods: {
                          ...paymentSettings.payment_methods,
                          stripe: {
                            ...paymentSettings.payment_methods.stripe,
                            enabled: e.target.checked
                          }
                        }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {paymentSettings.payment_methods.stripe.enabled && (
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="stripe_test_mode"
                        checked={paymentSettings.payment_methods.stripe.test_mode}
                        onChange={(e) => setPaymentSettings({
                          ...paymentSettings,
                          payment_methods: {
                            ...paymentSettings.payment_methods,
                            stripe: {
                              ...paymentSettings.payment_methods.stripe,
                              test_mode: e.target.checked
                            }
                          }
                        })}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="stripe_test_mode" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Test Mode
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Public Key
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.payment_methods.stripe.public_key}
                        onChange={(e) => setPaymentSettings({
                          ...paymentSettings,
                          payment_methods: {
                            ...paymentSettings.payment_methods,
                            stripe: {
                              ...paymentSettings.payment_methods.stripe,
                              public_key: e.target.value
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="pk_test_..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Secret Key
                      </label>
                      <input
                        type="password"
                        value={paymentSettings.payment_methods.stripe.secret_key}
                        onChange={(e) => setPaymentSettings({
                          ...paymentSettings,
                          payment_methods: {
                            ...paymentSettings.payment_methods,
                            stripe: {
                              ...paymentSettings.payment_methods.stripe,
                              secret_key: e.target.value
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="sk_test_..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Webhook Secret
                      </label>
                      <input
                        type="password"
                        value={paymentSettings.payment_methods.stripe.webhook_secret}
                        onChange={(e) => setPaymentSettings({
                          ...paymentSettings,
                          payment_methods: {
                            ...paymentSettings.payment_methods,
                            stripe: {
                              ...paymentSettings.payment_methods.stripe,
                              webhook_secret: e.target.value
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="whsec_..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Payment Description
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.payment_methods.stripe.payment_description}
                        onChange={(e) => setPaymentSettings({
                          ...paymentSettings,
                          payment_methods: {
                            ...paymentSettings.payment_methods,
                            stripe: {
                              ...paymentSettings.payment_methods.stripe,
                              payment_description: e.target.value
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Payment for order #{{order_id}}"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* PayPal Settings */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 4.643-5.783 4.643h-2.189c-.11 0-.203.077-.219.185l-.305 1.938h3.777c.21 0 .38.168.367.377l-.048.692a.383.383 0 0 1-.378.338h-3.73l-.44 2.786c-.024.167-.175.29-.345.29h-2.276a.208.208 0 0 1-.205-.243l.47-2.98a.384.384 0 0 1 .378-.337h3.731c.209 0 .38-.168.367-.377l.048-.692a.383.383 0 0 0-.367-.377h-3.677c-.209 0-.38.168-.367.377l.172 2.461c.024.167-.113.338-.283.338h-2.338a.208.208 0 0 1-.205-.243l.352-2.224a.383.383 0 0 0-.378-.338h-.295a.208.208 0 0 1-.205-.243l.097-.616a.384.384 0 0 1 .378-.338h.341c.21 0 .38-.168.367-.377l.447-2.835c.106-.673.691-1.17 1.371-1.17h2.189c1.85 0 3.069-.593 3.782-1.85-.811-.488-1.94-.74-3.361-.74H6.54l-1.155 7.322a.383.383 0 0 0 .378.445h4.545c.21 0 .38-.168.367-.377l.447-2.835c.106-.673.691-1.17 1.371-1.17h2.189c3.659 0 5.93-1.817 6.699-5.32.34-1.557.152-2.811-.659-3.699z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">PayPal</h4>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentSettings.payment_methods.paypal.enabled}
                      onChange={(e) => setPaymentSettings({
                        ...paymentSettings,
                        payment_methods: {
                          ...paymentSettings.payment_methods,
                          paypal: {
                            ...paymentSettings.payment_methods.paypal,
                            enabled: e.target.checked
                          }
                        }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {paymentSettings.payment_methods.paypal.enabled && (
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="paypal_test_mode"
                        checked={paymentSettings.payment_methods.paypal.test_mode}
                        onChange={(e) => setPaymentSettings({
                          ...paymentSettings,
                          payment_methods: {
                            ...paymentSettings.payment_methods,
                            paypal: {
                              ...paymentSettings.payment_methods.paypal,
                              test_mode: e.target.checked
                            }
                          }
                        })}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="paypal_test_mode" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Sandbox Mode
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Client ID
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.payment_methods.paypal.client_id}
                        onChange={(e) => setPaymentSettings({
                          ...paymentSettings,
                          payment_methods: {
                            ...paymentSettings.payment_methods,
                            paypal: {
                              ...paymentSettings.payment_methods.paypal,
                              client_id: e.target.value
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Client ID"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Client Secret
                      </label>
                      <input
                        type="password"
                        value={paymentSettings.payment_methods.paypal.client_secret}
                        onChange={(e) => setPaymentSettings({
                          ...paymentSettings,
                          payment_methods: {
                            ...paymentSettings.payment_methods,
                            paypal: {
                              ...paymentSettings.payment_methods.paypal,
                              client_secret: e.target.value
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Client Secret"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Payment Description
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.payment_methods.paypal.payment_description}
                        onChange={(e) => setPaymentSettings({
                          ...paymentSettings,
                          payment_methods: {
                            ...paymentSettings.payment_methods,
                            paypal: {
                              ...paymentSettings.payment_methods.paypal,
                              payment_description: e.target.value
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Payment for order #{{order_id}}"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Bank Transfer Settings */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Bank Transfer</h4>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentSettings.payment_methods.bank_transfer.enabled}
                      onChange={(e) => setPaymentSettings({
                        ...paymentSettings,
                        payment_methods: {
                          ...paymentSettings.payment_methods,
                          bank_transfer: {
                            ...paymentSettings.payment_methods.bank_transfer,
                            enabled: e.target.checked
                          }
                        }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {paymentSettings.payment_methods.bank_transfer.enabled && (
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Account Details
                      </label>
                      <textarea
                        value={paymentSettings.payment_methods.bank_transfer.account_details}
                        onChange={(e) => setPaymentSettings({
                          ...paymentSettings,
                          payment_methods: {
                            ...paymentSettings.payment_methods,
                            bank_transfer: {
                              ...paymentSettings.payment_methods.bank_transfer,
                              account_details: e.target.value
                            }
                          }
                        })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Bank: Example Bank
Account Name: Your Company Name
Account Number: 1234567890
Sort Code: 12-34-56"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Payment Instructions
                      </label>
                      <textarea
                        value={paymentSettings.payment_methods.bank_transfer.payment_instructions}
                        onChange={(e) => setPaymentSettings({
                          ...paymentSettings,
                          payment_methods: {
                            ...paymentSettings.payment_methods,
                            bank_transfer: {
                              ...paymentSettings.payment_methods.bank_transfer,
                              payment_instructions: e.target.value
                            }
                          }
                        })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Please transfer the total amount to our bank account. Your order will be processed once the payment is received."
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Payment Settings</span>
              </button>
            </form>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Analytics Settings</h3>
            <form onSubmit={handleAnalyticsSettingsSubmit} className="space-y-6">
              {/* Google Analytics */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <BarChart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Google Analytics</h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Google Analytics ID
                    </label>
                    <input
                      type="text"
                      value={analyticsSettings.google_analytics_id}
                      onChange={(e) => setAnalyticsSettings({
                        ...analyticsSettings,
                        google_analytics_id: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
                    />
                  </div>

                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="ga_v4"
                      checked={analyticsSettings.google_analytics_v4}
                      onChange={(e) => setAnalyticsSettings({
                        ...analyticsSettings,
                        google_analytics_v4: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="ga_v4" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Google Analytics 4 (GA4)
                    </label>
                  </div>

                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="enhanced_ecommerce"
                      checked={analyticsSettings.enable_enhanced_ecommerce}
                      onChange={(e) => setAnalyticsSettings({
                        ...analyticsSettings,
                        enable_enhanced_ecommerce: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="enhanced_ecommerce" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Enable Enhanced Ecommerce
                    </label>
                  </div>
                </div>
              </div>

              {/* Facebook Pixel */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Facebook Pixel</h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Facebook Pixel ID
                    </label>
                    <input
                      type="text"
                      value={analyticsSettings.facebook_pixel_id}
                      onChange={(e) => setAnalyticsSettings({
                        ...analyticsSettings,
                        facebook_pixel_id: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="XXXXXXXXXXXXXXXXXX"
                    />
                  </div>

                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="fb_events"
                      checked={analyticsSettings.enable_facebook_events}
                      onChange={(e) => setAnalyticsSettings({
                        ...analyticsSettings,
                        enable_facebook_events: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="fb_events" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Enable Facebook Events
                    </label>
                  </div>
                </div>
              </div>

              {/* Other Analytics Tools */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <LineChart className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Other Analytics Tools</h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hotjar ID
                    </label>
                    <input
                      type="text"
                      value={analyticsSettings.hotjar_id}
                      onChange={(e) => setAnalyticsSettings({
                        ...analyticsSettings,
                        hotjar_id: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="XXXXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Microsoft Clarity ID
                    </label>
                    <input
                      type="text"
                      value={analyticsSettings.microsoft_clarity_id}
                      onChange={(e) => setAnalyticsSettings({
                        ...analyticsSettings,
                        microsoft_clarity_id: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="XXXXXXX"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Privacy Settings</h4>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="cookie_consent"
                      checked={analyticsSettings.cookie_consent_required}
                      onChange={(e) => setAnalyticsSettings({
                        ...analyticsSettings,
                        cookie_consent_required: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="cookie_consent" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Require Cookie Consent
                    </label>
                  </div>

                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="anonymize_ip"
                      checked={analyticsSettings.anonymize_ip}
                      onChange={(e) => setAnalyticsSettings({
                        ...analyticsSettings,
                        anonymize_ip: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="anonymize_ip" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Anonymize IP Addresses
                    </label>
                  </div>

                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="user_tracking"
                      checked={analyticsSettings.enable_user_tracking}
                      onChange={(e) => setAnalyticsSettings({
                        ...analyticsSettings,
                        enable_user_tracking: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="user_tracking" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Enable User Tracking
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Analytics Settings</span>
              </button>
            </form>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">SEO Settings</h3>
            <form onSubmit={handleSiteInfoSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Meta Title
                </label>
                <input
                  type="text"
                  value={siteData.seo_title || siteData.site_name}
                  onChange={(e) => setSiteData({ ...siteData, seo_title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Your Site Name - Tagline"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Used when no specific meta title is provided for a page
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Meta Description
                </label>
                <textarea
                  value={siteData.seo_description || siteData.description}
                  onChange={(e) => setSiteData({ ...siteData, seo_description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Brief description of your site for search engines"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={siteData.seo_keywords || ''}
                  onChange={(e) => setSiteData({ ...siteData, seo_keywords: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Open Graph Image
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="url"
                    value={siteData.og_image || ''}
                    onChange={(e) => setSiteData({ ...siteData, og_image: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="https://example.com/og-image.jpg"
                  />
                  <button
                    type="button"
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Used for social media sharing when no specific image is provided
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Robots.txt Content
                </label>
                <textarea
                  value={siteData.robots_txt || `User-agent: *\nAllow: /`}
                  onChange={(e) => setSiteData({ ...siteData, robots_txt: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Structured Data (JSON-LD)
                </label>
                <textarea
                  value={siteData.structured_data || `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "${siteData.site_name}",
  "url": "https://example.com",
  "logo": "${siteData.logo_light}"
}`}
                  onChange={(e) => setSiteData({ ...siteData, structured_data: e.target.value })}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
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
                    checked={siteData.enable_sitemap || true}
                    onChange={(e) => setSiteData({ ...siteData, enable_sitemap: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save SEO Settings</span>
              </button>
            </form>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Advanced Settings</h3>
            <form onSubmit={handleSiteInfoSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Head Code
                </label>
                <textarea
                  value={siteData.custom_head_code}
                  onChange={(e) => setSiteData({ ...siteData, custom_head_code: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                  placeholder="Custom HTML code to be inserted in the <head> section"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Add custom meta tags, CSS, or JavaScript that should be loaded in the head section.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Footer Code
                </label>
                <textarea
                  value={siteData.custom_footer_code}
                  onChange={(e) => setSiteData({ ...siteData, custom_footer_code: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                  placeholder="Custom HTML code to be inserted before the closing </body> tag"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Add custom JavaScript, tracking codes, or other scripts that should be loaded at the end of the page.
                </p>
              </div>

              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Advanced Settings</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;