import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SiteStructuredData } from "@/components/seo/site-structured-data";
import { siteConfig } from "@/data/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: "Switch North Immigration | Canadian Immigration Services",
    template: `%s | ${siteConfig.businessName}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.businessName,
    description: siteConfig.description,
    url: siteConfig.domain,
    siteName: siteConfig.businessName,
    images: [
      {
        url: "/images/consultation-hero.png",
        width: 1792,
        height: 1024,
        alt: "Canadian immigration consultation in a modern office",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.businessName,
    description: siteConfig.description,
    images: ["/images/consultation-hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA">
      <body className={`${inter.variable} ${newsreader.variable}`}>
        <SiteStructuredData />
        <a
          className="focus-ring fixed left-4 top-4 z-[100] -translate-y-20 rounded-md bg-white px-4 py-3 font-semibold text-deep-ink shadow-soft transition focus:translate-y-0"
          href="#main-content"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
