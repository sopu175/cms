import React, { ReactNode, HTMLAttributes } from 'react';
import parse, { HTMLReactParserOptions, Element, domToReact } from 'html-react-parser';

/**
 * Title Component
 * 
 * A flexible heading component that supports HTML parsing, dynamic styling,
 * and special span element styling. Perfect for creating consistent typography
 * across your application with advanced customization options.
 * 
 * @example
 * // Basic usage
 * <Title tag="h1">Welcome to Our Site</Title>
 * 
 * @example
 * // With custom styling
 * <Title 
 *   tag="h2"
 *   fontSize="2.5rem"
 *   color="var(--var-dc--primary-color)"
 *   fontWeight="700"
 *   textAlign="center"
 * >
 *   Our Services
 * </Title>
 * 
 * @example
 * // With HTML content and span styling
 * <Title 
 *   tag="h1"
 *   spanColor="var(--var-dc--accent-color)"
 *   spanFontWeight="800"
 * >
 *   Welcome to <span>Our Amazing</span> Platform
 * </Title>
 * 
 * @example
 * // Using CSS variables for consistent theming
 * <Title 
 *   tag="h3"
 *   fontSize="var(--var-dc--font-size-2xl)"
 *   fontFamily="var(--var-dc--font-secondary)"
 *   color="var(--var-dc--foreground)"
 *   margin="var(--var-dc--spacing-40) 0"
 * >
 *   Section Title
 * </Title>
 */

type TagName = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface TitleProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  /** HTML tag to render (h1-h6) */
  tag?: TagName;
  /** Font size (CSS value) */
  fontSize?: string;
  /** Line height (CSS value) */
  lineHeight?: string;
  /** Text color (CSS color value) */
  color?: string;
  /** Content to render (string or JSX) */
  children?: ReactNode | string;
  /** Additional CSS classes */
  className?: string;
  /** Margin (CSS margin value) */
  margin?: string;
  /** Font family (CSS font-family value) */
  fontFamily?: string;
  /** Font weight (CSS font-weight value) */
  fontWeight?: string;
  /** Text alignment */
  textAlign?: React.CSSProperties['textAlign'];
  /** Text transformation */
  textTransform?: React.CSSProperties['textTransform'];
  /** Text decoration */
  textDecoration?: React.CSSProperties['textDecoration'];
  /** Letter spacing (CSS value) */
  letterSpacing?: string;
  /** Font style */
  fontStyle?: React.CSSProperties['fontStyle'];
  /** Padding (CSS padding value) */
  padding?: string;
  
  // Span-specific styling props
  /** Color for all span elements */
  spanColor?: string;
  /** Font weight for all span elements */
  spanFontWeight?: string;
  /** Font size for all span elements */
  spanFontSize?: string;
  /** Font family for all span elements */
  spanFontFamily?: string;
  /** Text transform for all span elements */
  spanTextTransform?: React.CSSProperties['textTransform'];
  /** Letter spacing for all span elements */
  spanLetterSpacing?: string;
  /** Font style for all span elements */
  spanFontStyle?: React.CSSProperties['fontStyle'];
  /** Margin for all span elements */
  spanMargin?: string;
  /** Padding for all span elements */
  spanPadding?: string;
  /** Text decoration for all span elements */
  spanTextDecoration?: React.CSSProperties['textDecoration'];
}

/**
 * Title Component Implementation
 * 
 * Features:
 * - Supports all HTML heading tags (h1-h6)
 * - HTML string parsing with html-react-parser
 * - Dynamic span element styling
 * - CSS custom properties support
 * - TypeScript support with proper prop types
 * - Accessibility-friendly semantic HTML
 * - Flexible content handling (string or JSX)
 */
const Title: React.FC<TitleProps> = ({
  tag = 'h2',
  fontSize,
  lineHeight,
  color,
  margin,
  fontFamily,
  fontWeight,
  textAlign,
  textTransform,
  textDecoration,
  letterSpacing,
  fontStyle,
  padding,
  spanColor,
  spanFontWeight,
  spanFontSize,
  spanFontFamily,
  spanTextTransform,
  spanLetterSpacing,
  spanFontStyle,
  spanMargin,
  spanPadding,
  spanTextDecoration,
  children,
  className,
  ...rest
}) => {
  const Tag = tag as TagName;
  
  // Main element styles
  const style = {
    ...(fontSize && { fontSize }),
    ...(lineHeight && { lineHeight }),
    ...(color && { color }),
    ...(margin && { margin }),
    ...(fontFamily && { fontFamily }),
    ...(fontWeight && { fontWeight }),
    ...(textAlign && { textAlign }),
    ...(textTransform && { textTransform }),
    ...(textDecoration && { textDecoration }),
    ...(letterSpacing && { letterSpacing }),
    ...(fontStyle && { fontStyle }),
    ...(padding && { padding }),
  } as React.CSSProperties;

  // Span element styles
  const spanStyle = {
    ...(spanColor && { color: spanColor }),
    ...(spanFontWeight && { fontWeight: spanFontWeight }),
    ...(spanFontSize && { fontSize: spanFontSize }),
    ...(spanFontFamily && { fontFamily: spanFontFamily }),
    ...(spanTextTransform && { textTransform: spanTextTransform }),
    ...(spanLetterSpacing && { letterSpacing: spanLetterSpacing }),
    ...(spanFontStyle && { fontStyle: spanFontStyle }),
    ...(spanMargin && { margin: spanMargin }),
    ...(spanPadding && { padding: spanPadding }),
    ...(spanTextDecoration && { textDecoration: spanTextDecoration }),
  } as React.CSSProperties;

  /**
   * HTML parser options for processing span elements
   * Automatically applies span styles to all span elements in parsed HTML
   */
  const parserOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name === 'span') {
        const { attribs, children } = domNode;
        
        // Merge existing inline styles with span styles
        const existingStyle = attribs?.style ? 
          attribs.style.split(';').reduce((acc, rule) => {
            const [property, value] = rule.split(':').map(s => s.trim());
            if (property && value) {
              const camelProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (acc as any)[camelProperty] = value;
            }
            return acc;
          }, {} as React.CSSProperties) : {};

        const mergedStyle = { ...spanStyle, ...existingStyle };

        return (
          <span 
            {...attribs} 
            style={mergedStyle}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {domToReact(children as any, parserOptions)}
          </span>
        );
      }
    },
  };

  /**
   * Renders content with proper HTML parsing and span processing
   * @returns Processed content ready for rendering
   */
  const renderContent = () => {
    if (typeof children === 'string') {
      // If children is a string that might contain HTML, parse it
      if (children.includes('<') && children.includes('>')) {
        return parse(children, parserOptions);
      }
      // If it's just plain text, return as is
      return children;
    }
    
    // If children is already JSX, process it for span elements
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === 'span') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return React.cloneElement(child as any, {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          style: { ...spanStyle, ...(child as any).props.style },
        });
      }
      return child;
    });
  };

  return (
    <Tag style={style} className={className} {...rest}>
      {renderContent()}
    </Tag>
  );
};

export default Title;