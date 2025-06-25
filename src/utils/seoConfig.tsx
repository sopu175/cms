/**
 * SEO Configuration Component
 *
 * This module provides interfaces and utilities for generating comprehensive SEO metadata
 * for Next.js pages, including Open Graph, Twitter Cards, and JSON-LD structured data.
 */

/**
 * Interface for Open Graph image metadata
 * Used to define social media preview images with proper dimensions and alt text
 */
interface OpenGraphImage {
    url: string;      // Image URL (absolute or relative path)
    width: number;    // Image width in pixels (recommended: 1200px)
    height: number;   // Image height in pixels (recommended: 630px)
    alt: string;      // Alternative text for accessibility and SEO
}

/**
 * Interface for Open Graph metadata
 * Defines all properties needed for social media sharing (Facebook, LinkedIn, etc.)
 */
interface OpenGraph {
    title: string;           // Page title for social sharing
    description: string;     // Page description for social sharing
    ogTitle: string;         // Specific Open Graph title (can differ from page title)
    ogDescription: string;   // Specific Open Graph description
    url: string;             // Canonical URL of the page
    siteName: string;        // Name of the website/application
    images: OpenGraphImage[]; // Array of images for social preview
    locale: string;          // Language/locale (e.g., "en_US")
    type: string;            // Open Graph type (e.g., "website", "article")
}

/**
 * Interface for Twitter Card metadata
 * Defines properties for Twitter-specific social sharing
 */
interface Twitter {
    card: string;        // Twitter card type (e.g., "summary_large_image")
    title: string;       // Title for Twitter sharing
    description: string; // Description for Twitter sharing
    images: string[];    // Array of image URLs for Twitter preview
}

/**
 * Main SEO configuration interface
 * Defines all optional parameters that can be passed to generate SEO metadata
 */
interface SEOConfig {
    title?: string;          // Page title for <title> tag
    description?: string;    // Meta description for search engines
    keywords?: string;       // Meta keywords (comma-separated)
    ogImage?: string;        // Open Graph image URL
    ogTitle?: string;        // Open Graph specific title
    ogDescription?: string;  // Open Graph specific description
    url?: string;            // Canonical URL of the page
    jsonLd?: Record<string, unknown>; // JSON-LD structured data for rich snippets
}

/**
 * Generates comprehensive SEO metadata for Next.js pages
 *
 * This function takes SEO configuration parameters and returns a complete
 * metadata object that includes standard meta tags, Open Graph data,
 * Twitter Cards, and structured data for optimal search engine optimization.
 *
 * @param {SEOConfig} config - Configuration object with SEO parameters
 * @returns {Object} Complete metadata object for Next.js generateMetadata()
 *
 * @example
 * ```typescript
 * const metadata = generatePageSEO({
 *   title: "About Us",
 *   description: "Learn about our company and mission",
 *   ogImage: "/images/about-hero.jpg",
 *   keywords: "company, about, mission, team"
 * });
 * ```
 */
export function generatePageSEO({
                                    title,
                                    description,
                                    ogTitle,
                                    ogDescription,
                                    keywords,
                                    ogImage,
                                    url,
                                    jsonLd,
                                }: SEOConfig): {
    title: string;
    description: string;
    keywords: string;
    openGraph: OpenGraph;
    jsonLd?: Record<string, unknown>;
    twitter: Twitter;
    robots: string;
} {
    return {
        // Basic meta tags
        title: title || "Nextjs Boilerplate",
        description:
            description ||
            "description",
        keywords:
            keywords ||
            "keywords1, keywords2, keywords3",

        // Open Graph metadata for social media sharing
        openGraph: {
            title: ogTitle || title || "title", // fallback to title if ogTitle is undefined
            description:
                ogDescription || description || "description", // fallback to description if ogDescription is undefined
            url: url || "",
            siteName: "Site name",
            images: [
                {
                    url: ogImage || "/images/dynamic/units/banner.jpg",
                    width: 1200,    // Optimal width for social media
                    height: 630,    // Optimal height for social media (1.91:1 ratio)
                    alt: "Banner",
                },
            ],
            locale: "en_US",
            type: "website",
        } as OpenGraph,

        // JSON-LD structured data for rich snippets
        jsonLd: jsonLd,

        // Twitter Card metadata
        twitter: {
            card: "summary_large_image",  // Large image card format
            title: title || "title",
            description:
                description ||
                "description",
            images: [ogImage || "/og-default.jpg"],
        } as Twitter,

        // Search engine crawler instructions
        robots: "index, follow",  // Allow indexing and following links
    };
}