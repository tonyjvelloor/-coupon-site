"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ShoppingProfile, DEFAULT_PROFILE, LocalStorageAdapter } from '@/lib/profile';

interface UserContextType {
  profile: ShoppingProfile;
  isLoaded: boolean;
  saveStore: (slug: string) => void;
  removeStore: (slug: string) => void;
  isStoreSaved: (slug: string) => boolean;
  saveDeal: (dealId: string) => void;
  removeDeal: (dealId: string) => void;
  isDealSaved: (dealId: string) => boolean;
  addRecentStore: (store: { slug: string; name: string; logo?: string }) => void;
  toggleBank: (bankName: string) => void;
  isBankSelected: (bankName: string) => boolean;
  toggleCategory: (category: string) => void;
  togglePreference: (key: keyof ShoppingProfile['preferences']) => void;
  clearProfile: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const adapter = new LocalStorageAdapter();

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ShoppingProfile>(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    adapter.getProfile().then(p => {
      setProfile(p);
      setIsLoaded(true);
    });
  }, []);

  const updateProfile = (newProfile: ShoppingProfile) => {
    setProfile(newProfile);
    adapter.saveProfile(newProfile);
  };

  const saveStore = (slug: string) => {
    if (!profile.savedStores.includes(slug)) {
      updateProfile({ ...profile, savedStores: [...profile.savedStores, slug] });
    }
  };

  const removeStore = (slug: string) => {
    updateProfile({ ...profile, savedStores: profile.savedStores.filter(s => s !== slug) });
  };

  const isStoreSaved = (slug: string) => profile.savedStores.includes(slug);

  const saveDeal = (dealId: string) => {
    if (!profile.savedDeals.includes(dealId)) {
      updateProfile({ ...profile, savedDeals: [...profile.savedDeals, dealId] });
    }
  };

  const removeDeal = (dealId: string) => {
    updateProfile({ ...profile, savedDeals: profile.savedDeals.filter(d => d !== dealId) });
  };

  const isDealSaved = (dealId: string) => profile.savedDeals.includes(dealId);

  const addRecentStore = (store: { slug: string; name: string; logo?: string }) => {
    const existingIndex = profile.recentlyViewed.findIndex(s => s.slug === store.slug);
    let newRecent = [...profile.recentlyViewed];
    
    if (existingIndex > -1) {
      newRecent.splice(existingIndex, 1);
    }
    
    newRecent.unshift({ ...store, timestamp: Date.now() });
    
    // Limit to 10
    if (newRecent.length > 10) {
      newRecent = newRecent.slice(0, 10);
    }
    
    updateProfile({ ...profile, recentlyViewed: newRecent });
  };

  const toggleBank = (bankName: string) => {
    if (profile.walletBanks.includes(bankName)) {
      updateProfile({ ...profile, walletBanks: profile.walletBanks.filter(b => b !== bankName) });
    } else {
      updateProfile({ ...profile, walletBanks: [...profile.walletBanks, bankName] });
    }
  };

  const isBankSelected = (bankName: string) => profile.walletBanks.includes(bankName);

  const toggleCategory = (category: string) => {
    if (profile.favoriteCategories.includes(category)) {
      updateProfile({ ...profile, favoriteCategories: profile.favoriteCategories.filter(c => c !== category) });
    } else {
      updateProfile({ ...profile, favoriteCategories: [...profile.favoriteCategories, category] });
    }
  };

  const togglePreference = (key: keyof ShoppingProfile['preferences']) => {
    updateProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        [key]: !profile.preferences[key]
      }
    });
  };

  const clearProfile = () => {
    setProfile(DEFAULT_PROFILE);
    adapter.clearProfile();
  };

  return (
    <UserContext.Provider
      value={{
        profile,
        isLoaded,
        saveStore,
        removeStore,
        isStoreSaved,
        saveDeal,
        removeDeal,
        isDealSaved,
        addRecentStore,
        toggleBank,
        isBankSelected,
        toggleCategory,
        togglePreference,
        clearProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useShoppingProfile() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useShoppingProfile must be used within a UserProvider');
  }
  return context;
}
