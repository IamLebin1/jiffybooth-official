'use client';

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";

type Brand = { name?: string; logo?: string };
type Service = { title?: string; description?: string; slug?: string; image?: string };
type EventItem = { title?: string; category?: string; description?: string; slug?: string; image?: string };
type TemplateItem = { designImage?: string; title?: string };
type Testimonial = { rating?: number; text?: string; name?: string };

type MainPage = {
  heroBackgroundImage?: string | null;
  heroLogo?: string | null;
  templates?: TemplateItem[];
  testimonials?: Testimonial[];
  brands?: Brand[];
};

export default function Home() {
  const [pageData, setPageData] = useState<MainPage | null>(null);
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [eventsData, setEventsData] = useState<EventItem[]>([]);
  const [eventSearch, setEventSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await client.fetch(`{ "mainPage": *[_type == "mainPage"] | order(_updatedAt desc)[0]{..., "heroBackgroundImage": heroBackgroundImage.asset->url, "heroLogo": heroLogo.asset->url, "templates": templates[]->{designImage, title}, "testimonials": testimonials[] { rating, text, name }, "brands": brands[] { name, "logo": logo.asset->url } }, "services": *[_type == "ourServices"] | order(order asc){ title, description, "slug": slug.current, "image": image.asset->url }, "events": *[_type == "ourEvents"] | order(_createdAt asc){ title, category, description, "slug": slug.current, "image": image.asset->url } }`);

        setPageData(data?.mainPage || null);
        setServicesData(data?.services || []);
        setEventsData(data?.events || []);
      } catch (err) {
        console.error("Failed to fetch home data", err);
      }
    }
    fetchData();
  }, []);

  const eventCategories = useMemo(() => {
    const grouped = new Map<string, { title: string; image?: string; count: number }>();
    eventsData.forEach((e) => {
      const cat = (e.category || "").trim();
      if (!cat) return;
      const cur = grouped.get(cat);
      if (cur) {
        cur.count += 1;
      } else {
        grouped.set(cat, { title: cat, image: e.image, count: 1 });
      }
    });
    return Array.from(grouped.values());
  }, [eventsData]);

  const filteredPreviewEvents = useMemo(() => {
    const q = eventSearch.trim().toLowerCase();
    if (!q) return eventCategories;
    return eventCategories.filter((c) => c.title.toLowerCase().includes(q));
  }, [eventCategories, eventSearch]);

  return (
    <main className="min-h-screen bg-white font-inter">
      <section className="relative w-full min-h-[60vh] flex items-center justify-center bg-gray-50">
        {pageData?.heroBackgroundImage ? (
          <Image src={pageData.heroBackgroundImage} alt="Hero" fill className="object-cover opacity-10" />
        ) : null}

        <div className="relative z-10 text-center p-6 max-w-4xl">
          {pageData?.heroLogo && (
            <Image src={pageData.heroLogo} alt="Logo" width={200} height={80} className="mx-auto mb-4 object-contain" />
          )}
          <h1 className="text-3xl md:text-5xl font-bold">A Booth for All Occasions</h1>
          <p className="mt-4 text-jiffy-dark/80">We bring fun and memories to weddings, corporate events and more.</p>
        </div>
      </section>

      <section className="py-12 px-6">
        <h2 className="section-title mb-6">Our Services</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {servicesData.map((s, i) => (
            <Link key={s.slug || i} href={`/services/${s.slug || "#"}`} className="min-w-[220px]">
              <div className="rounded-xl overflow-hidden bg-white border p-4">
                {s.image && <Image src={s.image} alt={s.title || ""} width={400} height={300} className="object-cover w-full h-40" />}
                <h3 className="mt-3 font-semibold">{s.title}</h3>
                <p className="text-sm text-jiffy-dark/80">{s.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title mb-4">Event Types</h2>
          <div className="mb-6 max-w-sm">
            <input
              suppressHydrationWarning
              value={eventSearch}
              onChange={(e) => setEventSearch(e.target.value)}
              placeholder="Search event types..."
              className="w-full rounded-full p-3 border"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredPreviewEvents.map((c) => (
              <div key={c.title} className="bg-white rounded-lg p-4 shadow-sm">
                {c.image && <Image src={c.image} alt={c.title} width={600} height={400} className="object-cover w-full h-36 rounded-md" />}
                <h3 className="mt-3 font-semibold">{c.title}</h3>
                <p className="text-sm text-jiffy-dark/70">{c.count} events</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6">
        <h2 className="section-title mb-6">Templates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(pageData?.templates || []).filter(Boolean).map((t, i) => (
            <div key={i} className="rounded-lg overflow-hidden bg-white">
              {t?.designImage ? (
                <Image src={t.designImage} alt={t.title || `Template ${i + 1}`} width={900} height={600} className="w-full h-48 object-cover" />
              ) : (
                <div className="h-48 bg-gray-100 flex items-center justify-center">Image Coming Soon</div>
              )}
              <div className="p-4">
                <h3 className="font-semibold">{t.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 px-6">
        <h2 className="section-title mb-6">Trusted By</h2>
        <div className="flex gap-6 overflow-x-auto">
          {pageData?.brands?.map((b, i) => (
            <div key={i} className="flex items-center justify-center min-w-[120px]">
              {b.logo && <Image src={b.logo} alt={b.name || ""} width={140} height={56} className="object-contain" />}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}