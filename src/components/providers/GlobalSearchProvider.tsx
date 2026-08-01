"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { GlobalSearch } from "../ui/GlobalSearch";

interface GlobalSearchContextType {
    isSearchOpen: boolean;
    openSearch: () => void;
    closeSearch: () => void;
}

const GlobalSearchContext = createContext<GlobalSearchContextType | undefined>(undefined);

export function GlobalSearchProvider({ children }: { children: ReactNode }) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const openSearch = () => setIsSearchOpen(true);
    const closeSearch = () => setIsSearchOpen(false);

    return (
        <GlobalSearchContext.Provider value={{ isSearchOpen, openSearch, closeSearch }}>
            {children}
            <GlobalSearch isOpen={isSearchOpen} onClose={closeSearch} />
        </GlobalSearchContext.Provider>
    );
}

export function useGlobalSearch() {
    const context = useContext(GlobalSearchContext);
    if (context === undefined) {
        throw new Error("useGlobalSearch must be used within a GlobalSearchProvider");
    }
    return context;
}
