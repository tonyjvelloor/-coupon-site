"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Loader2, Store, Tag } from "lucide-react";

interface SuggestionStore {
  name: string;
  slug: string;
  logo: string | null;
}

interface SuggestionCategory {
  name: string;
  slug: string;
}

interface SearchBoxProps {
  placeholder?: string;
  className?: string;
  onSelectSuggestion?: () => void;
}

export function SearchBox({ placeholder = "Search stores or categories...", className = "", onSelectSuggestion }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{ stores: SuggestionStore[]; categories: SuggestionCategory[] }>({
    stores: [],
    categories: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions({ stores: [], categories: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions({
            stores: data.stores || [],
            categories: data.categories || [],
          });
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const totalSuggestions = suggestions.stores.length + suggestions.categories.length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % totalSuggestions);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + totalSuggestions) % totalSuggestions);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < totalSuggestions) {
        if (selectedIndex < suggestions.stores.length) {
          handleSelectStore(suggestions.stores[selectedIndex]);
        } else {
          handleSelectCategory(suggestions.categories[selectedIndex - suggestions.stores.length]);
        }
      } else if (query.trim()) {
        // Fallback: search redirect to stores search page or just go to first suggestion
        if (suggestions.stores.length > 0) {
          handleSelectStore(suggestions.stores[0]);
        } else if (suggestions.categories.length > 0) {
          handleSelectCategory(suggestions.categories[0]);
        }
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelectStore = (store: SuggestionStore) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/stores/${store.slug}`);
    if (onSelectSuggestion) onSelectSuggestion();
  };

  const handleSelectCategory = (category: SuggestionCategory) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/category/${category.slug}`);
    if (onSelectSuggestion) onSelectSuggestion();
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-surface-variant opacity-70">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-brand-indigo" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3 bg-surface-container-low dark:bg-inverse-surface dark:text-white border-none rounded-full focus:ring-2 focus:ring-brand-indigo transition-all font-body-md text-slate-800 outline-none"
        />
      </div>

      {isOpen && (suggestions.stores.length > 0 || suggestions.categories.length > 0) && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-inverse-surface border border-surface-variant/30 rounded-2xl shadow-xl z-50 overflow-hidden py-2 max-h-96 overflow-y-auto">
          {suggestions.stores.length > 0 && (
            <div>
              <div className="px-4 py-1.5 text-[11px] font-bold tracking-wider text-on-surface-variant dark:text-surface-variant opacity-60 uppercase">
                Stores
              </div>
              {suggestions.stores.map((store, index) => {
                const globalIndex = index;
                const isSelected = selectedIndex === globalIndex;
                const storeLogo = store.logo || `https://icon.horse/icon/${store.slug.replace(/-/g, '')}.com`;
                return (
                  <button
                    key={store.slug}
                    onClick={() => handleSelectStore(store)}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-left font-body-md text-sm transition-colors ${
                      isSelected
                        ? "bg-brand-indigo/10 dark:bg-brand-indigo/25 text-brand-indigo dark:text-white"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-on-background/10"
                    }`}
                  >
                    <div className="w-7 h-7 rounded border border-surface-variant/20 bg-white relative flex items-center justify-center overflow-hidden shrink-0">
                      <Image
                        src={storeLogo}
                        alt={store.name}
                        fill
                        className="object-contain p-0.5"
                        unoptimized
                      />
                    </div>
                    <span className="font-medium flex-1">{store.name}</span>
                    <Store className="w-4 h-4 opacity-40 shrink-0" />
                  </button>
                );
              })}
            </div>
          )}

          {suggestions.categories.length > 0 && (
            <div className={suggestions.stores.length > 0 ? "mt-2 pt-2 border-t border-surface-variant/10" : ""}>
              <div className="px-4 py-1.5 text-[11px] font-bold tracking-wider text-on-surface-variant dark:text-surface-variant opacity-60 uppercase">
                Categories
              </div>
              {suggestions.categories.map((category, index) => {
                const globalIndex = suggestions.stores.length + index;
                const isSelected = selectedIndex === globalIndex;
                return (
                  <button
                    key={category.slug}
                    onClick={() => handleSelectCategory(category)}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left font-body-md text-sm transition-colors ${
                      isSelected
                        ? "bg-brand-indigo/10 dark:bg-brand-indigo/25 text-brand-indigo dark:text-white"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-on-background/10"
                    }`}
                  >
                    <div className="w-7 h-7 rounded bg-brand-indigo/5 dark:bg-brand-indigo/20 flex items-center justify-center shrink-0">
                      <Tag className="w-4 h-4 text-brand-indigo" />
                    </div>
                    <span className="font-medium flex-1">{category.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
