import React, { useEffect, useState } from "react";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-video.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgVideo from "lightgallery/plugins/video";
import { Play } from "lucide-react";
import Title from "@/components/ui/Title";

type GalleryItem = {
    id: string | number;
    type: "image" | "video";
    thumb: string;
    src: string;
    title?: string;
};

interface GalleryProps {
    items?: GalleryItem[];
}

const Gallery: React.FC<GalleryProps> = ({ items }) => {
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

    const data = {
        "galleries": {
            "list": [
                {
                    "items": [
                        {
                            "id": 374,
                            "short_title": "anwar_landmark",
                            "short_desc": "",
                            "img_alt": "anwar_landmark",
                            "file_format": "jpg",
                            "duration": null,
                            "thumb_image": "https://picsum.photos/seed/1/400/300",
                            "large_image": "https://picsum.photos/seed/1/1200/900"
                        },
                        {
                            "id": 375,
                            "short_title": "sample_video",
                            "short_desc": "",
                            "img_alt": "sample_video",
                            "file_format": "mp4",
                            "duration": null,
                            "thumb_image": "https://picsum.photos/seed/2/400/300",
                            // Using a more reliable video URL
                            "large_image": "/images/dynamic/banner.mp4"
                        },
                        {
                            "id": 376,
                            "short_title": "blue_sky",
                            "short_desc": "",
                            "img_alt": "blue_sky",
                            "file_format": "jpg",
                            "duration": null,
                            "thumb_image": "https://picsum.photos/seed/3/400/300",
                            "large_image": "https://picsum.photos/seed/3/1200/900"
                        },
                        {
                            "id": 377,
                            "short_title": "sunrise_view",
                            "short_desc": "",
                            "img_alt": "sunrise_view",
                            "file_format": "jpg",
                            "dimension": "1280x720",
                            "duration": null,
                            "thumb_image": "https://picsum.photos/seed/4/400/300",
                            "large_image": "https://picsum.photos/seed/4/1200/900"
                        },
                        {
                            "id": 378,
                            "short_title": "city_lights",
                            "short_desc": "",
                            "img_alt": "city_lights",
                            "file_format": "jpg",
                            "duration": null,
                            "thumb_image": "https://picsum.photos/seed/5/400/300",
                            "large_image": "https://picsum.photos/seed/5/1200/900"
                        },
                        {
                            "id": 379,
                            "short_title": "mountain_peak",
                            "short_desc": "",
                            "img_alt": "mountain_peak",
                            "file_format": "jpg",
                            "dimension": "1920x1080",
                            "duration": null,
                            "thumb_image": "https://picsum.photos/seed/6/400/300",
                            "large_image": "https://picsum.photos/seed/6/1200/900"
                        },
                        {
                            "id": 380,
                            "short_title": "desert_dunes",
                            "short_desc": "",
                            "img_alt": "desert_dunes",
                            "file_format": "jpg",
                            "dimension": "1920x1080",
                            "duration": null,
                            "thumb_image": "https://picsum.photos/seed/7/400/300",
                            "large_image": "https://picsum.photos/seed/7/1200/900"
                        },
                        {
                            "id": 381,
                            "short_title": "forest_path",
                            "short_desc": "",
                            "img_alt": "forest_path",
                            "file_format": "jpg",
                            "dimension": "1920x1080",
                            "duration": null,
                            "thumb_image": "https://picsum.photos/seed/8/400/300",
                            "large_image": "https://picsum.photos/seed/8/1200/900"
                        },
                        {
                            "id": 382,
                            "short_title": "nature_video",
                            "short_desc": "",
                            "img_alt": "nature_video",
                            "file_format": "mp4",
                            "duration": null,
                            "thumb_image": "https://picsum.photos/seed/9/400/300",
                            // Another working video URL
                            "large_image": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
                        }
                    ]
                }
            ]
        }
    };

    // Transform dataset to gallery items
    const transformDataset = (data: any): GalleryItem[] => {
        if (
            data.galleries &&
            data.galleries.list &&
            data.galleries.list[0] &&
            data.galleries.list[0].items
        ) {
            const items = data.galleries.list[0].items;
            return items
                .filter(
                    (item: any) =>
                        item &&
                        item.id &&
                        item.thumb_image &&
                        item.large_image 
                )
                .map((item: any) => ({
                    id: item.id,
                    type: item.file_format === 'mp4' ? 'video' : 'image',
                    thumb: item.thumb_image,
                    src: item.large_image,
                    title: item.short_title
                        ? item.short_title.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
                        : '',
                }));
        }

        if (Array.isArray(data)) {
            return data;
        }

        return [];
    };

    useEffect(() => {
        setGalleryItems(items || transformDataset(data));
    }, [items]);

    const onInit = () => {
        console.log('LightGallery has been initialized');
    };

    const onBeforeSlide = (detail: any) => {
        console.log('Before slide change:', detail);
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-6">
            <div className="text-center mb-12">
                <Title tag='h2' fontFamily='var(--var-dc--font-mono)' spanColor='var(--var-dc--error-color)' color='var(--var-dc--background)' textAlign='center'>
                    Media Gallery
                </Title>
                <p className="text-gray-600 text-lg">Discover our collection of stunning images and videos</p>
            </div>
            
            <LightGallery
                speed={500}
                plugins={[lgThumbnail, lgVideo]}
                onInit={onInit}
                onBeforeSlide={onBeforeSlide}
                elementClassNames="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                selector="a"
                // Video specific settings
                youTubePlayerParams={{
                    modestbranding: 1,
                    showinfo: 0,
                    rel: 0
                }}
                vimeoPlayerParams={{
                    byline: 0,
                    portrait: 0,
                    color: 'A90707'
                }}
                // Thumbnail settings
                thumbWidth={100}
                thumbHeight="80"
                thumbMargin={5}
                animateThumb={true}
                currentPagerPosition="middle"
                thumbnail={true}
            >
                {galleryItems.map((item) => (
                    <a
                        key={item.id}
                        href={item.src}
                        data-lg-size="1200-900"
                        data-sub-html={`<h4>${item.title}</h4>`}
                        {...(item.type === "video" && {
                            "data-poster": item.thumb,
                            "data-video": JSON.stringify({
                                source: [
                                    {
                                        src: item.src,
                                        type: "video/mp4"
                                    }
                                ],
                                attributes: {
                                    preload: "metadata",
                                    controls: true,
                                    playsinline: true,
                                    muted: false
                                }
                            })
                        })}
                        className="block group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white"
                    >
                        <div className="aspect-[4/3] overflow-hidden">
                            <img
                                src={item.thumb}
                                alt={item.title || "Gallery item"}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                loading="lazy"
                                onError={(e) => {
                                    console.error(`Failed to load thumbnail: ${item.thumb}`);
                                    // Fallback to a placeholder
                                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x300/cccccc/666666?text=${item.type}`;
                                }}
                            />
                        </div>
                        
                        {item.type === "video" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300">
                                <div className="bg-white bg-opacity-90 rounded-full p-4 backdrop-blur-sm transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <Play className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" />
                                </div>
                            </div>
                        )}
                        
                        {item.title && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent text-white p-4">
                                <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                            </div>
                        )}
                        
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white bg-opacity-90 rounded-full px-3 py-1 text-xs font-medium text-gray-800 backdrop-blur-sm">
                                {item.type === "video" ? "Video" : "Image"}
                            </div>
                        </div>
                    </a>
                ))}
            </LightGallery>
        </div>
    );
};

export default Gallery;