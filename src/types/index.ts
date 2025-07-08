import { Session } from '@supabase/supabase-js';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'author' | 'customer';
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  parent_id?: string;
  featured_image?: string;
  sections?: PostSection[];
  post_count?: number;
  category_type?: 'post' | 'product'; // Added category type
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  featured_image?: string;
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  author_id?: string;
  author_name?: string;
  author_email?: string;
  category_id?: string;
  category_name?: string;
  category_color?: string;
  views: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  canonical_url?: string;
  og_image?: string;
  robots?: string;
  scheduled_at?: string;
  content_blocks?: ContentBlock[];
  sections?: PostSection[];
  gallery_images?: GalleryItem[];
  video_url?: string;
  audio_url?: string;
  tags?: string[];
  is_featured?: boolean;
  allow_comments?: boolean;
  gallery_id?: string;
}

export interface GalleryItem {
  id: string;
  type: 'folder' | 'image';
  name?: string;
  url?: string;
  children?: GalleryItem[];
}

export interface ContentPage {
  id: string;
  title: string;
  html_name: string;
  description?: string;
  content?: string;
  excerpt?: string;
  background_image?: string;
  background_color: string;
  sections?: any[];
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  author_id?: string;
  author?: { username: string };
  created_at: string;
  updated_at: string;
  published_at?: string;
  scheduled_at?: string;
  views?: number;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  canonical_url?: string;
  og_image?: string;
  robots?: string;
  schema_markup?: any;
  content_blocks?: ContentBlock[];
  gallery_images?: string[];
  video_url?: string;
  audio_url?: string;
  is_featured?: boolean;
  allow_comments?: boolean;
  gallery_id?: string;
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'rich_text' | 'image' | 'gallery' | 'video' | 'audio' | 'table' | 'list' | 'link' | 'button' | 'form' | 'post_list' | 'product_list' | 'hero' | 'testimonial' | 'faq' | 'contact' | 'code';
  content: any;
  order: number;
  settings?: any;
  styles?: any;
}

export interface PostSection {
  id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  content_blocks?: ContentBlock[];
  type: 'banner' | 'gallery' | 'child_page' | 'section' | 'slider' | 'video' | 'image';
  post_list?: PostListItem[];
  order: number;
}

export interface PostListItem {
  id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  content_blocks?: ContentBlock[];
  type: string;
  order: number;
}

export interface SEOData {
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  canonical_url?: string;
  og_image?: string;
  robots?: string;
  averagePosition?: number;
  topKeywords?: {
    keyword: string;
    position: number;
    volume: number;
  }[];
  indexedPages?: number;
  crawlErrors?: number;
  mobileUsability?: number;
  pagespeedScore?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  images?: string[];
  price: number;
  category_id?: string | undefined;
  category_name?: string;
  status: string;
  variations_count?: number;
  average_rating?: number;
  reviews_count?: number;
  content_blocks?: ContentBlock[]; // Added content blocks
  sections?: PostSection[]; // Added sections
  specifications?: {name: string, value: string}[]; // Added specifications
  created_at: string;
  updated_at: string;
}

export interface ProductVariation {
  id: string;
  product_id: string;
  sku: string;
  options: any;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id?: string;
  user?: {
    username?: string;
    email?: string;
  };
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: any[];
  shipping_info: any;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variation_id?: string;
  quantity: number;
  unit_price: number;
  created_at: string;
  product?: Product;
  variation?: ProductVariation;
}

export interface Review {
  id: string;
  product_id: string;
  product?: {
    name: string;
  };
  user_id: string;
  user?: {
    username: string;
  };
  rating: number;
  comment?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  amount: number;
  min_amount?: number;
  max_amount?: number;
  max_uses?: number;
  used_count: number;
  expires_at?: string;
  status: 'active' | 'inactive';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  url: string;
  alt_text?: string;
  caption?: string;
  folder: string;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Gallery {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: 'image' | 'video' | 'mixed';
  items: GalleryItem[];
  status: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface ContactInfo {
  type: 'email' | 'phone';
  label: string;
  value: string;
}

export interface SiteInfo {
  id: string;
  site_name: string;
  logo_url?: string;
  logo_light?: string;
  logo_dark?: string;
  favicon?: string;
  description?: string;
  tagline?: string;
  contact_name?: string;
  contact_email?: string;
  phone?: string;
  address?: string;
  google_maps_link?: string;
  google_maps_embed?: string;
  contact_info?: ContactInfo[];
  social_icons?: any[];
  copyright_text?: string;
  google_analytics?: string;
  facebook_pixel?: string;
  google_tag_manager?: string;
  custom_head_code?: string;
  custom_footer_code?: string;
  maintenance_mode?: boolean;
  maintenance_message?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  og_image?: string;
  robots_txt?: string;
  structured_data?: string;
  enable_sitemap?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Menu {
  id: string;
  name: string;
  slug: string;
  location: string;
  items: MenuItem[];
  settings?: any;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  type: string;
  target: string;
  children?: MenuItem[];
}

export interface Form {
  id: string;
  name: string;
  slug: string;
  description?: string;
  fields: FormField[];
  settings?: {
    submit_text?: string;
    success_message?: string;
    redirect_url?: string;
    email_notifications?: boolean;
    notification_email?: string;
    sender_email?: string;
    email_subject?: string;
  };
  status: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: any;
  order: number;
}

export interface FormSubmission {
  id: string;
  form_id: string;
  data: any;
  ip_address?: string;
  user_agent?: string;
  submitted_by?: string;
  created_at: string;
}

export interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: string;
  topPages: {
    path: string;
    views: number;
    title: string;
  }[];
  trafficSources: {
    source: string;
    percentage: number;
  }[];
  weeklyTrend: {
    day: string;
    views: number;
  }[];
}