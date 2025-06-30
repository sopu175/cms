import {Suspense, unstable_ViewTransition as ViewTransition} from 'react';
import NotFound from "@/app/not-found";
import LoadingSpinner from "@/components/LoadingSpinner";
import reactHtmlParser from 'react-html-parser';
import {getPageData, PageSection} from "@/utils/api";
import { generatePageSEO } from "@/utils/seoConfig";
import Banner from "@/components/client/Banner";
import Slider from "@/components/global/Slider";
import NestedGallery from "@/components/client/NestedGallery";
import FormContact from "@/components/FormContact";
import BlogListing from '@/components/client/BlogListing';

// Map section templates to their corresponding components
const sectionComponentMap: Record<string, React.ComponentType<any>> = {
    hero_banner: Banner,
    overview: Slider,
    gallery: NestedGallery,
    form: FormContact,
    news_list: BlogListing,
    inner_banner: Banner,
    blog_list_all: BlogListing,
    // Add more mappings as needed
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    // Resolve the params to get the slug
    const resolvedParams = await params;

    // Fetch the page data with the slug
    const pageData = await getPageData(resolvedParams?.slug);

    // Handle the case where page data is missing
    if (!pageData || !pageData?.page_data) {
        console.error('Error: Metadata could not be generated due to missing page data.');

        // Use the SEO config with default values
        return generatePageSEO({
            title: 'Next.js Boilerplate',
            description: 'Learn more about our team and mission.',
        });
    }

    // Extract metadata from the page data
    const meta = pageData?.page_data;

    // Parse HTML content if needed
    const parsedTitle = reactHtmlParser(meta.meta_title);
    const parsedSubtitle = reactHtmlParser(meta.meta_description);

    // Use the SEO config function
    return generatePageSEO({
        title: Array.isArray(parsedTitle) ? parsedTitle.join('') : parsedTitle || 'Next.js Boilerplate',
        description: Array.isArray(parsedSubtitle) ? parsedSubtitle.join('') : parsedSubtitle || 'Learn more about our team and mission.',
        ogTitle: Array.isArray(parsedTitle) ? parsedTitle.join('') : parsedTitle,
        ogDescription: Array.isArray(parsedSubtitle) ? parsedSubtitle.join('') : parsedSubtitle,
        ogImage: pageData.images?.[0],
        keywords: 'Next.js, React, TypeScript, Boilerplate',
        url: `/${resolvedParams?.slug || ''}`,
    });
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;

    // Fetch page data on the server side
    const data = await getPageData(resolvedParams?.slug);

    if (!data) {
        return <NotFound />; // Handle error case
    }

    // Pass the fetched data to the components
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <ViewTransition>
                {/* Dynamically render sections based on their template and order */}
                {data?.sections?.map((section: PageSection, idx: number) => {
                    const SectionComponent = sectionComponentMap[section?.section_data?.template];
                    if (!SectionComponent) return null; // Skip unknown templates
                    
                    // Special handling for FormContact
                    if (SectionComponent === FormContact) {
                        const { padding, asModal, id, formData, form_id, career } = section.section_data || {};
                        return (
                            <FormContact
                                key={section.section_data?.id || idx}
                                padding={padding}
                                asModal={asModal}
                                id={id ? String(id) : undefined}
                                formData={section?.section_data?.form_data || ''}
                                form_id={form_id || ''}
                                career={career}
                            />
                        );
                    }
                    
                    return (
                        <SectionComponent
                            key={section.section_data?.id || idx}
                            data={section.section_data}
                        />
                    );
                })}
            </ViewTransition>
        </Suspense>
    );
}