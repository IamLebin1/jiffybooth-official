import { Inter } from "next/font/google"; 
import "./globals.css";
import { createClient } from "next-sanity";
import ClientLayout from "./ClientLayout";

// 1. CONFIGURE INTER GLOBALLY
const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

// Sanity client
const client = createClient({
  projectId: "g8867hcl", 
  dataset: "production",
  apiVersion: "2024-01-01",
  // Use CDN for faster public page fetches; switch to false if you need always-fresh server-side builds
  useCdn: true,
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch site settings server-side
  let siteSettings = null;
  try {
    siteSettings = await client.fetch(
      `*[_type == "headerFooter"][0] {
        headerSection {
          "logo": logo.asset->url,
          navigationLinks
        },
        footerSection {
          companyName,
          tagline,
          socialLinks,
          copyrightText,
          "footerLinks": footerLinks[]-> {
            "name": title,
            "href": "/services/" + slug.current
          }
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
  } catch (error) {
    console.error("Error fetching header/footer settings:", error);
  }

  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        <title>{siteSettings?.footerSection?.companyName || 'Jiffy Booth'}</title>
        <meta name="description" content={siteSettings?.footerSection?.tagline || 'Premium photo booth experiences for events and celebrations.'} />
        <meta property="og:title" content={siteSettings?.footerSection?.companyName || 'Jiffy Booth'} />
        <meta property="og:description" content={siteSettings?.footerSection?.tagline || 'Premium photo booth experiences for events and celebrations.'} />
        {siteSettings?.headerSection?.logo && <meta property="og:image" content={siteSettings.headerSection.logo} />}
        {/* Preconnect to common image hosts to reduce latency for remote images */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        {/* Preload critical images (site logo and default hero) to help LCP */}
        {siteSettings?.headerSection?.logo && <link rel="preload" as="image" href={siteSettings.headerSection.logo} />}
        <link rel="preload" as="image" href="/hero-background.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <ClientLayout siteSettings={siteSettings} interClassName={inter.className}>
        {children}
      </ClientLayout>
    </html>
  );
}
