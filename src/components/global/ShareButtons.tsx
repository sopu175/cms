'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    EmailShareButton,
    WhatsappShareButton,
    TelegramShareButton,
    PinterestShareButton,
    RedditShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    EmailIcon,
    WhatsappIcon,
    TelegramIcon,
    PinterestIcon,
    RedditIcon,
} from 'react-share';

/**
 * ShareButtons Component
 * 
 * A comprehensive and accessible social sharing component that uses react-share npm package
 * for reliable platform-specific sharing. Features include customizable styling, tooltips,
 * and responsive design with various styling options.
 * 
 * Automatically detects and shares the current page URL.
 * Uses CSS variables from global.css for consistent styling.
 * 
 * @example
 * Basic usage with default sharing options:
 * ```tsx
 * import { ShareButtons } from '@/components/global/ShareButtons';
 * 
 * <ShareButtons 
 *   title="Amazing Article Title"
 *   description="Check out this amazing article!"
 *   variant="primary"
 *   size="md"
 * />
 * ```
 * 
 * @example
 * Custom platforms and styling:
 * ```tsx
 * <ShareButtons 
 *   title="My Content"
 *   description="Check this out!"
 *   platforms={['facebook', 'twitter', 'linkedin', 'email', 'whatsapp']}
 *   variant="custom"
 *   customVariantClasses="bg-gradient-to-r from-purple-500 to-pink-500"
 *   showLabels={true}
 * />
 * ```
 */

/** Supported react-share platform names */
export type ReactSharePlatform = 'facebook' | 'twitter' | 'linkedin' | 'email' | 'whatsapp' | 'telegram' | 'pinterest' | 'reddit';

/** Data structure for sharing content */
export interface ShareData {
    /** URL to be shared */
    url: string;
    /** Title of the content */
    title?: string;
    /** Description or summary of the content */
    description?: string;
    /** Image URL for platforms that support it */
    image?: string;
    /** Hashtags for social platforms */
    hashtags?: string[];
    /** Via/from attribution */
    via?: string;
}

/** Main component props interface */
export interface ShareButtonsProps {
    /** Title of the content being shared */
    title?: string;
    /** Description or summary of the content */
    description?: string;
    /** Image URL for platforms that support it */
    image?: string;
    /** Hashtags for social platforms */
    hashtags?: string[];
    /** Via/from attribution */
    via?: string;
    /** React-share platforms to include */
    platforms?: ReactSharePlatform[];
    /** Size of the buttons and icons */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** Tailwind spacing class for gap between buttons (e.g., 'gap-4') */
    spacing?: string;
    /** Additional CSS classes for the container */
    className?: string;
    /** Color variant for the buttons */
    variant?: 'primary' | 'secondary' | 'muted' | 'dark' | 'custom';
    /** Whether to show pulse animation */
    pulse?: boolean;
    /** Whether to show bounce animation on hover */
    bounce?: boolean;
    /** Whether to show shadow effects */
    shadow?: boolean;
    /** Border radius variant */
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    /** Position of tooltips relative to buttons */
    tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
    /** Delay before showing tooltips (in milliseconds) */
    tooltipDelay?: number;
    /** Whether to show tooltips at all */
    showTooltips?: boolean;
    /** Whether to show platform labels */
    showLabels?: boolean;
    /** Custom CSS classes for custom variant styling */
    customVariantClasses?: string;
    /** Custom background color */
    backgroundColor?: string;
    /** Custom text color */
    textColor?: string;
    /** Custom border color */
    borderColor?: string;
    /** Custom hover background color */
    hoverBackgroundColor?: string;
    /** Custom hover text color */
    hoverTextColor?: string;
    /** Custom hover border color */
    hoverBorderColor?: string;
    /** Custom icon size in pixels (overrides size-based icon sizing) */
    iconSize?: number;
    /** Callback function when sharing occurs */
    onShare?: (platform: string, data: ShareData) => void;
}

/** Icon size mapping in pixels for different size variants */
const iconSizes = {
    sm: 16,  // Small icons (16px)
    md: 20,  // Medium icons (20px) - default
    lg: 24,  // Large icons (24px)
    xl: 28,  // Extra large icons (28px)
};

/** Container padding mapping for different size variants using CSS variables */
const containerPadding = {
    sm: '8px',      // Small padding (8px)
    md: '12px',     // Medium padding (12px) - default
    lg: '16px',     // Large padding (16px)
    xl: '20px',     // Extra large padding (20px)
};

