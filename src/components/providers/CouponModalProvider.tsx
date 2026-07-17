"use client";

import React, { createContext, useContext, useState } from "react";
import { CouponModal } from "../ui/CouponModal";

interface CouponData {
  id: string;
  title: string;
  code?: string;
  description?: string;
  affiliateUrl: string;
  storeName: string;
  storeLogo?: string;
}

interface CouponModalContextType {
  openCouponModal: (coupon: CouponData) => void;
  closeCouponModal: () => void;
}

const CouponModalContext = createContext<CouponModalContextType | undefined>(undefined);

export function CouponModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState<CouponData | null>(null);

  const openCouponModal = (coupon: CouponData) => {
    setActiveCoupon(coupon);
    setIsOpen(true);
  };

  const closeCouponModal = () => {
    setIsOpen(false);
    setActiveCoupon(null);
  };

  return (
    <CouponModalContext.Provider value={{ openCouponModal, closeCouponModal }}>
      {children}
      {isOpen && activeCoupon && (
        <CouponModal coupon={activeCoupon} onClose={closeCouponModal} />
      )}
    </CouponModalContext.Provider>
  );
}

export function useCouponModal() {
  const context = useContext(CouponModalContext);
  if (!context) {
    throw new Error("useCouponModal must be used within a CouponModalProvider");
  }
  return context;
}
