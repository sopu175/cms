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
    low_stock_threshold: 5
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
        acc[setting.key] = setting.value;
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
      const settingsToUpsert = Object.entries(newSettings).map(([key, value]) => ({
        key,
        value,
        type: typeof value === 'boolean' ? 'boolean' : 'string'
      }));

      const { error } = await supabase
        .from('settings')
        .upsert(settingsToUpsert);

      if (error) throw error;

      await fetchSettings();
      return { success: true };
    } catch (err) {
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