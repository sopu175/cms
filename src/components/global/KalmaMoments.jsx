'use client';

import styled from "styled-components";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import React, {useEffect, useRef, useState} from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);
const slides = [
    {
        "id": 1,
        "title": "Banani",
        "projects": [
            {
                "name": "Banani Lake View",
                "status": "Ongoing",
                "type": "Residential"
            },
            {
                "name": "Banani Corporate Hub",
                "status": "Completed",
                "type": "Commercial"
            },
            {
                "name": "Banani Heights",
                "status": "Upcoming",
                "type": "Residential"
            },
            {
                "name": "Banani Lake View",
                "status": "Ongoing",
                "type": "Residential"
            },
            {
                "name": "Banani Corporate Hub",
                "status": "Completed",
                "type": "Commercial"
            },
            {
                "name": "Banani Heights",
                "status": "Upcoming",
                "type": "Residential"
            }
        ],
        "button": {
            "text": "Spatial design",
            "src": "/projects/details"
        }
    },
    {
        "id": 2,
        "title": "Gulshan",
        "projects": [
            {
                "name": "Gulshan Plaza",
                "status": "Completed",
                "type": "Commercial"
            },
            {
                "name": "Gulshan Residency",
                "status": "Ongoing",
                "type": "Residential"
            },
            {
                "name": "Gulshan Business Tower",
                "status": "Upcoming",
                "type": "Commercial"
            },
            {
                "name": "Gulshan Plaza",
                "status": "Completed",
                "type": "Commercial"
            },
            {
                "name": "Gulshan Residency",
                "status": "Ongoing",
                "type": "Residential"
            },
            {
                "name": "Gulshan Business Tower",
                "status": "Upcoming",
                "type": "Commercial"
            }
        ],
        "button": {
            "text": "Visualization",
            "src": "/projects/details"
        }
    },
    {
        "id": 3,
        "title": "Mirpur",
        "projects": [
            {
                "name": "Mirpur Garden Heights",
                "status": "Ongoing",
                "type": "Residential"
            },
            {
                "name": "Mirpur Shopping Complex",
                "status": "Completed",
                "type": "Commercial"
            },
            {
                "name": "Mirpur Sky Towers",
                "status": "Upcoming",
                "type": "Residential"
            },
            {
                "name": "Mirpur Garden Heights",
                "status": "Ongoing",
                "type": "Residential"
            },
            {
                "name": "Mirpur Shopping Complex",
                "status": "Completed",
                "type": "Commercial"
            },
            {
                "name": "Mirpur Sky Towers",
                "status": "Upcoming",
                "type": "Residential"
            }
        ],
        "button": {
            "text": "Interactive",
            "src": "/projects/details"
        }
    },
    {
        "id": 4,
        "title": "Baridhara",
        "projects": [
            {
                "name": "Baridhara Diplomatic Zone",
                "status": "Completed",
                "type": "Commercial"
            },
            {
                "name": "Baridhara Lake City",
                "status": "Ongoing",
                "type": "Residential"
            },
            {
                "name": "Baridhara Business Park",
                "status": "Upcoming",
                "type": "Commercial"
            },
            {
                "name": "Baridhara Diplomatic Zone",
                "status": "Completed",
                "type": "Commercial"
            },
            {
                "name": "Baridhara Lake City",
                "status": "Ongoing",
                "type": "Residential"
            },
            {
                "name": "Baridhara Business Park",
                "status": "Upcoming",
                "type": "Commercial"
            }
        ],
        "button": {
            "text": "Interactive",
            "src": "/projects/details"
        }
    },
    {
        "id": 5,
        "title": "Dhanmondi",
        "projects": [
            {
                "name": "Dhanmondi Twin Towers",
                "status": "Ongoing",
                "type": "Residential"
            },
            {
                "name": "Dhanmondi Mall",
                "status": "Completed",
                "type": "Commercial"
            },
            {
                "name": "Dhanmondi Executive Heights",
                "status": "Upcoming",
                "type": "Commercial"
            },
            {
                "name": "Dhanmondi Twin Towers",
                "status": "Ongoing",
                "type": "Residential"
            },
            {
                "name": "Dhanmondi Mall",
                "status": "Completed",
                "type": "Commercial"
            },
            {
                "name": "Dhanmondi Executive Heights",
                "status": "Upcoming",
                "type": "Commercial"
            }
        ],
        "button": {
            "text": "Interactive",
            "src": "/projects/details"
        }
    },
    {
        "id": 6,
        "title": "Bashundhara",
        "projects": [
            {
                "name": "Bashundhara Twin Towers",
                "status": "Ongoing",
                "type": "Residential"
            },
            {
                "name": "Bashundhara Mall",
                "status": "Completed",
                "type": "Commercial"
            },
            {
                "name": "Bashundhara Executive Heights",
                "status": "Upcoming",
                "type": "Commercial"
            },
            {
                "name": "Bashundhara Twin Towers",
                "status": "Ongoing",
                "type": "Residential"
            },
            {
                "name": "Bashundhara Mall",
                "status": "Completed",
                "type": "Commercial"
            },
            {
                "name": "Bashundhara Executive Heights",
                "status": "Upcoming",
                "type": "Commercial"
            }
        ],
        "button": {
            "text": "Interactive",
            "src": "/projects/details"
        }
    }
];

