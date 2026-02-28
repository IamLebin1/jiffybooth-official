'use client';

import { Inter } from "next/font/google"; 
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "next-sanity";
import imageUrlBuilder from '@sanity/image-url';

// 1. CONFIGURE INTER GLOBALLY
const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

// Type definitions
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
  };
  whatsappSettings?: {
    whatsappNumber?: string;
    defaultMessage?: string;
    floatingMessage?: string;
  };
};

// Sanity client
const client = createClient({
  projectId: "g8867hcl", 
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isContactPage = pathname === "/contact-us";
  const isStudio = pathname.startsWith("/studio");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showWhatsAppMessage, setShowWhatsAppMessage] = useState(false);

  // --- SITE SETTINGS STATE ---
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // --- FORM STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    name: '',
    tel: '',
    email: '',
    event: '',
    date: '',
    time: '',
    description: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // --- FETCH HEADER & FOOTER SETTINGS ---
  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await client.fetch(
          `*[_type == "headerFooter"][0] {
            headerSection {
              "logo": logo.asset->url,
              navigationLinks
            },
            footerSection {
              companyName,
              tagline,
              socialLinks,
              copyrightText
            },
            whatsappSettings {
              whatsappNumber,
              defaultMessage,
              floatingMessage
            }
          }`,
          {},
          { cache: 'no-store' }
        );
        setSiteSettings(data);
      } catch (error) {
        console.error("Error fetching header/footer settings:", error);
      }
    }
    if (!isStudio) {
      fetchSettings();
    }
  }, [isStudio]);

  // Show WhatsApp message after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWhatsAppMessage(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the message for WhatsApp
    const message = `
*Quotation Request*

*Name:* ${formData.name}
*Tel:* ${formData.tel}
*Email:* ${formData.email}
*Event:* ${formData.event}
*Date:* ${formData.date}
*Time:* ${formData.time || 'Not specified'}
*Description:* ${formData.description || 'Not provided'}
    `.trim();

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp number from Sanity or fallback
    const whatsappNumber = siteSettings?.whatsappSettings?.whatsappNumber || '60172082266';
    
    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    
    // Reset form after opening WhatsApp
    setFormData({ name: '', tel: '', email: '', event: '', date: '', time: '', description: '' });
    setStatus('success');
    
    // Reset button status after 3 seconds
    setTimeout(() => setStatus('idle'), 3000);
  };

  if (isStudio) {
    return (
      <html lang="en">
        <body className="bg-white">{children}</body>
      </html>
    );
  }

  // Get data from Sanity with fallbacks
  const logoUrl = siteSettings?.headerSection?.logo || '/logo.png';
  const whatsappMessage = siteSettings?.whatsappSettings?.defaultMessage || "Hi Jiffy Booth! I'd like to enquire...";
  const whatsappNum = siteSettings?.whatsappSettings?.whatsappNumber || '60163966562';
  const floatingMessage = siteSettings?.whatsappSettings?.floatingMessage || "Hi, want to make your event amazing?";
  
  // Navigation links from Sanity or fallback
  const navLinks: NavLink[] = (siteSettings?.headerSection?.navigationLinks as NavLink[]) || [
    { name: "Our Services", href: "/our-services" },
    { name: "About Us", href: "/about-us" },
    { name: "Contact Us", href: "/contact-us" },
    { name: "FAQ", href: "/faq" },
  ];

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
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className={`${inter.className} antialiased bg-jiffy-cream min-h-screen flex flex-col`}>
        
        {/* --- NAVIGATION BAR --- */}
        <header className="bg-jiffy-dark sticky top-0 z-[100] w-full shadow-md">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex-shrink-0" onClick={() => setIsMenuOpen(false)}>
              <div className="w-22 h-16 md:w-26 md:h-20 relative flex items-center justify-center">
                <img src={logoUrl} alt="Jiffy Logo" className="object-contain" />
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-white font-medium">
              {/* FIXED: Added ': any' to link parameter to bypass implicit any error */}
              {navLinks.map((link: any) => (
                <Link key={link.href} href={link.href} className="hover:text-blue-300 transition-colors whitespace-nowrap uppercase text-sm tracking-widest">
                  {link.name}
                </Link>
              ))}
            </nav>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden text-white p-2 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
              )}
            </button>
          </div>

          {isMenuOpen && (
            <nav className="md:hidden bg-jiffy-dark border-t border-gray-700 absolute w-full left-0 shadow-2xl animate-in slide-in-from-top duration-200">
              <ul className="flex flex-col p-4 space-y-2">
                {/* FIXED: Added ': any' to link parameter here as well */}
                {navLinks.map((link: any) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      onClick={() => setIsMenuOpen(false)} 
                      className="text-white text-lg（14px) font-bold block border-b border-gray-800 pb-1.5 active:text-blue-300"
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
                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>
                    </a>
                    <a href={socialLinks.xiaohongshu} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                        <title>Xiaohongshu</title>
                        <path d="M22.405 9.879c0.002 0.016 0.01 0.02 0.07 0.019h0.725a0.797 0.797 0 0 0 0.78 -0.972 0.794 0.794 0 0 0 -0.884 -0.618 0.795 0.795 0 0 0 -0.692 0.794c0 0.101 -0.002 0.666 0.001 0.777zm-11.509 4.808c-0.203 0.001 -1.353 0.004 -1.685 0.003a2.528 2.528 0 0 1 -0.766 -0.126 0.025 0.025 0 0 0 -0.03 0.014L7.7 16.127a0.025 0.025 0 0 0 0.01 0.032c0.111 0.06 0.336 0.124 0.495 0.124 0.66 0.01 1.32 0.002 1.981 0 0.01 0 0.02 -0.006 0.023 -0.015l0.712 -1.545a0.025 0.025 0 0 0 -0.024 -0.036zM0.477 9.91c-0.071 0 -0.076 0.002 -0.076 0.01a0.834 0.834 0 0 0 -0.01 0.08c-0.027 0.397 -0.038 0.495 -0.234 3.06 -0.012 0.24 -0.034 0.389 -0.135 0.607 -0.026 0.057 -0.033 0.042 0.003 0.112 0.046 0.092 0.681 1.523 0.787 1.74 0.008 0.015 0.011 0.02 0.017 0.02 0.008 0 0.033 -0.026 0.047 -0.044 0.147 -0.187 0.268 -0.391 0.371 -0.606 0.306 -0.635 0.44 -1.325 0.486 -1.706 0.014 -0.11 0.021 -0.22 0.03 -0.33l0.204 -2.616 0.022 -0.293c0.003 -0.029 0 -0.033 -0.03 -0.034zm7.203 3.757a1.427 1.427 0 0 1 -0.135 -0.607c-0.004 -0.084 -0.031 -0.39 -0.235 -3.06a0.443 0.443 0 0 0 -0.01 -0.082c-0.004 -0.011 -0.052 -0.008 -0.076 -0.008h-1.48c-0.03 0.001 -0.034 0.005 -0.03 0.034l0.021 0.293c0.076 0.982 0.153 1.964 0.233 2.946 0.05 0.4 0.186 1.085 0.487 1.706 0.103 0.215 0.223 0.419 0.37 0.606 0.015 0.018 0.037 0.051 0.048 0.049 0.02 -0.003 0.742 -1.642 0.804 -1.765 0.036 -0.07 0.03 -0.055 0.003 -0.112zm3.861 -0.913h-0.872a0.126 0.126 0 0 1 -0.116 -0.178l1.178 -2.625a0.025 0.025 0 0 0 -0.023 -0.035l-1.318 -0.003a0.148 0.148 0 0 1 -0.135 -0.21l0.876 -1.954a0.025 0.025 0 0 0 -0.023 -0.035h-1.56c-0.01 0 -0.02 0.006 -0.024 0.015l-0.926 2.068c-0.085 0.169 -0.314 0.634 -0.399 0.938a0.534 0.534 0 0 0 -0.02 0.191 0.46 0.46 0 0 0 0.23 0.378 0.981 0.981 0 0 0 0.46 0.119h0.59c0.041 0 -0.688 1.482 -0.834 1.972a0.53 0.53 0 0 0 -0.023 0.172 0.465 0.465 0 0 0 0.23 0.398c0.15 0.092 0.342 0.12 0.475 0.12l1.66 -0.001c0.01 0 0.02 -0.006 0.023 -0.015l0.575 -1.28a0.025 0.025 0 0 0 -0.024 -0.035zm-6.93 -4.937H3.1a0.032 0.032 0 0 0 -0.034 0.033c0 1.048 -0.01 2.795 -0.01 6.829 0 0.288 -0.269 0.262 -0.28 0.262h-0.74c-0.04 0.001 -0.044 0.004 -0.04 0.047 0.001 0.037 0.465 1.064 0.555 1.263 0.01 0.02 0.03 0.033 0.051 0.033 0.157 0.003 0.767 0.009 0.938 -0.014 0.153 -0.02 0.3 -0.06 0.438 -0.132 0.3 -0.156 0.49 -0.419 0.595 -0.765 0.052 -0.172 0.075 -0.353 0.075 -0.533 0.002 -2.33 0 -4.66 -0.007 -6.991a0.032 0.032 0 0 0 -0.032 -0.032zm11.784 6.896c0 -0.014 -0.01 -0.021 -0.024 -0.022h-1.465c-0.048 -0.001 -0.049 -0.002 -0.05 -0.049v-4.66c0 -0.072 -0.005 -0.07 0.07 -0.07h0.863c0.08 0 0.075 0.004 0.075 -0.074V8.393c0 -0.082 0.006 -0.076 -0.08 -0.076h-3.5c-0.064 0 -0.075 -0.006 -0.075 0.073v1.445c0 0.083 -0.006 0.077 0.08 0.077h0.854c0.075 0 0.07 -0.004 0.07 0.07v4.624c0 0.095 0.008 0.084 -0.085 0.084 -0.37 0 -1.11 -0.002 -1.304 0 -0.048 0.001 -0.06 0.03 -0.06 0.03l-0.697 1.519s-0.014 0.025 -0.008 0.036c0.006 0.01 0.013 0.008 0.058 0.008 1.748 0.003 3.495 0.002 5.243 0.002 0.03 -0.001 0.034 -0.006 0.035 -0.033v-1.539zm4.177 -3.43c0 0.013 -0.007 0.023 -0.02 0.024 -0.346 0.006 -0.692 0.004 -1.037 0.004 -0.014 -0.002 -0.022 -0.01 -0.022 -0.024 -0.005 -0.434 -0.007 -0.869 -0.01 -1.303 0 -0.072 -0.006 -0.071 0.07 -0.07l0.733 -0.003c0.041 0 0.081 0.002 0.12 0.015 0.093 0.025 0.16 0.107 0.165 0.204 0.006 0.431 0.002 1.153 0.001 1.153zm2.67 0.244a1.953 1.953 0 0 0 -0.883 -0.222h-0.18c-0.04 -0.001 -0.04 -0.003 -0.042 -0.04V10.21c0 -0.132 -0.007 -0.263 -0.025 -0.394a1.823 1.823 0 0 0 -0.153 -0.53 1.533 1.533 0 0 0 -0.677 -0.71 2.167 2.167 0 0 0 -1 -0.258c-0.153 -0.003 -0.567 0 -0.72 0 -0.07 0 -0.068 0.004 -0.068 -0.065V7.76c0 -0.031 -0.01 -0.041 -0.046 -0.039H17.93s-0.016 0 -0.023 0.007c-0.006 0.006 -0.008 0.012 -0.008 0.023v0.546c-0.008 0.036 -0.057 0.015 -0.082 0.022h-0.95c-0.022 0.002 -0.028 0.008 -0.03 0.032v1.481c0 0.09 -0.004 0.082 0.082 0.082h0.913c0.082 0 0.072 0.128 0.072 0.128v1.148s0.003 0.117 -0.06 0.117h-1.482c-0.068 0 -0.06 0.082 -0.06 0.082v1.445s-0.01 0.068 0.064 0.068h1.457c0.082 0 0.076 -0.006 0.076 0.079v3.225c0 0.088 -0.007 0.081 0.082 0.081h1.43c0.09 0 0.082 0.007 0.082 -0.08v-3.27c0 -0.029 0.006 -0.035 0.033 -0.035l2.323 -0.003c0.098 0 0.191 0.02 0.28 0.061a0.46 0.46 0 0 1 0.274 0.407c0.008 0.395 0.003 0.79 0.003 1.185 0 0.259 -0.107 0.367 -0.33 0.367h-1.218c-0.023 0.002 -0.029 0.008 -0.028 0.033 0.184 0.437 0.374 0.871 0.57 1.303a0.045 0.045 0 0 0 0.04 0.026c0.17 0.005 0.34 0.002 0.51 0.003 0.15 -0.002 0.517 0.004 0.666 -0.01a2.03 2.03 0 0 0 0.408 -0.075c0.59 -0.18 0.975 -0.698 0.976 -1.313v-1.981c0 -0.128 -0.01 -0.254 -0.034 -0.38 0 0.078 -0.029 -0.641 -0.724 -0.998z" fill="#ffffff" strokeWidth="1"></path>
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
                      <li><Link href="/services/photo-booth" className="hover:text-white transition-colors">Photo Booth</Link></li>
                      <li><Link href="/services/roaming-booth" className="hover:text-white transition-colors">Roaming Booth</Link></li>
                      <li><Link href="/services/audio-booth" className="hover:text-white transition-colors">Audio Booth</Link></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* --- ENQUIRY FORM --- */}
              {!isContactPage && (
                <div className="flex-1 lg:max-w-xl">
                  <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl text-jiffy-dark">
                    <h2 className="text-3xl font-bold mb-8 uppercase tracking-tighter">Quotation Request</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="font-bold block text-sm uppercase tracking-wider">Name:</label>
                        <input 
                          name="name"
                          type="text" 
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your Full Name" 
                          required
                          className="w-full bg-gray-100 border border-gray-200 rounded-lg p-3 outline-none focus:border-jiffy-dark/30 transition-colors" 
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-bold block text-sm uppercase tracking-wider">Tel:</label>
                          <input 
                            name="tel"
                            type="tel" 
                            value={formData.tel}
                            onChange={handleChange}
                            placeholder="Phone Number" 
                            required
                            className="w-full bg-gray-100 border border-gray-200 rounded-lg p-3 outline-none focus:border-jiffy-dark/30 transition-colors" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-bold block text-sm uppercase tracking-wider">Email:</label>
                          <input 
                            name="email"
                            type="email" 
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address" 
                            required
                            className="w-full bg-gray-100 border border-gray-200 rounded-lg p-3 outline-none focus:border-jiffy-dark/30 transition-colors" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="font-bold block text-sm uppercase tracking-wider">Event:</label>
                        <input 
                          name="event"
                          type="text" 
                          value={formData.event}
                          onChange={handleChange}
                          placeholder="e.g. Wedding, Corporate Launch" 
                          required
                          className="w-full bg-gray-100 border border-gray-200 rounded-lg p-3 outline-none focus:border-jiffy-dark/30 transition-colors" 
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-bold block text-sm uppercase tracking-wider">Date:</label>
                          <input 
                            name="date"
                            type="date" 
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-100 border border-gray-200 rounded-lg p-3 outline-none text-gray-500 focus:border-jiffy-dark/30 transition-colors" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-bold block text-sm uppercase tracking-wider">Time:</label>
                          <input 
                            name="time"
                            type="time" 
                            value={formData.time}
                            onChange={handleChange}
                            className="w-full bg-gray-100 border border-gray-200 rounded-lg p-3 outline-none text-gray-500 focus:border-jiffy-dark/30 transition-colors" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="font-bold block text-sm uppercase tracking-wider">Description:</label>
                        <textarea 
                          name="description"
                          rows={4} 
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Tell us more about your event (duration, theme, etc.)" 
                          className="w-full bg-gray-100 border border-gray-200 rounded-lg p-3 outline-none resize-none focus:border-jiffy-dark/30 transition-colors"
                        ></textarea>
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-jiffy-dark text-white font-bold py-4 rounded-xl mt-4 uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-[0.98]"
                      >
                        {status === 'success' ? 'Opening WhatsApp...' : 'Submit via WhatsApp'}
                      </button>
                    </form>
                  </div>
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
    </html>
  );
}