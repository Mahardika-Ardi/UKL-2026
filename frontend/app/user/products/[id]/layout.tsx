import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products ",
  description: "menampilkan product",
};

export default function UserProdukLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}