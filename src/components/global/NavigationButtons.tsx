/*
 * NavigationButtons Component
 *
 * A highly customizable navigation button pair (previous/next) for sliders, carousels, and paginated UIs.
 * Supports dynamic sizing, colors, border radius, padding, margin, gap, custom classes, IDs, and full hover/disabled styling.
 *
 * @example
 * // Basic usage
 * <NavigationButtons
 *   onPrevious={() => {}}
 *   onNext={() => {}}
 * />
 *
 * @example
 * // Full customization
 * <NavigationButtons
 *   isBeginning={false}
 *   isEnd={false}
 *   onPrevious={() => {}}
 *   onNext={() => {}}
 *   size={56}
 *   svgColor="#fff"
 *   backgroundColor="#0070f3"
 *   borderRadius="16px"
 *   hoverSvgColor="#ff0"
 *   hoverBackgroundColor="#0051a3"
 *   disabledBackgroundColor="#ccc"
 *   className="my-slider-nav-container"
 *   padding="12px"
 *   margin="6px"
 *   gap="32px"
 *   prevLiClassName="slider1-prev"
 *   nextLiClassName="slider1-next"
 *   prevLiId="slider1-prev-btn"
 *   nextLiId="slider1-next-btn"
 * />
 *
 * @param {boolean} [isBeginning] - If true, disables the previous button (useful for start of slider)
 * @param {boolean} [isEnd] - If true, disables the next button (useful for end of slider)
 * @param {function} [onPrevious] - Callback for previous button click
 * @param {function} [onNext] - Callback for next button click
 * @param {number|string} [size=50] - Size of each button in px or CSS units (applies to width/height)
 * @param {string} [svgColor="#fff"] - Arrow color (stroke)
 * @param {string} [backgroundColor] - Button background color (normal state)
 * @param {string|number} [borderRadius="50%"] - Border radius for button (e.g. '50%' for circle, '8px' for rounded square)
 * @param {string} [hoverSvgColor="#fff"] - Arrow color on hover
 * @param {string} [hoverBackgroundColor="#001A94"] - Button background color on hover
 * @param {string} [disabledBackgroundColor] - Button background color when disabled
 * @param {string} [className] - Extra class(es) for the outer container
 * @param {string|number} [padding] - Padding inside each button (applies to <li>)
 * @param {string|number} [margin] - Margin around each button (applies to <li>)
 * @param {string|number} [gap] - Gap between the two buttons (applies to <ul>)
 * @param {string} [prevLiClassName] - Extra class(es) for the previous button <li>
 * @param {string} [nextLiClassName] - Extra class(es) for the next button <li>
 * @param {string} [prevLiId] - ID for the previous button <li>
 * @param {string} [nextLiId] - ID for the next button <li>
 */

'use client';
import React, { useState } from 'react';

/**
 * Props for NavigationButtons component
 */
interface NavigationButtonsProps {
    /** If true, disables the previous button (useful for start of slider) */
    isBeginning?: boolean;
    /** If true, disables the next button (useful for end of slider) */
    isEnd?: boolean;
    /** Callback for previous button click */
    onPrevious?: () => void;
    /** Callback for next button click */
    onNext?: () => void;
    /** Size of each button in px or CSS units (applies to width/height) */
    size?: number | string;
    /** Arrow color (stroke) */
    svgColor?: string;
    /** Button background color (normal state) */
    backgroundColor?: string;
    /** Border radius for button (e.g. '50%' for circle, '8px' for rounded square) */
    borderRadius?: string | number;
    /** Arrow color on hover */
    hoverSvgColor?: string;
    /** Button background color on hover */
    hoverBackgroundColor?: string;
    /** Button background color when disabled */
    disabledBackgroundColor?: string;
    /** Extra class(es) for the outer container */
    className?: string;
    /** Padding inside each button (applies to <li>) */
    padding?: string | number;
    /** Margin around each button (applies to <li>) */
    margin?: string | number;
    /** Gap between the two buttons (applies to <ul>) */
    gap?: string | number;
    /** Extra class(es) for the previous button <li> */
    prevLiClassName?: string;
    /** Extra class(es) for the next button <li> */
    nextLiClassName?: string;
    /** ID for the previous button <li> */
    prevLiId?: string;
    /** ID for the next button <li> */
    nextLiId?: string;
}

/**
 * NavigationButtons
 *
 * Renders a pair of navigation buttons (previous/next) with full customization for use in sliders, carousels, and paginated UIs.
 *
 * All props are optional and have sensible defaults. You can style, size, and identify each button individually.
 */
