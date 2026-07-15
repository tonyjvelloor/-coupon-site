export interface ShoppingProfile {
  savedStores: string[];
  savedDeals: string[];
  walletBanks: string[];
  favoriteCategories: string[];
  recentlyViewed: { slug: string; name: string; logo?: string; timestamp: number }[];
  preferences: {
    cashback: boolean;
    coupons: boolean;
    bankOffers: boolean;
    studentDiscounts: boolean;
    emi: boolean;
    rewardPoints: boolean;
  };
  alerts: { id: string; query: string; threshold?: string; storeSlug?: string; createdAt: string }[];
}

export const DEFAULT_PROFILE: ShoppingProfile = {
  savedStores: [],
  savedDeals: [],
  walletBanks: [],
  favoriteCategories: [],
  recentlyViewed: [],
  preferences: {
    cashback: false,
    coupons: false,
    bankOffers: false,
    studentDiscounts: false,
    emi: false,
    rewardPoints: false,
  },
  alerts: [],
};

export interface StorageAdapter {
  getProfile(): Promise<ShoppingProfile>;
  saveProfile(profile: ShoppingProfile): Promise<void>;
  clearProfile(): Promise<void>;
}

export class LocalStorageAdapter implements StorageAdapter {
  private key = 'couponhub_shopping_profile';

  async getProfile(): Promise<ShoppingProfile> {
    if (typeof window === 'undefined') return DEFAULT_PROFILE;
    
    try {
      const data = localStorage.getItem(this.key);
      if (data) {
        // Merge with default to ensure no missing properties if schema changes
        return { ...DEFAULT_PROFILE, ...JSON.parse(data), preferences: { ...DEFAULT_PROFILE.preferences, ...JSON.parse(data).preferences } };
      }
    } catch (e) {
      console.warn("Failed to parse ShoppingProfile from localStorage", e);
    }
    return DEFAULT_PROFILE;
  }

  async saveProfile(profile: ShoppingProfile): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.key, JSON.stringify(profile));
    } catch (e) {
      console.warn("Failed to save ShoppingProfile to localStorage", e);
    }
  }

  async clearProfile(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.key);
    } catch (e) {
      console.warn("Failed to clear ShoppingProfile from localStorage", e);
    }
  }
}
