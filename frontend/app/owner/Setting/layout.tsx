import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "View and manage your store settings",
};

export default function settingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}