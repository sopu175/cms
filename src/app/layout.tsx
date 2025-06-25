// src/app/layout.tsx

import {JSX, ReactNode, Suspense} from 'react';
import './globals.css';
import ClientLayout from './client-layout';
import LayoutSEO from "@/utils/seoLayoutConfig";
import {Toaster} from "sonner";
import {GlobalProvider} from "@/context/GlobalContext";
import MainMenu from "@/components/global/MainMenu";
import Footer from "@/components/global/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";



interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({children}: RootLayoutProps): JSX.Element {
    return (

        <html lang="en" suppressHydrationWarning>
        <LayoutSEO
            title="Next.js"
            description="Page description"
            url="https://yoursite.com"
            image="https://yoursite.com/image.jpg"
            imageAlt="Description of the image"
            gtmId="GTM-XXXXXXX"
            preconnect={['https://fonts.googleapis.com', 'https://www.googletagmanager.com']}
            dnsPrefetch={['https://fonts.gstatic.com']}
            noIndex={false} // Set to true for staging/private pages
        />
        <body className={'antialiased'} suppressHydrationWarning>
        <Toaster
            duration={5000}
            position="bottom-right"
            richColors
        />
        <GlobalProvider>
            <Suspense fallback={<LoadingSpinner/>}>
                <MainMenu/>
            </Suspense>
            <ClientLayout>{children}</ClientLayout>
            <Footer />
        </GlobalProvider>
        </body>
        </html>
    );
}