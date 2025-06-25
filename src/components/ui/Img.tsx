import React from 'react';
import Image, { ImageProps } from 'next/image';

interface ImgProps extends Omit<ImageProps, 'src'> {
  alt: string;
  srcLg: string;
  srcMd?: string;
  srcSm?: string;
  widthPx: number;   // e.g. 800
  heightPx: number;  // e.g. 600
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Responsive Img component using Next.js <Image> and srcSet for breakpoints.
 * Supports dynamic aspect ratio and sizing.
 */
const Img: React.FC<ImgProps> = ({
  alt,
  srcLg,
  srcMd,
  srcSm,
  widthPx,
  heightPx,
  className,
  style,
  ...rest
}) => {
  // Calculate aspect ratio as percentage for padding-top
  const aspectPercent = (heightPx / widthPx) * 100;

  // Build sizes attribute for responsive loading
  const sizes =
    srcSm && srcMd
      ? '(max-width: 639px) 100vw, (max-width: 1023px) 100vw, 100vw'
      : srcMd
      ? '(max-width: 1023px) 100vw, 100vw'
      : '100vw';

  // Parent must be relative and have a set aspect ratio or height
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: `${aspectPercent}%`,
        overflow: 'hidden',
        ...style,
      }}
    >
      <Image
        alt={alt}
        src={srcLg}
        sizes={sizes}
        fill
        style={{ objectFit: 'cover' }}
        {...rest}
      />
    </div>
  );
};

export default Img;