const MyComponent = ({ data }) => {
    const pathname = usePathname();
    const mapRef = useRef(null);
    const leafletMapRef = useRef(null);
    const markersRef = useRef([]);
    const polylineRef = useRef(null);

    const [isDesktop, setIsDesktop] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);

    // Define your map markers - easily add/remove locations here
    const mapMarkers = [
        {
            id: 'banani',
            name: 'Banani',
            position: [23.7937, 90.4066], // [lat, lng]
            color: '#22c55e', // green
            slideIndex: 0
        },
        {
            id: 'gulshan',
            name: 'Gulshan',
            position: [23.7808, 90.4128], // [lat, lng]
            color: '#3b82f6', // blue
            slideIndex: 1
        },
        {
            id: 'mirpur',
            name: 'Mirpur',
            position: [23.8223, 90.3654], // [lat, lng]
            color: '#ef4444', // red
            slideIndex: 2
        },
        {
            id: 'baridhara',
            name: 'Baridhara',
            position: [23.8103, 90.4125], // [lat, lng]
            color: '#8b5cf6', // purple
            slideIndex: 3
        },
        {
            id: 'dhanmondi',
            name: 'Dhanmondi',
            position: [23.7461, 90.3742], // [lat, lng]
            color: '#f97316', // orange
            slideIndex: 4
        },
        {
            id: 'bashundhara',
            name: 'Bashundhara',
            position: [23.820013950213465, 90.45212362926175], // [lat, lng]
            color: '#829B4D',
            slideIndex: 5
        }
    ];

    useEffect(() => {
        setIsDesktop(window.innerWidth > 991);

        const handleResize = () => {
            setIsDesktop(window.innerWidth > 991);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Initialize Leaflet map
    useEffect(() => {
        if (typeof window !== 'undefined' && mapRef.current && !leafletMapRef.current) {
            // Load Leaflet dynamically
            const loadLeaflet = async () => {
                if (!window.L) {
                    // Load Leaflet CSS
                    const cssLink = document.createElement('link');
                    cssLink.rel = 'stylesheet';
                    cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                    document.head.appendChild(cssLink);

                    // Load Leaflet JS
                    const script = document.createElement('script');
                    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                    script.onload = initializeMap;
                    document.head.appendChild(script);
                } else {
                    initializeMap();
                }
            };

            // In the useEffect for initializing Leaflet map
            const initializeMap = () => {
                if (!leafletMapRef.current && window.L) {
                    // Calculate bounds to fit all markers
                    const bounds = window.L.latLngBounds(mapMarkers.map(marker => marker.position));

                    // Initialize map
                    const map = window.L.map(mapRef.current, {
                        zoomControl: false,
                        scrollWheelZoom: false,
                        doubleClickZoom: false,
                        dragging: false, // Disable dragging completely
                        touchZoom: false, // Disable touch zoom completely
                        boxZoom: false,
                        keyboard: false,
                        attributionControl: false
                    });

                    // Only enable dragging and touch zoom for mobile
                    if (!isDesktop) {
                        map.dragging.enable();
                        map.touchZoom.enable();
                    }

                    // Add a handler to prevent any drag attempts on desktop
                    if (isDesktop) {
                        const mapContainer = mapRef.current;
                        if (mapContainer) {
                            // Prevent mousedown events on the map container for desktop
                            mapContainer.addEventListener('mousedown', (e) => {
                                if (window.innerWidth > 991) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    return false;
                                }
                            }, { passive: false });

                            // Also prevent touchstart for touch-enabled desktops
                            mapContainer.addEventListener('touchstart', (e) => {
                                if (window.innerWidth > 991) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    return false;
                                }
                            }, { passive: false });
                        }
                    }

                    // Add OpenStreetMap tiles
                    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                        maxZoom: 15,
                        minZoom: 11
                    }).addTo(map);

                    // Fit map to show all markers with padding
                    map.fitBounds(bounds, {
                        padding: [50, 50],
                        maxZoom: 13
                    });

                    // Create custom marker icon function
                    const createCustomIcon = (color, isActive = false) => {
                        const size = 50; // Use consistent size
                        const iconHtml = `
                            <div class="marker-icon ${isActive ? 'active' : ''}" style="
                                width: ${size}px;
                                height: ${size}px;
                                background: ${color};
                                border: 3px solid white;
                                border-radius: 50% 50% 50% 0;
                                transform: rotate(-45deg) scale(${isActive ? 1 : 0.6});
                                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                transition: transform 0.5s ease-in-out;
                            ">
                                <div style="
                                    width: 8px;
                                    height: 8px;
                                    background: white;
                                    border-radius: 50%;
                                    transform: rotate(45deg);
                                "></div>
                            </div>
                        `;

                        return window.L.divIcon({
                            html: iconHtml,
                            className: 'custom-marker',
                            iconSize: [size, size],
                            iconAnchor: [size/2, size],
                            popupAnchor: [0, -size]
                        });
                    };

                    // Add markers
                    mapMarkers.forEach((markerData, index) => {
                        // Different marker options based on device type
                        const markerOptions = {
                            icon: createCustomIcon(markerData.color, index === 0),
                            // For desktop: disable interactivity except for tooltips
                            interactive: isDesktop ? false : true,
                            // For desktop: disable keyboard accessibility
                            keyboard: isDesktop ? false : true,
                        };

                        const marker = window.L.marker(markerData.position, markerOptions).addTo(map);

                        // Add tooltip with location name
                        marker.bindTooltip(markerData.name, {
                            permanent: isDesktop ? false : true,
                            direction: 'top',
                            offset: [0, -25],
                            className: 'custom-tooltip'
                        });

                        // For mobile only: add popup functionality
                        if (!isDesktop) {
                            marker.on('click', () => {
                                // Close any existing popups first
                                map.closePopup();

                                // Show a popup with project details
                                const slideData = slides[markerData.slideIndex];
                                let projectsHtml = '';

                                slideData.projects.slice(0, 3).forEach(project => {
                                    projectsHtml += `<li>${project.name} - ${project.status} (${project.type})</li>`;
                                });

                                const popupContent = `
                <div class="mobile-popup">
                    <h3>${slideData.title}</h3>
                    <ul>${projectsHtml}</ul>
                    <a href="/projects" class="view-all">View All</a>
                </div>
            `;

                                // Create a new popup each time instead of binding it
                                const popup = window.L.popup({
                                    className: 'project-popup',
                                    maxWidth: 300,
                                    closeButton: true
                                })
                                    .setLatLng(markerData.position)
                                    .setContent(popupContent)
                                    .openOn(map);
                            });
                        }

                        // After adding the marker, if on desktop, try to disable click events at the DOM level
                        if (isDesktop) {
                            // Get the marker's DOM element
                            const markerElement = marker.getElement();
                            if (markerElement) {
                                // Disable pointer events on the marker element
                                markerElement.style.pointerEvents = 'none';

                                // Re-enable pointer events only for the tooltip
                                const tooltipElement = marker.getTooltip()._container;
                                if (tooltipElement) {
                                    tooltipElement.style.pointerEvents = 'auto';
                                }
                            }
                        }

                        markersRef.current.push({
                            leafletMarker: marker,
                            data: markerData,
                            createIcon: (isActive) => createCustomIcon(markerData.color, isActive)
                        });
                    });

                    leafletMapRef.current = map;
                    setMapLoaded(true);
                }
            };

            loadLeaflet();
        }

        return () => {
            if (leafletMapRef.current) {
                leafletMapRef.current.remove();
                leafletMapRef.current = null;
                markersRef.current = [];
                setMapLoaded(false);
            }
        };
    }, []);

    const isLoad = typeof window !== 'undefined' ? window.innerWidth > 992 : false;

    useGSAP(() => {
        if (isLoad && mapLoaded) {
            const animations = [];
            const slideContents = document.querySelectorAll(".slide-content");
            const pointerLine = document.querySelector(".pointer-line");
            const pointerDot = document.querySelector(".pointer-dot");

            // Initialize all slide contents
            slideContents.forEach((content, index) => {
                if (index === 0) {
                    gsap.set(content, {
                        y: 0,
                        opacity: 1,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%'
                    });
                } else {
                    gsap.set(content, {
                        y: '100%',
                        opacity: 0,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%'
                    });
                }
            });

            // Initialize pointer line - connect to map center initially
            if (pointerLine && pointerDot && leafletMapRef.current) {
                const mapContainer = mapRef.current;
                const mapRect = mapContainer.getBoundingClientRect();
                const containerRect = document.querySelector('.projects-reveal').getBoundingClientRect();

                // Calculate relative position of first marker
                const firstMarkerLatLng = mapMarkers[0].position;
                const point = leafletMapRef.current.latLngToContainerPoint(firstMarkerLatLng);

                // Convert to percentage coordinates
                const markerX = (point.x / mapRect.width) * 50; // 50% because map is half width
                const markerY = (point.y / mapRect.height) * 100;

                const textBoxX = 69;
                const textBoxY = 50;

                const initialPathData = `M ${textBoxX} ${textBoxY} L ${markerX} ${markerY}`;

                gsap.set(pointerLine, {
                    attr: { d: initialPathData },
                    autoAlpha: 1,
                    immediateRender: true
                });

                gsap.set(pointerDot, {
                    attr: {
                        cx: markerX,
                        cy: markerY
                    },
                    autoAlpha: 1,
                    immediateRender: true
                });
            }

            const progressStep = 1 / (slides.length - 1);

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".projects-reveal",
                    start: "top top",
                    end: () => `+=${document.querySelector(".projects-reveal").offsetHeight * 2}`,
                    scrub: 1.5,
                    pin: true,
                    pinSpacer: false,
                    onUpdate: (self) => {
                        const currentSlideIndex = Math.floor(self.progress / progressStep);
                        const slideProgress = (self.progress - (currentSlideIndex * progressStep)) / progressStep;
                        const nextSlideIndex = Math.min(currentSlideIndex + 1, slideContents.length - 1);

                        // Determine which slide is most visible to the user
                        // This will be used for both content and marker/pointer
                        let dominantSlideIndex = currentSlideIndex;

                        // If the next slide is more than 50% visible, consider it the dominant slide
                        if (slideProgress > 0.5 && nextSlideIndex < slides.length) {
                            dominantSlideIndex = nextSlideIndex;
                        }

                        // Animate slide content transitions
                        slideContents.forEach((content, index) => {
                            if (index === currentSlideIndex) {
                                const currentY = slideProgress * -100;
                                const currentOpacity = Math.max(0, 1 - slideProgress * 1.5);
                                gsap.set(content, {
                                    y: `${currentY}%`,
                                    opacity: currentOpacity
                                });
                            } else if (index === nextSlideIndex && currentSlideIndex < slideContents.length - 1) {
                                const nextY = 100 - (slideProgress * 100);
                                const nextOpacity = Math.min(1, slideProgress * 1.5);
                                gsap.set(content, {
                                    y: `${nextY}%`,
                                    opacity: nextOpacity
                                });
                            } else if (index < currentSlideIndex) {
                                gsap.set(content, {
                                    y: '-100%',
                                    opacity: 0
                                });
                            } else if (index > nextSlideIndex) {
                                gsap.set(content, {
                                    y: '100%',
                                    opacity: 0
                                });
                            }
                        });

                        // Update map markers based on the dominant slide
                        markersRef.current.forEach((markerObj, index) => {
                            const isActive = index === dominantSlideIndex;

                            // Instead of replacing the icon, find and update the existing marker element
                            const markerElement = markerObj.leafletMarker.getElement();
                            if (markerElement) {
                                const iconDiv = markerElement.querySelector('.marker-icon');
                                if (iconDiv) {
                                    if (isActive) {
                                        iconDiv.classList.add('active');
                                        iconDiv.style.transform = 'rotate(-45deg) scale(1)';
                                    } else {
                                        iconDiv.classList.remove('active');
                                        iconDiv.style.transform = 'rotate(-45deg) scale(0.6)';
                                    }
                                }
                            }
                        });

                        // Update pointer line to the dominant slide's marker with smooth animation
                        if (pointerLine && pointerDot && leafletMapRef.current) {
                            const mapContainer = mapRef.current;
                            const mapRect = mapContainer.getBoundingClientRect();

                            const targetMarkerLatLng = mapMarkers[dominantSlideIndex].position;
                            const point = leafletMapRef.current.latLngToContainerPoint(targetMarkerLatLng);

                            const markerX = (point.x / mapRect.width) * 50;
                            const markerY = (point.y / mapRect.height) * 100;
                            const textBoxX = 69;
                            const textBoxY = 50;

                            const pathData = `M ${textBoxX} ${textBoxY} L ${markerX} ${markerY}`;

                            // Use GSAP to animate the path and dot position for smooth transitions
                            gsap.to(pointerLine, {
                                attr: { d: pathData },
                                duration: 0.5,
                                ease: "power2.out"
                            });

                            gsap.to(pointerDot, {
                                attr: {
                                    cx: markerX,
                                    cy: markerY
                                },
                                duration: 0.5,
                                ease: "power2.out"
                            });
                        }
                    }
                },
            });

            animations.push(tl);

            return () => {
                animations.forEach(anim => anim.kill());
                ScrollTrigger.getAll().forEach(t => t.kill());
            };
        }
    }, [pathname, isLoad, mapLoaded]);

    const [offset, setOffset] = useState(90);
    useEffect(() => {
        const updateOffset = () => {
            const container = document.querySelector(".container");
            if (container) {
                const newOffset = container.offsetLeft;
                document.documentElement.style.setProperty('--offset-left', `${newOffset + 30}px`);
            }
        };

        requestAnimationFrame(() => {
            setTimeout(updateOffset, 50);
        });

        window.addEventListener("resize", updateOffset);
        return () => window.removeEventListener("resize", updateOffset);
    }, []);

    return (
        <StyledComponent className="projects-reveal" offset={offset}>
            <div className="work__photo">
                {/* Leaflet Map Container */}
                <div className="map-container">
                    <div
                        ref={mapRef}
                        className="leaflet-map"
                        style={{
                            width: isDesktop ? '50%' : '100%',
                            height: '100%'
                        }}
                    />
                </div>

                {/* Animated pointer lines connecting text to markers */}
                {isDesktop && (
                    <div className="pointer-lines-container">
                        <svg className="pointer-svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                    <feMerge>
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>
                            <path
                                className="pointer-line"
                                stroke="rgba(255, 255, 255, 0.8)"
                                strokeWidth="0.15"
                                strokeDasharray="0.8,0.4"
                                fill="none"
                                filter="url(#glow)"
                            />
                            <circle
                                className="pointer-dot"
                                r="0.6"
                                cx="0"  /* Initial position, will be updated by GSAP */
                                cy="0"  /* Initial position, will be updated by GSAP */
                                fill="rgba(255, 255, 255, 0.9)"
                                filter="url(#glow)"
                                style={{ shapeRendering: 'geometricPrecision' }}
                            />
                        </svg>
                    </div>
                )}


                {
                    isDesktop && (
                        <div className="fixed-text-container">
                            <div className="glass-card">
                                <div className="content-wrapper">
                                    {slides.map((slide, index) => (
                                        <div className="slide-content" key={slide.id} data-index={index}>
                                            <h3>{slide.title}</h3>
                                            <ul>
                                                {slide.projects.map((project, i) => (
                                                    <li key={i}>
                                                        <Link href={'#'}>
                                                            <span>{project.name}</span> - {project.status} ({project.type})
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="button-wrapper">
                                                <a href={'/projects'}>View All</a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                }

            </div>
        </StyledComponent>
    );
};

const StyledComponent = styled.section`
    position: relative;
    height: 100svh;
    will-change: transform;
    z-index: 10;

    .container {
        height: 100%;

        .row {
            height: 100%;
        }
    }

    .map-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;

        .leaflet-map {
            height: 100% !important;
            filter: grayscale(20%) contrast(1.1);
            
            // Custom tooltip styling
            .custom-tooltip {
                background: rgba(0, 0, 0, 0.8);
                color: white;
                border: none;
                border-radius: 8px;
                padding: 8px 12px;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                font-size: 14px;
                top: -20px;
                &:before {
                    border-top-color: rgba(0, 0, 0, 0.8);
                }
            }

            // Custom marker styling
            .custom-marker {
                background: transparent !important;
                border: none !important;

                .marker-icon {
                    transition: transform 0.5s ease-in-out !important;

                    &.active {
                        transform: rotate(-45deg) scale(1) !important;
                    }

                    &:not(.active) {
                        transform: rotate(-45deg) scale(0.6) !important;
                    }
                }
            }

            // Hide default leaflet controls
            .leaflet-control-container {
                display: none;
            }
        }
    }

    .pointer-lines-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 25;

        .pointer-svg {
            width: 100%;
            height: 100%;

            .pointer-line {
                animation: dash 3s linear infinite;
                opacity: 1;
                visibility: visible;
            }

            .pointer-dot {
                animation: pulse 2s infinite;
                opacity: 1;
                visibility: visible;
            }
        }
    }

    .fixed-text-container {
        z-index: 30;
    }

    .work__photo {
        position: relative;
        height: 100svh !important;
        background: #000;
        overflow: hidden;
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
            r: 0.6;
        }
        50% {
            opacity: 0.7;
            r: 0.8;
        }
    }

    @keyframes dash {
        0% {
            stroke-dashoffset: 0;
        }
        100% {
            stroke-dashoffset: 4.8;
        }
    }

    .fixed-text-container {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        pointer-events: none;
        padding-right: 5vw;
        overflow: hidden;
        z-index: 999999;
    }

    .glass-card {
        position: relative;
        width: 35vw;
        max-width: 500px;
        padding: 2.5rem;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        pointer-events: auto;

        .content-wrapper {
            position: relative;
            height: 60vh;
            overflow: hidden;
        }

        .slide-content {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            will-change: transform, opacity;
            transition: none;
            padding-bottom: 40px;
            
            h3 {
                color: #F8F0E8;
                font-family: Axiforma;
                font-size: 2.5vw;
                font-weight: 500;
                line-height: 1.2;
                margin-bottom: 1rem;
            }
            
            ul{
                padding-left: 0;
                li{
                    list-style: none;
                    padding: 10px 0;
                    border-bottom: 1px solid #FFF;
                    color: #FFF;
                    
                    a{
                        text-decoration: none;
                        color: #FFF;
                        font-weight: 400;
                    }
                }
            }

            p {
                color: #F8F0E8;
                font-family: Axiforma;
                font-size: 1vw;
                font-weight: 400;
                margin-bottom: 1.5rem;
            }

            .button-wrapper {
                margin-top: 1rem;

                a {
                    display: inline-block;
                    padding: 0.8rem 1.5rem;
                    background: rgba(255, 255, 255, 0.2);
                    color: #F8F0E8;
                    border-radius: 30px;
                    font-size: 0.9vw;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.3s ease;

                    &:hover {
                        background: rgba(255, 255, 255, 0.3);
                        transform: translateY(-2px);
                    }
                }
            }
        }
    }

    @media (max-width: 991px) {
        height: 100%;
        .work__photo {
            height: 100% !important;
        }

        .pointer-lines-container {
            display: none;
        }

        .map-container {
            .leaflet-map {
                width: 100% !important;
            }
        }

        .fixed-text-container {
            position: relative;
            padding-right: 0;
            justify-content: center;
            background: rgba(0, 0, 0, 0.7);
        }

        .glass-card {
            width: 92vw;
            margin: 2rem auto;
        }

        .container {
            .row {
                position: unset;
            }
        }

        .work__photo-item {
            position: relative;
            height: 100svh;

            .container-fluid {
                position: absolute;
                top: 60px;
                left: 15px;
                height: 100%;
                width: 100%;

                .row {
                    height: unset;
                }

                .text-box {
                    .glass-card {
                        position: relative;
                        width: 92vw;
                        margin-top: 2rem;
                        padding: 1.5rem;

                        h3 {
                            font-size: 24px;
                        }

                        p {
                            font-size: 16px;
                        }
                    }
                }
            }

            .image-wrapper {
                position: unset;

                img {
                    position: unset;
                }
            }
        }
    }

    @media (max-width: 991px) and (min-width: 768px) {
        .work__photo-item .container-fluid {
            left: 6vw;

            .text-box {
                .glass-card {
                    img {
                        padding-right: 4vw;
                    }
                }

                .title-text {
                    h2 {
                        font-size: 36px;
                        line-height: 110%;
                    }

                    p {
                        font-size: 16px;
                    }
                }
            }
        }
    }


    @media (max-width: 991px) {
        height: 100vh; /* Set explicit height for mobile */

        .work__photo {
            height: 100vh !important; /* Force full viewport height */
            position: relative;
        }

        .map-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh; /* Full viewport height */
            z-index: 1;

            .leaflet-map {
                width: 100% !important;
                height: 100% !important; /* Ensure map fills container */
            }
        }

        .pointer-lines-container {
            display: none; /* Hide pointer lines on mobile */
        }

        .fixed-text-container {
            display: none; /* Hide the text container on mobile */
        }

        /* Custom styling for mobile tooltips and popups */
        .custom-tooltip {
            font-size: 16px;
            font-weight: 600;
            padding: 10px 15px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);

            &:before {
                border-top-color: rgba(0, 0, 0, 0.8);
            }
        }

        /* ... rest of mobile styles ... */
    }

    @media (min-width: 992px) {
        .leaflet-marker-icon {
            pointer-events: none !important;
        }

        .leaflet-tooltip {
            pointer-events: auto !important;
        }

        .leaflet-container {
            cursor: default !important;
            pointer-events: none !important;
        }
    }
`;

export default MyComponent;