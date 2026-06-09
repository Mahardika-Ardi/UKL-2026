import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Store",
  description: "View and manage your store profile",
};

export default function ProfilStoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

