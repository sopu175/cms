/*
  # Add Post Fields to Content Pages
  
  1. Changes
    - Add the same content-related fields to content_pages that exist in posts
    - This includes content_blocks, gallery_images, video_url, audio_url
    - Ensures content pages have the same rich content capabilities as posts
*/

-- Add content fields to content_pages table
ALTER TABLE content_pages ADD COLUMN IF NOT EXISTS content_blocks jsonb DEFAULT '[]'::jsonb;
ALTER TABLE content_pages ADD COLUMN IF NOT EXISTS gallery_images jsonb DEFAULT '[]'::jsonb;
ALTER TABLE content_pages ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE content_pages ADD COLUMN IF NOT EXISTS audio_url text;

-- Add post-specific fields to content_pages
ALTER TABLE content_pages ADD COLUMN IF NOT EXISTS excerpt text;
ALTER TABLE content_pages ADD COLUMN IF NOT EXISTS content text;
ALTER TABLE content_pages ADD COLUMN IF NOT EXISTS published_at timestamptz;
ALTER TABLE content_pages ADD COLUMN IF NOT EXISTS scheduled_at timestamptz;
ALTER TABLE content_pages ADD COLUMN IF NOT EXISTS views integer DEFAULT 0;

-- Create index for scheduled content pages
CREATE INDEX IF NOT EXISTS idx_content_pages_scheduled_at ON content_pages(scheduled_at);