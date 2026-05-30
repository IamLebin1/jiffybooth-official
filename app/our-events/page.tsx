"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { client } from "@/sanity/lib/client";

type EventListItem = {
  title: string;
  category: string;
  description: string;
  image: string;
  slug: string;
};

export default function OurEventsPage() {
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState<EventListItem[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await client
          .withConfig({ useCdn: false })
          .fetch(
            `*[_type == "ourEvents"] | order(coalesce(order, 9999) asc, _createdAt asc) {
              title,
              category,
              description,
              "slug": slug.current,
              "image": image.asset->url
            }`,
            {},
            { cache: "no-store" }
          );

        setEvents((data || []).filter((item: EventListItem) => item?.slug));
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    fetchEvents();
  }, []);

  // Show one image per event, grouped visually by category.
  const photos = useMemo(() => {
    return events
      .filter((ev) => Boolean(ev.image))
      .map((ev) => ({
        src: ev.image,
        title: ev.title,
        slug: ev.slug,
        category: ev.category,
        description: ev.description,
      }));
  }, [events]);

  const filteredPhotos = useMemo<Array<{ src: string; title: string; slug: string; category: string; description?: string }>>(
    () => photos.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase())
    ),
    [photos, search]
  );

  return (
    <main className="min-h-screen bg-white text-slate-900 font-inter">
      <section className="bg-[#f3f3f3] py-10 md:py-14 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-inter font-semibold tracking-tight text-2xl md:text-4xl text-jiffy-dark">
            Our Events
                    </h1>
          <p className="mt-4 font-inter text-sm md:text-base text-jiffy-dark/80 max-w-3xl mx-auto leading-relaxed">
              Get inspired by our past events! From elegant weddings to lively corporate parties, explore how Jiffy Booth has added fun and unforgettable memories to a wide range of occasions. Browse through our gallery and see why we&apos;re the perfect addition to your next event.
          </p>

          {/* Keep search for usability while matching the cleaner header style */}
          <div className="max-w-xl mx-auto relative group mt-7">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-jiffy-dark/50 group-focus-within:text-[#9b5744] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search photos by event, category..."
              className="w-full rounded-full border border-[#d8d8d8] bg-white py-3.5 pl-12 pr-6 text-base text-jiffy-dark outline-none transition-all focus:border-[#9b5744] focus:ring-4 focus:ring-[#9b5744]/10"
            />
          </div>
        </div>
      </section>

      {/* --- EVENTS GRID SECTION --- */}
      <section className="bg-[#f3f3f3]">
        <div>
          {/* Edge-to-edge gallery grid with hover reveal text */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {filteredPhotos.map((item, i) => (
              <Link
                key={`${item.slug}-${i}`}
                href={`/our-events/${item.slug}`}
                className="group relative block overflow-hidden aspect-[4/5] md:aspect-[5/6]"
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-400" />

                <div className="absolute inset-x-0 bottom-0 p-4 md:p-7 flex flex-col justify-end text-white z-10 pointer-events-none">
                  <div className="translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-400 ease-out">
                    <p className="font-inter text-[11px] md:text-sm font-bold uppercase tracking-[0.18em] mb-2">
                      {item.category}
                    </p>
                    <h2 className="font-inter text-lg md:text-[32px] leading-tight font-semibold tracking-tight max-w-[14ch]">
                      {item.title}
                    </h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredPhotos.length === 0 && (
            <div className="mt-12 rounded-[2rem] border border-gray-200 bg-white p-12 text-center text-gray-500 shadow-sm">
              <Sparkles className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-jiffy-dark mb-2 font-inter">No photos found</h3>
              <p className="font-inter">Try searching for something else, like &quot;Wedding&quot; or &quot;Corporate&quot;.</p>
            </div>
          )}
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
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