import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Image, 
  DollarSign, 
  ShieldCheck, 
  AlertTriangle,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Link,
  Code
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useSiteInfo } from '../hooks/useSiteInfo';
import { ContactInfo } from '../types';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const { siteInfo, updateSiteInfo } = useSiteInfo();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    site_name: '',
    description: '',
    tagline: '',
    contact_name: '',
    address: '',
    google_maps_link: '',
    google_maps_embed: '',
    contact_info: [] as ContactInfo[],
    logo_url: '',
    logo_light: '',
    logo_dark: '',
    favicon: '',
    social_icons: [],
    copyright_text: '',
    google_analytics: '',
    facebook_pixel: '',
    google_tag_manager: '',
    custom_head_code: '',
    custom_footer_code: '',
    maintenance_mode: false,
    maintenance_message: '',
    currency: 'USD',
    currency_symbol: '$',
    enable_taxes: false,
    tax_rate: 0,
    enable_shipping: true,
    free_shipping_threshold: 100,
    default_shipping_cost: 10,
    enable_coupons: true,
    enable_reviews: true,
    enable_wishlist: true,
    stock_management: true,
    low_stock_threshold: 5,
    enable_ecommerce: true
  });

  useEffect(() => {
    if (siteInfo) {
      setFormData(prev => ({
        ...prev,
        site_name: siteInfo.site_name || '',
        description: siteInfo.description || '',
        tagline: siteInfo.tagline || '',
        contact_name: siteInfo.contact_name || '',
        address: siteInfo.address || '',
        google_maps_link: siteInfo.google_maps_link || '',
        google_maps_embed: siteInfo.google_maps_embed || '',
        contact_info: siteInfo.contact_info || [],
        logo_url: siteInfo.logo_url || '',
        logo_light: siteInfo.logo_light || '',
        logo_dark: siteInfo.logo_dark || '',
        favicon: siteInfo.favicon || '',
        social_icons: siteInfo.social_icons || [],
        copyright_text: siteInfo.copyright_text || '',
        google_analytics: siteInfo.google_analytics || '',
        facebook_pixel: siteInfo.facebook_pixel || '',
        google_tag_manager: siteInfo.google_tag_manager || '',
        custom_head_code: siteInfo.custom_head_code || '',
        custom_footer_code: siteInfo.custom_footer_code || '',
        maintenance_mode: siteInfo.maintenance_mode || false,
        maintenance_message: siteInfo.maintenance_message || ''
      }));
    }
  }, [siteInfo]);

  useEffect(() => {
    if (settings) {
      setFormData(prev => ({
        ...prev,
        currency: settings.currency || 'USD',
        currency_symbol: settings.currency_symbol || '$',
        enable_taxes: settings.enable_taxes || false,
        tax_rate: settings.tax_rate || 0,
        enable_shipping: settings.enable_shipping !== false,
        free_shipping_threshold: settings.free_shipping_threshold || 100,
        default_shipping_cost: settings.default_shipping_cost || 10,
        enable_coupons: settings.enable_coupons !== false,
        enable_reviews: settings.enable_reviews !== false,
        enable_wishlist: settings.enable_wishlist !== false,
        stock_management: settings.stock_management !== false,
        low_stock_threshold: settings.low_stock_threshold || 5,
        enable_ecommerce: settings.enable_ecommerce !== false
      }));
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update site info
      await updateSiteInfo({
        site_name: formData.site_name,
        description: formData.description,
        tagline: formData.tagline,
        contact_name: formData.contact_name,
        address: formData.address,
        google_maps_link: formData.google_maps_link,
        google_maps_embed: formData.google_maps_embed,
        contact_info: formData.contact_info,
        logo_url: formData.logo_url,
        logo_light: formData.logo_light,
        logo_dark: formData.logo_dark,
        favicon: formData.favicon,
        social_icons: formData.social_icons,
        copyright_text: formData.copyright_text,
        google_analytics: formData.google_analytics,
        facebook_pixel: formData.facebook_pixel,
        google_tag_manager: formData.google_tag_manager,
        custom_head_code: formData.custom_head_code,
        custom_footer_code: formData.custom_footer_code,
        maintenance_mode: formData.maintenance_mode,
        maintenance_message: formData.maintenance_message
      });

      // Update settings
      await updateSettings({
        currency: formData.currency,
        currency_symbol: formData.currency_symbol,
        enable_taxes: formData.enable_taxes,
        tax_rate: formData.tax_rate,
        enable_shipping: formData.enable_shipping,
        free_shipping_threshold: formData.free_shipping_threshold,
        default_shipping_cost: formData.default_shipping_cost,
        enable_coupons: formData.enable_coupons,
        enable_reviews: formData.enable_reviews,
        enable_wishlist: formData.enable_wishlist,
        stock_management: formData.stock_management,
        low_stock_threshold: formData.low_stock_threshold,
        enable_ecommerce: formData.enable_ecommerce
      });

      alert('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const addContactInfo = (type: 'email' | 'phone') => {
    setFormData(prev => ({
      ...prev,
      contact_info: [
        ...prev.contact_info,
        { type, label: type === 'email' ? 'Work' : 'Office', value: '' }
      ]
    }));
  };

  const updateContactInfo = (index: number, field: keyof ContactInfo, value: string) => {
    setFormData(prev => {
      const updatedContactInfo = [...prev.contact_info];
      updatedContactInfo[index] = {
        ...updatedContactInfo[index],
        [field]: value
      };
      return {
        ...prev,
        contact_info: updatedContactInfo
      };
    });
  };

  const removeContactInfo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contact_info: prev.contact_info.filter((_, i) => i !== index)
    }));
  };

  const addSocialIcon = () => {
    setFormData(prev => ({
      ...prev,
      social_icons: [
        ...prev.social_icons,
        { name: 'Facebook', icon: 'facebook', url: '' }
      ]
    }));
  };

  const updateSocialIcon = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updatedSocialIcons = [...prev.social_icons];
      updatedSocialIcons[index] = {
        ...updatedSocialIcons[index],
        [field]: value
      };
      return {
        ...prev,
        social_icons: updatedSocialIcons
      };
    });
  };

  const removeSocialIcon = (index: number) => {
    setFormData(prev => ({
      ...prev,
      social_icons: prev.social_icons.filter((_, i) => i !== index)
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'logo', label: 'Logo & Branding', icon: Image },
    { id: 'contact', label: 'Contact Info', icon: Mail },
    { id: 'social', label: 'Social Media', icon: Link },
    { id: 'seo', label: 'SEO & Analytics', icon: SettingsIcon },
    { id: 'ecommerce', label: 'Ecommerce', icon: DollarSign },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'maintenance', label: 'Maintenance', icon: AlertTriangle }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">Configure your site settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
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
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://example.com/logo.png"
                />
                {formData.logo_url && (
                  <div className="mt-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 w-32 h-32 flex items-center justify-center">
                    <img src={formData.logo_url} alt="Logo" className="max-w-full max-h-full" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Favicon URL
                </label>
                <input
                  type="url"
                  value={formData.favicon}
                  onChange={(e) => setFormData({ ...formData, favicon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://example.com/favicon.ico"
                />
                {formData.favicon && (
                  <div className="mt-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 w-16 h-16 flex items-center justify-center">
                    <img src={formData.favicon} alt="Favicon" className="max-w-full max-h-full" />
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
                  value={formData.logo_light}
                  onChange={(e) => setFormData({ ...formData, logo_light: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://example.com/logo-light.png"
                />
                {formData.logo_light && (
                  <div className="mt-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white w-32 h-32 flex items-center justify-center">
                    <img src={formData.logo_light} alt="Light Logo" className="max-w-full max-h-full" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dark Mode Logo URL
                </label>
                <input
                  type="url"
                  value={formData.logo_dark}
                  onChange={(e) => setFormData({ ...formData, logo_dark: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://example.com/logo-dark.png"
                />
                {formData.logo_dark && (
                  <div className="mt-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-900 w-32 h-32 flex items-center justify-center">
                    <img src={formData.logo_dark} alt="Dark Logo" className="max-w-full max-h-full" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Name
              </label>
              <input
                type="text"
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Organization or Contact Person Name"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Addresses
                </label>
                <button
                  type="button"
                  onClick={() => addContactInfo('email')}
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Email</span>
                </button>
              </div>
              
              {formData.contact_info.filter(info => info.type === 'email').length > 0 ? (
                <div className="space-y-3">
                  {formData.contact_info.map((info, index) => {
                    if (info.type !== 'email') return null;
                    return (
                      <div key={`email-${index}`} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={info.label}
                          onChange={(e) => updateContactInfo(index, 'label', e.target.value)}
                          className="w-1/4 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Label"
                        />
                        <input
                          type="email"
                          value={info.value}
                          onChange={(e) => updateContactInfo(index, 'value', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="email@example.com"
                        />
                        <button
                          type="button"
                          onClick={() => removeContactInfo(index)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  <Mail className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No email addresses added</p>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Numbers
                </label>
                <button
                  type="button"
                  onClick={() => addContactInfo('phone')}
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Phone</span>
                </button>
              </div>
              
              {formData.contact_info.filter(info => info.type === 'phone').length > 0 ? (
                <div className="space-y-3">
                  {formData.contact_info.map((info, index) => {
                    if (info.type !== 'phone') return null;
                    return (
                      <div key={`phone-${index}`} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={info.label}
                          onChange={(e) => updateContactInfo(index, 'label', e.target.value)}
                          className="w-1/4 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Label"
                        />
                        <input
                          type="tel"
                          value={info.value}
                          onChange={(e) => updateContactInfo(index, 'value', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="+1 (555) 123-4567"
                        />
                        <button
                          type="button"
                          onClick={() => removeContactInfo(index)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  <Phone className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No phone numbers added</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="123 Main St, City, Country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Google Maps Link
              </label>
              <input
                type="url"
                value={formData.google_maps_link}
                onChange={(e) => setFormData({ ...formData, google_maps_link: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="https://goo.gl/maps/example"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Google Maps Embed Code
              </label>
              <textarea
                value={formData.google_maps_embed}
                onChange={(e) => setFormData({ ...formData, google_maps_embed: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                placeholder='<iframe src="https://www.google.com/maps/embed?..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
              />
              {formData.google_maps_embed && (
                <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div dangerouslySetInnerHTML={{ __html: formData.google_maps_embed }} />
                </div>
              )}
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
            
            {formData.social_icons.length > 0 ? (
              <div className="space-y-4">
                {formData.social_icons.map((social, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={social.name}
                      onChange={(e) => updateSocialIcon(index, 'name', e.target.value)}
                      className="w-1/4 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Platform Name"
                    />
                    <input
                      type="text"
                      value={social.icon}
                      onChange={(e) => updateSocialIcon(index, 'icon', e.target.value)}
                      className="w-1/4 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Icon Name"
                    />
                    <input
                      type="url"
                      value={social.url}
                      onChange={(e) => updateSocialIcon(index, 'url', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="https://example.com/profile"
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
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <Link className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No social media links added</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Add your social media profiles</p>
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
                  SEO Title
                </label>
                <input
                  type="text"
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Default SEO Title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  value={formData.seo_keywords}
                  onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
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
                value={formData.seo_description}
                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Default meta description for your site"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Open Graph Image URL
              </label>
              <input
                type="url"
                value={formData.og_image}
                onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="https://example.com/og-image.jpg"
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Head Code
              </label>
              <textarea
                value={formData.custom_head_code}
                onChange={(e) => setFormData({ ...formData, custom_head_code: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                placeholder="<!-- Custom code to be added to the <head> section -->"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Footer Code
              </label>
              <textarea
                value={formData.custom_footer_code}
                onChange={(e) => setFormData({ ...formData, custom_footer_code: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                placeholder="<!-- Custom code to be added before the closing </body> tag -->"
              />
            </div>
          </div>
        )}

        {activeTab === 'ecommerce' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ecommerce Settings</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Enable Ecommerce</span>
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                  <option value="JPY">Japanese Yen (JPY)</option>
                  <option value="CAD">Canadian Dollar (CAD)</option>
                  <option value="AUD">Australian Dollar (AUD)</option>
                  <option value="INR">Indian Rupee (INR)</option>
                  <option value="BDT">Bangladeshi Taka (BDT)</option>
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
                  placeholder="$"
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
                    checked={formData.enable_taxes}
                    onChange={(e) => setFormData({ ...formData, enable_taxes: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {formData.enable_taxes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={formData.tax_rate}
                    onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    min="0"
                    max="100"
                    step="0.01"
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
                    Add shipping options to checkout
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enable_shipping}
                    onChange={(e) => setFormData({ ...formData, enable_shipping: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
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
                        min="0"
                        step="0.01"
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
                    Allow discount coupons
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enable_coupons}
                    onChange={(e) => setFormData({ ...formData, enable_coupons: e.target.checked })}
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
                    checked={formData.enable_reviews}
                    onChange={(e) => setFormData({ ...formData, enable_reviews: e.target.checked })}
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
                    Allow product wishlists
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enable_wishlist}
                    onChange={(e) => setFormData({ ...formData, enable_wishlist: e.target.checked })}
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
                    checked={formData.stock_management}
                    onChange={(e) => setFormData({ ...formData, stock_management: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {formData.stock_management && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  value={formData.low_stock_threshold}
                  onChange={(e) => setFormData({ ...formData, low_stock_threshold: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  min="0"
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'email' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Email Settings</h3>
            
            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
              <h4 className="text-md font-medium text-blue-800 dark:text-blue-300 mb-3">Email Configuration</h4>
              <p className="text-sm text-blue-700 dark:text-blue-400 mb-4">
                Email settings are managed through your Supabase project. To configure email:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700 dark:text-blue-400">
                <li>Go to your Supabase project dashboard</li>
                <li>Navigate to Authentication → Email Templates</li>
                <li>Customize your email templates for various actions</li>
                <li>Set up SMTP credentials in the Email Settings section</li>
              </ol>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h3>
            
            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
              <h4 className="text-md font-medium text-blue-800 dark:text-blue-300 mb-3">Security Configuration</h4>
              <p className="text-sm text-blue-700 dark:text-blue-400 mb-4">
                Security settings are managed through your Supabase project. To configure security:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700 dark:text-blue-400">
                <li>Go to your Supabase project dashboard</li>
                <li>Navigate to Authentication → Settings</li>
                <li>Configure password policies, session duration, and more</li>
                <li>Set up additional security features like MFA if needed</li>
              </ol>
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Maintenance Mode</h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.maintenance_mode}
                  onChange={(e) => setFormData({ ...formData, maintenance_mode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
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
                  placeholder="We're currently performing maintenance. Please check back soon."
                />
              </div>
            )}

            <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-lg">
              <h4 className="text-md font-medium text-yellow-800 dark:text-yellow-300 mb-3">Maintenance Mode Information</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-2">
                When maintenance mode is enabled:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-400">
                <li>Your site will display the maintenance message to all visitors</li>
                <li>Administrators will still be able to access the site</li>
                <li>API endpoints will return a 503 Service Unavailable response</li>
                <li>Search engines will be notified that the site is temporarily down</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;