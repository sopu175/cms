import React from 'react';

interface PictureImgProps {
  alt: string;
  srcLg: string;
  srcMd?: string;
  srcSm?: string;
  widthPx: number;   // e.g. 800
  heightPx: number;  // e.g. 600
  className?: string;
  style?: React.CSSProperties;
  objectFit?: React.CSSProperties['objectFit'];
}

/**
 * Responsive image component using <picture> and <source> for breakpoints.
 * Maintains aspect ratio using the padding-top hack, like the Img component.
 */
const PictureImg: React.FC<PictureImgProps> = ({
  alt,
  srcLg,
  srcMd,
  srcSm,
  widthPx,
  heightPx,
  className,
  style,
  objectFit = 'cover',
  ...rest
}) => {
  // Calculate aspect ratio as percentage for padding-top
  const aspectPercent = (heightPx / widthPx) * 100;

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
      <picture>
        {srcSm && <source srcSet={srcSm} media="(max-width: 639px)" />}
        {srcMd && <source srcSet={srcMd} media="(max-width: 1023px)" />}
        <img
          src={srcLg}
          alt={alt}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit,
          }}
          loading="lazy"
          {...rest}
        />
      </picture>
    </div>
  );
};

export default PictureImg;