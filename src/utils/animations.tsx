'use client'; // Ensures this code runs only in the browser environment

// Import necessary hooks and GSAP plugins
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/dist/SplitText';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register GSAP plugins (only in the browser)
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, SplitText);
}

// Type definitions for animation presets
interface AnimationPreset {
    initial: {
        opacity: number;
        y?: number;
        scale?: number;
    };
    animate: {
        opacity: number;
        y?: number;
        scale?: number;
    };
    transition: {
        duration: number;
        ease: string | number[] | ((t: number) => number);
    };
}

// Reusable animation presets for common animations
export const animationPresets: Record<string, AnimationPreset> = {
    fadeUp: {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: [0.6, 0.01, -0.05, 0.95] },
    },
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5, ease: 'easeInOut' },
    },
    scaleUp: {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.6, ease: [0.6, 0.01, -0.05, 0.95] },
    },
};

// Type definitions for GSAP utility options
interface ParallaxOptions {
    speed?: number;
    start?: string;
    end?: string;
}

interface RevealOptions {
    y?: number;
    duration?: number;
    start?: string;
    end?: string;
    stagger?: number;
}

interface SplitTextOptions {
    duration?: number;
    stagger?: number;
    ease?: string;
}

interface MagneticOptions {
    strength?: number;
    ease?: number;
}

// GSAP utility functions for common animation effects
export const gsapUtils = {
    /**
     * Parallax scroll effect
     * Adds a smooth parallax scrolling effect to an element.
     *
     * @param {HTMLElement} element - The element to apply the effect to.
     * @param {ParallaxOptions} options - Options for the effect, like speed and scroll range.
     */
    createParallax: (element: HTMLElement, options: ParallaxOptions = {}) => {
        const { speed = 0.1, start = 'top bottom', end = 'bottom top' } = options;

        return gsap.to(element, {
            y: () => (element.offsetHeight * speed * -1), // Moves element up/down based on scroll
            ease: 'none', // No easing, just direct movement
            scrollTrigger: {
                trigger: element,
                start,
                end,
                scrub: true, // Syncs animation to the scroll position
            },
        });
    },

    /**
     * Reveal on scroll animation
     * Reveals an element with a fade and slide effect as it comes into view.
     *
     * @param {HTMLElement | HTMLElement[]} element - The element(s) to animate.
     * @param {RevealOptions} options - Options for the reveal animation (e.g., y offset, duration).
     */
    createReveal: (element: HTMLElement | HTMLElement[], options: RevealOptions = {}) => {
        const {
            y = 50,
            duration = 1,
            start = 'top 85%',
            end = 'top 15%',
            stagger = 0,
        } = options;

        return gsap.from(element, {
            opacity: 0,
            y,
            duration,
            ease: 'cubic-smooth',
            stagger,
            scrollTrigger: {
                trigger: element,
                start,
                end,
                toggleActions: 'play none none reverse',
            },
        });
    },

    /**
     * Split text animation
     * Splits text into individual characters and animates them as they come into view.
     *
     * @param {HTMLElement} element - The element containing the text to split and animate.
     * @param {SplitTextOptions} options - Options for split text animation (duration, stagger).
     */
    splitTextReveal: (element: HTMLElement, options: SplitTextOptions = {}) => {
        const {
            duration = 1.5,
            stagger = 0.02,
            ease = 'power4.out',
        } = options;

        const split = new SplitText(element, {
            type: 'chars,words',
            linesClass: 'split-line', // Adds a class for styling lines
        });

        gsap.from(split.chars, {
            opacity: 0,
            yPercent: 100,
            duration,
            ease,
            stagger,
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            },
        });

        return split; // Returns SplitText instance to be used for further manipulation
    },

    /**
     * Magnetic effect
     * Creates a magnetic hover effect where the element moves in response to mouse movement.
     *
     * @param {HTMLElement} element - The element to apply the magnetic effect to.
     * @param {MagneticOptions} options - Options for the effect, such as strength and ease.
     */
    createMagneticEffect: (element: HTMLElement, options: MagneticOptions = {}) => {
        const { strength = 0.5, ease = 0.1 } = options;
        let bounds: DOMRect;
        let mouseX = 0;
        let mouseY = 0;
        let elementX = 0;
        let elementY = 0;

        const lerp = (start: number, end: number, t: number): number => start * (1 - t) + end * t;

        const animate = () => {
            if (!bounds) return;

            elementX = lerp(elementX, mouseX, ease);
            elementY = lerp(elementY, mouseY, ease);

            gsap.set(element, {
                x: elementX * strength,
                y: elementY * strength,
            });

            requestAnimationFrame(animate); // Keep animating based on mouse position
        };

        const calculatePosition = (e: MouseEvent) => {
            bounds = element.getBoundingClientRect();
            mouseX = e.clientX - bounds.left - bounds.width / 2;
            mouseY = e.clientY - bounds.top - bounds.height / 2;
        };

        const handleMouseEnter = (e: MouseEvent) => {
            calculatePosition(e);
            animate();
        };

        const handleMouseLeave = () => {
            gsap.to(element, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'power2.out', // Smooth transition back to the initial position
            });
        };

        const handleMouseMove = (e: MouseEvent) => {
            calculatePosition(e);
        };

        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);
        element.addEventListener('mousemove', handleMouseMove);

        return () => {
            element.removeEventListener('mouseenter', handleMouseEnter);
            element.removeEventListener('mouseleave', handleMouseLeave);
            element.removeEventListener('mousemove', handleMouseMove);
        };
    },
};

// Custom hook for intersection observer functionality (detects visibility of elements in view)
export const useIntersectionObserver = (options: IntersectionObserverInit = {}) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const elementRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const currentElement = elementRef.current;
        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting); // Update visibility state when the element enters/exits the viewport
        }, options);

        if (currentElement) {
            observer.observe(currentElement); // Start observing the element
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement); // Cleanup observer on component unmount
            }
        };
    }, [options]);

    return [elementRef, isVisible] as const; // Return the ref and visibility state
};
