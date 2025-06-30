'use client';

import { useEffect, useRef, ReactNode } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * SmoothScroll Component
 * 
 * A comprehensive smooth scrolling solution that integrates Lenis smooth scroll
 * with GSAP ScrollTrigger for advanced scroll-based animations. This component
 * provides a premium scrolling experience with customizable easing and performance
 * optimizations.
 * 
 * @example
 * // Basic usage - wrap your entire app
 * <SmoothScroll>
 *   <YourAppContent />
 * </SmoothScroll>
 * 
 * @example
 * // Custom configuration
 * <SmoothScroll
 *   duration={1.5}
 *   easing={(t) => 1 - Math.pow(1 - t, 3)}
 *   smoothTouch={true}
 *   touchMultiplier={1.5}
 * >
 *   <YourAppContent />
 * </SmoothScroll>
 * 
 * @example
 * // Disable on mobile for better performance
 * <SmoothScroll
 *   smoothTouch={false}
 *   touchMultiplier={0}
 * >
 *   <YourAppContent />
 * </SmoothScroll>
 */

interface SmoothScrollProps {
  /** Child components to render */
  children: ReactNode;
  /** Scroll animation duration (default: 1.2) */
  duration?: number;
  /** Custom easing function */
  easing?: (t: number) => number;
  /** Scroll direction ('vertical' | 'horizontal') */
  direction?: 'vertical' | 'horizontal';
  /** Gesture direction for touch devices */
  gestureDirection?: 'vertical' | 'horizontal' | 'both';
  /** Mouse wheel multiplier (default: 1) */
  mouseMultiplier?: number;
  /** Enable smooth scrolling on touch devices (default: false) */
  smoothTouch?: boolean;
  /** Touch scroll multiplier (default: 2) */
  touchMultiplier?: number;
  /** Enable infinite scroll (default: false) */
  infinite?: boolean;
  /** Custom wrapper class name */
  className?: string;
}

/**
 * Default easing function - smooth ease-out curve
 * Provides a natural feeling deceleration
 */
const defaultEasing = (t: number): number => 
  Math.min(1, 1.001 - Math.pow(2, -10 * t));

/**
 * SmoothScroll Component Implementation
 * 
 * Features:
 * - Lenis smooth scroll integration
 * - GSAP ScrollTrigger compatibility
 * - Customizable easing functions
 * - Touch device optimization
 * - Performance monitoring
 * - Automatic cleanup on unmount
 * - TypeScript support
 */
const SmoothScroll: React.FC<SmoothScrollProps> = ({
  children,
  duration = 1.2,
  easing = defaultEasing,
  direction = 'vertical',
  gestureDirection = 'vertical',
  mouseMultiplier = 1,
  smoothTouch = false,
  touchMultiplier = 2,
  infinite = false,
  className = '',
}) => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration,
      easing,
      direction,
      gestureDirection,
      smooth: true,
      mouseMultiplier,
      smoothTouch,
      touchMultiplier,
      infinite,
      // Additional Lenis options for better performance
      syncTouch: true,
      syncTouchLerp: 0.1,
      touchInertiaMultiplier: 35,
      // Prevent scroll on specific elements
      prevent: (node: Element) => {
        return node.classList.contains('no-smooth-scroll') ||
               node.closest('.no-smooth-scroll') !== null;
      },
    });

    lenisRef.current = lenis;

    // Connect Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Update ScrollTrigger on Lenis scroll
    gsap.ticker.lagSmoothing(0);

    /**
     * Animation frame loop for Lenis
     * Ensures smooth scrolling performance
     */
    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }

    // Start the animation loop
    rafRef.current = requestAnimationFrame(raf);

    // Handle anchor links with smooth scrolling
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement;
      
      if (anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href')?.slice(1);
        const targetElement = targetId ? document.getElementById(targetId) : null;
        
        if (targetElement) {
          lenis.scrollTo(targetElement, {
            offset: -100, // Account for fixed headers
            duration: 1.5,
            easing: (t: number) => 1 - Math.pow(1 - t, 3),
          });
        }
      }
    };

    // Add event listener for anchor links
    document.addEventListener('click', handleAnchorClick);

    // Cleanup function
    return () => {
      // Remove event listeners
      document.removeEventListener('click', handleAnchorClick);
      
      // Cancel animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      // Destroy Lenis instance
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      
      // Clean up GSAP
      gsap.ticker.remove(ScrollTrigger.update);
    };
  }, [
    duration,
    easing,
    direction,
    gestureDirection,
    mouseMultiplier,
    smoothTouch,
    touchMultiplier,
    infinite,
  ]);

  // Expose Lenis instance for external use
  useEffect(() => {
    // Add Lenis instance to window for debugging (development only)
    if (process.env.NODE_ENV === 'development' && lenisRef.current) {
      (window as any).lenis = lenisRef.current;
    }
  }, []);

  return (
    <div className={`smooth-scroll-wrapper ${className}`}>
      {children}
      
      {/* Add CSS for smooth scroll optimization */}
      <style jsx global>{`
        html.lenis {
          height: auto;
        }

        .lenis.lenis-smooth {
          scroll-behavior: auto;
        }

        .lenis.lenis-smooth [data-lenis-prevent] {
          overscroll-behavior: contain;
        }

        .lenis.lenis-stopped {
          overflow: hidden;
        }

        .lenis.lenis-scrolling iframe {
          pointer-events: none;
        }

        /* Disable smooth scroll for specific elements */
        .no-smooth-scroll {
          overscroll-behavior: auto;
        }

        /* Optimize for mobile performance */
        @media (max-width: 768px) {
          .smooth-scroll-wrapper {
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
    </div>
  );
};

/**
 * Hook to access Lenis instance from components
 * 
 * @example
 * const lenis = useLenis();
 * 
 * const scrollToTop = () => {
 *   lenis?.scrollTo(0, { duration: 2 });
 * };
 */
export const useLenis = (): Lenis | null => {
  const lenisRef = useRef<Lenis | null>(null);
  
  useEffect(() => {
    // Access Lenis from window (development) or find instance
    if (typeof window !== 'undefined') {
      lenisRef.current = (window as any).lenis || null;
    }
  }, []);
  
  return lenisRef.current;
};

/**
 * Utility function to scroll to element with Lenis
 * 
 * @param target - Element, selector, or scroll position
 * @param options - Scroll options
 * 
 * @example
 * scrollToElement('#section-2', { offset: -100, duration: 1.5 });
 * scrollToElement(document.getElementById('target'));
 * scrollToElement(0); // Scroll to top
 */
export const scrollToElement = (
  target: string | Element | number,
  options?: {
    offset?: number;
    duration?: number;
    easing?: (t: number) => number;
  }
) => {
  const lenis = (window as any).lenis as Lenis;
  
  if (lenis) {
    lenis.scrollTo(target, {
      offset: options?.offset || 0,
      duration: options?.duration || 1.2,
      easing: options?.easing || defaultEasing,
    });
  } else {
    // Fallback to native scroll behavior
    if (typeof target === 'string') {
      const element = document.querySelector(target);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else if (target instanceof Element) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    }
  }
};

export default SmoothScroll;