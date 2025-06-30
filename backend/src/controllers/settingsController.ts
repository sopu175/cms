import { Request, Response } from 'express';
import { supabase } from '../config/database.js';
import { ApiResponse } from '../types/index.js';

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: settings, error } = await supabase
      .from('settings')
      .select('*')
      .order('key');

    if (error) {
      res.status(400).json({
        success: false,
        error: error.message
      } as ApiResponse);
      return;
    }

    // Convert to key-value object
    const settingsObject = settings.reduce((acc: any, setting) => {
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

    res.json({
      success: true,
      data: settingsObject
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const getSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key } = req.params;

    const { data: setting, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', key)
      .single();

    if (error || !setting) {
      res.status(404).json({
        success: false,
        error: 'Setting not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: setting
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const updateSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key } = req.params;
    const { value, type, description } = req.body;

    // Format the value based on type
    let formattedValue;
    if (type === 'boolean') {
      formattedValue = value.toString();
    } else if (type === 'number') {
      formattedValue = value.toString();
    } else if (type === 'json') {
      formattedValue = JSON.stringify(value);
    } else {
      formattedValue = JSON.stringify(value);
    }

    const { data: setting, error } = await supabase
      .from('settings')
      .upsert([{
        key,
        value: formattedValue,
        type,
        description
      }])
      .select()
      .single();

    if (error) {
      res.status(400).json({
        success: false,
        error: error.message
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: setting,
      message: 'Setting updated successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const updateMultipleSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { settings } = req.body;

    const settingsToUpsert = Object.entries(settings).map(([key, config]: [string, any]) => {
      // Format the value based on type
      let formattedValue;
      if (config.type === 'boolean') {
        formattedValue = config.value.toString();
      } else if (config.type === 'number') {
        formattedValue = config.value.toString();
      } else if (config.type === 'json') {
        formattedValue = JSON.stringify(config.value);
      } else {
        formattedValue = JSON.stringify(config.value);
      }

      return {
        key,
        value: formattedValue,
        type: config.type || 'string',
        description: config.description
      };
    });

    const { data: updatedSettings, error } = await supabase
      .from('settings')
      .upsert(settingsToUpsert)
      .select();

    if (error) {
      res.status(400).json({
        success: false,
        error: error.message
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: updatedSettings,
      message: 'Settings updated successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const deleteSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key } = req.params;

    const { error } = await supabase
      .from('settings')
      .delete()
      .eq('key', key);

    if (error) {
      res.status(400).json({
        success: false,
        error: error.message
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      message: 'Setting deleted successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

// Site Info
export const getSiteInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: siteInfo, error } = await supabase
      .from('site_info')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      res.status(400).json({
        success: false,
        error: error.message
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: siteInfo || {}
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const updateSiteInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      site_name,
      logo_url,
      description,
      contact_email,
      phone,
      address,
      social_icons
    } = req.body;

    const { data: siteInfo, error } = await supabase
      .from('site_info')
      .upsert([{
        id: '1', // Single row for site info
        site_name,
        logo_url,
        description,
        contact_email,
        phone,
        address,
        social_icons: social_icons || []
      }])
      .select()
      .single();

    if (error) {
      res.status(400).json({
        success: false,
        error: error.message
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: siteInfo,
      message: 'Site info updated successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};