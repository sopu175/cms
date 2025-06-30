'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

/**
 * ScrollAnimations Component
 * 
 * A comprehensive scroll-based animation system using GSAP ScrollTrigger.
 * Provides pre-built animation presets and utilities for creating smooth,
 * performant scroll-triggered animations.
 * 
 * @example
 * // Basic fade-in animation
 * <ScrollAnimations>
 *   <div className="fade-in">This will fade in on scroll</div>
 * </ScrollAnimations>
 * 
 * @example
 * // Multiple animation types
 * <ScrollAnimations>
 *   <div className="slide-up">Slides up from bottom</div>
 *   <div className="slide-left">Slides in from right</div>
 *   <div className="scale-in">Scales in from small</div>
 *   <div className="split-text">Text splits and animates</div>
 * </ScrollAnimations>
 * 
 * @example
 * // Custom animation settings
 * <ScrollAnimations
 *   triggerStart="top 80%"
 *   triggerEnd="top 20%"
 *   stagger={0.1}
 * >
 *   <div className="fade-in">Content</div>
 * </ScrollAnimations>
 */

interface ScrollAnimationsProps {
  /** Child components to animate */
  children: ReactNode;
  /** ScrollTrigger start position (default: "top 85%") */
  triggerStart?: string;
  /** ScrollTrigger end position (default: "top 15%") */
  triggerEnd?: string;
  /** Stagger delay between elements (default: 0.1) */
  stagger?: number;
  /** Animation duration (default: 1) */
  duration?: number;
  /** Animation ease (default: "power2.out") */
  ease?: string;
  /** Enable debug markers (development only) */
  debug?: boolean;
}

/**
 * Animation presets for common scroll effects
 */
const animationPresets = {
  fadeIn: {
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0 },
  },
  slideUp: {
    from: { opacity: 0, y: 60 },
    to: { opacity: 1, y: 0 },
  },
  slideDown: {
    from: { opacity: 0, y: -60 },
    to: { opacity: 1, y: 0 },
  },
  slideLeft: {
    from: { opacity: 0, x: 60 },
    to: { opacity: 1, x: 0 },
  },
  slideRight: {
    from: { opacity: 0, x: -60 },
    to: { opacity: 1, x: 0 },
  },
  scaleIn: {
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1 },
  },
  scaleOut: {
    from: { opacity: 0, scale: 1.2 },
    to: { opacity: 1, scale: 1 },
  },
  rotateIn: {
    from: { opacity: 0, rotation: -10, scale: 0.9 },
    to: { opacity: 1, rotation: 0, scale: 1 },
  },
  flipIn: {
    from: { opacity: 0, rotationY: -90, transformOrigin: "center center" },
    to: { opacity: 1, rotationY: 0, transformOrigin: "center center" },
  },
};

/**
 * ScrollAnimations Component Implementation
 * 
 * Features:
 * - Multiple animation presets (fade, slide, scale, rotate, flip)
 * - Split text animations with character-level control
 * - Parallax effects for background elements
 * - Stagger animations for multiple elements
 * - Responsive animation controls
 * - Performance optimizations
 * - Debug mode for development
 */
