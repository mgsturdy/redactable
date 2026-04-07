import type { Metadata } from "next";
import localFont from "next/font/local";
import { DM_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Display — Redaction by MCKL (Jeremy Mickel + Titus Kaphar).
// The font is literally named after our brand concept. Released under
// SIL OFL for the MoMA PS1 exhibition on prison abolition and censorship.
const redaction = localFont({
  src: [
    {
      path: "./fonts/Redaction-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Redaction-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

// Grade 35 — the progressively-corrupted variant. For moments where we
// want the letters to visibly degrade, like they've been run through a
// photocopier one too many times.
const redactionGrit = localFont({
  src: "./fonts/Redaction_35-Regular.woff2",
  variable: "--font-grit",
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://redactable.xyz"),
  title: {
    default: "Redactable — You're not the product anymore.",
    template: "%s · Redactable",
  },
  description:
    "Prove what you bought without showing what you bought. Sell it to researchers. We never read a word.",
  openGraph: {
    title: "Redactable — You're not the product anymore.",
    description:
      "Prove what you bought without showing what you bought. Sell it to researchers. We never read a word.",
    url: "https://redactable.xyz",
    siteName: "Redactable",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Redactable — You're not the product anymore.",
    description:
      "Prove what you bought without showing what you bought. Sell it to researchers. We never read a word.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${redaction.variable} ${redactionGrit.variable} ${dmSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="grain min-h-dvh flex flex-col bg-[var(--color-canvas)] text-[var(--color-ink)]">
        {children}
      </body>
    </html>
  );
}
