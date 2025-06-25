'use client';

import { useEffect, useRef } from 'react';

/**
 * ✅ CustomScrollbar Component
 *
 * This component renders a custom scroll thumb on the right side of the screen.
 * It tracks the user's scroll position and displays a smooth, minimal scrollbar
 * that fades in while scrolling and fades out after 1.5 seconds of inactivity.
 *
 * 📌 Features:
 * - Custom scrollbar independent of the browser's native scrollbar
 * - Appears only during scroll activity for a cleaner UI
 * - Resizes and repositions based on scroll and viewport changes
 *
 * 🧠 How It Works:
 * - Uses `window.scrollY` and `document.documentElement.scrollHeight` to compute scroll progress
 * - Dynamically sets the thumb height (minimum 15% of the viewport)
 * - Automatically hides using `setTimeout` if scrolling stops
 *
 * 📦 Usage:
 * ----------------------------------------------------------------
 * 1️⃣ Add <CustomScrollbar /> in your root layout (e.g. `layout.tsx`):
 *
 *    <body>
 *      <CustomScrollbar />
 *      {children}
 *    </body>
 *
 * 2️⃣ Add the following to your global CSS (e.g. `globals.css`) to hide native scrollbars:
 *
 *    /* Hide scrollbars in all modern browsers */
// *    html {
// *      scrollbar-width: none; /* Firefox */
// *    }
// *
// *    html::-webkit-scrollbar,
// *    body::-webkit-scrollbar {
// *      display: none; /* Chrome, Safari, Opera */
// *    }
// * ----------------------------------------------------------------
// */

const CustomScrollbar = () => {
  const thumbRef = useRef<HTMLDivElement | null>(null);  // Scrollbar thumb element
  const timerRef = useRef<NodeJS.Timeout | null>(null);  // Timeout for hiding the thumb

  useEffect(() => {
    const updateThumb = () => {
      if (!thumbRef.current) return;

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      // Dynamically calculate thumb height (minimum 15% of viewport)
      const thumbHeight = Math.max(
          (windowHeight / documentHeight) * windowHeight,
          windowHeight * 0.15
      );

      // Calculate thumb position based on scroll progress
      const thumbTop = (scrollTop / (documentHeight - windowHeight)) * (windowHeight - thumbHeight);

      const thumb = thumbRef.current;
      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translateY(${thumbTop}px)`;

      // Show scrollbar thumb
      thumb.classList.remove('opacity-0');
      thumb.classList.add('opacity-100');

      // Clear any existing hide timers and set a new one
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        thumb.classList.remove('opacity-100');
        thumb.classList.add('opacity-0');
      }, 1500);
    };

    // Add scroll and resize listeners
    window.addEventListener('scroll', updateThumb);
    window.addEventListener('resize', updateThumb);
    updateThumb(); // Initial render

    // Cleanup event listeners and timers
    return () => {
      window.removeEventListener('scroll', updateThumb);
      window.removeEventListener('resize', updateThumb);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
      <div className="fixed top-0 right-0 w-1.5 h-full z-50 pointer-events-none">
        <div
            ref={thumbRef}
            className="absolute right-0 w-full rounded-full opacity-0 transition-opacity duration-300"
            style={{
              backgroundColor: 'oklch(77.2% .01 258.338)', // Semi-transparent red thumb
              height: '30px',
              transform: 'translateY(0px)',
            }}
        />
      </div>
  );
};

export default CustomScrollbar;
