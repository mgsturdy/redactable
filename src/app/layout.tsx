import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://redactable.xyz"),
  title: {
    default: "Redactable — Your inbox, redactable.",
    template: "%s · Redactable",
  },
  description:
    "Sell verified spend data from your email. We architecturally cannot see a thing. Zero-knowledge proofs of your receipts, generated on your own machine.",
  openGraph: {
    title: "Redactable — Your inbox, redactable.",
    description:
      "Sell verified spend data from your email. We architecturally cannot see a thing.",
    url: "https://redactable.xyz",
    siteName: "Redactable",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Redactable — Your inbox, redactable.",
    description:
      "Sell verified spend data from your email. We architecturally cannot see a thing.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="grain min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
