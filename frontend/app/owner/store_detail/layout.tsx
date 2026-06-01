import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store Detail",
  description: "View and manage your store details",
};

export default function storeDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}