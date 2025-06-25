'use client';
import React, { useState, useEffect } from 'react';

type MediaItem = {
    src: string;
    thumb?: string;
    title?: string;
    type?: 'image' | 'video';
};

type GalleryNode = {
    id: number;
    title: string;
    description?: string;
    thumb?: string;
    media?: MediaItem[];
    children?: GalleryNode[];
};

type JsonData = {
    nested_gallery: GalleryNode;
};

interface NestedGalleryProps {
    data?: {
        gallery?: GalleryNode;
    };
}

const NestedGallery: React.FC<NestedGalleryProps> = ({ data }) => {
    const [stack, setStack] = useState<GalleryNode[]>([data?.gallery].filter(Boolean) as GalleryNode[]);
    const [nestedGalleryOpen, setNestedGalleryOpen] = useState<boolean>(false);
    const [currentImages, setCurrentImages] = useState<MediaItem[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
        if (!nestedGalleryOpen) return;
        e.preventDefault();

        switch (e.key) {
            case 'Escape':
                closeNestedGallery();
                break;
            case 'ArrowRight':
                nextImage();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
        }
    }, [nestedGalleryOpen, currentImages.length]);

    useEffect(() => {
        if (nestedGalleryOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                document.body.style.overflow = 'unset';
            };
        }
    }, [nestedGalleryOpen, handleKeyDown]);

    const current = stack[stack.length - 1];

    const openNestedGallery = (images: MediaItem[], startIndex: number = 0) => {
        setCurrentImages(images);
        setCurrentImageIndex(Math.max(0, Math.min(startIndex, images.length - 1)));
        setNestedGalleryOpen(true);
    };

    const closeNestedGallery = () => {
        setNestedGalleryOpen(false);
        setCurrentImages([]);
        setCurrentImageIndex(0);
    };

    const collectAllImages = (node: GalleryNode): MediaItem[] => {
        let items: MediaItem[] = [];

        if (node.media?.length) {
            const validMedia = node.media.filter((m) => m.src && m.src.trim() !== '');
            items.push(...validMedia.map((m) => ({
                src: m.src,
                thumb: m.thumb || m.src,
                title: m.title || 'Untitled',
                type: m.type || 'image',
            })));
        }

        if (node.children?.length) {
            for (const child of node.children) {
                items.push(...collectAllImages(child));
            }
        }

        return items;
    };

    const hasValidMedia = (node: GalleryNode): boolean =>
        Boolean(node.media?.some((m) => m.src && m.src.trim() !== ''));

    const nextImage = () => {
        if (currentImages.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % currentImages.length);
        }
    };

    const prevImage = () => {
        if (currentImages.length > 1) {
            setCurrentImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
        }
    };

    const handleBack = () => {
        if (stack.length > 1) {
            setStack((prev) => prev.slice(0, -1));
        }
    };

    const getDisplayThumb = (node: GalleryNode): string => {
        // Try media thumb first
        if (node.media?.[0]?.thumb) return node.media[0].thumb;

        // Try media src as fallback
        if (node.media?.[0]?.src) return node.media[0].src;

        // Try node thumb
        if (node.thumb) return node.thumb;

        // Try children recursively
        if (node.children?.length) {
            for (const child of node.children) {
                const childThumb = getDisplayThumb(child);
                if (childThumb !== 'https://via.placeholder.com/200x200?text=No+Thumbnail') {
                    return childThumb;
                }
            }
        }

        return 'https://via.placeholder.com/200x200?text=No+Thumbnail';
    };

    const getSiblingMediaFromParent = (
        parentNode: GalleryNode,
        clickedChildId: number
    ): { allSiblingMedia: MediaItem[]; startIndex: number } => {
        const siblings = parentNode?.children || [];
        const allSiblingMedia = siblings.flatMap((child) =>
            child.media
                ?.filter((m) => m.src && m.src.trim() !== '')
                .map((m) => ({
                    src: m.src,
                    thumb: m.thumb || m.src,
                    title: m.title || child.title || 'Untitled',
                    type: m.type || 'image',
                })) || []
        );

        const clickedChild = siblings.find((child) => child.id === clickedChildId);
        if (!clickedChild) {
            return { allSiblingMedia, startIndex: 0 };
        }

        const clickedMedia = collectAllImages(clickedChild);
        const startIndex = allSiblingMedia.findIndex(
            (m) => m.src === clickedMedia?.[0]?.src
        );

        return {
            allSiblingMedia,
            startIndex: startIndex !== -1 ? startIndex : 0
        };
    };

    // Loading state
    if (loading) {
        return (
            <div className="p-16 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <div className="text-gray-600">Loading gallery...</div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-16 text-center min-h-[400px] flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <div className="text-red-600 text-xl mb-2">⚠️</div>
                    <h3 className="text-red-800 font-semibold mb-2">Gallery Load Failed</h3>
                    <p className="text-red-600 mb-4 text-sm">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // No data state
    if (!data?.gallery || !current) {
        return (
            <div className="p-16 text-center min-h-[400px] flex items-center justify-center">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
                    <div className="text-yellow-600 text-xl mb-2">📁</div>
                    <h3 className="text-yellow-800 font-semibold mb-2">No Gallery Data</h3>
                    <p className="text-yellow-600 text-sm">The gallery configuration is empty or invalid.</p>
                </div>
            </div>
        );
    }

    // No image state
    const allImages = collectAllImages(current);
    if (allImages.length === 0) {
        return (
            <div className="p-16 text-center min-h-[400px] flex items-center justify-center">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
                    <div className="text-yellow-600 text-xl mb-2">🖼️</div>
                    <h3 className="text-yellow-800 font-semibold mb-2">No image found</h3>
                    <p className="text-yellow-600 text-sm">There are no images available in this gallery.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-[120px] pb-[120px]">
            <div className={'container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  text-white'}>
                {stack.length > 1 && (
                    <button
                        onClick={handleBack}
                        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                        <span>←</span> Back
                    </button>
                )}

                <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">{current.title}</h2>
                    {current.description && (
                        <p className="text-gray-600 text-sm md:text-base">{current.description}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {current.children?.map((child) => {
                        const media = child.media?.find((m) => m.src && m.src.trim() !== '');
                        const isVideo = media?.type === 'video';
                        const thumb = getDisplayThumb(child);

                        return (
                            <div
                                key={child.id}
                                onClick={() => {
                                    if (child.children && child.children.length > 0) {
                                        setStack((prev) => [...prev, child]);
                                    } else if (hasValidMedia(child)) {
                                        const parentNode = stack[stack.length - 1];
                                        const { allSiblingMedia, startIndex } =
                                            getSiblingMediaFromParent(parentNode, child.id);

                                        if (allSiblingMedia.length > 0) {
                                            openNestedGallery(allSiblingMedia, startIndex);
                                        } else {
                                            const selfMedia = collectAllImages(child);
                                            if (selfMedia.length > 0) {
                                                openNestedGallery(selfMedia, 0);
                                            } else {
                                                alert('No image found');
                                            }
                                        }
                                    } else {
                                        alert('No image found');
                                    }
                                }}
                                className="relative cursor-pointer rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition-transform duration-200 group bg-gray-100"
                            >
                                <img
                                    src={thumb}
                                    alt={child.title}
                                    className="w-full h-48 object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://via.placeholder.com/200x200?text=Image+Error';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80"></div>

                                {isVideo && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg
                                            className="w-12 h-12 text-white opacity-90 drop-shadow-lg"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                )}

                                <div className="absolute bottom-2 left-3 right-3 text-white">
                                    <div className="font-bold text-sm sm:text-base drop-shadow-lg line-clamp-2">
                                        {child.title}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Modal Gallery */}
                {nestedGalleryOpen && currentImages.length > 0 && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
                        onClick={closeNestedGallery}
                    >
                        <div
                            className="relative max-w-5xl max-h-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button
                                onClick={closeNestedGallery}
                                className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-20 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
                            >
                                ×
                            </button>

                            {/* Navigation buttons */}
                            {currentImages.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-gray-300 z-20 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
                                    >
                                        ‹
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-gray-300 z-20 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
                                    >
                                        ›
                                    </button>
                                </>
                            )}

                            {/* Media content */}
                            {currentImages[currentImageIndex]?.type === 'video' ? (
                                <video
                                    key={currentImages[currentImageIndex].src}
                                    src={currentImages[currentImageIndex].src}
                                    controls
                                    autoPlay
                                    muted
                                    playsInline
                                    className="max-w-full max-h-[80vh] object-contain"
                                    onError={() => {
                                        console.error('Video failed to load:', currentImages[currentImageIndex].src);
                                    }}
                                />
                            ) : (
                                <img
                                    src={currentImages[currentImageIndex].src}
                                    alt={currentImages[currentImageIndex]?.title}
                                    className="max-w-full max-h-[80vh] object-contain"
                                    onError={(e) => {
                                        console.error('Image failed to load:', currentImages[currentImageIndex].src);
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                                    }}
                                />
                            )}

                            {/* Image info */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center bg-black bg-opacity-50 rounded-lg px-4 py-2">
                                {currentImages[currentImageIndex]?.title && (
                                    <p className="text-lg font-semibold mb-1">
                                        {currentImages[currentImageIndex].title}
                                    </p>
                                )}
                                <p className="text-sm text-gray-300">
                                    {currentImageIndex + 1} / {currentImages.length}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NestedGallery;