'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import EnquiryForm from "@/components/EnquiryForm";

type NavLink = {
  name: string;
  href: string;
};

type SiteSettings = {
  headerSection?: {
    logo?: string;
    navigationLinks?: NavLink[];
  };
  footerSection?: {
    companyName?: string;
    tagline?: string;
    copyrightText?: string;
    socialLinks?: {
      instagram?: string;
      tiktok?: string;
      xiaohongshu?: string;
    };
    footerLinks?: NavLink[];
  };
  whatsappSettings?: {
    whatsappNumber?: string;
    defaultMessage?: string;
    floatingMessage?: string;
  };
};

export default function ClientLayout({
  children,
  siteSettings,
  interClassName,
}: {
  children: React.ReactNode;
  siteSettings: SiteSettings | null;
  interClassName: string;
}) {
  const pathname = usePathname();
  const isContactPage = pathname === "/contact-us";
  const isStudio = pathname.startsWith("/studio");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showWhatsAppMessage, setShowWhatsAppMessage] = useState(false);

  // Show WhatsApp message after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWhatsAppMessage(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isStudio) {
    return <body className="bg-white">{children}</body>;
  }

  // Get data from Sanity with fallbacks
  const logoUrl = siteSettings?.headerSection?.logo || '/logo.png';
  const whatsappMessage = siteSettings?.whatsappSettings?.defaultMessage || "Hi Jiffy Booth! I'd like to enquire...";
  const whatsappNum = siteSettings?.whatsappSettings?.whatsappNumber || '60163966562';
  const floatingMessage = siteSettings?.whatsappSettings?.floatingMessage || "Hi, want to make your event amazing?";
  
  // Navigation links from Sanity or fallback
  const navLinks: NavLink[] = (siteSettings?.headerSection?.navigationLinks as NavLink[]) || [
    { name: "About Us", href: "/about-us" },
    { name: "Our Services", href: "/our-services" },
    { name: "Our Events", href: "/our-events" },
    { name: "Advice", href: "/advice" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact Us", href: "/contact-us" },
  ];

  const desktopContactLink =
    navLinks.find((link) => link.name.trim().toLowerCase() === "contact us" || link.href === "/contact-us") || null;
  const desktopLeftLinks = desktopContactLink
    ? navLinks.filter((link) => link !== desktopContactLink)
    : navLinks;

  // Footer data from Sanity or fallbacks
  const companyName = siteSettings?.footerSection?.companyName || "Jiffy Booth";
  const tagline = siteSettings?.footerSection?.tagline || '"Capturing a jiffy that lasts forever." We specialize in premium event entertainment that brings people together.';
  const copyrightText = siteSettings?.footerSection?.copyrightText || "© 2026 Jiffy Ventures. All rights reserved.";
  const socialLinks = siteSettings?.footerSection?.socialLinks || {
    instagram: "https://www.instagram.com/jiffybooth/",
    tiktok: "https://www.tiktok.com/@jiffybooth",
    xiaohongshu: "https://www.xiaohongshu.com/user/profile/5fcc526b00000000010031a0"
  };

  return (
    <body className={`${interClassName} antialiased bg-jiffy-cream min-h-screen flex flex-col`}>
      {/* --- NAVIGATION BAR --- */}
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

      <main className="flex-grow">
        {children}
      </main>

      {/* --- FLOATING WHATSAPP WITH MESSAGE BOX --- */}
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-2 md:gap-3">
        
        {/* Message Box */}
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

        {/* WhatsApp Button */}
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

      {/* --- FOOTER SECTION --- */}
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
                      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                        <title>Xiaohongshu</title>
                        <path d="M22.405 9.879c0.002 0.016 0.01 0.02 0.07 0.019h0.725a0.797 0.797 0 0 0 0.78 -0.972 0.794 0.794 0 0 0 -0.884 -0.618 0.795 0.795 0 0 0 -0.692 0.794c0 0.101 -0.002 0.666 0.001 0.777z" fill="currentColor"/>
                      </svg>
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
                          siteSettings.footerSection.footerLinks.map((link: NavLink) => (
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
    </body>
  );
}
