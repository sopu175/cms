'use client';
import React, {JSX, useEffect, useMemo, useRef, useState} from "react";
import TranslatingImage from "./TranslatingImage";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface WhyChooseSectionProps {
  mustNotShowHeader?: React.MutableRefObject<boolean>;
}

interface TextContainerDimensions {
  containerTop: number;
  textContainerHeight: number;
}

export default function WhyChooseSection({ mustNotShowHeader }: WhyChooseSectionProps): JSX.Element {
    const containerRef = useRef<HTMLElement | null>(null);
    const textContainerRef = useRef<HTMLDivElement | null>(null);
    const overlayRef = useRef<HTMLSpanElement | null>(null);
    const firstSectionRef = useRef<HTMLDivElement | null>(null);
    const secondSectionRef = useRef<HTMLDivElement | null>(null);
    const [windowHeight, setWindowHeight] = useState<number>(0);
    const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);

    const [{ containerTop, textContainerHeight }, setTextContainerHeight] = useState<TextContainerDimensions>({
        containerTop: 0,
        textContainerHeight: 0
    });

    const endOfFirstScroll = useMemo(() =>
            containerTop + textContainerHeight - windowHeight,
        [containerTop, textContainerHeight, windowHeight]
    );

    // Update measurements on resize
    useEffect(() => {
        const updateDimensions = (): void => {
            setWindowHeight(window.innerHeight);
            setIsMobileDevice(window.innerWidth < 960);

            const textContainer = document.getElementById('text-container1');
            if(!textContainer || !containerRef.current) return;

            const containerTop = containerRef.current.offsetTop;
            const textContainerHeight = textContainer.offsetHeight;
            setTextContainerHeight({ containerTop, textContainerHeight });
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        if (isMobileDevice || !containerRef.current || !textContainerRef.current) return;

        // Clear any existing ScrollTriggers for this component
        const triggers = ScrollTrigger.getAll().filter(t => 
            t.vars.trigger === containerRef.current ||
            (t.vars.trigger && (t.vars.trigger as Element).closest('.sticky-container'))
        );
        triggers.forEach(trigger => trigger.kill());

        const ctx = gsap.context(() => {
            // Text translate animation
            gsap.to(textContainerRef.current, {
                y: () => -textContainerHeight + windowHeight,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: () => `+=${textContainerHeight - windowHeight}`,
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            });

            // Overlay opacity animation
            gsap.to(overlayRef.current, {
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: () => `bottom-=${windowHeight} top`,
                    end: "bottom top",
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            });

            // First section scale animation
            gsap.to(firstSectionRef.current, {
                scale: 0.88,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: () => `bottom-=${windowHeight} top`,
                    end: "bottom top",
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            });

            // Second section scale animation
            gsap.fromTo(secondSectionRef.current,
                { scale: 0.88 },
                {
                    scale: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: () => `bottom-=${windowHeight} top`,
                        end: "bottom top",
                        scrub: 1,
                        invalidateOnRefresh: true
                    }
                }
            );

            // Header visibility control
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    if (mustNotShowHeader?.current !== undefined) {
                        mustNotShowHeader.current = self.isActive;
                    }
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, [containerTop, textContainerHeight, windowHeight, endOfFirstScroll, isMobileDevice, mustNotShowHeader]);

    const firstSectionFeatures = [
        "Blocks 70% of the sun's infrared heat energy",
        "Improves thermal insulation",
        "Maximizes natural daylight",
        "Reflects solar heat",
        "Cooler interiors and reduced energy costs",
        "Creates breathtaking natural outlooks instead of traditional walls"
    ];

    const secondSectionFeatures = [
        "Built in humidity control",
        "Incorporated air circulation system",
        "Protection against mold",
        "Silent and sleek design",
        "Life expectancy of 50 years",
        "Easily sourced components",
        "Non-toxic, recyclable and non-flammable",
        "Only 30% of the solar energy powers the system for up to 36 hours"
    ];

    return (
        <section ref={containerRef} className="bg-black/50">
            <div 
                className="relative min-h-screen md:sticky md:top-0" 
                style={{ height: isMobileDevice ? undefined : `${textContainerHeight}px` }}
            >
                <div 
                    ref={firstSectionRef}
                    className="relative bg-[var(--main-color)] flex flex-col-reverse md:grid md:grid-cols-[1fr_1.2fr] md:overflow-hidden md:h-screen lg:gap-4"
                >
                    <span 
                        ref={overlayRef}
                        className="absolute z-[3] hidden md:block top-0 left-0 w-full h-full bg-black/50 opacity-0" 
                    />
                    <div 
                        ref={textContainerRef}
                        id="text-container1"
                        className="flex flex-col gap-20 py-6 px-0 pb-20 sm:p-6 sm:pb-20 sm:pt-10 md:gap-[7.5rem] md:p-20 relative after:content-[''] after:w-full after:h-[200px] after:pointer-events-none after:hidden md:after:block"
                    >
                        <div className="px-4 sm:px-6 sm:px-0 flex items-center gap-2 font-mono text-base font-light lg:text-lg">
                            <span>01</span>
                            <hr className="opacity-60 w-6 h-0 border-t border-[var(--text-color)] border-b-0 border-l-0 border-r-0" />
                            <span className="opacity-60">02</span>
                        </div>
                        <div className="flex flex-col gap-10">
                            <h3 className="px-4 sm:px-6 sm:px-0 font-light text-2xl lg:text-[1.875rem]">
                                Innovative Glass Solutions
                            </h3>
                            <p className="px-4 sm:px-6 sm:px-0 text-sm leading-[1.2rem] max-w-[40ch] lg:text-lg lg:leading-6">
                                We use Low-E solar control glass throughout, which provides a comfortable,
                                energy-efficient, and visually appealing living environment in tropical areas.
                                The benefits include:
                            </p>
                            <ul className="mt-4">
                                {firstSectionFeatures.map((text, index) => (
                                    <li 
                                        key={index} 
                                        className="px-4 sm:px-6 sm:px-0 min-h-14 py-3 flex justify-start items-center gap-6 sm:gap-8 lg:gap-12 lg:min-h-16 border-t border-white/30"
                                    >
                                        <span className="font-mono font-light text-xs lg:text-base">
                                            {index < 9 ? `0${index + 1}` : index + 1}
                                        </span>
                                        <span className="text-sm leading-[1.2rem] lg:text-lg lg:leading-6">
                                            {text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="relative z-[2]">
                        <div className="relative min-h-[400px] w-full md:h-screen">
                            <div className="absolute top-0 left-0 w-full h-full md:relative">
                                <TranslatingImage src="/images/dynamic/slider-3.jpg" alt="image of a resort" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div 
                ref={secondSectionRef}
                className="relative bg-[var(--main-color)] flex flex-col-reverse md:grid md:grid-cols-[1fr_1.2fr] lg:gap-4"
            >
                <div className="relative flex flex-col gap-20 py-6 px-0 pb-20 sm:p-6 sm:pb-20 sm:pt-10 md:gap-[7.5rem] md:p-20 after:content-[''] after:w-full after:h-[200px] after:sticky after:bottom-0 after:pointer-events-none after:bg-gradient-to-b after:from-transparent after:to-[var(--main-color)] after:hidden md:after:block">
                    <div className="px-4 sm:px-6 sm:px-0 flex items-center gap-2 font-mono text-base font-light lg:text-lg">
                        <span>02</span>
                        <hr className="opacity-60 w-6 h-0 border-t border-[var(--text-color)] border-b-0 border-l-0 border-r-0" />
                        <span className="opacity-60">02</span>
                    </div>
                    <div className="flex flex-col gap-10">
                        <h3 className="px-4 sm:px-6 sm:px-0 font-light text-2xl lg:text-[1.875rem]">
                            World First Climate Control
                        </h3>
                        <p className="px-4 sm:px-6 sm:px-0 text-sm leading-[1.2rem] max-w-[40ch] lg:text-lg lg:leading-6">
                            We pioneer an innovative climate control system that outperforms any other,
                            ending the battle with mold for an infinitely healthier experience. Combined
                            with our solar energy system, it provides a world-first sustainable solution.
                            The benefits include:
                        </p>
                        <ul className="mt-4">
                            {secondSectionFeatures.map((text, index) => (
                                <li 
                                    key={index} 
                                    className="px-4 sm:px-6 sm:px-0 min-h-14 py-3 flex justify-start items-center gap-6 sm:gap-8 lg:gap-12 lg:min-h-16 border-t border-white/30"
                                >
                                    <span className="font-mono font-light text-xs lg:text-base">
                                        {index < 9 ? `0${index + 1}` : index + 1}
                                    </span>
                                    <span className="text-sm leading-[1.2rem] lg:text-lg lg:leading-6">
                                        {text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div>
                    <div className="sticky top-0 min-h-[400px] w-full md:h-screen">
                        <div className="h-full">
                            <TranslatingImage src="/images/resort1.jpg" alt="image of a resort" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}