"use client";

import React, { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import "./globals.css";
import { client } from "@/sanity/lib/client";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

type SiteSettings = {
  headerSection?: { logo?: string; navigationLinks?: { name: string; href: string }[] };
  footerSection?: { companyName?: string; tagline?: string; socialLinks?: any; copyrightText?: string; footerLinks?: any[] };
  whatsappSettings?: { whatsappNumber?: string; defaultMessage?: string; floatingMessage?: string };
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isContactPage = pathname === "/contact-us";

  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchSettings() {
      try {
        const data = await client.fetch(`*[_type == "headerFooter"][0] { headerSection{ "logo": logo.asset->url, navigationLinks }, footerSection{ companyName, tagline, socialLinks, copyrightText, "footerLinks": footerLinks[]-> { "name": title, "href": "/services/" + slug.current } }, whatsappSettings{ whatsappNumber, defaultMessage, floatingMessage } }`);
        if (mounted) setSiteSettings(data);
      } catch (e) {
        console.error(e);
      }
    }
    fetchSettings();
    return () => { mounted = false; };
  }, []);

  const logoUrl = siteSettings?.headerSection?.logo || "/logo.png";
  const navLinks = siteSettings?.headerSection?.navigationLinks || [ { name: "Home", href: "/" }, { name: "Services", href: "/our-services" }, { name: "Contact", href: "/contact-us" } ];
  const desktopContactLink = navLinks.find((l) => l.href.includes("contact")) || null;
  const socialLinks = siteSettings?.footerSection?.socialLinks || { instagram: "#", tiktok: "#", xiaohongshu: "#" };
  const companyName = siteSettings?.footerSection?.companyName || "Jiffy Booth";
  const tagline = siteSettings?.footerSection?.tagline || "Premium photo booth experiences for events and celebrations.";
  const copyrightText = siteSettings?.footerSection?.copyrightText || "© Jiffy Booth";
  const whatsappNum = siteSettings?.whatsappSettings?.whatsappNumber || "60163966562";
  const whatsappMessage = siteSettings?.whatsappSettings?.defaultMessage || "Hi, I'd like a quote";
  const floatingMessage = siteSettings?.whatsappSettings?.floatingMessage || "Chat with us on WhatsApp";

  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className={`${inter.className} antialiased bg-white min-h-screen flex flex-col`}>
        <header className="bg-[#f5ebe1] sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 h-20 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                <div className="h-12 w-36 relative">
                  <Image src={logoUrl} alt="logo" fill style={{ objectFit: 'contain' }} />
                </div>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="uppercase text-sm tracking-widest font-medium hover:text-[#9b5744]">
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {desktopContactLink && (
                <Link href={desktopContactLink.href} className="hidden md:inline-block uppercase text-sm tracking-widest bg-[#9b5744] text-white px-4 py-2 rounded-md">
                  {desktopContactLink.name}
                </Link>
              )}

              <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                {isMenuOpen ? 'Close' : 'Menu'}
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <nav className="md:hidden bg-white border-t">
              <ul className="flex flex-col p-4 space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}><Link href={link.href} onClick={() => setIsMenuOpen(false)} className="block py-2">{link.name}</Link></li>
                ))}
              </ul>
            </nav>
          )}
        </header>

        <main className="flex-grow">{children}</main>

        {/* Floating WhatsApp */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          <div className="hidden md:block">
            <div className="bg-[#1c2431] text-white px-4 py-2 rounded-2xl shadow-lg">{floatingMessage}</div>
          </div>
          <a href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noreferrer" className="bg-[#25D366] p-3 rounded-full shadow-lg">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
          </a>
        </div>

        <footer className="bg-[#1c2431] text-white py-12">
          <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div>
                <h3 className="text-2xl font-bold uppercase">{companyName}</h3>
                <p className="mt-2 text-gray-300 max-w-md">{tagline}</p>
              </div>
              <div className="flex gap-6">
                <a href={socialLinks.instagram} className="underline">Instagram</a>
                <a href={socialLinks.tiktok} className="underline">TikTok</a>
                <a href={socialLinks.xiaohongshu} className="underline">XHS</a>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-700 pt-6 text-sm text-gray-400 flex flex-col md:flex-row justify-between">
              <div>{copyrightText}</div>
              <div className="flex gap-6 mt-3 md:mt-0">
                <Link href="/privacy" className="hover:underline">Privacy</Link>
                <Link href="/terms" className="hover:underline">Terms</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
