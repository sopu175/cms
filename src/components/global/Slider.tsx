"use client"
import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from "swiper/modules"; // Added Autoplay module
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import NavigationButtons from "./NavigationButtons";
import Box from "./Box";
import Title from "../ui/Title";

// TypeScript interfaces
interface BannerItem {
    id: string | number;
    [key: string]: any;
}

interface BannersData {
    data: BannerItem[];
    speed?: number;
    loop?: boolean | string; // Can be boolean or string
    autoplayDelay?: number; // Added for autoplay delay
    [key: string]: any;
}

interface StrengthProps {
    data?: BannersData;
}

const Strength: React.FC<StrengthProps> = ({ data }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isBeginning, setIsBeginning] = useState<boolean>(true);
    const [isEnd, setIsEnd] = useState<boolean>(false);
    const swiperRef = useRef<SwiperType | null>(null);

    console.log('Received banners data:', data);

    const totalItems = data?.data?.length || 0;

    const handlePrevious = () => {
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
        }
    };

    const handleNext = () => {
        if (swiperRef.current) {
            swiperRef.current.slideNext();
        }
    };

    const handleSlideChange = (swiper: SwiperType) => {
        setCurrentIndex(swiper.activeIndex);
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    // Convert loop value to boolean
    const shouldLoop = data?.loop === true || data?.loop === 'true';

    // Set default values
    const swiperSpeed = data?.speed || 300;
    const autoplayDelay = data?.autoplayDelay || 3000; // Default 3 seconds

    if (!data?.data || data.data.length === 0) {
        return (
            <section className="pt-[120px] bg-[#F6F9FF] relative -mt-[5px] pb-[140px] max-md:pb-[70px] max-md:bg-[#F5EFE9] max-md:px-[30px]">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="text-center">
                        <p>No banner data available</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="pt-[120px] bg-[#F6F9FF] relative -mt-[5px] pb-[120px] max-md:pb-[70px] max-md:bg-[#F5EFE9] max-md:px-[30px]">
            {/* Header Section */}
            <div className="max-w-[1200px] mx-auto px-4">
                <div className="flex flex-wrap -mx-4">
                    <div className="w-full md:w-2/3 px-4">
                        <Title
                            tag={'h2'}
                            margin={'0 0 30px 0'}
                            fontSize={'2.5rem'}
                            fontWeight={'700'}
                            letterSpacing={'-0.88px'}
                            color={'black'}
                        >
                            Inspiring Innovation
                        </Title>
                    </div>
                    {data?.data?.length && data.data.length > 3 && (
                        <div className="w-full md:w-1/6 md:ml-auto px-4">
                            <NavigationButtons
                                prevLiClassName="slider1-prev"
                                nextLiClassName="slider1-next"
                                prevLiId="prev_swipper"
                                nextLiId="next_swipper"
                                isBeginning={isBeginning}
                                isEnd={isEnd}
                                onPrevious={handlePrevious}
                                onNext={handleNext}
                                size={44}
                                svgColor="#fff"
                                backgroundColor="#0070f3"
                                borderRadius="50%"
                                hoverSvgColor="#ffffff"
                                hoverBackgroundColor="#0051a3"
                                disabledBackgroundColor="#ccc"
                                className="my-custom-class"
                                padding="12px"
                                margin="6px"
                                gap="0px"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-[1200px] mx-auto px-4">
                <div className="flex flex-wrap -mx-4">
                    {data?.data?.length && data.data.length > 3 ? (
                        <div className="w-full">
                            <div className="swiper-container mr-[15px] max-md:mr-0">
                                <style jsx>{`
                                    .swiper-container .swiper-initialized {
                                        padding-right: 15px;
                                    }
                                    @media (max-width: 767px) {
                                        .swiper-container .swiper-initialized {
                                            padding-right: 0 !important;
                                            width: 100%;
                                        }
                                    }
                                    .swiper-container .swiper-button-prev,
                                    .swiper-container .swiper-button-next {
                                        opacity: 0;
                                    }
                                    .swiper-container .swiper-wrapper {
                                        height: auto !important;
                                        margin-left: 15px;
                                        margin-right: 15px;
                                    }
                                    @media (max-width: 767px) {
                                        .swiper-container .swiper-wrapper {
                                            margin-left: 0px;
                                            margin-right: 0px;
                                        }
                                    }
                                    .swiper-container .swiper-slide {
                                        width: 370px;
                                    }
                                `}</style>
                                <Swiper
                                    onSwiper={(swiper) => {
                                        swiperRef.current = swiper;
                                    }}
                                    onSlideChange={handleSlideChange}
                                    spaceBetween={30}
                                    slidesPerView={3}
                                    slideNextClass={'.next'}
                                    allowSlideNext={true}
                                    slidePrevClass={'.prev'}
                                    allowSlidePrev={true}
                                    allowTouchMove={true}
                                    longSwipesMs={900}
                                    speed={swiperSpeed} // Fixed: use processed speed
                                    loop={shouldLoop} // Fixed: convert to boolean
                                    autoplay={shouldLoop ? { // Only enable autoplay if loop is enabled
                                        delay: autoplayDelay,
                                        disableOnInteraction: false,
                                        pauseOnMouseEnter: true, // Pause on hover
                                    } : false}
                                    breakpoints={{
                                        320: {
                                            slidesPerView: 1,
                                            spaceBetween: 30,
                                        },
                                        768: {
                                            slidesPerView: 2,
                                            spaceBetween: 30,
                                        },
                                        1024: {
                                            slidesPerView: 3,
                                            spaceBetween: 30,
                                        },
                                    }}
                                    navigation={{
                                        prevEl: '#prev_swipper',
                                        nextEl: '#next_swipper',
                                    }}
                                    modules={[Navigation, Autoplay]} // Added Autoplay module
                                >
                                    {data?.data &&
                                        data.data.length > 0 &&
                                        data.data.map((item: BannerItem) => {
                                            return (
                                                <SwiperSlide key={item.id}>
                                                    <Box item={item} />
                                                </SwiperSlide>
                                            );
                                        })}
                                </Swiper>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full">
                            <div className="flex flex-wrap -mx-4">
                                {data?.data &&
                                    data.data.length > 0 &&
                                    data.data.map((item: BannerItem, index: number) => {
                                        const totalItems = data?.data?.length || 0;
                                        let colClasses = "w-full md:w-1/3 px-4";

                                        if (totalItems === 1) {
                                            colClasses = "w-full px-4";
                                        } else if (totalItems === 2) {
                                            colClasses = index === 0 ? "w-full md:w-2/3 px-4" : "w-full md:w-1/3 px-4";
                                        }

                                        return (
                                            <div className={colClasses} key={item.id}>
                                                <Box item={item} />
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Strength;