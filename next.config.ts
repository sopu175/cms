import withPWA from 'next-pwa';

const nextPWAConfig = withPWA({
    dest: "public",
    cacheOnFrontEndNav: true,
    disable: process.env.NODE_ENV === 'development',
    skipWaiting: true,
    clientsClaim: true,
    scope: '/',
    sw: 'sw.js',
    buildExcludes: [
        /^build-manifest\.json$/i,
        /^react-loadable-manifest\.json$/i,
        /\/_error\.js$/i,
        /\.js\.map$/i,
        /^app-build-manifest\.json$/i,
        /app-build-manifest\.json$/i,
        /\/app-build-manifest\.json$/i,
        /_next\/app-build-manifest\.json$/i,
        /middleware-manifest\.json$/i,
        /prerender-manifest\.json$/i,
        /routes-manifest\.json$/i,
        /chunks\/\d+-[a-f0-9]+\.js$/i,
        /static\/chunks\/\d+-[a-f0-9]+\.js$/i,
    ],
    runtimeCaching: [
        {
            urlPattern: /^\/(_next\/(static|image)|.*\.(js|css|ts|tsx|jsx|json|html|svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|otf|mp3|mp4|wav|avi|mov|wmv|flv|mkv))$/,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'pages-cache',
                expiration: { maxEntries: 50 },
                networkTimeoutSeconds: 3,
            },
        },
        // Fixed: Added specific caching for JSON files
        {
            urlPattern: /^\/json\/.*\.json$/,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'json-cache',
                expiration: { maxEntries: 20 },
                networkTimeoutSeconds: 3,
            },
        },
        {
            urlPattern: /^https?.*/,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'https-cache',
                expiration: { maxEntries: 200 },
            },
        },
        {
            urlPattern: /\/_next\/image/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'next-image-cache',
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60,
                },
            },
        },
        {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff|woff2|ttf|eot|otf|mp3|mp4|wav|avi|mov|wmv|flv|mkv)$/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'static-assets',
                expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 30 * 24 * 60 * 60,
                },
            },
        },
        {
            urlPattern: /^\/(_next\/static\/).*(?<!manifest\.json)$/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'next-static-files',
                expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 30 * 24 * 60 * 60,
                },
                cacheableResponse: {
                    statuses: [0, 200],
                },
            },
        },
    ],
    fallbacks: {
        document: '/offline',
    },
    publicExcludes: [
        '!robots.txt',
        '!sitemap.xml'
    ],
});

const nextConfig = {
    reactStrictMode: true,
    devIndicators: {
        autoPrerender: false,
    },
    crossOrigin: "anonymous",
    images: {
        domains: [
            'bestinbd.com',
            'dcfix.dcastalia.com',
            'dcastalia.com',
            'images.unsplash.com',
            'sopu.me',
            'localhost',
            'unsplash.com',
            'dgrees.studio',
            'project.bestinbd.com',
            'beta.ecosourcing.org',
            'cms.ecosourcing.org',
            'ecosourcing.org',
            'via.placeholder.com', // Added for fallback images
            'picsum.photos' // Added for demo images
        ],
        minimumCacheTTL: 60,
        deviceSizes: [640, 750, 1080, 1200, 1920],
        formats: ["image/avif", "image/webp"],
    },
    transpilePackages: ["@studio-freight/compono"],
    webpack: (config, { dev }) => {
        // FIXED: Simplified webpack config
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        config.resolve.fallback = {
            fs: false,
            canvas: false
        };

        if (!dev) {
            config.cache = {
                type: "filesystem",
            };
        }

        return config;
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        viewTransition: true,
        scrollRestoration: false,
        webVitalsAttribution: ['CLS', 'LCP'],
        serverActions: {
            allowedOrigins: ['localhost:3000', 'beta.ecosourcing.org'],
        },
        optimizeCss: true,
        cssChunking: true,
    },
    // FIXED: Simplified headers configuration
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                ],
            },
            // FIXED: Specific headers for JSON files
            {
                source: "/json/:path*",
                headers: [
                    {
                        key: "Content-Type",
                        value: "application/json; charset=utf-8",
                    },
                    {
                        key: "Cache-Control",
                        value: "public, max-age=300, s-maxage=300", // 5 minutes cache
                    },
                ],
            },
            {
                source: "/sw.js",
                headers: [
                    {
                        key: "Content-Type",
                        value: "application/javascript; charset=utf-8",
                    },
                    {
                        key: "Cache-Control",
                        value: "no-cache, no-store, must-revalidate",
                    },
                ],
            },
            {
                source: "/_next/static/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable"
                    }
                ],
            },
        ];
    },
    // FIXED: Updated rewrites to not conflict with JSON files
    async rewrites() {
        return [
            // Keep your existing API rewrite but make it more specific
            {
                source: "/api/cms/:path*",
                destination: "https://cms.maximuseducation.com.au/:path*",
            },
        ];
    },
    compress: true,
    productionBrowserSourceMaps: false, // Disable source maps for production
};

export default nextPWAConfig(nextConfig);