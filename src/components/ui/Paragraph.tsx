import React from 'react';
import parse, { domToReact, HTMLReactParserOptions, Element } from 'html-react-parser';

/**
 * Props for the Paragraph component.
 *
 * @property textOne - The primary text content to display in the paragraph.
 * @property textTwo - (Optional) The secondary text content, typically rendered as a <span> or similar element.
 * @property color - (Optional) The color of the paragraph text (CSS color value).
 * @property fontSize - (Optional) The font size of the paragraph text (CSS font-size value).
 * @property fontWeight - (Optional) The font weight of the paragraph text.
 * @property lineHeight - (Optional) The line height of the paragraph text (CSS line-height value).
 * @property letterSpacing - (Optional) The letter spacing of the paragraph text (CSS letter-spacing value).
 * @property fontFamily - (Optional) The font family of the paragraph text (CSS font-family value).
 * @property className - (Optional) Additional CSS class names to apply to the paragraph.
 * @property gap - (Optional) The gap between textOne and textTwo (Tailwind gap classes).
 * @property margin - (Optional) The margin around the paragraph (CSS margin value).
 * @property spanColor - (Optional) The color to apply specifically to all <span> elements in the text (CSS color value).
 * @property spanFontWeight - (Optional) Font weight for all <span> elements.
 * @property spanFontSize - (Optional) Font size for all <span> elements.
 * @property spanFontFamily - (Optional) Font family for all <span> elements.
 * @property spanTextTransform - (Optional) Text transform for all <span> elements.
 * @property spanLetterSpacing - (Optional) Letter spacing for all <span> elements.
 * @property spanFontStyle - (Optional) Font style for all <span> elements.
 * @property spanMargin - (Optional) Margin for all <span> elements.
 * @property spanPadding - (Optional) Padding for all <span> elements.
 * @property spanTextDecoration - (Optional) Text decoration for all <span> elements.
 */
interface ParagraphProps {
  textOne: string;
  textTwo?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: React.CSSProperties['fontWeight'];
  lineHeight?: string;
  letterSpacing?: string;
  fontFamily?: string;
  className?: string;
  gap?: string;
  margin?: string;
  spanColor?: string;
  spanFontWeight?: string;
  spanFontSize?: string;
  spanFontFamily?: string;
  spanTextTransform?: React.CSSProperties['textTransform'];
  spanLetterSpacing?: string;
  spanFontStyle?: React.CSSProperties['fontStyle'];
  spanMargin?: string;
  spanPadding?: string;
  spanTextDecoration?: React.CSSProperties['textDecoration'];
}

/**
 * Paragraph component that displays one or two text blocks in a responsive grid.
 * - If only textOne is provided, it spans the full width.
 * - If both textOne and textTwo are provided, each takes 6 columns on desktop.
 * - Supports dynamic styling and parsing of HTML, including dynamic styling of <span> tags.
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
   * Parser options for html-react-parser.
   * This will inject all span-related props as styles for all <span> elements in the parsed HTML.
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
   * Helper function to parse an inline style string into a style object.
   * @param styleString - The inline style string (e.g., "font-weight:bold;color:red;")
   * @returns An object suitable for use as a React style prop.
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

  // Render single or double column grid based on presence of textTwo
  if (!textTwo) {
    // Only textOne: full width
    return (
      <div className={`grid grid-cols-12 ${className || ''}`} style={containerStyle} {...rest}>
        <p className="col-span-12" style={style}>
          {parse(textOne, parserOptions)}
        </p>
      </div>
    );
  }

  // Both textOne and textTwo: split 6/6 on desktop, stacked on mobile
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