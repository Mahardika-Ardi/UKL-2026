import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile User",
  description: "View and manage your profile information",
};

export default function ProfileUserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}