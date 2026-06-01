import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OrderMasuk",
  description: "View and manage incoming orders",
};

export default function orderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}