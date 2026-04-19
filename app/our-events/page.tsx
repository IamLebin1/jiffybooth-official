'use client';

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { eventTypes } from "./eventData";

export default function OurEventsPage() {
  const [search, setSearch] = useState('');

  const filteredEvents = useMemo(
    () => eventTypes.filter((event) =>
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.category.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );

  return (
    <div className="min-h-screen bg-white font-inter">
      
      {/* --- HERO SECTION --- */}
      <section className="py-24 px-6 md:py-32 bg-[#e8dfd2] border-b border-[#ddd0be]">
        <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <p className="text-jiffy-dark/70 uppercase tracking-[0.35em] text-xs md:text-sm mb-6">
            Every Occasion
          </p>
          <h1 className="text-jiffy-dark font-bold text-5xl md:text-[clamp(60px,6vw,90px)] tracking-tighter leading-[1.1] mb-8">
            Moments Worth <br className="hidden md:block" /> Capturing.
          </h1>
          <p className="text-jiffy-dark/80 max-w-2xl mx-auto text-base md:text-xl font-light leading-relaxed mb-10">
            From intimate weddings to massive corporate galas, we bring the perfect aesthetic and energy to elevate your event and leave a lasting impression.
          </p>
          
          {/* --- SEARCH BAR --- */}
          <div className="max-w-xl mx-auto relative group">
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
              placeholder="Search event types..."
              className="w-full rounded-full border-2 border-[#ddd0be] bg-white/80 backdrop-blur-sm py-4 pl-12 pr-6 text-base text-jiffy-dark shadow-sm outline-none transition-all focus:border-[#9b5744] focus:bg-white focus:ring-4 focus:ring-[#9b5744]/10"
            />
          </div>
        </div>
      </section>

      {/* --- EVENTS GRID SECTION --- */}
      <section className="py-16 md:py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {filteredEvents.map((item) => (
              <Link 
                key={item.slug}
                href={`/our-events/${item.slug}`} 
                className="group relative block h-[450px] md:h-[550px] overflow-hidden rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-700"
              >
                {/* Background Image */}
                <div className="absolute inset-0 bg-stone-200">
                  <Image 
                    src={item.image} 
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
                
                {/* Dark Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-jiffy-dark/95 via-jiffy-dark/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

                {/* Content - Slides up on hover */}
                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-white z-10">
                  <div className="transform translate-y-12 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    
                    <p className="text-[#e8dfd2] text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                      {item.category}
                    </p>
                    
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                      {item.title}
                    </h2>
                    
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <span className="inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-white">
                      Explore Gallery 
                      <span className="transition-transform duration-300 group-hover:translate-x-2 text-orange-400">→</span>
                    </span>
                    
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="mt-12 rounded-[2rem] border border-gray-200 bg-white p-12 text-center text-gray-500 shadow-sm">
              <Sparkles className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-jiffy-dark mb-2">No event types found</h3>
              <p>Try searching for something else, like "Wedding" or "Corporate".</p>
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
          Let's Talk
        </Link>
      </section>

    </div>
  );
}
