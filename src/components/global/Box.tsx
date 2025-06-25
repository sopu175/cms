'use client'
import React from 'react';
import Link from "next/link";
import reactHtmlParser from "react-html-parser";
import Img from "@/components/ui/Img";

// TypeScript interfaces
interface Asset {
    thumb?: string;
    icon?: string;
    full_path: string;
}

interface Tag {
    title: string;
}

interface Text {
    title: string;
}

interface LinkItem {
    path: string;
    name: string;
}

interface Item {
    title?: string;
    subTitle?: string;
    assets?: Asset[];
    tags?: Tag[];
    texts?: Text[];
    links?: LinkItem[];
}

interface MyComponentProps {
    item: Item;
}

const MyComponent: React.FC<MyComponentProps> = ({ item }) => {
    const thumbImg = item?.assets?.find((e) => e?.thumb == 'on');
    const iconImg = item?.assets?.find((e) => e?.icon == 'on');

    return (
        <div className="single-box group">
            <div className="single-box__title mb-5">
                <div className="single-box__title-top flex justify-between mb-5">
                    <p className={'text-black'}>Date: 21.05.2024</p>
                    <p className={'text-black'}>Time: 12.30pm</p>
                </div>
                <h3 className="text-black text-2xl leading-9 font-bold mb-4">
                    Title : {item?.title}
                </h3>
                <h4 className="text-black text-xl leading-8 font-medium">
                    Subtitle: {item?.subTitle}
                </h4>
            </div>

            <div className="single-box__img h-[460px] relative bg-black">
                <div className="single-box__img-top absolute top-10 left-8 right-8 flex z-[999999]">
                    {item?.tags && item?.tags.length > 0 &&
                        item?.tags?.map((element, index) => {
                            return (
                                <span
                                    key={index}
                                    className="px-5 py-2.5 text-sm w-fit h-6 rounded-lg text-black bg-white flex justify-center items-center mr-1.5 last:mr-0"
                                >
                  {reactHtmlParser(element?.title)}
                </span>
                            );
                        })
                    }
                </div>
                <Img
                    srcLg={thumbImg?.full_path}
                    srcMd={thumbImg?.full_path}
                    widthPx={320}
                    heightPx={400}
                    alt={item?.title || "Thumbnail Image"}
                />

                {/* Hover Icon */}
                <div
                    className="single-box__hover-icon absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 ease-in-out z-[999999] pointer-events-none group-hover:opacity-100">
                    {iconImg ? (
                        <img
                            src={iconImg?.full_path}
                            alt="Hover Icon"
                            className="w-12 h-12 object-contain block contrast-150 brightness-110"
                        />
                    ) : (
                        <div className="fallback-icon text-4xl text-white font-bold">
                            ▶
                        </div>
                    )}
                </div>
            </div>

            <div className="single-box__bottom mt-5 pb-5 border-b-2 border-black">
                {item?.texts && item?.texts.length > 0 &&
                    item?.texts?.map((element, index) => {
                        return (
                            <p
                                key={index}
                                className="text-black text-base mb-4 last:mb-0"
                            >
                                Text {index + 1}: {reactHtmlParser(element?.title)}
                            </p>
                        );
                    })
                }
            </div>

            <div className="single-box__button flex mt-5">
                {item?.links && item?.links.length > 0 &&
                    item?.links?.map((link, index) => {
                        return (
                            <Link
                                key={index}
                                href={`${link?.path}`}
                                className="px-5 py-4 text-sm w-fit h-6 rounded-lg bg-white flex justify-center items-center border border-black mr-5 last:mr-0 !text-black"

                            >
                                {link?.name}
                            </Link>

                        );
                    })
                }
            </div>
        </div>
    );
};

export default MyComponent;