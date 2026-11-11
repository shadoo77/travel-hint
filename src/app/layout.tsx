import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "@/app/providers";
import { ScrollHeader } from "@/components/scroll-header";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Trav Hint — field notes for the next detour",
    template: "%s · Trav Hint",
  },
  description:
    "Short, honest travel hints: one city, one habit worth stealing, no top-ten lists. Built for people who would rather wander than tick boxes.",
  openGraph: {
    title: "Trav Hint",
    description:
      "Short, honest travel hints for people who would rather wander than tick boxes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn("font-sans", geist.variable, fraunces.variable)}
    >
      <body className="min-h-dvh antialiased">
        {/* Reveal animations start hidden; without JS the content must still be readable. */}
        <noscript>
          <style>
            {"[data-reveal]{opacity:1!important;transform:none!important}"}
          </style>
        </noscript>
        <Providers>
          <ScrollHeader>
            <SiteHeader />
          </ScrollHeader>
          <main className="mx-auto w-full max-w-6xl px-5 sm:px-8">
            {children}
          </main>
          <SiteFooter />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
