import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Change Password",
  description: "Manage your password",
};

export default function passwordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}