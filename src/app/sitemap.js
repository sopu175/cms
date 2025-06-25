// app/sitemap.js - Debug Version

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Static routes
    const staticRoutes = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/career`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ];

    const portfolios = await fetchPortfoliosFromAPI();
    const blogs = await fetchBlogsFromAPI();
    const services = await fetchServicesFromAPI();

    // Debug: Log the portfolios data
    console.log('🔍 DEBUG: Number of portfolios fetched:', portfolios?.length || 0);
    console.log('🔍 DEBUG: First portfolio:', portfolios?.[0]);
    console.log('🔍 DEBUG: Number of blogs fetched:', blogs?.length || 0);
    console.log('🔍 DEBUG: First blog:', blogs?.[0]);
    console.log('🔍 DEBUG: Number of services fetched:', services?.length || 0);
    console.log('🔍 DEBUG: First services:', services?.[0]);

    const portfolioRoutes = (portfolios || []).map(portfolio => ({
        url: `${baseUrl}/portfolio/${portfolio.slug}`,
        lastModified: portfolio.lastModified || new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
    }));

    const blogRoutes = (blogs || []).map(blog => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: blog.lastModified || new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
    }));

    const serviceRoutes = (services || []).map(service => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: service.lastModified || new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
    }));

    console.log('🔍 DEBUG: Number of portfolio routes:', portfolioRoutes.length);
    console.log('🔍 DEBUG: Number of blog routes:', blogRoutes.length);
    console.log('🔍 DEBUG: Number of service routes:', serviceRoutes.length);

    return [...staticRoutes, ...portfolioRoutes, ...blogRoutes, ...serviceRoutes];
}


//The api call need to be chnged



//Function to fetch portfolios from API

async function fetchPortfoliosFromAPI() {
    try {
        const apiBaseUrl = process.env.CMS_API_BASE_URL || 'https://cms.digitomark.com';
        const response = await fetch(`${apiBaseUrl}/api/get-req-data/portfolio-list-by-cat?category=&industry=&image=yes&slug=yes`, {
            next: { revalidate: 3600 },
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const data = await response.json();
        console.log('🔍 DEBUG: Full API response:', JSON.stringify(data, null, 2));

        const portfolioList = data?.portfolio_list;
        console.log('🔍 DEBUG: Portfolio list:', portfolioList);

        if (Array.isArray(portfolioList)) {
            const validPortfolios = portfolioList.filter(portfolio =>
                portfolio.data?.slug?.trim()
            ).map(portfolio => ({
                slug: portfolio.data.slug.trim(),
                lastModified: portfolio.data.lastModified,
            }));

            console.log('🔍 DEBUG: Valid portfolios:', validPortfolios.length);
            return validPortfolios;
        }

        console.warn('⚠️ Portfolio list is not an array or is undefined');
        return [];
    } catch (error) {
        console.error('❌ Sitemap portfolio fetch error:', error.message);
        return [];
    }
}

// Function to fetch blogs from API
async function fetchBlogsFromAPI() {
    try {
        const apiBaseUrl = process.env.CMS_API_BASE_URL || 'https://cms.digitomark.com';
        const response = await fetch(`${apiBaseUrl}/api/get-req-data/blog-list?category_id=`, {
            next: { revalidate: 3600 },
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const data = await response.json();
        console.log('🔍 DEBUG: Full API response:', JSON.stringify(data, null, 2));

        const blogList = data?.data;
        console.log('🔍 DEBUG: Blog list:', blogList);

        if (Array.isArray(blogList)) {
            const validBlogs = blogList.filter(blog =>
                blog.data?.slug?.trim()
            ).map(blog => ({
                slug: blog.data.slug.trim(),
                lastModified: blog.data.date || new Date(),
            }));

            console.log('🔍 DEBUG: Valid blogs:', validBlogs.length);
            return validBlogs;
        }

        console.warn('⚠️ Blog list is not an array or is undefined');
        return [];
    } catch (error) {
        console.error('❌ Sitemap blog fetch error:', error.message);
        return [];
    }
}

//Function to fetch services from API

async function fetchServicesFromAPI() {
    try {
        const apiBaseUrl = process.env.CMS_API_BASE_URL || 'https://cms.digitomark.com';
        const response = await fetch(`${apiBaseUrl}/api/get-req-data/all-services`, {
            next: { revalidate: 3600 },
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const data = await response.json();
        console.log('🔍 DEBUG: Full API response:', JSON.stringify(data, null, 2));

        const serviceList = data?.data;
        console.log('🔍 DEBUG: Service list:', serviceList);

        if (Array.isArray(serviceList)) {
            const validServices = serviceList.filter(service =>
                service.service_data?.slug?.trim()
            ).map(service => ({
                slug: service.service_data.slug.trim(),
                lastModified: service.service_data.date || new Date(),
            }));

            console.log('🔍 DEBUG: Valid services:', validServices.length);
            return validServices;
        }

        console.warn('⚠️ Service list is not an array or is undefined');
        return [];
    } catch (error) {
        console.error('❌ Sitemap service fetch error:', error.message);
        return [];
    }
}