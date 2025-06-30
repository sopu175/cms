'use client'
import React from 'react';
import Link from "next/link";
import Image from "next/image";

/**
 * Button Component
 * 
 * A highly customizable button component that supports various styles, animations,
 * and can function as a link or action button. Features include hover effects,
 * custom styling, and icon support.
 * 
 * @example
 * // Basic button
 * <Button text="Click Me" onClick={() => console.log('Clicked!')} />
 * 
 * @example
 * // Link button with custom styling
 * <Button
 *   text="Learn More"
 *   src="/about"
 *   background="var(--var-dc--primary-color)"
 *   hoverBackground="var(--var-dc--secondary-color)"
 *   color="#FFF"
 *   borderRadius={8}
 * />
 * 
 * @example
 * // Button with icon
 * <Button
 *   text="Download"
 *   img="/icons/download.svg"
 *   fontSize={16}
 *   fontWeight={600}
 * />
 * 
 * @example
 * // External link button
 * <Button
 *   text="Visit Website"
 *   src="https://example.com"
 *   target="_blank"
 *   border="2px solid #0070f3"
 * />
 */

interface ButtonProps {
  /** Function to call on form submission */
  onSubmit?: () => void;
  /** Button text content */
  text?: string;
  /** URL for link functionality (internal or external) */
  src?: string;
  /** Icon image source */
  img?: string;
  /** Font size in pixels */
  fontSize?: number;
  /** Font weight (100-900) */
  fontWeight?: number;
  /** Text color (CSS color value) */
  color?: string;
  /** Letter spacing (CSS value) */
  letterSpacing?: string;
  /** Line height in pixels */
  lineHeight?: number;
  /** Margin (CSS margin value) */
  margin?: string;
  /** Background color (CSS color value) */
  background?: string;
  /** Border radius in pixels */
  borderRadius?: number;
  /** Border style (CSS border value) */
  border?: string;
  /** Width (CSS width value) */
  width?: string;
  /** Height in pixels */
  height?: number;
  /** Background color on hover */
  hoverBackground?: string;
  /** Link target (_blank, _self, etc.) */
  target?: '_blank' | '_self' | '_parent' | '_top';
  /** Text color on hover */
  hoverColor?: string;
  /** Margin for small screens */
  marginSm?: string;
  /** Click handler function */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Border style on hover */
  borderHover?: string;
}

/**
 * Button Component Implementation
 * 
 * Features:
 * - Automatic link detection (internal vs external)
 * - Hover animations with CSS-in-JS
 * - Icon support with automatic filtering
 * - Responsive design with mobile-specific margins
 * - Accessibility support with proper focus states
 * - TypeScript support for all props
 */
const Button: React.FC<ButtonProps> = ({
  onSubmit,
  text,
  src,
  img,
  fontSize = 16,
  fontWeight = 400,
  color = '#423931',
  letterSpacing = '-0.8px',
  lineHeight = 20,
  margin = '0',
  background = 'transparent',
  borderRadius = 0,
  border = '1px solid #423931',
  width = 'fit-content',
  height = 44,
  hoverBackground = '#BC9632',
  target = '_self',
  hoverColor = '#FFF',
  marginSm,
  onClick,
  className,
  borderHover = '1px solid #BC9632'
}) => {
  /**
   * Handles button click events
   * Executes both onClick and onSubmit if provided
   */
  const handleClick = () => {
    if (onClick) onClick();
    if (onSubmit) onSubmit();
  };

  /**
   * Renders button content including text and optional icon
   * @returns JSX element with button content
   */
  const renderContent = () => (
    <span 
      className="btn-text"
      style={{
        position: 'relative',
        zIndex: 2,
        transition: 'all 0.3s ease-in-out',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {text}
      {img && (
        <Image 
          src={img} 
          alt="" 
          style={{
            paddingLeft: '5px',
            filter: 'none',
            transition: 'all 0.6s ease-in-out'
          }}
          width={20}
          height={20}
        />
      )}
    </span>
  );

  // Container styles for the button wrapper
  const buttonStyle: React.CSSProperties = {
    margin: margin,
    width: width === 'fit-content' ? 'fit-content' : width,
    height: `${height}px`,
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 0
  };

  // Link/button element styles
  const linkStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 0,
    boxSizing: 'border-box',
    width: 'fit-content',
    height: '100%',
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    letterSpacing: letterSpacing,
    lineHeight: `${lineHeight}px`,
    backgroundColor: background,
    borderRadius: `${borderRadius}px`,
    border: border,
    padding: '8px 39px',
    transition: 'background-color 0.3s, color 0.3s, border 0.3s',
    textDecoration: 'none'
  };

  const buttonClasses = `
    ${className || ''} 
    dc-btn
  `.trim();

  return (
    <div 
      onClick={handleClick} 
      className={buttonClasses}
      style={buttonStyle}
    >
      {/* CSS-in-JS styles for hover effects and animations */}
      <style jsx>{`
        .dc-btn .btn-link,
        .dc-btn .btn-link *,
        .dc-btn .btn-text,
        .dc-btn > a,
        .dc-btn > a * {
          color: ${color} !important;
        }

        .btn-link{
        cursor: pointer;
        }

        .dc-btn .btn-link:hover,
        .dc-btn:hover .btn-link,
        .dc-btn .btn-link:hover *,
        .dc-btn:hover .btn-link *,
        .dc-btn .btn-link:hover .btn-text,
        .dc-btn:hover .btn-text,
        .dc-btn > a:hover,
        .dc-btn:hover > a,
        .dc-btn > a:hover *,
        .dc-btn:hover > a * {
          color: ${hoverColor} !important;
        }

        .dc-btn .btn-link:hover,
        .dc-btn > a:hover {
          border: ${borderHover} !important;
        }

        .dc-btn .btn-link:before,
        .dc-btn > a:before {
          content: "";
          display: block;
          position: absolute;
          right: 0;
          top: 100%;
          left: 0;
          background-color: ${hoverBackground};
          height: 100%;
          width: 100%;
          margin: auto;
          transition: all 0.5s ease-in-out;
          z-index: 1;
        }

        .dc-btn:hover .btn-link:before,
        .dc-btn .btn-link:hover:before,
        .dc-btn:hover > a:before,
        .dc-btn > a:hover:before {
          top: 0;
        }

        .dc-btn:hover img,
        .dc-btn .btn-link:hover img,
        .dc-btn > a:hover img {
          filter: invert(92%) sepia(99%) saturate(1%) hue-rotate(235deg) brightness(105%) contrast(100%);
        }

        .dc-btn .btn-link:focus,
        .dc-btn > a:focus {
          color: #222222;
        }

        @media (max-width: 600px) {
          .dc-btn {
            margin: ${marginSm || margin};
          }
        }
      `}</style>

      {/* Conditional rendering based on src prop */}
      {src && typeof src === 'string' ? (
        // External link detection
        src?.startsWith('http') || src?.startsWith('www') ? (
          <a 
            href={src} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-link"
            style={linkStyle}
          >
            {renderContent()}
          </a>
        ) : (
          // Internal link using Next.js Link
          <Link href={src || '/'}>
            <button className="btn-link" style={linkStyle}>
                {renderContent()}
            </button>
            </Link>
        )
      ) : (
        // Action button (no navigation)
        <a 
          target={target} 
          className="btn-link"
          style={linkStyle}
        >
          {renderContent()}
        </a>
      )}
    </div>
  );
};

// Named export for flexibility
export { Button };

// Default export for convenience
export default Button;