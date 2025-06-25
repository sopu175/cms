import React from 'react';
import FontPreloader from "@/components/FontPreloader";

interface SEOProps {
    title: string;
    description: string;
    image: string;
    canonical?: string;
    keywords?: string;
    author?: string;
    url: string;
    fav?: string;
    ogType?: string;
    themeColor?: string;
    robots?: string;
    gtmId?: string;
    structuredData?: string;
    twitter?: string;
    googleVerificationCode?: string;
    facebookVerificationCode?: string;

    // Additional props for enhanced SEO
    imageAlt?: string;
    locale?: string;
    siteName?: string;
    noIndex?: boolean;
    preconnect?: string[];
    dnsPrefetch?: string[];
}

const LayoutSEO: React.FC<SEOProps> = ({
                                           title,
                                           description,
                                           keywords = '',
                                           author = '',
                                           url,
                                           image,
                                           twitter = '',
                                           facebookVerificationCode = '',
                                           googleVerificationCode = '',
                                           canonical = '',
                                           fav,
                                           gtmId,
                                           structuredData,
                                           ogType = 'website',
                                           themeColor = 'green',
                                           robots = 'index, follow',
                                           imageAlt = '',
                                           locale = 'en_US',
                                           siteName = 'NextJs Boilerplate',
                                           noIndex = false,
                                           preconnect = [],
                                           dnsPrefetch = [],
                                       }) => {

    // Override robots if noIndex is true
    const finalRobots = noIndex ? 'noindex, nofollow' : robots;

    return (
        <head>
            <title>{title ? title : 'NextJs Boilerplate'}</title>

            {/* Basic Meta Tags */}
            <meta charSet="UTF-8"/>
            <meta name="viewport"
                  content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"/>
            <meta name="theme-color" content={themeColor}/>
            <meta name="robots" content={finalRobots}/>
            <link rel="manifest" href={'/manifest.json'}/>
            <meta name="description" content={description}/>
            {keywords && <meta name="keywords" content={keywords}/>}
            {author && <meta name="author" content={author}/>}
            <meta name="mobile-web-app-capable" content="yes"/>
            <meta name="apple-mobile-web-app-capable" content="yes"/>
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
            <meta name="format-detection" content="telephone=no"/>
            <link rel="apple-touch-icon" href="/apple-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/icon1.png" />
            <link rel="icon" type="image/svg+xml" href="/icon0.svg" />

            {/* Performance Optimizations */}
            {preconnect.map((url, index) => (
                <link key={`preconnect-${index}`} rel="preconnect" href={url}/>
            ))}
            {dnsPrefetch.map((url, index) => (
                <link key={`dns-prefetch-${index}`} rel="dns-prefetch" href={url}/>
            ))}

            {/* Open Graph Meta Tags */}
            <meta property="og:title" content={title}/>
            <meta property="og:description" content={description}/>
            <meta property="og:image" content={image}/>
            {imageAlt && <meta property="og:image:alt" content={imageAlt}/>}
            <meta property="og:url" content={url}/>
            <meta property="og:type" content={ogType}/>
            <meta property="og:site_name" content={siteName}/>
            <meta property="og:locale" content={locale}/>

            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content={title}/>
            <meta name="twitter:description" content={description}/>
            <meta name="twitter:image" content={image}/>
            {imageAlt && <meta name="twitter:image:alt" content={imageAlt}/>}
            {twitter && <meta name="twitter:site" content={twitter}/>}
            {twitter && <meta name="twitter:creator" content={twitter}/>}

            {/* Favicon and Apple Touch Icon */}
            <link rel="icon" type="image/x-icon" href="/images/static/favicon.ico" />
            <link rel="apple-touch-icon" sizes="180x180" href="/images/static/apple-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/images/static/icon1.png" />
            <link rel="icon" type="image/svg+xml" href="/images/static/icon0.svg" />

            {/* Additional Apple Meta Tags */}
            <meta name="apple-mobile-web-app-title" content={siteName}/>
            <meta name="application-name" content={siteName}/>

            {/* Canonical Link */}
            {canonical && <link rel="canonical" href={canonical}/>}

            {/* Structured Data */}
            {structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{__html: structuredData}}
                />
            )}

            {/* Additional Meta Tags */}
            {facebookVerificationCode && (
                <meta name="facebook-domain-verification" content={facebookVerificationCode}/>
            )}
            {googleVerificationCode && (
                <meta name="google-site-verification" content={googleVerificationCode}/>
            )}

            {/* Security Headers */}
            <meta httpEquiv="X-Content-Type-Options" content="nosniff"/>
            <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin"/>

            {/* Google Tag Manager */}
            {gtmId && (
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
                    }}
                />
            )}
            <FontPreloader/>
        </head>
    );
};

export default React.memo(LayoutSEO);