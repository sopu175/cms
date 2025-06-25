'use client';
import React from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * StickyIcon Component
 * 
 * A versatile floating action button component that can be positioned anywhere on the screen.
 * Supports various icon types (Lucide icons, custom SVG, images), positioning, styling, and animations.
 * 
 * @example
 * ```tsx
 * // Basic usage with Lucide icon
 * import { Phone } from 'lucide-react';
 * 
 * <StickyIcon 
 *   icon={Phone}
 *   onClick={() => console.log('Phone clicked')}
 *   tooltip="Call us"
 *   variant="primary"
 * />
 * 
 * // Custom SVG icon
 * <StickyIcon 
 *   customSvg="<svg>...</svg>"
 *   size="lg"
 *   bottom="100"
 *   right="40"
 *   pulse={true}
 * />
 * 
 * // Image icon with custom positioning
 * <StickyIcon 
 *   imageSrc="/path/to/icon.png"
 *   imageAlt="Custom icon"
 *   top="20"
 *   left="20"
 *   variant="success"
 *   bounce={false}
 * />
 * 
 * // Disabled state
 * <StickyIcon 
 *   icon={Mail}
 *   disabled={true}
 *   tooltip="Feature coming soon"
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // Multiple sticky icons with different positions
 * <div>
 *   <StickyIcon 
 *     icon={Phone}
 *     bottom="20"
 *     right="20"
 *     variant="primary"
 *     tooltip="Call us"
 *   />
 *   <StickyIcon 
 *     icon={Mail}
 *     bottom="80"
 *     right="20"
 *     variant="secondary"
 *     tooltip="Email us"
 *   />
 *   <StickyIcon 
 *     icon={MessageCircle}
 *     bottom="140"
 *     right="20"
 *     variant="success"
 *     tooltip="Chat with us"
 *   />
 * </div>
 * ```
 */
interface StickyIconProps {
  /** The icon component to display (Lucide icon or custom React component) */
  icon?: LucideIcon | React.ComponentType<{ size?: number; className?: string }>;
  /** Custom SVG string or JSX element */
  customSvg?: string | React.ReactNode;
  /** Image source (URL, base64, or imported image) */
  imageSrc?: string;
  /** Alt text for image icons (accessibility) */
  imageAlt?: string;
  /** Click handler function */
  onClick?: () => void;
  /** Tooltip text to show on hover */
  tooltip?: string;
  /** Icon size (affects both icon and container) */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Background color variant */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'dark' | 'light';
  /** Position from bottom (in pixels, CSS values, or custom spacing: 20, 40, 60, 80, 100, 130, 150, 160, 200) */
  bottom?: string;
  /** Position from top (in pixels, CSS values, or custom spacing: 20, 40, 60, 80, 100, 130, 150, 160, 200) */
  top?: string;
  /** Position from right (in pixels, CSS values, or custom spacing: 20, 40, 60, 80, 100, 130, 150, 160, 200) */
  right?: string;
  /** Position from left (in pixels, CSS values, or custom spacing: 20, 40, 60, 80, 100, 130, 150, 160, 200) */
  left?: string;
  /** Custom className for additional styling */
  className?: string;
  /** Whether to show a pulse animation */
  pulse?: boolean;
  /** Whether to show a bounce animation on hover */
  bounce?: boolean;
  /** Custom z-index value */
  zIndex?: number;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Custom icon color (overrides variant color) */
  iconColor?: string;
  /** Whether to show a shadow */
  shadow?: boolean;
  /** Border radius variant */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** Use custom font family */
  fontFamily?: 'primary' | 'secondary' | 'mono';
}