const NavigationButtons: React.FC<NavigationButtonsProps> = ({
    isBeginning = false,
    isEnd = false,
    onPrevious,
    onNext,
    size = 50,
    svgColor = '#fff',
    backgroundColor = 'rgba(0, 22, 124, 1)',
    borderRadius = '50%',
    hoverSvgColor = '#fff',
    hoverBackgroundColor = '#001A94',
    disabledBackgroundColor = 'rgba(0, 22, 124, 0.25)',
    className = '',
    padding,
    margin,
    gap,
    prevLiClassName,
    nextLiClassName,
    prevLiId,
    nextLiId,
}) => {
    // Track which button is hovered for dynamic styling
    const [hovered, setHovered] = useState<'prev' | 'next' | null>(null);

    /**
     * Returns the style object for each button <li>
     * Applies dynamic size, color, border radius, padding, margin, and hover/disabled state
     */
    const getButtonStyle = (disabled: boolean, isHovered: boolean) => ({
        position: 'relative' as const,
        overflow: 'hidden',
        height: typeof size === 'number' ? `${size}px` : size,
        width: typeof size === 'number' ? `${size}px` : size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius,
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: disabled
            ? disabledBackgroundColor
            : isHovered
                ? hoverBackgroundColor
                : backgroundColor,
        transition: 'all 0.3s ease',
        padding: padding !== undefined ? (typeof padding === 'number' ? `${padding}px` : padding) : undefined,
        margin: margin !== undefined ? (typeof margin === 'number' ? `${margin}px` : margin) : undefined,
    });

    /**
     * Returns the style object for the SVG arrow
     * Handles rotation, color, and transitions for hover/disabled states
     */
    const getSvgStyle = (disabled: boolean, isHovered: boolean, isPrev: boolean) => ({
        position: 'relative' as const,
        zIndex: 1,
        transition: 'transform 0.3s ease, stroke 0.3s ease',
        transform: isPrev
            ? `rotate(${disabled ? 270 : isHovered ? 225 : 270}deg)`
            : `rotate(${disabled ? 0 : isHovered ? 45 : 0}deg)`,
        transformOrigin: 'center',
        stroke: isHovered ? hoverSvgColor : svgColor,
    });

    return (
        <div className={`mt-10 ${className}`}>
            {/* Navigation button list. Gap is dynamic via prop. */}
            <ul
                className="flex"
                style={{
                    gap: gap !== undefined ? (typeof gap === 'number' ? `${gap}px` : gap) : undefined,
                }}
            >
                {/* Previous Button */}
                <li
                    id={prevLiId}
                    className={`nav-btn prev${isBeginning ? ' disabled' : ''}${prevLiClassName ? ` ${prevLiClassName}` : ''}`}
                    style={getButtonStyle(isBeginning, hovered === 'prev')}
                    onClick={!isBeginning ? onPrevious : undefined}
                    onMouseEnter={() => setHovered('prev')}
                    onMouseLeave={() => setHovered(null)}
                >
                    {/* SVG arrow for previous */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={typeof size === 'number' ? size * 0.36 : '18'}
                        height={typeof size === 'number' ? size * 0.36 : '18'}
                        viewBox="0 0 18 18"
                        fill="none"
                        style={getSvgStyle(isBeginning, hovered === 'prev', true)}
                    >
                        <g clipPath="url(#clip0_4006_21)">
                            <path
                                d="M4.74268 13.2424L13.228 4.75715"
                                stroke={hovered === 'prev' ? hoverSvgColor : svgColor}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M13.228 13.2424V4.75715H4.74275"
                                stroke={hovered === 'prev' ? hoverSvgColor : svgColor}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_4006_21">
                                <rect
                                    width="16.9706"
                                    height="16.9706"
                                    fill="white"
                                    transform="translate(0.5 0.514648)"
                                />
                            </clipPath>
                        </defs>
                    </svg>
                </li>

                {/* Next Button */}
                <li
                    id={nextLiId}
                    className={`nav-btn next${isEnd ? ' disabled' : ''}${nextLiClassName ? ` ${nextLiClassName}` : ''}`}
                    style={getButtonStyle(isEnd, hovered === 'next')}
                    onClick={!isEnd ? onNext : undefined}
                    onMouseEnter={() => setHovered('next')}
                    onMouseLeave={() => setHovered(null)}
                >
                    {/* SVG arrow for next */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={typeof size === 'number' ? size * 0.36 : '18'}
                        height={typeof size === 'number' ? size * 0.36 : '18'}
                        viewBox="0 0 18 18"
                        fill="none"
                        style={getSvgStyle(isEnd, hovered === 'next', false)}
                    >
                        <g clipPath="url(#clip0_4006_21_next)">
                            <path
                                d="M4.74268 13.2424L13.228 4.75715"
                                stroke={hovered === 'next' ? hoverSvgColor : svgColor}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M13.228 13.2424V4.75715H4.74275"
                                stroke={hovered === 'next' ? hoverSvgColor : svgColor}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_4006_21_next">
                                <rect
                                    width="16.9706"
                                    height="16.9706"
                                    fill="white"
                                    transform="translate(0.5 0.514648)"
                                />
                            </clipPath>
                        </defs>
                    </svg>
                </li>
            </ul>
        </div>
    );
};

export default NavigationButtons;