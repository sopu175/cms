'use client';

import React, {unstable_ViewTransition as ViewTransition, useEffect, useState} from 'react';
import Title from "@/components/ui/Title";
import Paragraph from "@/components/ui/Paragraph";
import PictureImg from '../ui/PictureImg';
import Button from '../ui/Button';

interface BannerAsset {
    id: number;
    full_path: string;
    cdn_path: string;
    banner?: string;
    thumb?: string;
}

interface BannerText {
    title: string;
}

interface BannerLink {
    name: string;
    path: string;
    target: string;
}

interface BannerData {
    id: number;
    postName: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    subTitle: string;
    description: string | null;
    texts: BannerText[];
    links: BannerLink[];
    tag: any[];
    tempalte: string;
    assets: BannerAsset[];
}

interface BannerProps {
  data?: {
    data?: BannerData[];
  };
}

const Banner: React.FC<BannerProps> = ({ data }) => {
    const banners = data?.data || [];
    const [activeSliderId, setActiveSliderId] = useState<number>(banners[0]?.id || 0);

    useEffect(() => {
        if (banners.length > 0) {
            const currentBannerExists = banners.some(banner => banner.id === activeSliderId);
            if (!currentBannerExists) {
                setActiveSliderId(banners[0].id);
            }
        }
    }, [banners, activeSliderId]);
    
    if (!banners || banners.length === 0) {
        return (
            <ViewTransition>
                <div className="pt-52 min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-xl mb-4">No Banner Data Available</div>
                        <div className="text-sm text-gray-400 mb-4">Please check the console for debugging information</div>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            </ViewTransition>
        );
    }

    const currentBanner = banners.find(banner => banner.id === activeSliderId) || banners[0];
    const bannerAssets = currentBanner.assets || [];
    const bannerImage = bannerAssets.find(asset => asset.banner === "on");
    const thumbImage = bannerAssets.find(asset => asset.thumb === "on");

    return (
        <div className={'bg-gray-900 text-white'}>
            <div className={'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
                <div className="pt-40 pb-40 min-h-screen">
                    <div className="mx-auto container">
                        {/* Header Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                            <div className="lg:col-span-6 space-y-8 order-2 lg:order-1">
                                {/* Date and Version Info */}
                                <div className="flex gap-[180px] text-sm mb-16">
                                    <Paragraph textOne={'Date'} fontSize={'0.75rem'} fontWeight={'600'}/>
                                    <Paragraph textOne={'JSON version'} fontSize={'0.75rem'} fontWeight={'600'}/>
                                </div>

                                {/* Main Title */}
                                <div className="space-y-4">
                                    <Title tag="h2" margin="0 0 30px 0" fontSize="var(--var-dc--font-size-5xl)"
                                           fontWeight="700" letterSpacing="-0.88px">
                                        {currentBanner.title}
                                    </Title>
                                    <div className="flex gap-1 mb-[80px]">
                                        <Paragraph textOne={'Subtitle:'} fontWeight="700" fontSize="0.875rem"/>
                                        <Paragraph textOne={currentBanner.subTitle} fontSize="0.875rem"/>
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="mb-[100px]">
                                    {currentBanner.texts.map((text, index) => (
                                        <div key={index} className="space-y-2 mb-[35px]">
                                            <div className="flex gap-1">
                                            <span
                                                className="whitespace-nowrap text-[0.875rem] font-bold">Text {index + 1}:</span>
                                                <Paragraph textOne={text.title} fontWeight="500" fontSize="0.875rem"/>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Navigation Links */}
                                <div className="flex flex-wrap gap-4 pt-8">
                                    {currentBanner.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            src={link.path}
                                            color='white'
                                            text={link.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="lg:col-span-6 lg:col-start-9 space-y-8 order-1 lg:order-2">
                                {/* Image Sets */}
                                <div className="space-y-3">

                                    <div className="space-y-2 text-sm text-gray-400">
                                        {bannerImage && (
                                            <PictureImg
                                                alt={currentBanner.title}
                                                srcLg={bannerImage.full_path}
                                                srcMd={bannerImage.full_path}
                                                srcSm={bannerImage.full_path}
                                                widthPx={1920}
                                                heightPx={1280}
                                            />
                                        )}

                                    </div>
                                </div>

                                {/* Child Dataset */}
                                <div className="mb-5 pt-4">
                                    <h3 className="text-yellow-400 font-medium">No child data found</h3>

                                </div>

                                {/* Tags */}
                                {currentBanner.tag && currentBanner.tag.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-4">
                                        {currentBanner.tag.map((tag: any, index: number) => (
                                            <Button
                                                key={index}
                                                src=''
                                                color='black'
                                                text={tag.name || `Tag ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bottom Section - Post Slider */}
                        <div className="border-t border-gray-700 pt-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {banners.map((banner) => (
                                    <div
                                        key={banner.id}
                                        className="space-y-2 cursor-pointer"
                                        onClick={() => setActiveSliderId(banner.id)}
                                    >
                                        <h3 className={`text-xl font-medium transition-colors duration-200 ${
                                            activeSliderId === banner.id ? 'text-white' : 'text-gray-400'
                                        }`}>
                                            {`Slider ${banner.id}: ${banner.postName}`}
                                        </h3>
                                        {activeSliderId === banner.id && (
                                            <div className="w-12 h-1 bg-white rounded"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;
