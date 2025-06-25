declare module 'simplebar-react' {
  import * as React from 'react';
  type SimpleBarProps = React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
    autoHide?: boolean;
    style?: React.CSSProperties;
    // Add more props as needed
  };
  const SimpleBar: React.FC<SimpleBarProps>;
  export default SimpleBar;
} 