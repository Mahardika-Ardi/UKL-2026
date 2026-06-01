import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store",
  description: "Browse our products and make your purchase",
};

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}