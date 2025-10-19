import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sustainable Investment Portfolio Tracker",
  description: "Track your sustainable investment funds with real-time market data and ESG ratings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
