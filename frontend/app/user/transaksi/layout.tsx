import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "transaksi",
  description: "View and manage your transactions",
};

export default function TransaksiLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}