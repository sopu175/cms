'use client';

import {JSX, ReactNode, useEffect} from 'react';
import StickyIcon from "@/components/global/StickyIcon";
import {MessageCircle} from "lucide-react";
import CustomScrollbar from "@/components/CustomScrollbar";

interface ClientLayoutProps {
    children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps): JSX.Element {

// Typically added in a top-level client component like _app.tsx or a custom layout
useEffect(() => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('ServiceWorker registered: ', registration);
        })
        .catch((error) => {
          console.error('ServiceWorker registration failed: ', error);
        });
    });
  }
}, []);

  return (
    <>
      <CustomScrollbar />
      <StickyIcon
        icon={MessageCircle}
        bottom="60"
        right="40"
        variant="primary"
        fontFamily="secondary"
      />
        {children}
    </>
  );
}