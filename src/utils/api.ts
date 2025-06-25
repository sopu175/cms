// Types for dynamic page structure
export interface PageSectionData {
  id: number;
  parent_page_id: string;
  page_section: number;
  type?: string | null;
  title: string;
  slug: string;
  subtitle?: string;
  short_desc?: string;
  notitle?: number;
  form_id?: string | null;
  description?: string;
  image_size?: string;
  identifier?: string;
  template: string;
  status?: number;
  is_archived?: number;
  title_tag?: string | null;
  meta_title?: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  preview?: string | null;
  instructions?: string | null;
  child_of?: string | null;
  update_type?: string | null;
  visit_count?: number | null;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
  data?: any;
  padding?: string;
  asModal?: boolean;
  formData?: any;
  career?: any;
}

export interface PageSection {
  section_data: PageSectionData;
  [key: string]: any;
}

export interface PageData {
  page_data: Record<string, any>;
  sections: PageSection[];
  images?: string[];
  [key: string]: any;
}

export interface BlogData {
  page_data: Record<string, any>;
  sections: PageSection[];
  images?: string[];
  [key: string]: any;
}

interface SettingsData {
  [key: string]: unknown;
}

interface MenuData {
  [key: string]: unknown;
}

export async function getPageData(slug?: string): Promise<PageData | null> {
  let url = '';

  if (slug) {
    // If slug is provided, fetch the specific page data using the slug
    url = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/json/page/${slug}.json`;
  } else {
    // If no slug is provided, fetch the default home page data
    url = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/json/page/home.json`;
  }

  console.log('Fetching from URL:', url); // Log the URL

  try {
    const res = await fetch(url, {
      cache: 'no-store', // Always gets the latest file
    });

    if (!res.ok) throw new Error(`Failed to load JSON: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error(`Error fetching ${slug ? `${slug}.json` : 'home.json'}:`, error);
    return null;
  }
}

export async function getBlogDetailsData(slug?: string): Promise<BlogData | null> {
  let url = '';

  if (slug) {
    // If slug is provided, fetch the specific page data using the slug
    url = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/json/blog/blog_list.json`;
  } else {
    // If no slug is provided, fetch the default home page data
    // If slug is provided, fetch the specific page data using the slug
    url = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/json/blog/blog_list.json`;
  }

  console.log('Fetching from URL:', url); // Log the URL

  try {
    const res = await fetch(url, {
      cache: 'no-store', // Always gets the latest file
    });

    if (!res.ok) throw new Error(`Failed to load JSON: ${res.statusText}`);
    return await res.json();
  } catch (error) {

    return null;
  }
}

export async function getSettingsData(slug?: string): Promise<SettingsData | null> {
  let url = '';

  if (slug) {
    // If slug is provided, fetch the specific page data using the slug
    url = `${process.env.NEXT_PUBLIC_BASE_URL || 'public'}/json/${slug}.json`;
  }
  try {
    const res = await fetch(url, {
      cache: 'no-store', // Always gets the latest file
    });

    if (!res.ok) throw new Error(`Failed to load JSON: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error(`Error fetching ${slug ? `${slug}.json` : ''}:`, error);
    return null;
  }
}


export async function getMenuData(slug?: string): Promise<MenuData | null> {
  let url = '';

  if (slug) {
    // If slug is provided, fetch the specific page data using the slug
    url = `${process.env.NEXT_PUBLIC_BASE_URL || 'public'}/json/${slug}.json`;
  }
  try {
    const res = await fetch(url, {
      cache: 'no-store', // Always gets the latest file
    });

    if (!res.ok) throw new Error(`Failed to load JSON: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error(`Error fetching ${slug ? `${slug}.json` : ''}:`, error);
    return null;
  }
} 