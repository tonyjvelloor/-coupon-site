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
    if (query.trim().length < 1) {
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
    router.push(`/best/${category.slug}-coupons`);
    if (onSelectSuggestion) onSelectSuggestion();
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
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
          className="w-full pl-11 pr-4 py-3 bg-slate-100/50 dark:bg-slate-900/50 border border-transparent dark:border-slate-800 text-slate-900 dark:text-white rounded-full focus:ring-2 focus:ring-brand-indigo transition-all text-sm outline-none placeholder:text-slate-500"
        />
      </div>

      {isOpen && (suggestions.stores.length > 0 || suggestions.categories.length > 0) && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden py-2 max-h-96 overflow-y-auto">
          {suggestions.stores.length > 0 && (
            <div>
              <div className="px-4 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Stores
              </div>
              {suggestions.stores.map((store, index) => {
                const globalIndex = index;
                const isSelected = selectedIndex === globalIndex;
                return (
                  <button
                    key={store.slug}
                    onClick={() => handleSelectStore(store)}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-colors ${
                      isSelected
                        ? "bg-brand-indigo/10 dark:bg-brand-indigo/20 text-brand-indigo dark:text-white"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 relative flex items-center justify-center overflow-hidden shrink-0">
                      {store.logo ? (
                        <Image
                          src={store.logo}
                          alt={store.name}
                          fill
                          className="object-contain p-1"
                          unoptimized
                        />
                      ) : (
                        <span className="font-bold text-xs text-slate-400">{store.name.charAt(0)}</span>
                      )}
                    </div>
                    <span className="font-medium flex-1">{store.name}</span>
                    <Store className="w-4 h-4 opacity-40 shrink-0" />
                  </button>
                );
              })}
            </div>
          )}

          {suggestions.categories.length > 0 && (
            <div className={suggestions.stores.length > 0 ? "mt-2 pt-2 border-t border-slate-100 dark:border-slate-800" : ""}>
              <div className="px-4 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
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
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                      isSelected
                        ? "bg-brand-indigo/10 dark:bg-brand-indigo/20 text-brand-indigo dark:text-white"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-indigo/5 dark:bg-brand-indigo/10 flex items-center justify-center shrink-0">
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
