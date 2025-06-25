'use client';

import {useState, useEffect, JSX} from 'react';
import { smoothScrollTo } from '@/utils/smoothScroll';
import Link from "next/link";

interface NavLinkProps {
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  isActive?: boolean;
  children: React.ReactNode;
}

// Updated type for smoothScrollTo to fix the event handler error
// Assuming the imported smoothScrollTo has a different signature
type SmoothScrollFn = (e: React.MouseEvent<HTMLAnchorElement>) => void;
const typedSmoothScrollTo = smoothScrollTo as unknown as SmoothScrollFn;

const NavLink: React.FC<NavLinkProps> = ({ href, onClick, isActive = false, children }) => {
  return (
    <Link
      href={href} 
      onClick={onClick}
      className={`
        text-white no-underline text-[1.1rem] py-2 px-4 rounded-md transition-all duration-300 ease-in-out
        ${isActive ? 'opacity-100 bg-white/20' : 'opacity-70 bg-transparent'}
        hover:opacity-100 hover:bg-white/10
      `}
    >
      {children}
    </Link>
  );
};

export function Navigation(): JSX.Element {
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    const handleScroll = (): void => {
      // Fix: Cast the NodeList items to HTMLElement to access offsetTop and offsetHeight
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach(section => {
        // Cast the section to HTMLElement to access offsetTop and offsetHeight
        const htmlSection = section as HTMLElement;
        const sectionTop = htmlSection.offsetTop;
        const sectionBottom = sectionTop + htmlSection.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
          setActiveSection(htmlSection.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-[10px] z-[1000] py-4">
      <div className="max-w-[1200px] mx-auto flex justify-center gap-8">
        <NavLink 
          href="/"
        >
          Home
        </NavLink>
        <NavLink 
          href="#posts" 
          onClick={typedSmoothScrollTo}
          isActive={activeSection === 'posts'}
        >
          Posts
        </NavLink>
        <NavLink 
          href="/news-and-events"
        >
          News & Events
        </NavLink>
        <NavLink
          href="/about"
        >
          About Us
        </NavLink>
      </div>
    </nav>
  );
}