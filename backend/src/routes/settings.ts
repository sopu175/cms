import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = Router();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all settings
router.get('/', async (req, res) => {
  try {
    const { data: settings, error } = await supabase
      .from('settings')
      .select('*');

    if (error) {
      console.error('Error fetching settings:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch settings'
      });
    }

    // Convert settings array to key-value object
    const settingsObj: Record<string, any> = {};
    settings?.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });

    // Provide default values if no settings exist
    const defaultSettings = {
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
      low_stock_threshold: 5,
      ...settingsObj
    };

    res.json({
      success: true,
      data: defaultSettings
    });
  } catch (error) {
    console.error('Settings API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update settings
router.put('/', async (req, res) => {
  try {
    const updates = req.body;
    const results = [];

    for (const [key, value] of Object.entries(updates)) {
      const { data, error } = await supabase
        .from('settings')
        .upsert({
          key,
          value,
          type: typeof value === 'boolean' ? 'boolean' : 
                typeof value === 'number' ? 'number' : 'string'
        }, {
          onConflict: 'key'
        });

      if (error) {
        console.error(`Error updating setting ${key}:`, error);
        return res.status(500).json({
          success: false,
          error: `Failed to update setting: ${key}`
        });
      }

      results.push(data);
    }

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: results
    });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;