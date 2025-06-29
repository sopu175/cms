import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useSettings = () => {
  const [settings, setSettings] = useState<any>({
    // Default settings
    currency: 'BDT',
    currency_symbol: '৳', // Default to Bangladeshi Taka (TK)
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
    low_stock_threshold: 5,
    enable_ecommerce: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('settings')
        .select('*');

      if (fetchError) {
        throw fetchError;
      }

      const settingsObject = (data || []).reduce((acc: any, setting) => {
        try {
          // Parse JSON values
          if (setting.type === 'json') {
            acc[setting.key] = JSON.parse(setting.value);
          } else if (setting.type === 'boolean') {
            acc[setting.key] = setting.value === 'true';
          } else if (setting.type === 'number') {
            acc[setting.key] = parseFloat(setting.value);
          } else {
            // Handle string values - remove quotes if they exist
            if (typeof setting.value === 'string' && setting.value.startsWith('"') && setting.value.endsWith('"')) {
              acc[setting.key] = setting.value.slice(1, -1);
            } else {
              acc[setting.key] = setting.value;
            }
          }
        } catch (e) {
          // If parsing fails, use the raw value
          acc[setting.key] = setting.value;
        }
        return acc;
      }, {});

      // Merge with default settings
      setSettings({
        ...settings,
        ...settingsObject
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: any) => {
    try {
      const settingsToUpsert = Object.entries(newSettings).map(([key, value]) => {
        let formattedValue;
        let type;

        if (typeof value === 'boolean') {
          formattedValue = value.toString();
          type = 'boolean';
        } else if (typeof value === 'number') {
          formattedValue = value.toString();
          type = 'number';
        } else if (typeof value === 'object') {
          formattedValue = JSON.stringify(value);
          type = 'json';
        } else {
          formattedValue = JSON.stringify(value);
          type = 'string';
        }

        return {
          key,
          value: formattedValue,
          type
        };
      });

      const { error } = await supabase
        .from('settings')
        .upsert(settingsToUpsert, { onConflict: 'key' });

      if (error) throw error;

      await fetchSettings();
      return { success: true };
    } catch (err) {
      console.error('Error updating settings:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update settings' };
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    refetch: fetchSettings
  };
};