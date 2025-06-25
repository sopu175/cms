'use client';
import {useRef, useEffect, JSX} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TranslatingImageProps {
  src: string;
  alt: string;
  containerClassName?: string;
  imageClassName?: string;
}

export default function TranslatingImage({
  src,
  alt,
  containerClassName = '',
  imageClassName = ''
}: TranslatingImageProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const motionDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !motionDivRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(motionDivRef.current,
        {
          yPercent: -10
        },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden ${containerClassName}`}
    >
      <div 
        ref={motionDivRef}
        className="relative w-full h-full"
      >
        <img
          src={src}
          alt={alt}
          className={`absolute block top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] object-cover ${imageClassName}`}
        />
      </div>
    </div>
  );
}