"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { client } from "@/sanity/lib/client";

type EventListItem = {
  title: string;
  category: string;
  description: string;
  image: string;
  slug: string;
};

type EventCategory = {
  title: string;
  image?: string;
  description?: string;
  count: number;
};

export default function OurEventsPage() {
  const searchParams = useSearchParams();
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    const categoryFromQuery = searchParams.get("category");
    return categoryFromQuery ? categoryFromQuery.trim() : null;
  });
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

  const eventCategories = useMemo<EventCategory[]>(() => {
    const grouped = new Map<string, EventCategory>();

    events.forEach((item) => {
      const category = (item.category || "").trim();
      if (!category) return;

      const existing = grouped.get(category);
      if (existing) {
        existing.count += 1;
        if (!existing.image && item.image) existing.image = item.image;
        return;
      }

      grouped.set(category, {
        title: category,
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

  const selectedCategoryPhotos = useMemo<
    Array<{ src: string; title: string; slug: string; category: string; description?: string }>
  >(
    () =>
      events
        .filter(
          (ev) =>
            Boolean(ev.image) &&
            Boolean(selectedCategory) &&
            ev.category?.trim().toLowerCase() === selectedCategory?.trim().toLowerCase()
        )
        .map((ev) => ({
          src: ev.image,
          title: ev.title,
          slug: ev.slug,
          category: ev.category,
          description: ev.description,
        })),
    [events, selectedCategory]
  );

  const filteredPhotos = selectedCategoryPhotos;

  const showCategoryView = !selectedCategory;

  return (
    <main className="min-h-screen bg-white text-slate-900 font-inter">
      {showCategoryView ? (
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
                  <button
                    key={`${item.title}-${index}`}
                    type="button"
                    onClick={() => setSelectedCategory(item.title)}
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
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-x-7 gap-y-10">
              {filteredCategories.map((item, index) => (
                <button
                  key={`${item.title}-${index}`}
                  type="button"
                  onClick={() => setSelectedCategory(item.title)}
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
                </button>
              ))}
            </div>

            {filteredCategories.length === 0 && (
              <div className="mt-10 rounded-2xl border border-[#ddd5c9] bg-white p-8 text-center text-jiffy-dark/70">
                No matching event types found.
              </div>
            )}

          </div>
        </section>
      ) : (
        <>
          <section className="bg-[#f3f3f3] py-10 md:py-14 px-6">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="font-inter font-semibold tracking-tight text-2xl md:text-4xl text-jiffy-dark">
                {selectedCategory}
              </h1>
              <p className="mt-4 font-inter text-sm md:text-base text-jiffy-dark/80 max-w-3xl mx-auto leading-relaxed">
                Browse highlights from our {selectedCategory?.toLowerCase()} events.
              </p>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory(null);
                  }}
                  className="text-jiffy-dark/70 hover:text-jiffy-dark text-xs tracking-[0.2em] inline-block transition-colors"
                >
                  ← Back to Event Types
                </button>
              </div>
            </div>
          </section>

          <section className="bg-[#f3f3f3]">
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
                {filteredPhotos.map((item, i) => (
                  <div
                    key={`${item.slug}-${i}`}
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
                  </div>
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
        </>
      )}

      {showCategoryView && (
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
      )}

    </main>
  );
}
