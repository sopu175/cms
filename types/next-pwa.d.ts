declare module 'next-pwa' {
    import { NextConfig } from 'next';

    type RuntimeCaching = {
        urlPattern: RegExp | string;
        handler: string;
        options?: {
            cacheName?: string;
            expiration?: {
                maxEntries?: number;
                maxAgeSeconds?: number;
            };
            cacheableResponse?: {
                statuses?: number[];
            };
            networkTimeoutSeconds?: number;
        };
    };

    interface PWAOptions {
        dest: string;
        register?: boolean;
        skipWaiting?: boolean;
        disable?: boolean;
        sw?: string;
        scope?: string;
        buildExcludes?: RegExp[];
        runtimeCaching?: RuntimeCaching[];
    }

    const withPWA: (options: PWAOptions) => (nextConfig: NextConfig) => NextConfig;
    export default withPWA;
}
