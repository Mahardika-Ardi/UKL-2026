import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verifikasi",
  description: "Verify your account and complete the registration process",
};

export default function verifikasiLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}