/**
 * Global Context for managing application-wide settings data
 *
 * This context provides centralized state management for global settings data
 * that needs to be accessed across multiple components in the application.
 * It fetches settings data once and prevents duplicate API calls.
 */

"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react';
import { getMenuData, getSettingsData } from "@/utils/api";

/**
 * Interface defining the structure of global data
 */
export interface MenuItem {
    item_title: string;
    item_url: string;
    item_icon?: string;
    children?: MenuItem[];
}

interface GlobalData {
    site_title?: string;
    slogan?: string;
    info_email?: string;
    career_email?: string;
    contact_email?: string;
    office_location?: string;
    office_phone?: string;
    office_fax?: string;
    logo_light?: string;
    logo_dark?: string;
    favicon?: string;
    copyright_text?: string;
    facebook?: string;
    youtube?: string;
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    google_map?: string;
    [key: string]: unknown;
}

interface MenuData {
    main_menu?: {
        data: MenuItem[];
        social_links?: { name: string; icon: string; url: string }[];
        additional_info?: {
            contact_info: string;
            address: string;
            phone_numbers: string[];
            email_address: string;
        };
        additional_links?: { label: string; path: string; target_window: string }[];
    };
    footer_menu?: {
        data: {
            menu_list1?: MenuItem[];
            menu_list2?: MenuItem[];
            menu_list3?: MenuItem[];
            menu_list4?: MenuItem[];
        };
        social_links?: { name: string; icon: string; url: string }[];
        additional_info?: {
            logo?: { primary?: string; secondary?: string };
            contact_info?: string[];
            address?: { name: string; address: string; google_map?: string }[];
            phone_numbers?: string[];
            email_address?: string[];
            copyright?: string;
            siteCredit?: string;
        };
        additional_links?: { label: string; path: string; target_window: string }[];
    };
    [key: string]: unknown;
}

/**
 * Type definition for the context value
 */
interface GlobalContextType {
    globalData: GlobalData | null;
    setGlobalData: React.Dispatch<React.SetStateAction<GlobalData | null>>;
    menuData: MenuData | null;
    setMenuData: React.Dispatch<React.SetStateAction<MenuData | null>>;
    isLoading: boolean;
    refreshData: () => Promise<void>;
}

/**
 * Props interface for the GlobalProvider component
 */
interface GlobalProviderProps {
    children: ReactNode;
}

/**
 * Create React context with proper TypeScript typing
 */
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

/**
 * Global Context Provider Component
 *
 * Wraps the application to provide global settings data to all child components.
 * Automatically fetches settings data on mount and ensures it's only fetched once.
 */
export function GlobalProvider({ children }: GlobalProviderProps) {
    // State to store the fetched data
    const [globalData, setGlobalData] = useState<GlobalData | null>(null);
    const [menuData, setMenuData] = useState<MenuData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Ref to track whether API calls were already made
    const hasFetchedGlobalData = useRef<boolean>(false);
    const hasFetchedMenuData = useRef<boolean>(false);

    /**
     * Fetch all required data
     */
    const fetchAllData = useCallback(async () => {
        setIsLoading(true);
        
        try {
            // Fetch settings data
            if (!globalData && !hasFetchedGlobalData.current) {
                hasFetchedGlobalData.current = true;
                const settingsData = await getSettingsData("settings");
                setGlobalData(settingsData);
            }
            
            // Fetch menu data
            if (!menuData && !hasFetchedMenuData.current) {
                hasFetchedMenuData.current = true;
                const menuDataResult = await getMenuData("menu");
                setMenuData(menuDataResult);
            }
        } catch (error) {
            console.error('Error fetching global data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [globalData, menuData]);

    /**
     * Function to manually refresh data
     */
    const refreshData = useCallback(async () => {
        hasFetchedGlobalData.current = false;
        hasFetchedMenuData.current = false;
        await fetchAllData();
    }, [fetchAllData]);

    // Fetch data on component mount
    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    /**
     * Render the context provider
     */
    return (
        <GlobalContext.Provider value={{
            globalData,
            setGlobalData,
            menuData,
            setMenuData,
            isLoading,
            refreshData
        }}>
            {children}
        </GlobalContext.Provider>
    );
}

/**
 * Custom hook to access global context data
 *
 * @throws Error if used outside of GlobalProvider
 * @returns GlobalContextType - Object containing globalData, menuData, and related functions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { globalData, menuData, isLoading } = useGlobalData();
 *
 *   if (isLoading) {
 *     return <div>Loading...</div>;
 *   }
 *
 *   return <div>{globalData?.site_title}</div>;
 * }
 * ```
 */
export function useGlobalData(): GlobalContextType {
    const context = useContext(GlobalContext);

    // Throw error if hook is used outside of provider
    if (!context) {
        throw new Error('useGlobalData must be used within a GlobalProvider');
    }

    return context;
}