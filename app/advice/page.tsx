"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const featuredArticles = [
  { title: "How To Choose The Right Booth Setup For Your Guest Count", tag: "How-To", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80" },
  { title: "Don't Get Fooled: Event Vendor Red Flags To Watch Out For", tag: "How-To", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=80" },
  { title: "7 Timeline Tips To Keep Your Booth Busy From Start To End", tag: "Planning", image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1400&q=80" },
  { title: "Print Template Design Rules For Better-Looking Photo Strips", tag: "Design", image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1400&q=80" },
];

export default function AdvicePage() {
  const [search, setSearch] = useState("");

  const filteredArticles = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return featuredArticles;
    return featuredArticles.filter((a) => a.title.toLowerCase().includes(term) || a.tag.toLowerCase().includes(term));
  }, [search]);

  return (
    <main className="min-h-screen bg-[#f3f1ee] text-jiffy-dark font-inter">
      <section className="py-10 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-semibold">Articles</h1>
          <p className="mt-4 text-jiffy-dark/80">Get practical guidance, styling ideas, and planning tips to help you make the most of your event and photo booth experience.</p>
          <div className="mt-6 max-w-md mx-auto">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search article..." className="w-full rounded-full p-3 border" />
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredArticles.map((article) => (
            <article key={article.title} className="rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="h-56 relative">
                <Image src={article.image} alt={article.title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <p className="text-xs uppercase text-jiffy-dark/60">{article.tag}</p>
                <h3 className="mt-2 font-semibold">{article.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
