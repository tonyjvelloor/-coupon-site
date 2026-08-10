import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Offers & Stores | CouponHub",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SavedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
