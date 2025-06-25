'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Phone, ChevronDown, Menu, X } from 'lucide-react';
import { useGlobalData } from "@/context/GlobalContext";
import reactHtmlParser from "react-html-parser";
import Link from "next/link";

interface MenuItem {
    id: number;
    menu_id: number;
    parent_id: number;
    item_title: string;
    item_type: string | null;
    item_desc: string;
    item_url: string;
    item_target: string;
    item_icon: string;
    sort_order: number;
    items: MenuItem[];
}

interface MainMenuProps {
    menuData?: MenuItem[];
}

const MenuItemIcon: React.FC<{ item: MenuItem }> = ({ item }) => {
    return (
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden text-gray-600">
            {item.item_icon ? (
                <img src={item.item_icon} alt={item.item_title} className="w-5 h-5 object-contain" />
            ) : (
                <span className="text-xs font-medium">
                    {item.item_title.charAt(0)}
                </span>
            )}
        </div>
    );
};

const MainMenu: React.FC<MainMenuProps> = ({ }) => {
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const [activeSubMenu, setActiveSubMenu] = useState<number | null>(null);
    const [activeDeepMenu, setActiveDeepMenu] = useState<number | null>(null);
    const [activeFinalMenu, setActiveFinalMenu] = useState<number | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openMobileSubmenus, setOpenMobileSubmenus] = useState<number[]>([]);
    const menuRef = useRef<HTMLDivElement>(null);
    const menuTimerRef = useRef<NodeJS.Timeout | null>(null);
    const subMenuTimerRef = useRef<NodeJS.Timeout | null>(null);
    const deepMenuTimerRef = useRef<NodeJS.Timeout | null>(null);

    const { globalData, menuData } = useGlobalData();
    const getMenuData = (menuData?.main_menu?.data || []) as MenuItem[];

    const currentMenuData = getMenuData;

    // Helper function to check if an item has children
    const hasChildren = (item: MenuItem): boolean => {
        return Array.isArray(item.items) && item.items.length > 0;
    };

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenu(null);
                setActiveSubMenu(null);
                setActiveDeepMenu(null);
                setActiveFinalMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const clearTimeoutIfExists = (ref: React.MutableRefObject<NodeJS.Timeout | null>) => {
        if (ref.current) {
            clearTimeout(ref.current);
            ref.current = null;
        }
    };

    const handleMenuEnter = (menuId: number) => {
        if (window.innerWidth < 768) return;
        clearTimeoutIfExists(menuTimerRef);
        setActiveMenu(menuId);
        setActiveSubMenu(null);
        setActiveDeepMenu(null);
        setActiveFinalMenu(null);
    };

    const handleMenuLeave = () => {
        if (window.innerWidth < 768) return;
        menuTimerRef.current = setTimeout(() => {
            setActiveMenu(null);
        }, 300);
    };

    const handleSubMenuEnter = (subMenuId: number) => {
        if (window.innerWidth < 768) return;
        clearTimeoutIfExists(menuTimerRef);
        clearTimeoutIfExists(subMenuTimerRef);
        setActiveSubMenu(subMenuId);
        setActiveDeepMenu(null);
        setActiveFinalMenu(null);
    };

    const handleSubMenuLeave = () => {
        if (window.innerWidth < 768) return;
        subMenuTimerRef.current = setTimeout(() => {
            setActiveSubMenu(null);
        }, 300);
    };

    const handleDeepMenuEnter = (deepMenuId: number) => {
        if (window.innerWidth < 768) return;
        clearTimeoutIfExists(menuTimerRef);
        clearTimeoutIfExists(subMenuTimerRef);
        clearTimeoutIfExists(deepMenuTimerRef);
        setActiveDeepMenu(deepMenuId);
        setActiveFinalMenu(null);
    };

    const handleDeepMenuLeave = () => {
        if (window.innerWidth < 768) return;
        deepMenuTimerRef.current = setTimeout(() => {
            setActiveDeepMenu(null);
        }, 300);
    };

    const handleFinalMenuEnter = (finalMenuId: number) => {
        if (window.innerWidth < 768) return;
        clearTimeoutIfExists(menuTimerRef);
        clearTimeoutIfExists(subMenuTimerRef);
        clearTimeoutIfExists(deepMenuTimerRef);
        setActiveFinalMenu(finalMenuId);
    };

    const handleMenuClick = (url: string, target: string) => {
        if (url.startsWith('#')) {
            const element = document.getElementById(url.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            if (target === '_blank') {
                window.open(url, '_blank');
            } else {
                window.location.href = url;
            }
        }
        setIsMobileMenuOpen(false);
        setOpenMobileSubmenus([]);
    };

    const toggleMobileSubmenu = (menuId: number) => {
        setOpenMobileSubmenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    // Recursive function to render mobile menu items with proper spacing
    const renderMobileMenuItem = (item: MenuItem, depth: number = 0): React.ReactNode => {
        const hasSubmenu = hasChildren(item);
        const isSubmenuOpen = openMobileSubmenus.includes(item.id);

        return (
            <div key={item.id} className={`mobile-menu-item ${depth > 0 ? 'ml-6' : ''}`}>
                <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                    <button
                        className="flex items-center gap-4 flex-1 text-left"
                        onClick={() => !hasSubmenu ? handleMenuClick(item.item_url, item.item_target) : toggleMobileSubmenu(item.id)}
                    >
                        <MenuItemIcon item={item} />
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 text-base leading-tight">
                                {reactHtmlParser(item.item_title)}
                            </div>
                            {item.item_desc && (
                                <div className="text-sm text-gray-500 mt-1 leading-relaxed">
                                    {item.item_desc}
                                </div>
                            )}
                        </div>
                    </button>

                    {hasSubmenu && (
                        <button
                            onClick={() => toggleMobileSubmenu(item.id)}
                            className={`p-2 transition-transform duration-200 ${isSubmenuOpen ? 'rotate-180' : ''}`}
                        >
                            <ChevronDown size={18} className="text-gray-400" />
                        </button>
                    )}
                </div>

                {/* Auto-generated submenu for mobile with proper spacing */}
                {hasSubmenu && isSubmenuOpen && (
                    <div className="ml-6 bg-gray-50 rounded-lg mt-3 mb-4 p-3">
                        {item.items.map((subItem) => renderMobileMenuItem(subItem, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    // Recursive function to render desktop submenu with proper grid positioning
    const renderDesktopSubmenu = (items: MenuItem[], depth: number): React.ReactNode => {
        const getDepthLabel = (depth: number): string => {
            switch (depth) {
                case 2: return "Level 2";
                case 3: return "Level 3";
                case 4: return "Level 4";
                case 5: return "Level 5";
                default: return `Level ${depth}`;
            }
        };

        const getDepthBadge = (depth: number) => {
            if (depth === 4) return <div className="text-xs text-orange-600 px-2 py-1 bg-orange-50 rounded-md font-medium">Deep</div>;
            if (depth === 5) return <div className="text-xs text-red-600 px-2 py-1 bg-red-50 rounded-md font-medium">Max</div>;
            return null;
        };

        return (
            <div className="absolute left-full top-0 ml-2">
                <div className="w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                            <div className="text-xs text-gray-500 px-3 py-1.5 bg-gray-50 rounded-md font-medium">
                                {getDepthLabel(depth)}
                            </div>
                            {getDepthBadge(depth)}
                        </div>
                        <div className="space-y-1">
                            {items.map((item) => {
                                let isActive = false;
                                if (depth === 3) isActive = activeDeepMenu === item.id;
                                else if (depth === 4) isActive = activeFinalMenu === item.id;

                                return (
                                    <div
                                        key={item.id}
                                        className="relative"
                                        onMouseEnter={() => {
                                            if (depth === 3) handleDeepMenuEnter(item.id);
                                            if (depth === 4) handleFinalMenuEnter(item.id);
                                        }}
                                        onMouseLeave={() => {
                                            if (depth === 3) handleDeepMenuLeave();
                                        }}
                                    >
                                        <Link
                                            href={item.item_url}
                                            target={item.item_target}
                                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150 group"
                                        >
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <MenuItemIcon item={item} />
                                                <div className="text-left min-w-0 flex-1">
                                                    <div className="font-medium text-gray-900 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                                                        {reactHtmlParser(item.item_title)}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                                                        {item.item_desc || `${getDepthLabel(depth)} menu item`}
                                                    </div>
                                                </div>
                                            </div>
                                            {hasChildren(item) && (
                                                <ChevronDown size={16} className="text-gray-400 transform -rotate-90 flex-shrink-0" />
                                            )}
                                        </Link>

                                        {/* Auto-generate deeper submenu if item has children and is active */}
                                        {hasChildren(item) && isActive && depth < 5 && (
                                            renderDesktopSubmenu(item.items, depth + 1)
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* Top Navigation Bar with Container Grid */}
            <nav className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-12 gap-4 items-center py-4">
                        {/* Logo - Takes 3 columns on large screens, auto on smaller */}
                        <div className="col-span-6 md:col-span-3">
                            <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-semibold text-sm inline-block">
                                <Link href={'/'}>
                                    Company Logo
                                </Link>
                            </div>
                        </div>

                        {/* Contact Info - Takes remaining columns on desktop, hidden on mobile */}
                        <div className="hidden md:flex md:col-span-9 justify-end items-center gap-6">
                            <a
                                href={`mailto:${globalData?.info_email ?? ''}`}
                                className="hover:text-gray-300 transition-colors text-sm"
                            >
                                {String(globalData?.info_email ?? '')}
                            </a>
                            <a
                                href={`mailto:${globalData?.career_email ?? ''}`}
                                className="hover:text-gray-300 transition-colors text-sm"
                            >
                                {String(globalData?.career_email ?? '')}
                            </a>
                            <a
                                href={`tel:${globalData?.office_fax ?? ''}`}
                                className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700 transition-colors text-sm"
                            >
                                <Phone size={16}/>
                                <span>{String(globalData?.office_fax ?? '')}</span>
                            </a>
                        </div>

                        {/* Mobile Phone - Shows only on mobile */}
                        <div className="col-span-6 md:hidden flex justify-end">
                            <a
                                href={`tel:${globalData?.office_fax}`}
                                className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-full text-sm hover:bg-gray-700 transition-colors"
                            >
                                <Phone size={14}/>
                                <span>{String(globalData?.office_fax ?? '')}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Navigation with Container Grid */}
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="flex items-center justify-center py-6">
                            <ul className="flex items-center gap-8">
                                {currentMenuData.map((item) => (
                                    <li
                                        key={item.id}
                                        className="relative group"
                                        onMouseEnter={() => handleMenuEnter(item.id)}
                                        onMouseLeave={handleMenuLeave}
                                    >
                                        <Link
                                            href={item.item_url}
                                            target={item.item_target}
                                            className="flex items-center gap-3 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 group"
                                        >
                                            <MenuItemIcon item={item}/>
                                            <div className="text-left">
                                                <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {reactHtmlParser(item.item_title)}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    {item.item_desc || 'Menu item'}
                                                </div>
                                            </div>
                                            {hasChildren(item) && (
                                                <ChevronDown size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors"/>
                                            )}
                                        </Link>

                                        {/* Auto-generated Desktop Dropdown Menu */}
                                        {hasChildren(item) && activeMenu === item.id && (
                                            <div className="absolute top-full left-0 z-40 mt-2">
                                                <div className="w-72 bg-white rounded-lg shadow-xl border border-gray-200 transform opacity-100 transition-all duration-200">
                                                    <div className="p-4">
                                                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                                                            <div className="text-xs text-gray-500 px-3 py-1.5 bg-gray-50 rounded-md font-medium">
                                                                Level 2
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            {item.items.map((subItem) => (
                                                                <div
                                                                    key={subItem.id}
                                                                    className="relative"
                                                                    onMouseEnter={() => handleSubMenuEnter(subItem.id)}
                                                                    onMouseLeave={handleSubMenuLeave}
                                                                >
                                                                    <Link
                                                                        href={subItem.item_url}
                                                                        target={subItem.item_target}
                                                                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150 group"
                                                                    >
                                                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                                                            <MenuItemIcon item={subItem}/>
                                                                            <div className="text-left min-w-0 flex-1">
                                                                                <div className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                                                                                    {reactHtmlParser(subItem.item_title)}
                                                                                </div>
                                                                                <div className="text-xs text-gray-500 mt-1">
                                                                                    {subItem.item_desc || 'Submenu item'}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {hasChildren(subItem) && (
                                                                            <ChevronDown size={16} className="text-gray-400 transform -rotate-90 flex-shrink-0"/>
                                                                        )}
                                                                    </Link>

                                                                    {/* Auto-generate deeper levels */}
                                                                    {hasChildren(subItem) && activeSubMenu === subItem.id && (
                                                                        renderDesktopSubmenu(subItem.items, 3)
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Mobile Menu Header with Grid */}
                    <div className="md:hidden">
                        <div className="grid grid-cols-12 gap-4 items-center py-4">
                            <div className="col-span-8">
                                <div className="bg-yellow-400 text-gray-900 px-3 py-2 rounded-full font-semibold text-sm inline-block">
                                    <Link href={'/'}>
                                        Company Logo
                                    </Link>
                                </div>
                            </div>
                            <div className="col-span-4 flex justify-end">
                                <button
                                    onClick={() => setIsMobileMenuOpen(true)}
                                    className="p-3 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <Menu size={24} className="text-gray-700"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Panel with Container Grid */}
            <div
                className={`md:hidden fixed inset-0 z-50 bg-white transition-transform duration-300 ease-in-out transform ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header within the mobile panel */}
                    <div className="flex-shrink-0 border-b border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6">
                            <div className="grid grid-cols-12 gap-4 items-center py-4">
                                <div className="col-span-8">
                                    <div className="bg-yellow-400 text-gray-900 px-3 py-2 rounded-full font-semibold text-sm inline-block">
                                        <Link href={'/'}>
                                            Company Logo
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-span-4 flex justify-end">
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-3 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <X size={24} className="text-gray-700"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable content area with container */}
                    <div className="flex-grow overflow-y-auto">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6">
                            <div className="py-6">
                                {currentMenuData.map((item) => renderMobileMenuItem(item))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainMenu;