'use client';

import {useRef, useEffect, useState, JSX} from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Image from 'next/image';
import { smoothScrollTo } from '@/utils/smoothScroll';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);
}

interface Post {
  id: number;
  title: string;
  body: string;
}

interface Company {
  name: string;
  catchPhrase: string;
}

interface Address {
  city: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  company: Company;
  address: Address;
}

interface ApiData {
  posts: Post[];
  users: User[];
}

export function HomeClient(): JSX.Element | null {
  const [apiData] = useState<ApiData | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const heroRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const pinRef = useRef<HTMLElement | null>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const parallaxRef = useRef<HTMLDivElement | null>(null);

  // Mount effect
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Load data effect
  useEffect(() => {
    if (!isMounted) return;
    
    try {
      const storedData = localStorage.getItem('apiData');
      if (storedData) {
        // Data is available but not being used currently
        console.log('Data loaded from localStorage');
      } else {
        console.warn('No data found in localStorage');
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isMounted]);

  useGSAP(() => {
    if (!isMounted || !apiData) {
      console.log('Waiting for data before initializing GSAP');
      return;
    }
    
    console.log('Initializing GSAP animations');
    ScrollTrigger.refresh();
    ScrollSmoother.get()?.refresh();

    // Hero title animation
    gsap.from(titleRef.current, {
      y: 100,
      opacity: 0,
      duration: 1.5,
      ease: 'power4.out',
    });

    // Hero subtitle animation
    gsap.from(subtitleRef.current, {
      y: 50,
      opacity: 0,
      duration: 1.5,
      delay: 0.5,
      ease: 'power3.out',
    });

    // Cards animation
    cardsRef.current.forEach((card) => {
      if (!card) return;

      gsap.from(card, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom-=100',
          end: 'top center',
          toggleActions: 'play none none reverse',
        },
      });
    });

    // Section titles animation
    sectionsRef.current.forEach((section) => {
      const title = section?.querySelector('h2');
      if (!title) return;

      gsap.from(title, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: title,
          start: 'top bottom-=100',
          end: 'top center',
          toggleActions: 'play none none reverse',
        },
      });
    });

    // Pin animations
    if (pinRef.current) {
      const panels = panelsRef.current.filter(Boolean) as HTMLDivElement[];
      const totalPanels = panels.length + 1;

      // Create ScrollTrigger for the pin section
      ScrollTrigger.create({
        trigger: pinRef.current,
        start: 'top top',
        end: 'bottom top',
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Calculate which panel should be active
          const progress = self.progress;
          const panelIndex = Math.floor(progress * totalPanels);

          // Update panel visibility with previous/active states
          panels.forEach((panel, index) => {
            if (index === panelIndex) {
              panel.classList.remove('translate-y-[-100px]', 'opacity-0', 'invisible');
              panel.classList.add('translate-y-0', 'opacity-100', 'visible');
            } else if (index < panelIndex) {
              panel.classList.add('translate-y-[-100px]', 'opacity-0', 'invisible');
              panel.classList.remove('translate-y-0', 'opacity-100', 'visible');
            } else {
              panel.classList.remove('translate-y-0', 'opacity-100', 'visible', 'translate-y-[-100px]');
              panel.classList.add('opacity-0', 'invisible', 'translate-y-[100px]');
            }
          });
        }
      });

      // Create floating elements for each panel
      panels.forEach((panel) => {
        // Create multiple floating elements with different sizes and positions
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Array.from({ length: 3 }).forEach((_, i) => {
          const floater = document.createElement('div');
          floater.className = 'absolute w-[150px] h-[150px] bg-gradient-to-tr from-[#00C9FF] to-[#92FE9D] rounded-full blur-[30px] opacity-30 pointer-events-none';
          const panelInner = panel.querySelector('.panel-inner');
          if (panelInner) {
            panelInner.appendChild(floater);
          }

          // Random starting position with more dramatic ranges
          gsap.set(floater, {
            x: `random(-100, 100)%`,
            y: `random(-100, 100)%`,
            scale: `random(0.8, 2)`,
            opacity: `random(0.2, 0.4)`
          });

          // Animate floating elements with varied durations
          gsap.to(floater, {
            x: `random(-100, 100)%`,
            y: `random(-100, 100)%`,
            rotation: `random(-360, 360)`,
            scale: `random(0.8, 2)`,
            duration: `random(8, 15)`,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        });
      });
    }

    // Setup parallax effect for the hero background
    if (parallaxRef.current) {
      gsap.to(parallaxRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });
    }
  }, [isMounted, apiData]);

  // Handle scroll click
  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Use the native event if smoothScrollTo expects a native MouseEvent
    smoothScrollTo(e.nativeEvent);
  };

  if (!isMounted || isLoading) {
    return null;
  }

  if (!apiData) {
    console.error('Failed to load required data');
    return <div>Error: Failed to load required data</div>;
  }

  return (
    <main className="min-h-screen w-full relative z-[1] bg-black">
      <section ref={heroRef} id="hero" className="h-screen flex items-center justify-center flex-col gap-8 relative overflow-hidden p-8">
        <div className="absolute top-0 left-0 w-full h-[110%] z-[-1] after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-gradient-to-b after:from-black/50 after:to-black/80 after:pointer-events-none">
          <div className="parallax-image w-full h-[110%] relative origin-top" ref={parallaxRef}>
            <Image
              src="/images/dynamic/slider-3.jpg"
              alt="Hero background"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        </div>
        
        <h1 ref={titleRef} className="text-[clamp(3rem,8vw,6rem)] font-bold text-white text-center leading-[1.1] shadow-[0_2px_4px_rgba(0,0,0,0.3)] relative z-[2]">
          Welcome to Our Blog
          <br />
          Discover Amazing Stories
        </h1>
        
        <p ref={subtitleRef} className="text-[clamp(1rem,3vw,1.5rem)] text-white/80 text-center max-w-[600px] shadow-[0_1px_2px_rgba(0,0,0,0.2)] relative z-[2]">
          Explore our collection of posts, meet our team, and browse through our gallery
        </p>
        
        <a 
          href="#posts" 
          onClick={handleScrollClick}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white text-sm tracking-wider uppercase z-[2] no-underline cursor-pointer transition-opacity duration-300 ease-in-out hover:opacity-80 after:content-[''] after:w-[2px] after:h-[60px] after:bg-white after:origin-top after:shadow-[0_0_8px_rgba(255,255,255,0.3)] after:animate-scrollPulse"
        >
          Scroll
        </a>
      </section>

      <section 
        id="posts" 
        className="min-h-screen py-32 px-8 relative overflow-visible bg-[#111] odd:bg-black"
        ref={(el) => { sectionsRef.current[0] = el; }}
      >
        <div className="max-w-[1200px] m-auto relative z-[2]">
          <h2 className="text-[clamp(2rem,5vw,4rem)] text-white text-center mb-8 relative z-[2]">Latest Posts</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-16 py-16">
            {apiData.posts.map((post, i) => (
              <div
                key={post.id}
                ref={(el) => { cardsRef.current[i] = el; }}
                className="bg-white/5 backdrop-blur-[10px] rounded-2xl p-8 text-white cursor-pointer origin-center border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out overflow-hidden relative z-[2] hover:border-white/20 hover:-translate-y-[5px]"
              >
                <h3 className="text-2xl mb-4 text-white">{post.title}</h3>
                <p className="text-white/80 leading-[1.6]">{post.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <section ref={pinRef} id="pin" className="h-[200vh] bg-[#111] relative overflow-hidden">
        <div className="h-screen w-full flex items-center justify-center bg-black relative">
          <div className="w-full h-screen relative">
            <div 
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-8 opacity-0 invisible translate-y-[100px] transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]"
              ref={(el) => { panelsRef.current[0] = el; }}
            >
              <div className="panel-inner w-full max-w-[1200px] h-[80vh] bg-white/5 rounded-3xl flex items-center justify-center relative overflow-hidden scale-95 transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <h2 className="text-[clamp(2rem,5vw,4rem)] text-white text-center leading-[1.2] max-w-[800px] px-8 translate-y-[30px] opacity-0 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]">Scroll down to see the magic happen</h2>
              </div>
            </div>
            <div 
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-8 opacity-0 invisible translate-y-[100px] transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]"
              ref={(el) => { panelsRef.current[1] = el; }}
            >
              <div className="panel-inner w-full max-w-[1200px] h-[80vh] bg-white/5 rounded-3xl flex items-center justify-center relative overflow-hidden scale-95 transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <h2 className="text-[clamp(2rem,5vw,4rem)] text-white text-center leading-[1.2] max-w-[800px] px-8 translate-y-[30px] opacity-0 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]">This section stays pinned while you scroll</h2>
              </div>
            </div>
            <div 
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-8 opacity-0 invisible translate-y-[100px] transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]"
              ref={(el) => { panelsRef.current[2] = el; }}
            >
              <div className="panel-inner w-full max-w-[1200px] h-[80vh] bg-white/5 rounded-3xl flex items-center justify-center relative overflow-hidden scale-95 transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <h2 className="text-[clamp(2rem,5vw,4rem)] text-white text-center leading-[1.2] max-w-[800px] px-8 translate-y-[30px] opacity-0 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]">Watch the smooth transitions between panels</h2>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <section 
        id="team" 
        className="min-h-screen py-32 px-8 relative overflow-visible bg-[#111] odd:bg-black"
        ref={(el) => { sectionsRef.current[1] = el; }}
      >
        <div className="max-w-[1200px] mx-auto relative z-[2]">
          <h2 className="text-[clamp(2rem,5vw,4rem)] text-white text-center mb-8 relative z-[2]">Meet Our Team</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-16 py-16">
            {apiData.users.map((user, i) => (
              <div
                key={user.id}
                ref={(el) => { cardsRef.current[i + apiData.posts.length] = el; }}
                className="bg-white/5 backdrop-blur-[10px] rounded-2xl p-8 text-white cursor-pointer origin-center border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out overflow-hidden relative z-[2] hover:border-white/20 hover:-translate-y-[5px]"
              >
                <h3 className="text-2xl mb-4 text-white">{user.name}</h3>
                <p className="text-white/80 leading-[1.6]">{user.company.catchPhrase}</p>
                <div className="user-meta">
                  <p>{user.email}</p>
                  <p>{user.address.city}</p>
                  <p>{user.company.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add keyframes for scroll animation */}
      <style jsx global>{`
        @keyframes scrollPulse {
          0% { transform: scaleY(1); }
          50% { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </main>
  );
}
