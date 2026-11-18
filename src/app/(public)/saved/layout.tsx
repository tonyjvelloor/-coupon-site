import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Offers & Stores",
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
