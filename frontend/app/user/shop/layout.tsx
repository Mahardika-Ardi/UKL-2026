import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Shop",
  description: "Browse our products and make your purchase",
};

export default function HomeShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}