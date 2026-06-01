import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notification",
  description: "View and manage your notifications",
};

export default function notificationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}