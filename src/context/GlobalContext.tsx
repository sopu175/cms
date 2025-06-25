/**
 * global Context for managing application-wide settings data
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
 * Currently allows any properties - should be replaced with specific types
 * based on your actual settings data structure
 */
export interface MenuItem {
    item_title: string;
    item_url: string;
    item_icon?: string;
    children?: MenuItem[];
}

interface GlobalData {
    logo_footer_fav?: string;
    office_location?: string;
    office_phone?: string;
    contact_email?: string;
    google_map_link?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    copyright_text?: string;
    [key: string]: unknown; // This allows any properties - replace with specific ones
}

interface MenuData {
    main_menu?: MenuItem[];
    footer_menu?: MenuItem[];
    [key: string]: unknown;
}

/**
 * Type definition for the context value
 * Defines what data and functions are available through the context
 */
interface GlobalContextType {
    globalData: GlobalData | null;
    setGlobalData: React.Dispatch<React.SetStateAction<GlobalData | null>>;
    menuData: MenuData | null;
    setMenuData: React.Dispatch<React.SetStateAction<MenuData | null>>;
}

/**
 * Props interface for the GlobalProvider component
 */
interface GlobalProviderProps {
    children: ReactNode;
}

/**
 * Create React context with proper TypeScript typing
 * Initially undefined, will be populated by the provider
 */
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

/**
 * global Context Provider Component
 *
 * Wraps the application to provide global settings data to all child components.
 * Automatically fetches settings data on mount and ensures it's only fetched once.
 *
 * @param children - React components that will have access to the global context
 * @returns JSX.Element - Context provider wrapping children
 */
export function GlobalProvider({ children }: GlobalProviderProps) {
    // State to store the fetched global settings data
    const [globalData, setGlobalData] = useState<GlobalData | null>(null);
    const [menuData, setMenuData] = useState<MenuData | null>(null);


    // Ref to track whether API call was already made to prevent duplicate requests
    const hasFetchedGlobalData = useRef<boolean>(false);
    const hasFetchedMenuData = useRef<boolean>(false);
    /**
     * Optimized data fetching function that ensures API is only called once
     *
     * This function implements a single-call pattern using refs to prevent
     * duplicate API requests during component re-renders.
     *
     * @param fetchFunction - Function that returns a Promise with the data
     * @param setState - React state setter function
     * @param currentState - Current state value to check if data already exists
     * @param flagRef - Ref to track if fetch has been attempted
     */
    const fetchDataOnce = useCallback(async (
        fetchFunction: () => Promise<GlobalData | null>,
        setState: React.Dispatch<React.SetStateAction<GlobalData | null>>,
        currentState: GlobalData | null,
        flagRef: React.MutableRefObject<boolean>
    ) => {
        // Only fetch if data doesn't exist and fetch hasn't been attempted
        if (!currentState && !flagRef.current) {
            flagRef.current = true;  // Mark as fetch attempted to prevent duplicate calls
            try {
                const response = await fetchFunction(); // Attempt to fetch the data
                setState(response); // Update state with fetched data
            } catch (error) {
                // Log error and reset flag to allow retry on next render
                console.error(`Error fetching global data: ${error instanceof Error ? error.message : 'Unknown error'}`);
                flagRef.current = false; // Reset flag to allow retry
            }
        }
    }, []);

    /**
     * Effect hook to fetch global settings data on component mount
     *
     * Creates a wrapper function for the API call and triggers the fetch
     * only when the component first mounts or when dependencies change.
     */
    useEffect(() => {
        // Create a function that calls getSettingsData with "settings" parameter
        const fetchGlobalData = () => getSettingsData("settings");

        // Trigger the optimized fetch function
        fetchDataOnce(fetchGlobalData, setGlobalData, globalData, hasFetchedGlobalData);
    }, [globalData, fetchDataOnce]); // Dependency array - effect runs when these values change

     // Fetch menu.json (new)
     useEffect(() => {
        const fetchMenuData = () => getMenuData("menu");
        if (!menuData && !hasFetchedMenuData.current) {
            hasFetchedMenuData.current = true;
            fetchMenuData().then(setMenuData);
        }
    }, [menuData]);

    /**
     * Render the context provider
     *
     * Provides globalData and setGlobalData to all child components
     * that use the useGlobalData hook.
     */
    return (
        <GlobalContext.Provider value={{
            globalData,      // Current global settings data (null until loaded)
            setGlobalData,    // Function to update global settings data
            menuData,
            setMenuData,
        }}>
            {children}
        </GlobalContext.Provider>
    );
}

/**
 * Custom hook to access global context data
 *
 * This hook provides a convenient way to access the global settings data
 * and its setter function from any component within the GlobalProvider.
 *
 * @throws Error if used outside of GlobalProvider
 * @returns GlobalContextType - Object containing globalData and setGlobalData
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { globalData, setGlobalData } = useGlobalData();
 *
 *   if (!globalData) {
 *     return <div>Loading...</div>;
 *   }
 *
 *   return <div>{globalData.siteName}</div>;
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