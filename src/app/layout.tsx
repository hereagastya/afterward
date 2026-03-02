import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, DM_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://afterward.fyi"),
  title: "Afterward — Decision Clarity",
  description:
    "Feel the consequences before they happen. AI-powered decision clarity that shows you both futures.",
  icons: {
    icon: [
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/icon-180x180.png", sizes: "180x180", type: "image/png" }],
    other: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png", rel: "icon" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    url: "https://afterward.fyi",
    title: "Afterward — Decision Clarity",
    description:
      "Regret is better simulated. Feel the consequences before they happen with AI-powered decision clarity.",
    siteName: "Afterward",
    images: [
      {
        url: "https://afterward.fyi/og-image.png",
        width: 1200,
        height: 630,
        alt: "Afterward — Regret is better simulated",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Agastyabuilds",
    title: "Afterward — Decision Clarity",
    description:
      "Regret is better simulated. Feel the consequences before they happen with AI-powered decision clarity.",
    images: [
      {
        url: "https://afterward.fyi/twitter-image.png",
        width: 1200,
        height: 628,
        alt: "Afterward — Regret is better simulated",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable} font-[var(--font-dm-sans)] bg-background text-foreground antialiased min-h-screen selection:bg-[#7c5cbf]/30 selection:text-white`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
