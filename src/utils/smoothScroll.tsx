'use client';

import gsap from 'gsap';
import ScrollSmoother from 'gsap/ScrollSmoother';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollSmoother, ScrollToPlugin);
}

/**
 * Smooth scrolls to an element when clicking an anchor link
 * @param e The click event
 */
export const smoothScrollTo = (e: MouseEvent): void => {
    // If it's not a hash link, let the default behavior happen
    const target = (e.target as Element).closest('a[href^="#"]');
    if (!target) return;

    e.preventDefault();
    const targetId = target.getAttribute('href')?.slice(1);
    if (!targetId) return;
    
    const element = document.getElementById(targetId);

    if (element) {
        // Update URL without scroll
        window.history.pushState(null, '', `#${targetId}`);

        // Get the ScrollSmoother instance
        const smoother = ScrollSmoother.get();

        // Calculate offset for fixed header
        const headerOffset = 80; // Adjust this value based on your header height

        // Get element's position relative to the viewport
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const targetPosition = absoluteElementTop - headerOffset;

        // Use GSAP for smooth scrolling
        gsap.to(window, {
            duration: 1,
            scrollTo: {
                y: targetPosition,
                autoKill: false
            },
            ease: 'power2.inOut',
            onComplete: () => {
                // Ensure ScrollSmoother is updated
                if (smoother) {
                    smoother.scrollTo(targetPosition, false);
                }
            }
        });
    }
};