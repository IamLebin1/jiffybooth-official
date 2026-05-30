"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const featuredArticles = [
  {
    title: "How To Choose The Right Booth Setup For Your Guest Count",
    tag: "How-To",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Don't Get Fooled: Event Vendor Red Flags To Watch Out For",
    tag: "How-To",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "7 Timeline Tips To Keep Your Booth Busy From Start To End",
    tag: "Planning",
    image:
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Print Template Design Rules For Better-Looking Photo Strips",
    tag: "Design",
    image:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1400&q=80",
  },
];

export default function AdvicePage() {
  const [search, setSearch] = useState("");

  const filteredArticles = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return featuredArticles;

    return featuredArticles.filter((article) =>
      article.title.toLowerCase().includes(term) ||
      article.tag.toLowerCase().includes(term)
    );
  }, [search]);

  return (
    <main className="min-h-screen bg-[#f3f1ee] text-jiffy-dark font-inter">
      <section className="bg-[#f3f1ee] py-10 md:py-14 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-inter font-semibold tracking-tight text-2xl md:text-4xl text-jiffy-dark">
            Articles
          </h1>
          <p className="mt-4 font-inter text-sm md:text-base text-jiffy-dark/80 max-w-3xl mx-auto leading-relaxed">
            Get practical guidance, styling ideas, and planning tips to help you make the most of your event and photo booth experience.
          </p>

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
              placeholder="Search article..."
              className="w-full rounded-full border border-[#d8d8d8] bg-white py-3.5 pl-12 pr-6 text-base text-jiffy-dark outline-none transition-all focus:border-[#9b5744] focus:ring-4 focus:ring-[#9b5744]/10"
            />
          </div>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-10 lg:px-12 pb-20 md:pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {filteredArticles.map((article) => (
            <article
              key={article.title}
              className="group rounded-[1.6rem] overflow-hidden border border-[#ddd6cd] bg-[#f3f1ee] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-[240px] sm:h-[260px] md:h-[280px] lg:h-[260px]">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4 md:p-5">
                <p className="text-jiffy-dark/60 text-[11px] md:text-sm uppercase tracking-wide mb-2 font-semibold">
                  {article.tag}
                </p>
                <h3 className="text-[1.05rem] md:text-[1.18rem] font-medium leading-snug">
                  {article.title}
                </h3>
              </div>
            </article>
          ))}

          {filteredArticles.length === 0 && (
            <div className="lg:col-span-4 rounded-[2rem] border border-gray-200 bg-white p-12 text-center text-gray-500 shadow-sm">
              No matching articles found.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
