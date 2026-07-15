export interface PublicCoupon {
  id: string;
  title: string;
  description: string | null;
  code: string | null;
  type: string;
  discountType: string;
  discountValue: string | null;
  affiliateUrl: string;
  expiresAt: Date | null;
  isVerified: boolean;
  isExclusive: boolean;
  merchantName: string;
  merchantSlug: string;
  merchantLogo: string | null;
  createdAt: Date;
}

export interface PublicMerchant {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  website: string;
  cashbackRate: string | null;
  cashbackType: string | null;
  offerCount: number;
  isFeatured: boolean;
  contents: StoreContentDTO[];
  healthScore?: any;
  categories: { id: string, name: string, slug: string }[];
  histories: MerchantHistoryDTO[];
}

export interface StoreContentDTO {
  id: string;
  type: string;
  content: string;
  updatedAt: Date;
}

export interface MerchantHistoryDTO {
  id: string;
  title: string;
  type: string;
  date: Date;
}
