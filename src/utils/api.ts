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

/**
 * Fetches page data from JSON files in the public directory
 * 
 * @param slug - The slug of the page to fetch data for
 * @returns Promise with the page data or null if not found
 */
export async function getPageData(slug?: string): Promise<PageData | null> {
  try {
    // Determine the URL based on the slug
    const url = slug 
      ? `${process.env.NEXT_PUBLIC_BASE_URL || ''}/json/page/${slug}.json`
      : `${process.env.NEXT_PUBLIC_BASE_URL || ''}/json/page/home.json`;
    
    console.log('Fetching page data from:', url);
    
    // Fetch the data with no-store to always get the latest
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    // Handle HTTP errors
    if (!res.ok) {
      console.error(`HTTP error ${res.status}: ${res.statusText}`);
      throw new Error(`Failed to load page data: ${res.statusText}`);
    }
    
    // Parse the JSON response
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching page data for ${slug || 'home'}:`, error);
    return null;
  }
}

/**
 * Fetches blog data from JSON files in the public directory
 * 
 * @param slug - The slug of the blog to fetch data for
 * @returns Promise with the blog data or null if not found
 */
export async function getBlogData(slug?: string): Promise<any[] | null> {
  try {
    // Fetch the blog list data
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/json/blog/blog_list.json`;
    console.log('Fetching blog data from:', url);
    
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error(`HTTP error ${res.status}: ${res.statusText}`);
      throw new Error(`Failed to load blog data: ${res.statusText}`);
    }
    
    const blogs = await res.json();
    
    // If a slug is provided, find the specific blog
    if (slug) {
      const blog = blogs.find((blog: any) => blog.slug === slug);
      return blog ? [blog] : null;
    }
    
    return blogs;
  } catch (error) {
    console.error(`Error fetching blog data:`, error);
    return null;
  }
}

/**
 * Fetches blog details data for a specific blog post
 * 
 * @param slug - The slug of the blog post to fetch
 * @returns Promise with the blog details or null if not found
 */
export async function getBlogDetailsData(slug?: string): Promise<any | null> {
  try {
    if (!slug) return null;
    
    // First fetch the blog list to find the specific blog
    const blogs = await getBlogData();
    if (!blogs) return null;
    
    // Find the specific blog by slug
    const blog = blogs.find((blog: any) => blog.slug === slug);
    return blog || null;
  } catch (error) {
    console.error(`Error fetching blog details for ${slug}:`, error);
    return null;
  }
}

/**
 * Fetches settings data from JSON files in the public directory
 * 
 * @param slug - The settings file to fetch (without .json extension)
 * @returns Promise with the settings data or null if not found
 */
export async function getSettingsData(slug?: string): Promise<SettingsData | null> {
  try {
    if (!slug) return null;
    
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/json/${slug}.json`;
    console.log('Fetching settings data from:', url);
    
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error(`HTTP error ${res.status}: ${res.statusText}`);
      throw new Error(`Failed to load settings data: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error(`Error fetching settings data for ${slug}:`, error);
    return null;
  }
}

/**
 * Fetches menu data from JSON files in the public directory
 * 
 * @param slug - The menu file to fetch (without .json extension)
 * @returns Promise with the menu data or null if not found
 */
export async function getMenuData(slug?: string): Promise<MenuData | null> {
  try {
    if (!slug) return null;
    
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/json/${slug}.json`;
    console.log('Fetching menu data from:', url);
    
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error(`HTTP error ${res.status}: ${res.statusText}`);
      throw new Error(`Failed to load menu data: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error(`Error fetching menu data for ${slug}:`, error);
    return null;
  }
}

/**
 * Fetches form data from JSON files in the public directory
 * 
 * @param formId - The ID of the form to fetch
 * @returns Promise with the form data or null if not found
 */
export async function getFormData(formId?: string): Promise<any | null> {
  try {
    if (!formId) return null;
    
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/json/forms.json`;
    console.log('Fetching form data from:', url);
    
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error(`HTTP error ${res.status}: ${res.statusText}`);
      throw new Error(`Failed to load form data: ${res.statusText}`);
    }
    
    const forms = await res.json();
    return forms[formId] || null;
  } catch (error) {
    console.error(`Error fetching form data for ${formId}:`, error);
    return null;
  }
}

/**
 * Fetches any JSON data from the public directory
 * 
 * @param path - The path to the JSON file (relative to /public/json/)
 * @returns Promise with the JSON data or null if not found
 */
export async function getJsonData(path: string): Promise<any | null> {
  try {
    if (!path) return null;
    
    // Ensure path has .json extension
    const jsonPath = path.endsWith('.json') ? path : `${path}.json`;
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/json/${jsonPath}`;
    
    console.log('Fetching JSON data from:', url);
    
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error(`HTTP error ${res.status}: ${res.statusText}`);
      throw new Error(`Failed to load JSON data: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error(`Error fetching JSON data for ${path}:`, error);
    return null;
  }
}