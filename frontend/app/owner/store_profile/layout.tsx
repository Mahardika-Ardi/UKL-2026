import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store Profile",
  description: "View and manage your store profile",
};

export default function StoreProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}