const ScrollAnimations: React.FC<ScrollAnimationsProps> = ({
  children,
  triggerStart = "top 85%",
  triggerEnd = "top 15%",
  stagger = 0.1,
  duration = 1,
  ease = "power2.out",
  debug = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const container = containerRef.current;
    const animations: gsap.core.Tween[] = [];

    /**
     * Create scroll-triggered animations for each preset class
     */
    Object.entries(animationPresets).forEach(([className, preset]) => {
      const elements = container.querySelectorAll(`.${className}`);
      
      if (elements.length > 0) {
        // Set initial state
        gsap.set(elements, preset.from);
        
        // Create scroll-triggered animation
        const animation = gsap.to(elements, {
          ...preset.to,
          duration,
          ease,
          stagger,
          scrollTrigger: {
            trigger: elements[0],
            start: triggerStart,
            end: triggerEnd,
            toggleActions: "play none none reverse",
            markers: debug && process.env.NODE_ENV === 'development',
          },
        });
        
        animations.push(animation);
      }
    });

    /**
     * Split text animations
     */
    const splitTextElements = container.querySelectorAll('.split-text');
    splitTextElements.forEach((element) => {
      const splitText = new SplitText(element as HTMLElement, {
        type: "chars,words,lines",
        linesClass: "split-line",
      });

      // Set initial state for characters
      gsap.set(splitText.chars, {
        opacity: 0,
        y: 50,
        rotationX: -90,
      });

      // Animate characters
      const textAnimation = gsap.to(splitText.chars, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.02,
        scrollTrigger: {
          trigger: element,
          start: triggerStart,
          end: triggerEnd,
          toggleActions: "play none none reverse",
          markers: debug && process.env.NODE_ENV === 'development',
        },
      });

      animations.push(textAnimation);
    });

    /**
     * Parallax animations
     */
    const parallaxElements = container.querySelectorAll('.parallax');
    parallaxElements.forEach((element) => {
      const speed = parseFloat(element.getAttribute('data-speed') || '0.5');
      
      const parallaxAnimation = gsap.to(element, {
        yPercent: -50 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          markers: debug && process.env.NODE_ENV === 'development',
        },
      });

      animations.push(parallaxAnimation);
    });

    /**
     * Pin animations (sticky elements)
     */
    const pinElements = container.querySelectorAll('.pin');
    pinElements.forEach((element) => {
      ScrollTrigger.create({
        trigger: element,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
        markers: debug && process.env.NODE_ENV === 'development',
      });
    });

    /**
     * Counter animations
     */
    const counterElements = container.querySelectorAll('.counter');
    counterElements.forEach((element) => {
      const endValue = parseFloat(element.getAttribute('data-count') || '100');
      const duration = parseFloat(element.getAttribute('data-duration') || '2');
      
      const counterObj = { value: 0 };
      
      const counterAnimation = gsap.to(counterObj, {
        value: endValue,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          element.textContent = Math.round(counterObj.value).toString();
        },
        scrollTrigger: {
          trigger: element,
          start: triggerStart,
          toggleActions: "play none none reverse",
          markers: debug && process.env.NODE_ENV === 'development',
        },
      });

      animations.push(counterAnimation);
    });

    /**
     * Morphing path animations (for SVGs)
     */
    const morphElements = container.querySelectorAll('.morph-path');
    morphElements.forEach((element) => {
      const targetPath = element.getAttribute('data-morph-to');
      
      if (targetPath) {
        const morphAnimation = gsap.to(element, {
          attr: { d: targetPath },
          duration: 2,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: element,
            start: triggerStart,
            toggleActions: "play none none reverse",
            markers: debug && process.env.NODE_ENV === 'development',
          },
        });

        animations.push(morphAnimation);
      }
    });

    // Cleanup function
    return () => {
      animations.forEach(animation => animation.kill());
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [triggerStart, triggerEnd, stagger, duration, ease, debug]);

  return (
    <div ref={containerRef} className="scroll-animations-container">
      {children}
      
      {/* CSS for animation optimization */}
      <style jsx global>{`
        .scroll-animations-container {
          /* Optimize for animations */
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }

        /* Split text styling */
        .split-line {
          overflow: hidden;
        }

        /* Parallax optimization */
        .parallax {
          will-change: transform;
        }

        /* Pin element styling */
        .pin {
          will-change: transform;
        }

        /* Counter styling */
        .counter {
          font-variant-numeric: tabular-nums;
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .scroll-animations-container * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

/**
 * Hook for creating custom scroll animations
 * 
 * @example
 * const { animateOnScroll } = useScrollAnimation();
 * 
 * useEffect(() => {
 *   animateOnScroll('.my-element', {
 *     from: { opacity: 0, scale: 0.5 },
 *     to: { opacity: 1, scale: 1 },
 *   });
 * }, []);
 */
export const useScrollAnimation = () => {
  const animateOnScroll = (
    selector: string,
    animation: {
      from: gsap.TweenVars;
      to: gsap.TweenVars;
      trigger?: string;
      start?: string;
      end?: string;
    }
  ) => {
    const elements = document.querySelectorAll(selector);
    
    if (elements.length > 0) {
      gsap.set(elements, animation.from);
      
      return gsap.to(elements, {
        ...animation.to,
        scrollTrigger: {
          trigger: animation.trigger || elements[0],
          start: animation.start || "top 85%",
          end: animation.end || "top 15%",
          toggleActions: "play none none reverse",
        },
      });
    }
  };

  return { animateOnScroll };
};

export default ScrollAnimations;