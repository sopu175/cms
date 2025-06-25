import React, { ReactNode, HTMLAttributes } from 'react';
import parse, { HTMLReactParserOptions, Element, domToReact } from 'html-react-parser';

type TagName = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface TitleProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  tag?: TagName;
  fontSize?: string;
  lineHeight?: string;
  color?: string;
  children?: ReactNode | string;
  className?: string;
  margin?: string;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: React.CSSProperties['textAlign'];
  textTransform?: React.CSSProperties['textTransform'];
  textDecoration?: React.CSSProperties['textDecoration'];
  letterSpacing?: string;
  fontStyle?: React.CSSProperties['fontStyle'];
  padding?: string;
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

  // Parser options to handle span elements
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

  // Function to render content
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