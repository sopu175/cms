import React, { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  DollarSign,
  Percent,
  TruckIcon,
  Tag,
  ShoppingBag,
  Shield,
  AlertTriangle,
  FileText,
  Code,
  ExternalLink
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useSiteInfo } from '../hooks/useSiteInfo';

const Settings: React.FC = () => {
  const { settings, loading: settingsLoading, updateSettings } = useSettings();
  const { siteInfo, loading: siteInfoLoading, updateSiteInfo } = useSiteInfo();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    site_name: '',
    tagline: '',
    description: '',
    contact_email: '',
    phone: '',
    address: ''
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

  // Social media settings
  const [socialMedia, setSocialMedia] = useState<any[]>([]);

  // Ecommerce settings
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
    default_shipping_cost: 10
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

  // Maintenance settings
  const [maintenanceSettings, setMaintenanceSettings] = useState({
    maintenance_mode: false,
    maintenance_message: 'We are currently performing maintenance. Please check back soon.'
  });

  // Documentation settings
  const [docsSettings, setDocsSettings] = useState({
    cms_documentation_version: '1.0',
    api_documentation_version: '1.0',
    show_documentation_links: true
  });

  // Available currencies
  const [availableCurrencies, setAvailableCurrencies] = useState<any[]>([]);

  useEffect(() => {
    if (!settingsLoading && settings) {
      // Parse settings
      setGeneralSettings({
        site_name: siteInfo?.site_name || '',
        tagline: siteInfo?.tagline || '',
        description: siteInfo?.description || '',
        contact_email: siteInfo?.contact_email || '',
        phone: siteInfo?.phone || '',
        address: siteInfo?.address || ''
      });

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

      setSocialMedia(siteInfo?.social_icons || []);

      setEcommerceSettings({
        enable_ecommerce: settings.enable_ecommerce !== false,
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
        default_shipping_cost: settings.default_shipping_cost || 10
      });

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

      setMaintenanceSettings({
        maintenance_mode: siteInfo?.maintenance_mode === true,
        maintenance_message: siteInfo?.maintenance_message || 'We are currently performing maintenance. Please check back soon.'
      });

      setDocsSettings({
        cms_documentation_version: settings.cms_documentation_version || '1.0',
        api_documentation_version: settings.api_documentation_version || '1.0',
        show_documentation_links: settings.show_documentation_links !== false
      });

      // Parse available currencies
      if (settings.available_currencies) {
        try {
          setAvailableCurrencies(settings.available_currencies);
        } catch (e) {
          console.error('Error parsing available currencies:', e);
          setAvailableCurrencies([]);
        }
      }
    }
  }, [settings, siteInfo, settingsLoading, siteInfoLoading]);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      // Update site info
      const siteInfoResult = await updateSiteInfo({
        site_name: generalSettings.site_name,
        tagline: generalSettings.tagline,
        description: generalSettings.description,
        contact_email: generalSettings.contact_email,
        phone: generalSettings.phone,
        address: generalSettings.address,
        social_icons: socialMedia,
        maintenance_mode: maintenanceSettings.maintenance_mode,
        maintenance_message: maintenanceSettings.maintenance_message
      });

      if (!siteInfoResult.success) {
        throw new Error(siteInfoResult.error || 'Failed to update site info');
      }

      // Update settings
      const settingsResult = await updateSettings({
        // SEO settings
        meta_title: seoSettings.meta_title,
        meta_description: seoSettings.meta_description,
        meta_keywords: seoSettings.meta_keywords,
        google_analytics_id: seoSettings.google_analytics_id,
        facebook_pixel_id: seoSettings.facebook_pixel_id,
        google_tag_manager_id: seoSettings.google_tag_manager_id,
        robots_txt: seoSettings.robots_txt,
        enable_sitemap: seoSettings.enable_sitemap,

        // Ecommerce settings
        enable_ecommerce: ecommerceSettings.enable_ecommerce,
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

        // Documentation settings
        cms_documentation_version: docsSettings.cms_documentation_version,
        api_documentation_version: docsSettings.api_documentation_version,
        show_documentation_links: docsSettings.show_documentation_links
      });

      if (!settingsResult.success) {
        throw new Error(settingsResult.error || 'Failed to update settings');
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const updateSocialMedia = (index: number, field: string, value: string) => {
    const updatedSocialMedia = [...socialMedia];
    updatedSocialMedia[index] = {
      ...updatedSocialMedia[index],
      [field]: value
    };
    setSocialMedia(updatedSocialMedia);
  };

  const addSocialMedia = () => {
    setSocialMedia([
      ...socialMedia,
      {
        id: Date.now().toString(),
        platform: 'facebook',
        url: '',
        icon: 'facebook'
      }
    ]);
  };

  const removeSocialMedia = (index: number) => {
    const updatedSocialMedia = [...socialMedia];
    updatedSocialMedia.splice(index, 1);
    setSocialMedia(updatedSocialMedia);
  };

  const updatePhone = (index: number, field: string, value: string) => {
    const updatedSiteInfo = { ...siteInfo };
    if (!updatedSiteInfo.contact_info) {
      updatedSiteInfo.contact_info = [];
    }
    
    if (!updatedSiteInfo.contact_info[0]) {
      updatedSiteInfo.contact_info[0] = {
        id: "1",
        label: "Main Office",
        address: "",
        map_url: "",
        emails: [],
        phones: []
      };
    }
    
    if (!updatedSiteInfo.contact_info[0].phones) {
      updatedSiteInfo.contact_info[0].phones = [];
    }
    
    if (!updatedSiteInfo.contact_info[0].phones[index]) {
      updatedSiteInfo.contact_info[0].phones[index] = { label: "", link: "" };
    }
    
    updatedSiteInfo.contact_info[0].phones[index][field] = value;
    
    // Update the site info state
    // This would typically call a function like setSiteInfo(updatedSiteInfo)
    // But since we're not directly managing the siteInfo state in this component,
    // we'll need to handle this differently
  };

  const getCurrencySymbol = (code: string) => {
    const currency = availableCurrencies.find(c => c.code === code);
    return currency ? currency.symbol : '৳';
  };

  const openCmsDocumentation = () => {
    window.open('/docs/cms', '_blank');
  };

  const openApiDocumentation = () => {
    window.open('/docs/api', '_blank');
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
        <div className="flex items-center space-x-3">
          <button
            onClick={openCmsDocumentation}
            className="flex items-center space-x-2 px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
          >
            <FileText className="w-4 h-4" />
            <span>CMS Docs</span>
          </button>
          <button
            onClick={openApiDocumentation}
            className="flex items-center space-x-2 px-4 py-2 border border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
          >
            <Code className="w-4 h-4" />
            <span>API Docs</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-green-100 border border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400 px-4 py-3 rounded-lg">
          Settings saved successfully!
        </div>
      )}

      {saveError && (
        <div className="bg-red-100 border border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          Error: {saveError}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-4 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'general'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('logo')}
            className={`pb-4 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'logo'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Logo & Branding
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`pb-4 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'contact'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Contact Info
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`pb-4 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'social'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Social Media
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`pb-4 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'seo'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            SEO & Analytics
          </button>
          <button
            onClick={() => setActiveTab('ecommerce')}
            className={`pb-4 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'ecommerce'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Ecommerce
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`pb-4 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'email'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-4 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`pb-4 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'maintenance'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">General Settings</h3>
            
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
          </div>
        )}

        {activeTab === 'logo' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Logo & Branding</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Logo
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={siteInfo?.logo_url || ''}
                    onChange={(e) => updateSiteInfo({ logo_url: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Logo URL"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Upload
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Light Mode Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={siteInfo?.logo_light || ''}
                      onChange={(e) => updateSiteInfo({ logo_light: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Light logo URL"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Upload
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dark Mode Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={siteInfo?.logo_dark || ''}
                      onChange={(e) => updateSiteInfo({ logo_dark: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Dark logo URL"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Favicon
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={siteInfo?.favicon || ''}
                    onChange={(e) => updateSiteInfo({ favicon: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Favicon URL"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Email
                </label>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="email"
                    value={generalSettings.contact_email}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, contact_email: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="tel"
                    value={generalSettings.phone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-1" />
                <textarea
                  value={generalSettings.address}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                  rows={3}
                  className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Social Media</h3>
            
            <div className="space-y-4">
              {socialMedia.map((social, index) => (
                <div key={social.id} className="flex items-center space-x-4">
                  <select
                    value={social.platform}
                    onChange={(e) => updateSocialMedia(index, 'platform', e.target.value)}
                    className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="facebook">Facebook</option>
                    <option value="twitter">Twitter</option>
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="youtube">YouTube</option>
                    <option value="pinterest">Pinterest</option>
                    <option value="tiktok">TikTok</option>
                  </select>
                  <input
                    type="url"
                    value={social.url}
                    onChange={(e) => updateSocialMedia(index, 'url', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="https://example.com"
                  />
                  <button
                    type="button"
                    onClick={() => removeSocialMedia(index)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addSocialMedia}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <span>Add Social Media</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SEO & Analytics</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={seoSettings.meta_title}
                  onChange={(e) => setSeoSettings({ ...seoSettings, meta_title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={seoSettings.meta_description}
                  onChange={(e) => setSeoSettings({ ...seoSettings, meta_description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={seoSettings.meta_keywords}
                  onChange={(e) => setSeoSettings({ ...seoSettings, meta_keywords: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
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
                    placeholder="G-XXXXXXXXXX"
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
          </div>
        )}

        {activeTab === 'ecommerce' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ecommerce Settings</h3>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-md font-medium text-blue-800 dark:text-blue-300">Enable Ecommerce</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Turn on/off all ecommerce features (products, orders, reviews, coupons)
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Currency
                </label>
                <select
                  value={ecommerceSettings.currency}
                  onChange={(e) => {
                    const code = e.target.value;
                    setEcommerceSettings({
                      ...ecommerceSettings,
                      currency: code,
                      currency_symbol: getCurrencySymbol(code)
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {availableCurrencies.map((currency) => (
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency Position
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
                  Decimal Places
                </label>
                <input
                  type="number"
                  min="0"
                  max="4"
                  value={ecommerceSettings.decimal_places}
                  onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, decimal_places: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enable_taxes"
                checked={ecommerceSettings.enable_taxes}
                onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, enable_taxes: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="enable_taxes" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Enable Taxes
              </label>
            </div>

            {ecommerceSettings.enable_taxes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={ecommerceSettings.tax_rate}
                  onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, tax_rate: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enable_shipping"
                checked={ecommerceSettings.enable_shipping}
                onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, enable_shipping: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="enable_shipping" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Enable Shipping
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
                      min="0"
                      step="0.01"
                      value={ecommerceSettings.default_shipping_cost}
                      onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, default_shipping_cost: parseFloat(e.target.value) })}
                      className="w-full pl-7 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
                      min="0"
                      step="0.01"
                      value={ecommerceSettings.free_shipping_threshold}
                      onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, free_shipping_threshold: parseFloat(e.target.value) })}
                      className="w-full pl-7 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'email' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Settings</h3>
            
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="enable_email_notifications"
                checked={emailSettings.enable_email_notifications}
                onChange={(e) => setEmailSettings({ ...emailSettings, enable_email_notifications: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="enable_email_notifications" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Enable Email Notifications
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
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">SMTP Settings</h4>
                  
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
                      />
                    </div>
                  </div>

                  <div className="mt-4">
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
              </>
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security Settings</h3>
            
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
                  Allow User Registration
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="social_login_enabled"
                  checked={securitySettings.social_login_enabled}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, social_login_enabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="social_login_enabled" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Enable Social Login
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
                  Enable CAPTCHA on Forms
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enable_2fa"
                  checked={securitySettings.enable_2fa}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, enable_2fa: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="enable_2fa" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Enable Two-Factor Authentication
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Password Length
                </label>
                <input
                  type="number"
                  min="6"
                  max="32"
                  value={securitySettings.password_min_length}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, password_min_length: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  value={securitySettings.session_timeout}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, session_timeout: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="password_requires_special"
                  checked={securitySettings.password_requires_special}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, password_requires_special: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="password_requires_special" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Require Special Characters in Passwords
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="password_requires_number"
                  checked={securitySettings.password_requires_number}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, password_requires_number: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="password_requires_number" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Require Numbers in Passwords
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Maintenance Mode</h3>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  When maintenance mode is enabled, your site will be inaccessible to regular visitors. Only administrators will be able to access the site.
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenance_mode"
                checked={maintenanceSettings.maintenance_mode}
                onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, maintenance_mode: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="maintenance_mode" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Enable Maintenance Mode
              </label>
            </div>

            {maintenanceSettings.maintenance_mode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maintenance Message
                </label>
                <textarea
                  value={maintenanceSettings.maintenance_message}
                  onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, maintenance_message: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;