/** Default sharing platforms */
const defaultPlatforms: ReactSharePlatform[] = ['facebook', 'twitter', 'linkedin', 'email'];

/** React-share platform configurations */
const reactShareConfig = {
    facebook: {
        button: FacebookShareButton,
        icon: FacebookIcon,
        label: 'Share on Facebook',
        color: '#1877F2',
    },
    twitter: {
        button: TwitterShareButton,
        icon: TwitterIcon,
        label: 'Share on Twitter',
        color: '#1DA1F2',
    },
    linkedin: {
        button: LinkedinShareButton,
        icon: LinkedinIcon,
        label: 'Share on LinkedIn',
        color: '#0A66C2',
    },
    email: {
        button: EmailShareButton,
        icon: EmailIcon,
        label: 'Share via Email',
        color: '#EA4335',
    },
    whatsapp: {
        button: WhatsappShareButton,
        icon: WhatsappIcon,
        label: 'Share on WhatsApp',
        color: '#25D366',
    },
    telegram: {
        button: TelegramShareButton,
        icon: TelegramIcon,
        label: 'Share on Telegram',
        color: '#0088cc',
    },
    pinterest: {
        button: PinterestShareButton,
        icon: PinterestIcon,
        label: 'Share on Pinterest',
        color: '#E60023',
    },
    reddit: {
        button: RedditShareButton,
        icon: RedditIcon,
        label: 'Share on Reddit',
        color: '#FF4500',
    },
};

/**
 * Tooltip Component
 * 
 * A reusable tooltip component that displays contextual information
 * with configurable positioning and smooth animations.
 * Uses CSS variables from global.css for consistent styling.
 * 
 * @param content - The tooltip text content
 * @param position - The position relative to the trigger element
 * @param isVisible - Whether the tooltip should be visible
 * @param children - The trigger element that shows the tooltip
 */
