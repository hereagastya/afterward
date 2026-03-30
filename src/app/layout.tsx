import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, DM_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";

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
  title: {
    default: "Afterward - AI Decision Simulator | See Both Futures Before You Choose",
    template: "%s | Afterward"
  },
  description: "Stuck on a big decision? Afterward uses AI to simulate both futures—if you GO and if you STAY. See yourself 3 months, 1 year, and 3 years from now. Experience regret before it happens. Make better decisions with AI-powered clarity.",
  keywords: [
    "decision making tool",
    "AI decision simulator",
    "should I quit my job",
    "life decision tool",
    "career decision help",
    "regret prediction",
    "future simulator",
    "decision anxiety",
    "overcome indecision",
    "what if calculator",
    "AI life coach",
    "decision clarity tool",
    "simulate future outcomes",
    "relationship decision help",
    "career change tool"
  ],
  authors: [{ name: "Afterward" }],
  creator: "Afterward",
  publisher: "Afterward",
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
    locale: "en_US",
    url: "https://afterward.fyi",
    title: "Afterward - See Both Futures Before You Choose",
    description: "AI-powered decision simulator. Experience regret before it happens. See what happens if you GO vs if you STAY.",
    siteName: "Afterward",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Afterward - Simulate regret before you feel it",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Agastyabuilds",
    title: "Afterward - AI Decision Simulator",
    description: "See both futures before you choose. Simulate regret before you feel it.",
    images: ["/og-image.png"],
    creator: "@Agastyabuilds"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://afterward.fyi"
  },
  category: "productivity"
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
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
