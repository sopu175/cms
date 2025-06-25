'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * SocialIcons Component
 * 
 * A flexible and accessible social media icons component that supports multiple icon types,
 * customizable tooltips, various styling options, and enhanced user interactions.
 * Features include hover effects, keyboard navigation, disabled states, and robust error handling.
 * 
 * @example
 * Basic usage with Lucide icons:
 * ```tsx
 * import { Facebook, Twitter, Instagram } from 'lucide-react';
 * 
 * const socialItems = [
 *   { icon: Facebook, url: "https://facebook.com", tooltip: "Follow us on Facebook" },
 *   { icon: Twitter, url: "https://twitter.com", tooltip: "Follow us on Twitter" },
 *   { icon: Instagram, url: "https://instagram.com", tooltip: "Follow us on Instagram" }
 * ];
 * 
 * <SocialIcons items={socialItems} variant="primary" size="lg" />
 * ```
 * 
 * @example
 * Custom SVG icons with different tooltip positions:
 * ```tsx
 * const customItems = [
 *   { 
 *     customSvg: "<svg>...</svg>", 
 *     url: "https://linkedin.com", 
 *     tooltip: "Connect on LinkedIn" 
 *   }
 * ];
 * 
 * <SocialIcons 
 *   items={customItems}
 *   tooltipPosition="bottom"
 *   tooltipDelay={500}
 *   variant="custom"
 *   customVariantClasses="bg-gradient-to-r from-blue-500 to-purple-500"
 * />
 * ```
 * 
 * @example
 * Image icons with disabled state and custom click handlers:
 * ```tsx
 * const imageItems = [
 *   { 
 *     imageSrc: "/icons/facebook.png", 
 *     imageAlt: "Facebook", 
 *     url: "#", 
 *     tooltip: "Coming soon", 
 *     disabled: true 
 *   },
 *   { 
 *     imageSrc: "/icons/twitter.png", 
 *     imageAlt: "Twitter", 
 *     url: "#", 
 *     tooltip: "Share on Twitter",
 *     onClick: (e, item) => {
 *       e.preventDefault();
 *       window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check this out!')}`);
 *     }
 *   }
 * ];
 * 
 * <SocialIcons 
 *   items={imageItems}
 *   variant="secondary"
 *   bounce={true}
 *   pulse={false}
 * />
 * ```
 */

/** Individual social icon item configuration */
export type SocialIconItem = {
    /** Lucide icon component or custom React component */
    icon?: LucideIcon | React.ComponentType<{ size?: number; className?: string }>;
    /** URL to navigate to when clicked */
    url: string;
    /** Tooltip text displayed on hover/focus */
    tooltip?: string;
    /** Custom SVG string or React node for custom icons */
    customSvg?: string | React.ReactNode;
    /** Image source for image-based icons */
    imageSrc?: string;
    /** Alt text for image accessibility */
    imageAlt?: string;
    /** Custom color for the icon (overrides variant colors) */
    iconColor?: string;
    /** Whether the icon is disabled (non-clickable) */
    disabled?: boolean;
    /** Custom click handler function */
    onClick?: (e: React.MouseEvent, item: SocialIconItem) => void;
};

/** Main component props interface */
export interface SocialIconsProps {
    /** Array of social icon items to display */
    items: SocialIconItem[];
    /** Size of the icons and containers */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** Tailwind spacing class for gap between icons (e.g., 'gap-4') */
    spacing?: string;
    /** Whether to open links in new tab */
    openInNewTab?: boolean;
    /** Additional CSS classes for the container */
    className?: string;
    /** Color variant for the icons */
    variant?: 'primary' | 'secondary' | 'muted' | 'dark' | 'custom';
    /** Whether to show pulse animation */
    pulse?: boolean;
    /** Whether to show bounce animation on hover */
    bounce?: boolean;
    /** Whether to show shadow effects */
    shadow?: boolean;
    /** Border radius variant */
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    /** Position of tooltips relative to icons */
    tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
    /** Delay before showing tooltips (in milliseconds) */
    tooltipDelay?: number;
    /** Whether to show tooltips at all */
    showTooltips?: boolean;
    /** Custom CSS classes for custom variant styling */
    customVariantClasses?: string;
}

/** Icon size mapping in pixels for different size variants */
const iconSizes = {
    sm: 16,  // Small icons (16px)
    md: 20,  // Medium icons (20px) - default
    lg: 24,  // Large icons (24px)
    xl: 28,  // Extra large icons (28px)
};

/** Container padding mapping for different size variants */
const containerPadding = {
    sm: 'p-2',      // Small padding (8px)
    md: 'p-3',      // Medium padding (12px) - default
    lg: 'p-3.5',    // Large padding (14px)
    xl: 'p-4',      // Extra large padding (16px)
};

/**
 * Tooltip Component
 * 
 * A reusable tooltip component that displays contextual information
 * with configurable positioning and smooth animations.
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
 * SocialIcons Component
 * 
 * Renders a collection of social media icons with enhanced functionality including:
 * - Multiple icon types (Lucide icons, custom SVG, images)
 * - Configurable tooltips with positioning and delay
 * - Keyboard navigation and accessibility features
 * - Disabled states and custom click handlers
 * - Responsive design with various styling options
 * 
 * @param items - Array of social icon configurations
 * @param size - Size variant for icons and containers
 * @param spacing - Tailwind spacing class for gaps
 * @param openInNewTab - Whether to open links in new tab
 * @param className - Additional CSS classes
 * @param variant - Color variant for styling
 * @param pulse - Whether to show pulse animation
 * @param bounce - Whether to show bounce animation on hover
 * @param shadow - Whether to show shadow effects
 * @param rounded - Border radius variant
 * @param tooltipPosition - Position of tooltips
 * @param tooltipDelay - Delay before showing tooltips
 * @param showTooltips - Whether to show tooltips
 * @param customVariantClasses - Custom CSS classes for custom variant
 */
const SocialIcons: React.FC<SocialIconsProps> = ({
    items,
    size = 'md',
    spacing = 'gap-4',
    openInNewTab = true,
    className = '',
    variant = 'primary',
    pulse = false,
    bounce = true,
    shadow = true,
    rounded = 'full',
    tooltipPosition = 'top',
    tooltipDelay = 300,
    showTooltips = true,
    customVariantClasses = '',
}) => {
    /** State to track which tooltips are currently visible */
    const [tooltipStates, setTooltipStates] = useState<{ [key: number]: boolean }>({});
    
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
     * Shows tooltip for a specific icon after the configured delay
     * Handles timeout management to prevent multiple tooltips from conflicting
     * 
     * @param index - Index of the icon to show tooltip for
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
     * Hides tooltip for a specific icon immediately
     * Clears any pending timeout to ensure immediate response
     * 
     * @param index - Index of the icon to hide tooltip for
     */
    const hideTooltip = (index: number) => {
        if (tooltipTimeouts.current[index]) {
            clearTimeout(tooltipTimeouts.current[index]);
        }
        setTooltipStates(prev => ({ ...prev, [index]: false }));
    };

    /** Base container classes for the social icons wrapper */
    const containerBase = `inline-flex ${spacing} ${className}`;

    /** Color variant configurations with hover and focus states */
    const variantBg = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:bg-gray-700',
        muted: 'bg-gray-300 text-black hover:bg-gray-400 focus:bg-gray-400',
        dark: 'bg-black text-white hover:bg-gray-800 focus:bg-gray-800',
        custom: customVariantClasses,
    };

    /**
     * Handles click events for social icons
     * Prevents default behavior for disabled icons and calls custom handlers
     * 
     * @param e - Mouse event object
     * @param item - The social icon item configuration
     */
    const handleClick = (e: React.MouseEvent, item: SocialIconItem) => {
        if (item.disabled) {
            e.preventDefault();
            return;
        }

        if (item.onClick) {
            item.onClick(e, item);
        }
    };

    /**
     * Renders the appropriate icon content based on priority:
     * 1. Image source (highest priority)
     * 2. Custom SVG
     * 3. Lucide icon component
     * 4. Fallback question mark (lowest priority)
     * 
     * @param item - The social icon item configuration
     * @param iconSize - Size of the icon in pixels
     * @returns JSX element representing the icon
     */
    const renderIcon = (item: SocialIconItem, iconSize: number) => {
        const { icon: Icon, customSvg, imageSrc, imageAlt = '', iconColor } = item;

        // Priority 1: Image-based icons
        if (imageSrc) {
            return (
                <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="w-full h-full object-contain"
                    style={{ maxWidth: iconSize, maxHeight: iconSize }}
                    onError={(e) => {
                        // Hide broken images gracefully
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                    }}
                />
            );
        }

        // Priority 2: Custom SVG icons
        if (customSvg) {
            if (typeof customSvg === 'string') {
                // Handle SVG string with dangerous HTML injection
                return (
                    <div
                        className="w-full h-full flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: customSvg }}
                        style={{ width: iconSize, height: iconSize, color: iconColor }}
                    />
                );
            }
            // Handle React node SVG
            return (
                <div style={{ width: iconSize, height: iconSize, color: iconColor }}>
                    {customSvg}
                </div>
            );
        }

        // Priority 3: Lucide icon components
        if (Icon) {
            return <Icon size={iconSize} color={iconColor} />;
        }

        // Priority 4: Fallback for missing icons
        return (
            <div 
                className="w-full h-full flex items-center justify-center text-xs"
                style={{ width: iconSize, height: iconSize }}
            >
                ?
            </div>
        );
    };

    return (
        <div className={containerBase} role="group" aria-label="Social media links">
            {items.map((item, index) => {
                const iconSize = iconSizes[size];
                const padClass = containerPadding[size];
                const isDisabled = item.disabled;
                const tooltipVisible = tooltipStates[index];

                /** Dynamic CSS classes for each social icon link */
                const linkClasses = [
                    'flex items-center justify-center transition-all duration-200',
                    variant !== 'custom' ? variantBg[variant] : customVariantClasses,
                    padClass,
                    shadow && 'shadow-md hover:shadow-lg',
                    bounce && !isDisabled && 'hover:scale-110',
                    pulse && 'animate-pulse',
                    `rounded-${rounded}`,
                    isDisabled && 'opacity-50 cursor-not-allowed',
                    !isDisabled && 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                ]
                    .filter(Boolean)
                    .join(' ');

                /** The main icon element with all interactions and styling */
                const iconElement = (
                    <a
                        href={isDisabled ? '#' : item.url}
                        target={openInNewTab && !isDisabled ? '_blank' : '_self'}
                        rel={openInNewTab && !isDisabled ? 'noopener noreferrer' : undefined}
                        className={linkClasses}
                        title={item.tooltip}
                        aria-label={item.tooltip || `Social media link ${index + 1}`}
                        onMouseEnter={() => showTooltip(index)}
                        onMouseLeave={() => hideTooltip(index)}
                        onFocus={() => showTooltip(index)}
                        onBlur={() => hideTooltip(index)}
                        onClick={(e) => handleClick(e, item)}
                        tabIndex={isDisabled ? -1 : 0}
                    >
                        {renderIcon(item, iconSize)}
                    </a>
                );

                return (
                    <Tooltip
                        key={index}
                        content={item.tooltip || ''}
                        position={tooltipPosition}
                        isVisible={tooltipVisible && !!item.tooltip}
                    >
                        {iconElement}
                    </Tooltip>
                );
            })}
        </div>
    );
};

export default SocialIcons;
