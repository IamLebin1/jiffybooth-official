"use client";

import React, { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import "./globals.css";
import { client } from "@/sanity/lib/client";
import EnquiryForm from "@/components/EnquiryForm";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

type SiteSettings = {
  headerSection?: { logo?: string; navigationLinks?: { name: string; href: string }[] };
  footerSection?: { companyName?: string; tagline?: string; socialLinks?: any; copyrightText?: string; footerLinks?: any[] };
  whatsappSettings?: { whatsappNumber?: string; defaultMessage?: string; floatingMessage?: string };
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isContactPage = pathname === "/contact-us";
  const isStudio = pathname?.startsWith("/studio");

  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showWhatsAppMessage, setShowWhatsAppMessage] = useState(false);

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

  // show WhatsApp message after short delay
  useEffect(() => {
    const timer = setTimeout(() => setShowWhatsAppMessage(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const logoUrl = siteSettings?.headerSection?.logo || "/logo.png";
  const navLinks = siteSettings?.headerSection?.navigationLinks || [
    { name: "About Us", href: "/about-us" },
    { name: "Our Services", href: "/our-services" },
    { name: "Our Events", href: "/our-events" },
    { name: "Advice", href: "/advice" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact Us", href: "/contact-us" },
  ];
  const desktopContactLink = navLinks.find((l) => l.name.trim().toLowerCase() === "contact us" || l.href === "/contact-us") || null;
  const desktopLeftLinks = desktopContactLink ? navLinks.filter((link) => link !== desktopContactLink) : navLinks;
  const socialLinks = siteSettings?.footerSection?.socialLinks || { instagram: "#", tiktok: "#", xiaohongshu: "#" };
  const companyName = siteSettings?.footerSection?.companyName || "Jiffy Booth";
  const tagline = siteSettings?.footerSection?.tagline || "Premium photo booth experiences for events and celebrations.";
  const copyrightText = siteSettings?.footerSection?.copyrightText || "© Jiffy Booth";
  const whatsappNum = siteSettings?.whatsappSettings?.whatsappNumber || "60163966562";
  const whatsappMessage = siteSettings?.whatsappSettings?.defaultMessage || "Hi, I'd like a quote";
  const floatingMessage = siteSettings?.whatsappSettings?.floatingMessage || "Chat with us on WhatsApp";

  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className={`${inter.className} antialiased bg-jiffy-cream min-h-screen flex flex-col`}>
        {/* --- NAVIGATION BAR --- */}
        {!isStudio && (
          <header className="bg-[#f5ebe1] sticky top-0 z-[100] w-full">
          <div className="w-full px-6 md:px-8 lg:px-10 h-20 flex items-center justify-between gap-6">
            <div className="hidden md:flex items-center gap-10 flex-1 min-w-0">
              <Link href="/" className="flex-shrink-0" onClick={() => setIsMenuOpen(false)}>
                <div className="w-22 h-16 md:w-26 md:h-20 relative flex items-center justify-center">
                  <Image src={logoUrl} alt="Jiffy Logo" width={160} height={64} className="object-contain" />
                </div>
              </Link>

              <nav className="flex items-center gap-8 text-jiffy-dark font-medium justify-start">
                {desktopLeftLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="hover:text-blue-300 transition-colors whitespace-nowrap uppercase text-sm tracking-widest">
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            <Link href="/" className="md:hidden flex-shrink-0" onClick={() => setIsMenuOpen(false)}>
              <div className="w-22 h-16 md:w-26 md:h-20 relative flex items-center justify-center">
                <Image src={logoUrl} alt="Jiffy Logo" width={140} height={56} className="object-contain" />
              </div>
            </Link>

            {desktopContactLink && (
              <nav className="hidden md:flex items-center ml-auto text-jiffy-dark font-medium">
                <Link href={desktopContactLink.href} className="hover:text-blue-300 transition-colors whitespace-nowrap uppercase text-sm tracking-widest">
                  {desktopContactLink.name}
                </Link>
              </nav>
            )}

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden text-jiffy-dark p-2 focus:outline-none transition-transform duration-300 active:scale-90"
              style={{ transform: isMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? (
                <svg className="animate-in zoom-in-50 duration-300" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              ) : (
                <svg className="animate-in zoom-in-50 duration-300" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
              )}
            </button>
          </div>

          {isMenuOpen && (
            <nav className="md:hidden bg-jiffy-cream border-t border-[#e3dbd0] absolute w-full left-0 shadow-2xl animate-in slide-in-from-top duration-200">
              <ul className="flex flex-col p-4 space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      onClick={() => setIsMenuOpen(false)} 
                      className="text-jiffy-dark text-lg font-bold block border-b border-[#e3dbd0] pb-1.5 active:text-[#9b5744]"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          </header>
        )}

        <main className="flex-grow">{children}</main>

        {/* --- FLOATING WHATSAPP WITH MESSAGE BOX --- */}
        {!isStudio && (
          <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-2 md:gap-3">
          {showWhatsAppMessage && (
            <div className="relative bg-jiffy-dark text-white px-4 py-2 md:px-6 md:py-4 rounded-2xl shadow-xl max-w-[210px] md:max-w-[280px] animate-in slide-in-from-bottom duration-300">
              <button 
                onClick={() => setShowWhatsAppMessage(false)}
                className="absolute -top-2 -left-2 bg-white text-jiffy-dark rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md"
                aria-label="Close message"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
              
              <p className="text-xs md:text-[15px] leading-relaxed">
                {floatingMessage}
              </p>
              
              <div className="absolute -bottom-2 right-6 md:right-8 w-0 h-0 border-l-[8px] md:border-l-[10px] border-l-transparent border-r-[8px] md:border-r-[10px] border-r-transparent border-t-[8px] md:border-t-jiffy-dark"></div>
            </div>
          )}

          <a 
            href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank" rel="noopener noreferrer"
            aria-label="Open WhatsApp chat"
            className="bg-whatsapp p-2 md:p-4 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-[30px] h-[30px] md:w-[50px] md:h-[50px]">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </a>
          </div>
        )}

        {/* --- FOOTER SECTION --- */}
        {!isStudio && (
          <footer className="bg-jiffy-dark text-white py-12 px-6 mt-auto">
          <div className="max-w-7xl mx-auto">
            <div className={`flex flex-col lg:flex-row gap-16 ${isContactPage ? 'justify-between' : ''}`}>
              
              <div className="flex-1 space-y-12">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold uppercase tracking-tighter">{companyName}</h2>
                  <p className="text-gray-400 text-lg leading-relaxed max-w-sm font-light">
                    {tagline}
                  </p>
                  
                  <div className="flex gap-6 text-white">
                      <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-blue-300 transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                      <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="hover:text-blue-300 transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>
                    </a>
                      <a href={socialLinks.xiaohongshu} target="_blank" rel="noopener noreferrer" aria-label="Xiaohongshu" className="hover:text-blue-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>Xiaohongshu SVG Icon</title><path fill="currentColor" d="M22.405 9.879c.002.016.01.02.07.019h.725a.797.797 0 0 0 .78-.972a.794.794 0 0 0-.884-.618a.795.795 0 0 0-.692.794c0 .101-.002.666.001.777m-11.509 4.808c-.203.001-1.353.004-1.685.003a2.5 2.5 0 0 1-.766-.126a.025.025 0 0 0-.03.014L7.7 16.127a.025.025 0 0 0 .01.032c.111.06.336.124.495.124c.66.01 1.32.002 1.981 0q.017 0 .023-.015l.712-1.545a.025.025 0 0 0-.024-.036zM.477 9.91c-.071 0-.076.002-.076.01l-.01.08c-.027.397-.038.495-.234 3.06c-.012.24-.034.389-.135.607c-.026.057-.033.042.003.112c.046.092.681 1.523.787 1.74c.008.015.011.02.017.02c.008 0 .033-.026.047-.044q.219-.282.371-.606c.306-.635.44-1.325.486-1.706c.014-.11.021-.22.03-.33l.204-2.616l.022-.293c.003-.029 0-.033-.03-.034zm7.203 3.757a1.4 1.4 0 0 1-.135-.607c-.004-.084-.031-.39-.235-3.06a.4.4 0 0 0-.01-.082c-.004-.011-.052-.008-.076-.008h-1.48c-.03.001-.034.005-.03.034l.021.293q.114 1.473.233 2.946c.05.4.186 1.085.487 1.706c.103.215.223.419.37.606c.015.018.037.051.048.049c.02-.003.742-1.642.804-1.765c.036-.07.03-.055.003-.112m3.861-.913h-.872a.126.126 0 0 1-.116-.178l1.178-2.625a.025.025 0 0 0-.023-.035l-1.318-.003a.148.148 0 0 1-.135-.21l.876-1.954a.025.025 0 0 0-.023-.035h-1.56q-.017 0-.024.015l-.926 2.068c-.085.169-.314.634-.399.938a.5.5 0 0 0-.02.191a.46.46 0 0 0 .23.378a1 1 0 0 0 .46.119h.59c.041 0-.688 1.482-.834 1.972a.5.5 0 0 0-.023.172a.47.47 0 0 0 .23.398c.15.092.342.12.475.12l1.66-.001q.017 0 .023-.015l.575-1.28a.025.025 0 0 0-.024-.035m-6.93-4.937H3.1a.032.032 0 0 0-.034.033c0 1.048-.01 2.795-.01 6.829c0 .288-.269.262-.28.262h-.74c-.04.001-.044.004-.04.047c.001.037.465 1.064.555 1.263c.01.02.03.033.051.033c.157.003.767.009.938-.014c.153-.02.3-.06.438-.132c.3-.156.49-.419.595-.765c.052-.172.075-.353.075-.533q.003-3.495-.007-6.991a.03.03 0 0 0-.032-.032zm11.784 6.896q-.002-.02-.024-.022h-1.465c-.048-.001-.049-.002-.05-.049v-4.66c0-.072-.005-.07.07-.07h.863c.08 0 .075.004.075-.074V8.393c0-.082.006-.076-.08-.076h-3.5c-.064 0-.075-.006-.075.073v1.445c0 .083-.006.077.08.077h.854c.075 0 .07-.004.70.07v4.624c0 .095.008.084-.085.084c-.37 0-1.11-.002-1.304 0c-.048.001-.06.03-.06.03l-.697 1.519s-.014.025-.008.036s.013.008.058.008q2.622.003 5.243.002c.03-.001.034-.006.035-.033zm4.177-3.43q0 .021-.02.024c-.346.006-.692.004-1.037.004q-.021-.003-.022-.024q-.006-.651-.01-1.303c0-.072-.006-.071.07-.07l.733-.003c.041 0 .081.002.12.015c.093.025.16.107.165.204c.006.431.002 1.153.001 1.153m2.67.244a1.95 1.95 0 0 0-.883-.222h-.18c-.04-.001-.04-.003-.042-.04V10.21q.001-.198-.025-.394a1.8 1.8 0 0 0-.153-.53a1.53 1.53 0 0 0-.677-.71a2.2 2.2 0 0 0-1-.258c-.153-.003-.567 0-.72 0c-.07 0-.068.004-.068-.065V7.76c0-.031-.01-.041-.046-.039H17.93s-.016 0-.023.007q-.008.008-.008.023v.546c-.008.036-.057.015-.082.022h-.95c-.022.002-.028.008-.03.032v1.481c0 .09-.004.082.082.082h.913c.082 0 .072.128.072.128v1.148s.003.117-.06.117h-1.482c-.068 0-.06.082-.06.082v1.445s-.01.068.064.068h1.457c.082 0 .076-.006.076.079v3.225c0 .088-.007.081.082.081h1.43c.09 0 .082.007.082-.08v-3.27c0-.029.006-.035.033-.035l2.323-.003a.7.7 0 0 1 .28.061a.46.46 0 0 1 .274.407c.008.395.003.79.003 1.185c0 .259-.107.367-.33.367h-1.218c-.023.002-.029.008-.028.033q.276.655.57 1.303a.05.05 0 0 0 .04.026c.17.005.34.002.51.003c.15-.002.517.004.666-.01a2 2 0 0 0 .408-.075c.59-.18.975-.698.976-1.313v-1.981q.001-.191-.034-.38c0 .078-.029-.641-.724-.998"/></svg>
                      </a>
                  </div>
                </div>

                <div className="flex gap-20">
                  <div>
                    <h3 className="font-bold mb-6 text-gray-200 uppercase text-xs tracking-widest">Company</h3>
                    <ul className="space-y-4 text-gray-400 text-sm">
                      <li><Link href="/about-us" className="hover:text-white transition-colors">About Us</Link></li>
                      <li><Link href="/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
                      <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                    </ul>
                  </div>
                  <div>
                      <h3 className="font-bold mb-6 text-gray-200 uppercase text-xs tracking-widest">Our Services</h3>
                      <ul className="space-y-4 text-gray-400 text-sm">
                          {siteSettings?.footerSection?.footerLinks && siteSettings.footerSection.footerLinks.length > 0 ? (
                            siteSettings.footerSection.footerLinks.map((link: any) => (
                        <li key={link.href}>
                            <Link href={link.href} className="hover:text-white transition-colors">
                            {link.name}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-600 italic text-xs animate-pulse">Loading services...</li>
                    )}
                  </ul>
                </div>
                </div>
              </div>

              {/* --- ENQUIRY FORM --- */}
              {!isContactPage && (
                <div className="flex-1 lg:max-w-xl">
                  <EnquiryForm whatsappNumber={whatsappNum} />
                </div>
              )}
            </div>

            <div className="max-w-7xl mx-auto border-t border-gray-800 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-[10px] uppercase tracking-widest">
              <div>{copyrightText}</div>
              <div className="flex gap-8">
                <Link href="/privacy" className="hover:text-white transition-colors font-bold">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors font-bold">Terms of Service</Link>
              </div>
            </div>
          </div>
          </footer>
        )}
      </body>
    </html>
  );
}
