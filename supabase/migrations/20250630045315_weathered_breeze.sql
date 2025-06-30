/*
  # Add Multiple Contact Information Fields

  1. Changes
     - Modify site_info table to support multiple contact information entries
     - Add Google Maps link and embed map link fields
     - Update contact_info field to store multiple email and phone entries with labels

  2. New Fields
     - contact_name: Store the organization or contact person name
     - google_maps_link: Store Google Maps URL
     - google_maps_embed: Store Google Maps embed code
     - contact_info: JSONB array to store multiple emails and phones with labels
*/

-- First check if contact_info column exists, if not create it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_info' AND column_name = 'contact_info'
  ) THEN
    ALTER TABLE site_info ADD COLUMN contact_info JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add contact_name field if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_info' AND column_name = 'contact_name'
  ) THEN
    ALTER TABLE site_info ADD COLUMN contact_name TEXT;
  END IF;
END $$;

-- Add google_maps_link field if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_info' AND column_name = 'google_maps_link'
  ) THEN
    ALTER TABLE site_info ADD COLUMN google_maps_link TEXT;
  END IF;
END $$;

-- Add google_maps_embed field if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_info' AND column_name = 'google_maps_embed'
  ) THEN
    ALTER TABLE site_info ADD COLUMN google_maps_embed TEXT;
  END IF;
END $$;

-- Migrate existing contact_email and phone to contact_info if needed
DO $$
DECLARE
  site_record RECORD;
  contact_array JSONB := '[]'::jsonb;
BEGIN
  SELECT * INTO site_record FROM site_info WHERE id = '1';
  
  IF site_record IS NOT NULL THEN
    -- Add existing email to contact_info if it exists
    IF site_record.contact_email IS NOT NULL AND site_record.contact_email != '' THEN
      contact_array := contact_array || jsonb_build_object(
        'type', 'email',
        'label', 'Primary',
        'value', site_record.contact_email
      );
    END IF;
    
    -- Add existing phone to contact_info if it exists
    IF site_record.phone IS NOT NULL AND site_record.phone != '' THEN
      contact_array := contact_array || jsonb_build_object(
        'type', 'phone',
        'label', 'Primary',
        'value', site_record.phone
      );
    END IF;
    
    -- Update contact_info with the new array
    IF jsonb_array_length(contact_array) > 0 THEN
      UPDATE site_info 
      SET contact_info = contact_array
      WHERE id = '1';
    END IF;
  END IF;
END $$;