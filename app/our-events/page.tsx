"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type EventListItem = {
  title: string;
  category: string;
  description: string;
  image: string;
  slug: string;
};

type EventCategory = {
  title: string;
  slug: string;
  image?: string;
  description?: string;
  count: number;
};

const toEventTypeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

function OurEventsPageContent() {
  const [categorySearch, setCategorySearch] = useState("");
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events", { cache: "no-store" });
        const data = await response.json();

        if (Array.isArray(data)) {
          setEvents(data.filter((item: EventListItem) => item?.slug));
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const eventCategories = useMemo<EventCategory[]>(() => {
    const grouped = new Map<string, EventCategory>();

    events.forEach((item) => {
      const eventTypeTitle = (item.title || "").trim();
      if (!eventTypeTitle) return;

      const eventTypeSlug = (item.slug || "").trim() || toEventTypeSlug(eventTypeTitle);
      if (!eventTypeSlug) return;

      const existing = grouped.get(eventTypeSlug);
      if (existing) {
        existing.count += 1;
        if (!existing.image && item.image) existing.image = item.image;
        return;
      }

      grouped.set(eventTypeSlug, {
        title: eventTypeTitle,
        slug: eventTypeSlug,
        image: item.image,
        description: item.description,
        count: 1,
      });
    });

    return Array.from(grouped.values());
  }, [events]);

  const filteredCategories = useMemo(
    () =>
      eventCategories.filter(
        (item) =>
          item.title.toLowerCase().includes(categorySearch.toLowerCase()) ||
          (item.description || "").toLowerCase().includes(categorySearch.toLowerCase())
      ),
    [eventCategories, categorySearch]
  );

  if (loading) {
    return <main className="min-h-screen bg-white text-slate-900 font-inter" />;
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 font-inter">
      <section className="py-16 md:py-20 px-6 bg-[#f4f4f4] border-t border-[#e8e3da]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-10 md:mb-12">
            <h1 className="section-title mb-4">Event Types</h1>
            <p className="text-jiffy-dark/75 text-sm md:text-base leading-relaxed">
              From weddings to corporate events, our booths add a touch of fun and create lasting memories for every occasion.
            </p>

            <div className="mt-8 max-w-md mx-auto relative">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-jiffy-dark/45">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </span>
              <input
                suppressHydrationWarning
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Search event types..."
                className="w-full rounded-full border border-transparent bg-[#e7e7e7] py-3 pl-11 pr-5 text-sm text-jiffy-dark outline-none transition-colors focus:border-[#c9c3bb] focus:bg-white"
              />
            </div>
          </div>

          <div className="md:hidden -mx-6 px-6 overflow-x-auto scrollbar-hide pb-2">
            <div className="flex gap-4 w-max snap-x snap-mandatory">
              {filteredCategories.map((item, index) => (
                <Link
                  key={`${item.title}-${index}`}
                  href={`/our-events/${item.slug}`}
                  className="group block text-left text-jiffy-dark shrink-0 w-[76vw] max-w-[320px] snap-center"
                >
                  <div className="relative overflow-hidden rounded-[1.7rem] aspect-[4/5] bg-stone-200">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center px-6 text-center bg-gradient-to-br from-[#ece6de] to-[#dcd3c7]">
                        <p className="font-serif italic text-lg text-jiffy-dark">Image Coming Soon</p>
                      </div>
                    )}
                  </div>

                  <h3 className="mt-3 font-serif italic text-lg leading-tight">{item.title}</h3>
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-x-7 gap-y-10">
            {filteredCategories.map((item, index) => (
              <Link
                key={`${item.title}-${index}`}
                href={`/our-events/${item.slug}`}
                className="group block text-left text-jiffy-dark"
              >
                <div className="relative overflow-hidden rounded-[1.7rem] aspect-[1/1] bg-stone-200">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center px-6 text-center bg-gradient-to-br from-[#ece6de] to-[#dcd3c7]">
                      <p className="font-serif italic text-lg text-jiffy-dark">Image Coming Soon</p>
                    </div>
                  )}
                </div>

                <h3 className="mt-3 font-serif italic text-xl md:text-2xl leading-tight">{item.title}</h3>
              </Link>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="mt-10 rounded-2xl border border-[#ddd5c9] bg-white p-8 text-center text-jiffy-dark/70">
              No event types found.
            </div>
          )}

        </div>
      </section>

      <section className="py-24 text-center bg-white border-t border-gray-100 px-6">
        <h2 className="text-jiffy-dark font-inter font-bold tracking-tight text-3xl md:text-5xl mb-8">
          Not seeing your event type?
        </h2>
        <p className="text-gray-500 mb-10 max-w-xl mx-auto">
          We love getting creative! Reach out to us and we can custom-build a photo booth experience specifically for your unique theme.
        </p>
        <Link
          href="/contact-us"
          className="inline-block bg-[#9b5744] text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          Let&apos;s Talk
        </Link>
      </section>

    </main>
  );
}

export default function OurEventsPage() {
  return <OurEventsPageContent />;
}
