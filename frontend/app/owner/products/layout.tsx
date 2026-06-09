import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products ",
  description: "Edit Products",
};

export default function ProdukLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}