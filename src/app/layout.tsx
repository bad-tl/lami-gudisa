import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Cormorant_Garamond,
  Geist,
  Geist_Mono,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const heroSerif = Cormorant_Garamond({
  variable: "--font-hero-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});




export const metadata: Metadata = {
  metadataBase: new URL("https://lemigudisa.vercel.app"),

  title: {
    default: "Lemi Gudisa | Accountant & Controller Officer",
    template: "%s | Lemi Gudisa",
  },

  description:
    "Explore Lemi Gudisa's professional portfolio, featuring accounting and finance experience, financial reporting, budgeting, bookkeeping, and financial management in Ethiopia.",

  alternates: {
    canonical: "/",
  },

  verification: {
    google: "-hXFajTY5zrolCj8oCKNt9IYEmzB1itiNMpoJgPGFTI",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  openGraph: {
    type: "website",
    url: "https://lemigudisa.vercel.app/",
    siteName: "Lemi Gudisa",
    title: "Lemi Gudisa | Accountant & Controller Officer",
    description:
      "Explore Lemi Gudisa's accounting and finance experience, professional skills, education, and certificates.",
    locale: "en_ET",
  },

  twitter: {
    card: "summary",
    title: "Lemi Gudisa | Accountant & Controller Officer",
    description:
      "Professional portfolio of Lemi Gudisa, an accounting and finance professional in Ethiopia.",
  },
};




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${heroSerif.variable} antialiased`}
      >
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

