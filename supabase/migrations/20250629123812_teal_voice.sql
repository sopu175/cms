/*
  # Add content blocks and additional fields to posts table

  1. Changes
    - Add content_blocks, gallery_images, video_url, and audio_url fields to posts table
    - These fields enable rich content management for posts
    
  2. Fields Added
    - content_blocks: JSON array of content blocks for flexible post layouts
    - gallery_images: JSON array of image URLs for post galleries
    - video_url: URL for embedded videos
    - audio_url: URL for embedded audio
*/

-- Add content blocks and media fields to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS content_blocks jsonb DEFAULT '[]'::jsonb;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS gallery_images jsonb DEFAULT '[]'::jsonb;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS audio_url text;