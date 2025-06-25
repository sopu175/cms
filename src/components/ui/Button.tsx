'use client'
import React from 'react';
import Link from "next/link";
import Image from "next/image";

interface ButtonProps {
  onSubmit?: () => void;
  text?: string;
  src?: string;
  img?: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  letterSpacing?: string;
  lineHeight?: number;
  margin?: string;
  background?: string;
  borderRadius?: number;
  border?: string;
  width?: string;
  height?: number;
  hoverBackground?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  hoverColor?: string;
  marginSm?: string;
  onClick?: () => void;
  className?: string;
  borderHover?: string;
}

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
  const handleClick = () => {
    if (onClick) onClick();
    if (onSubmit) onSubmit();
  };

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

  // Inline styles to prevent FOUC
  const buttonStyle: React.CSSProperties = {
    margin: margin,
    width: width === 'fit-content' ? 'fit-content' : width,
    height: `${height}px`,
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 0
  };

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

      {src && typeof src === 'string' ? (
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
          <Link href={src || '/'}>
            <button className="btn-link" style={linkStyle}>
                {renderContent()}
            </button>
            </Link>
        )
      ) : (
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

// Named export
export { Button };

// Default export
export default Button;