const Tooltip: React.FC<{
    content: string;
    position: 'top' | 'bottom' | 'left' | 'right';
    isVisible: boolean;
    children: React.ReactNode;
}> = ({ content, position, isVisible, children }) => {
    /** CSS classes for different tooltip positions */
    const positionClasses = {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    };

    /** CSS classes for tooltip arrows pointing to the trigger element */
    const arrowClasses = {
        top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-800',
        bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800',
        left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-800',
        right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-800',
    };

    return (
        <div className="relative inline-block">
            {children}
            {isVisible && (
                <div
                    className={`absolute z-50 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg whitespace-nowrap transition-opacity duration-200 ${positionClasses[position]}`}
                    style={{
                        fontSize: 'var(--var-dc--font-size-xs)',
                        borderRadius: 'var(--var-dc--border-radius)',
                        transition: `opacity var(--var-dc--transition-speed) ease`,
                    }}
                    role="tooltip"
                >
                    {content}
                    {/* Tooltip arrow pointing to the trigger element */}
                    <div className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`} />
                </div>
            )}
        </div>
    );
};

/**
 * ShareButtons Component
 *
 * Renders a collection of social sharing buttons using react-share package with enhanced functionality including:
 * - Multiple sharing platforms (Facebook, Twitter, LinkedIn, Email, WhatsApp, etc.)
 * - Platform-specific sharing URLs and parameters
 * - Configurable tooltips with positioning and delay
 * - Keyboard navigation and accessibility features
 * - Responsive design with various styling options
 * - Automatic current page URL detection
 * - Uses CSS variables from global.css for consistent styling
 *
 * <ShareButtons
 *                 title="Complete Sharing"
 *                 description="Share everywhere"
 *                 platforms={['facebook', 'twitter', 'linkedin', 'email', 'whatsapp']}
 *                 variant="primary"
 *                 iconSize={28}
 *                 size="sm"
 *                 spacing="gap-6"
 *                 backgroundColor="var(--var-dc--background)"
 *                 textColor="var(--var-dc--text)"
 *                 borderColor="var(--var-dc--border)"
 *                 hoverBackgroundColor="var(--var-dc--hover-background)"
 *                 hoverTextColor="var(--var-dc--hover-text)"
 *                 hoverBorderColor="var(--var-dc--hover-border)"
 *             />
 *
 * @param title - Title of the content being shared
 * @param description - Description or summary of the content
 * @param image - Image URL for platforms that support it
 * @param hashtags - Hashtags for social platforms
 * @param via - Via/from attribution
 * @param platforms - React-share platforms to include
 * @param size - Size variant for buttons and icons
 * @param spacing - Tailwind spacing class for gaps
 * @param className - Additional CSS classes
 * @param variant - Color variant for styling
 * @param pulse - Whether to show pulse animation
 * @param bounce - Whether to show bounce animation on hover
 * @param shadow - Whether to show shadow effects
 * @param rounded - Border radius variant
 * @param tooltipPosition - Position of tooltips
 * @param tooltipDelay - Delay before showing tooltips
 * @param showTooltips - Whether to show tooltips
 * @param showLabels - Whether to show platform labels
 * @param customVariantClasses - Custom CSS classes for custom variant
 * @param backgroundColor - Custom background color for buttons
 * @param textColor - Custom text color for buttons
 * @param borderColor - Custom border color for buttons
 * @param hoverBackgroundColor - Custom background color on hover
 * @param hoverTextColor - Custom text color on hover
 * @param hoverBorderColor - Custom border color on hover
 * @param iconSize - Custom icon size in pixels (overrides size-based icon sizing)
 * @param onShare - Callback function when sharing occurs
 */
const ShareButtons: React.FC<ShareButtonsProps> = ({
    title = '',
    description = '',
    image = '',
    hashtags = [],
    via = '',
    platforms = defaultPlatforms,
    size = 'md',
    spacing = 'gap-4',
    className = '',
    variant = 'primary',
    pulse = false,
    bounce = true,
    shadow = true,
    rounded = 'full',
    tooltipPosition = 'top',
    tooltipDelay = 300,
    showTooltips = true,
    showLabels = false,
    customVariantClasses = '',
    backgroundColor,
    textColor,
    borderColor,
    hoverBackgroundColor,
    hoverTextColor,
    hoverBorderColor,
    iconSize,
    onShare,
}) => {
    /** State to track which tooltips are currently visible */
    const [tooltipStates, setTooltipStates] = useState<{ [key: number]: boolean }>({});
    
    /** State to track which buttons are being hovered */
    const [hoverStates, setHoverStates] = useState<{ [key: number]: boolean }>({});
    
    /** Refs to store timeout IDs for tooltip delays */
    const tooltipTimeouts = useRef<{ [key: number]: NodeJS.Timeout }>({});

    /**
     * Cleanup function to clear all tooltip timeouts on component unmount
     * Prevents memory leaks from pending timeouts
     */
    useEffect(() => {
        return () => {
            Object.values(tooltipTimeouts.current).forEach(timeout => {
                clearTimeout(timeout);
            });
        };
    }, []);

    /**
     * Shows tooltip for a specific button after the configured delay
     * Handles timeout management to prevent multiple tooltips from conflicting
     * 
     * @param index - Index of the button to show tooltip for
     */
    const showTooltip = (index: number) => {
        if (!showTooltips) return;
        
        // Clear existing timeout to prevent multiple tooltips
        if (tooltipTimeouts.current[index]) {
            clearTimeout(tooltipTimeouts.current[index]);
        }

        // Set new timeout for tooltip display
        tooltipTimeouts.current[index] = setTimeout(() => {
            setTooltipStates(prev => ({ ...prev, [index]: true }));
        }, tooltipDelay);
    };

    /**
     * Hides tooltip for a specific button immediately
     * Clears any pending timeout to ensure immediate response
     * 
     * @param index - Index of the button to hide tooltip for
     */
    const hideTooltip = (index: number) => {
        if (tooltipTimeouts.current[index]) {
            clearTimeout(tooltipTimeouts.current[index]);
        }
        setTooltipStates(prev => ({ ...prev, [index]: false }));
    };

    /**
     * Sets hover state for a specific button
     * 
     * @param index - Index of the button
     * @param isHovered - Whether the button is being hovered
     */
    const setHoverState = (index: number, isHovered: boolean) => {
        setHoverStates(prev => ({ ...prev, [index]: isHovered }));
    };

    /** Base container classes for the share buttons wrapper */
    const containerBase = `inline-flex ${spacing} ${className}`;

    /** Color variant configurations with hover and focus states using CSS variables */
    const getVariantStyles = (variantType: string, isHovered: boolean = false) => {
        const baseStyles = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: `all var(--var-dc--transition-speed) ease`,
            borderRadius: rounded === 'full' ? '50%' : 
                         rounded === 'lg' ? 'var(--var-dc--border-radius)' :
                         rounded === 'md' ? 'calc(var(--var-dc--border-radius) * 0.75)' :
                         rounded === 'sm' ? 'calc(var(--var-dc--border-radius) * 0.5)' : '0',
            padding: containerPadding[size],
            fontFamily: 'var(--var-dc--font-primary)',
            fontSize: 'var(--var-dc--font-size-sm)',
            fontWeight: 'var(--var-dc--font-weight-medium)',
        };

        // Use custom colors if provided, otherwise use variant colors
        const bgColor = backgroundColor || (isHovered && hoverBackgroundColor) || 
                       (variantType === 'primary' ? 'var(--var-dc--primary-color)' :
                        variantType === 'secondary' ? 'var(--var-dc--secondary-color)' :
                        variantType === 'muted' ? 'var(--var-dc--background)' :
                        variantType === 'dark' ? 'var(--var-dc--foreground)' :
                        isHovered ? 'var(--var-dc--success-color)' : 'var(--var-dc--primary-color)');

        const txtColor = textColor || (isHovered && hoverTextColor) || 
                        (variantType === 'muted' && isHovered ? 'var(--var-dc--background)' : 'var(--var-dc--background)');

        const brdColor = borderColor || (isHovered && hoverBorderColor) || 
                        (variantType === 'muted' ? 'var(--var-dc--border-radius)' : 'transparent');

        return {
            ...baseStyles,
            backgroundColor: bgColor,
            color: txtColor,
            ...(variantType === 'muted' && { border: `1px solid ${brdColor}` }),
        };
    };

    /**
     * Generates sharing data object with all available content
     * 
     * @returns ShareData object with all sharing information
     */
    const getShareData = (): ShareData => ({
        url: typeof window !== 'undefined' ? window.location.href : 'https://example.com',
        title,
        description,
        image,
        hashtags,
        via,
    });

    /**
     * Renders react-share buttons
     * Uses react-share package for reliable platform integration
     */
    const renderShareButtons = () => {
        const shareData = getShareData();
        const finalIconSize = iconSize || iconSizes[size];
        const url = typeof window !== 'undefined' ? window.location.href : '';

        return platforms.map((platformName, index) => {
            const config = reactShareConfig[platformName];
            if (!config) return null;

            const { button: ShareButton, icon: ShareIcon, label } = config;
            const tooltipVisible = tooltipStates[index];
            const isHovered = hoverStates[index];
            const tooltipText = label;

            /** Dynamic styles for each share button using CSS variables */
            const buttonStyles = {
                ...getVariantStyles(variant, isHovered),
                ...(shadow && {
                    boxShadow: isHovered 
                        ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }),
                ...(bounce && isHovered && {
                    transform: 'scale(1.1)',
                }),
                ...(pulse && {
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }),
            };

            const handleShareSuccess = () => {
                onShare?.(platformName, shareData);
            };

            return (
                <Tooltip
                    key={platformName}
                    content={tooltipText}
                    position={tooltipPosition}
                    isVisible={tooltipVisible && !!tooltipText}
                >
                    <div
                        onMouseEnter={() => {
                            showTooltip(index);
                            setHoverState(index, true);
                        }}
                        onMouseLeave={() => {
                            hideTooltip(index);
                            setHoverState(index, false);
                        }}
                        onFocus={() => showTooltip(index)}
                        onBlur={() => hideTooltip(index)}
                    >
                        {/* Using 'any' here because different react-share components require different props */}
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <ShareButton {...({ url, title, hashtags, beforeOnClick: handleShareSuccess, style: buttonStyles, className: variant === 'custom' ? customVariantClasses : '' } as any)}>
                            <ShareIcon size={finalIconSize} round />
                            {showLabels && (
                                <span 
                                    className="ml-2"
                                    style={{
                                        fontSize: 'var(--var-dc--font-size-sm)',
                                        fontWeight: 'var(--var-dc--font-weight-medium)',
                                        marginLeft: 'var(--var-dc--spacing-20)',
                                    }}
                                >
                                    {label}
                                </span>
                            )}
                        </ShareButton>
                    </div>
                </Tooltip>
            );
        });
    };

    return (
        <div 
            className={containerBase} 
            role="group" 
            aria-label="Social sharing buttons"
            style={{
                fontFamily: 'var(--var-dc--font-primary)',
            }}
        >
            {renderShareButtons()}
        </div>
    );
};

export default ShareButtons; 