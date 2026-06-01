import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
  description: "View your notifications and updates",
};

export default function NotificationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}