const StickyIcon: React.FC<StickyIconProps> = ({
  icon: Icon,
  customSvg,
  imageSrc,
  imageAlt = "Icon",
  onClick,
  tooltip,
  size = 'md',
  variant = 'primary',
  bottom,
  top,
  right,
  left,
  className = '',
  pulse = false,
  bounce = true,
  zIndex = 50,
  disabled = false,
  iconColor,
  shadow = true,
  rounded = 'full',
  fontFamily = 'primary',
}) => {
  // Size configurations - defines container and icon dimensions
  const sizeClasses = {
    sm: 'w-10 h-10 p-2',    // 40px container, 16px icon
    md: 'w-12 h-12 p-3',    // 48px container, 20px icon
    lg: 'w-14 h-14 p-3.5',  // 56px container, 24px icon
    xl: 'w-16 h-16 p-4',    // 64px container, 28px icon
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
  };

  // Variant color configurations - text colors for different themes
  const variantClasses = {
    primary: 'text-white',
    secondary: 'text-white',
    success: 'text-white',
    warning: 'text-white',
    danger: 'text-white',
    info: 'text-white',
    dark: 'text-white',
    light: 'text-gray-900 border border-gray-200', // Light variant has dark text and border
  };

  // Custom CSS variables integration - uses design system colors
  const variantStyles = {
    primary: { backgroundColor: 'var(--var-dc--primary-color)' },
    secondary: { backgroundColor: 'var(--var-dc--secondary-color)' },
    success: { backgroundColor: 'var(--var-dc--success-color)' },
    warning: { backgroundColor: 'var(--var-dc--warning-color)' },
    danger: { backgroundColor: 'var(--var-dc--error-color)' },
    info: { backgroundColor: 'var(--var-dc--info-color)' },
    dark: { backgroundColor: 'var(--var-dc--foreground)' },
    light: { backgroundColor: 'var(--var-dc--background)' },
  };

  // Font family mapping - uses design system fonts
  const fontFamilyStyles = {
    primary: { fontFamily: 'var(--var-dc--font-primary)' },
    secondary: { fontFamily: 'var(--var-dc--font-secondary)' },
    mono: { fontFamily: 'var(--var-dc--font-mono)' },
  };

  // Rounded configurations - border radius options
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  // Build dynamic classes - combines all styling classes
  const baseClasses = [
    'fixed',           // Fixed positioning
    'flex',            // Flexbox layout
    'items-center',    // Center items vertically
    'justify-center',  // Center items horizontally
    'cursor-pointer',  // Pointer cursor on hover
    'select-none',     // Prevent text selection
    sizeClasses[size], // Size-specific classes
    variantClasses[variant], // Color variant classes
    roundedClasses[rounded], // Border radius classes
  ];

  // Add conditional classes based on props
  if (shadow) {
    baseClasses.push('shadow-lg', 'hover:shadow-xl'); // Enhanced shadow on hover
  }

  if (bounce) {
    baseClasses.push('hover:scale-110'); // Scale up on hover
  }

  if (pulse) {
    baseClasses.push('animate-pulse'); // Continuous pulse animation
  }

  if (disabled) {
    baseClasses.push('opacity-50', 'cursor-not-allowed'); // Disabled state styling
  } else {
    baseClasses.push('active:scale-95'); // Scale down on click
  }

  /**
   * Helper function to convert spacing values to CSS values
   * Supports custom spacing variables, CSS units, and Tailwind-style conversion
   * 
   * @param value - The spacing value to convert
   * @param defaultValue - Fallback value if none provided
   * @returns CSS value string or undefined
   */
  const convertSpacing = (value: string | undefined, defaultValue?: string): string | undefined => {
    if (!value && !defaultValue) return undefined;
    const val = value || defaultValue!;
    
    // Handle CSS units (px, rem, %, em, vh, vw)
    if (val.includes('px') || val.includes('rem') || val.includes('%') || 
        val.includes('em') || val.includes('vh') || val.includes('vw')) {
      return val;
    }
    
    // Handle custom spacing values from design system
    const customSpacing: { [key: string]: string } = {
      '0': 'var(--var-dc--spacing-0)',
      '20': 'var(--var-dc--spacing-20)',
      '40': 'var(--var-dc--spacing-40)',
      '60': 'var(--var-dc--spacing-60)',
      '80': 'var(--var-dc--spacing-80)',
      '100': 'var(--var-dc--spacing-100)',
      '130': 'var(--var-dc--spacing-130)',
      '150': 'var(--var-dc--spacing-150)',
      '160': 'var(--var-dc--spacing-160)',
      '200': 'var(--var-dc--spacing-200)',
    };
    
    if (customSpacing[val]) {
      return customSpacing[val];
    }
    
    // Fallback to Tailwind spacing conversion (1 unit = 0.25rem)
    return `${parseInt(val) * 0.25}rem`;
  };

  // Handle positioning with priority: specific positions override defaults
  const positionStyle: React.CSSProperties = {
    zIndex,
    transition: `var(--var-dc--transition-speed)`,
    borderRadius: rounded === 'full' ? '50%' : `var(--var-dc--border-radius)`,
    ...variantStyles[variant],
    ...fontFamilyStyles[fontFamily],
  };

  // Set default position (bottom-right) only if no specific positions are provided
  if (!bottom && !top && !left && !right) {
    positionStyle.bottom = convertSpacing('20'); // Using custom spacing
    positionStyle.right = convertSpacing('20');
  } else {
    // Apply specific positions
    if (bottom) positionStyle.bottom = convertSpacing(bottom);
    if (top) positionStyle.top = convertSpacing(top);
    if (left) positionStyle.left = convertSpacing(left);
    if (right) positionStyle.right = convertSpacing(right);
  }

  /**
   * Click handler - only executes if component is not disabled
   */
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  /**
   * Render icon content based on priority: imageSrc > customSvg > icon
   * Supports different icon types with appropriate styling
   */
  const renderIcon = () => {
    // Priority: imageSrc > customSvg > icon
    if (imageSrc) {
      // Handle image files (PNG, JPG, SVG files, base64, etc.)
      return (
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-contain"
          style={{
            filter: iconColor ? `brightness(0) saturate(100%) ${getColorFilter(iconColor)}` : undefined
          }}
        />
      );
    } else if (customSvg) {
      if (typeof customSvg === 'string') {
        // Handle SVG string
        return (
          <div
            className={`w-full h-full flex items-center justify-center ${iconColor ? '' : 'fill-current'}`}
            dangerouslySetInnerHTML={{ __html: customSvg }}
            style={{ color: iconColor }}
          />
        );
      } else {
        // Handle React node (JSX SVG)
        return (
          <div 
            className={`w-full h-full flex items-center justify-center ${iconColor ? '' : 'fill-current'}`}
            style={{ color: iconColor }}
          >
            {customSvg}
          </div>
        );
      }
    } else if (Icon) {
      // Handle Lucide icons or other React components
      return (
        <Icon 
          size={iconSizes[size]} 
          color={iconColor}
          className={iconColor ? '' : 'w-full h-full'}
        />
      );
    }
    return null;
  };

  /**
   * Helper function to convert hex color to CSS filter for image recoloring
   * Provides basic color mapping for common colors
   * 
   * @param hexColor - Hex color value to convert
   * @returns CSS filter string
   */
  const getColorFilter = (hexColor: string): string => {
    // This is a simplified color filter generator
    // For more accurate color conversion, you might want to use a library
    const colorMap: { [key: string]: string } = {
      '#000000': 'invert(0%)',
      '#ffffff': 'invert(100%)',
      '#ef4444': 'invert(27%) sepia(88%) saturate(3544%) hue-rotate(347deg) brightness(104%) contrast(97%)',
      '#10b981': 'invert(69%) sepia(58%) saturate(2618%) hue-rotate(125deg) brightness(91%) contrast(83%)',
      '#3b82f6': 'invert(50%) sepia(93%) saturate(1352%) hue-rotate(202deg) brightness(97%) contrast(97%)',
      '#f59e0b': 'invert(67%) sepia(98%) saturate(1969%) hue-rotate(9deg) brightness(98%) contrast(96%)',
    };
    return colorMap[hexColor] || '';
  };

  /**
   * Determine tooltip position based on icon position
   * Ensures tooltip doesn't go off-screen
   */
  const getTooltipClasses = () => {
    const isLeft = left !== undefined;
    const isTop = top !== undefined;
    
    if (isTop && isLeft) {
      return "absolute top-full left-0 mt-2";
    } else if (isTop) {
      return "absolute top-full right-0 mt-2";
    } else if (isLeft) {
      return "absolute bottom-full left-0 mb-2";
    } else {
      return "absolute bottom-full right-0 mb-2";
    }
  };

  return (
    <div
      className={`${baseClasses.join(' ')} ${className}`}
      style={positionStyle}
      onClick={handleClick}
      title={tooltip}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick && !disabled) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Render the appropriate icon based on props priority */}
      {renderIcon()}
      
      {/* Tooltip - shows on hover, positioned based on icon location */}
      {tooltip && (
        <div className={`${getTooltipClasses()} px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none`}>
          {tooltip}
          <div className={getTooltipClasses()}></div>
        </div>
      )}
    </div>
  );
};

export default StickyIcon;