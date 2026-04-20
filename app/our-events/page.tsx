'use client';

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
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
    <main className="min-h-screen bg-white text-slate-900 font-inter">
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-orange-500 mb-4">Discover Your Event Dream Team</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Discover Your Event Dream Team</h1>
          <p className="mt-4 text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Looking for top event professionals? Browse curated event types with the best planning, design, and execution support.
          </p>

          <div className="mt-10 flex items-center justify-center">
            <div className="relative w-full max-w-xl">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search event types"
                className="w-full rounded-full border border-gray-200 bg-white py-4 pl-14 pr-6 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <Link
                key={event.slug}
                href={`/our-events/${event.slug}`}
                className="group overflow-hidden rounded-[2rem] shadow-xl border border-gray-100 bg-white transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative h-72 overflow-hidden bg-gray-100">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="px-6 py-6">
                  <p className="text-sm uppercase tracking-[0.35em] text-orange-500 mb-3">{event.category}</p>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-3">{event.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{event.description}</p>
                </div>
              </Link>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="mt-12 rounded-[2rem] border border-gray-200 bg-white p-10 text-center text-gray-500">
              No event types found. Try another search term.
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-6 max-w-7xl mx-auto text-center">
        <Link
          href="/our-services"
          className="inline-flex items-center justify-center rounded-full bg-orange-500 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-xl transition hover:bg-orange-600"
        >
          View Our Services
        </Link>
      </section>
    </main>
  );
}
