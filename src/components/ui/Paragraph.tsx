import React from 'react';
import parse, { domToReact, HTMLReactParserOptions, Element } from 'html-react-parser';

/**
 * Paragraph Component
 * 
 * A flexible paragraph component that supports responsive grid layouts,
 * HTML parsing, and dynamic span styling. Perfect for creating consistent
 * text content with advanced formatting options.
 * 
 * @example
 * // Single paragraph
 * <Paragraph
 *   textOne="This is a single paragraph with some content."
 *   fontSize="1.2rem"
 *   color="var(--var-dc--foreground)"
 * />
 * 
 * @example
 * // Two-column layout
 * <Paragraph
 *   textOne="First column content goes here."
 *   textTwo="Second column content goes here."
 *   gap="gap-8"
 *   fontSize="1.1rem"
 * />
 * 
 * @example
 * // With HTML content and span styling
 * <Paragraph
 *   textOne="This paragraph has <span>highlighted text</span> in it."
 *   spanColor="var(--var-dc--primary-color)"
 *   spanFontWeight="700"
 *   fontSize="1rem"
 * />
 * 
 * @example
 * // Using CSS variables for theming
 * <Paragraph
 *   textOne="Themed paragraph content"
 *   fontSize="var(--var-dc--font-size-lg)"
 *   fontFamily="var(--var-dc--font-secondary)"
 *   color="var(--var-dc--foreground)"
 *   margin="var(--var-dc--spacing-40) 0"
 * />
 */

interface ParagraphProps {
  /** Primary text content (required) */
  textOne: string;
  /** Secondary text content for two-column layout (optional) */
  textTwo?: string;
  /** Text color (CSS color value) */
  color?: string;
  /** Font size (CSS font-size value) */
  fontSize?: string;
  /** Font weight */
  fontWeight?: React.CSSProperties['fontWeight'];
  /** Line height (CSS line-height value) */
  lineHeight?: string;
  /** Letter spacing (CSS letter-spacing value) */
  letterSpacing?: string;
  /** Font family (CSS font-family value) */
  fontFamily?: string;
  /** Additional CSS classes */
  className?: string;
  /** Gap between columns (Tailwind gap classes) */
  gap?: string;
  /** Margin around container (CSS margin value) */
  margin?: string;
  
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
 * Paragraph Component Implementation
 * 
 * Features:
 * - Responsive grid layout (single or two-column)
 * - HTML string parsing with html-react-parser
 * - Dynamic span element styling
 * - CSS custom properties support
 * - Mobile-first responsive design
 * - TypeScript support with comprehensive prop types
 * - Automatic layout detection based on content
 */
const Paragraph: React.FC<ParagraphProps> = ({
  textOne,
  textTwo,
  color,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  fontFamily,
  className,
  gap = 'gap-4',
  margin,
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
  ...rest
}) => {
  // Style for the <p> elements
  const style: React.CSSProperties = {
    color,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    fontFamily,
  };

  // Style for the grid container
  const containerStyle: React.CSSProperties = {
    margin,
  };

  /**
   * Parser options for html-react-parser
   * Automatically applies span-specific styles to all span elements
   */
  const parserOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (
        domNode instanceof Element &&
        domNode.name === 'span'
      ) {
        return (
          <span
            style={{
              color: spanColor,
              fontWeight: spanFontWeight,
              fontSize: spanFontSize,
              fontFamily: spanFontFamily,
              textTransform: spanTextTransform,
              letterSpacing: spanLetterSpacing,
              fontStyle: spanFontStyle,
              margin: spanMargin,
              padding: spanPadding,
              textDecoration: spanTextDecoration,
              ...(domNode.attribs?.style ? { ...parseStyleString(domNode.attribs.style) } : {}),
            }}
          >
            {domToReact(domNode.children as Element[], parserOptions)}
          </span>
        );
      }
    },
  };

  /**
   * Helper function to parse inline style strings into style objects
   * @param styleString - The inline style string (e.g., "font-weight:bold;color:red;")
   * @returns Style object suitable for React style prop
   */
  function parseStyleString(styleString: string): Record<string, string> {
    return styleString.split(';').reduce((acc, styleProp) => {
      const [key, value] = styleProp.split(':');
      if (key && value) {
        (acc as Record<string, string>)[key.trim()] = value.trim();
      }
      return acc;
    }, {} as Record<string, string>);
  }

  // Single column layout (only textOne provided)
  if (!textTwo) {
    return (
      <div className={`grid grid-cols-12 ${className || ''}`} style={containerStyle} {...rest}>
        <p className="col-span-12" style={style}>
          {parse(textOne, parserOptions)}
        </p>
      </div>
    );
  }

  // Two-column layout (both textOne and textTwo provided)
  return (
    <div className={`grid grid-cols-12 ${gap} ${className || ''}`} style={containerStyle} {...rest}>
      <p className="col-span-12 md:col-span-6" style={style}>
        {parse(textOne, parserOptions)}
      </p>
      <p className="col-span-12 md:col-span-6" style={style}>
        {parse(textTwo, parserOptions)}
      </p>
    </div>
  );
};

export default Paragraph;