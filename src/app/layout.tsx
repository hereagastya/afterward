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
  title: "Afterward — Decision Clarity",
  description: "Feel the consequences before they happen. AI-powered decision clarity that shows you both futures.",
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
