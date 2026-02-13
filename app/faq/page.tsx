'use client';

import { useEffect, useState } from "react";
import { createClient } from "next-sanity";

const client = createClient({
  projectId: "g8867hcl", 
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

export default function FAQPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await client.fetch(`*[_type == "faqPage"][0]`);
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen bg-white" />;

  return (
    /* 1. Added flex and flex-col to allow the content to push the CTA down */
    <main className="min-h-screen flex flex-col bg-white font-inter overflow-x-hidden">
      
      {/* --- COMPACT HEADER --- */}
      <section className="bg-[#2c343f] py-8 md:py-10 px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-tight">
              {data?.title || "FAQ"}
            </h1>
            <div className="h-1 w-12 bg-blue-400 mt-1 rounded-full hidden md:block"></div>
          </div>
          <p className="text-gray-400 text-sm md:text-base max-w-md md:text-right font-light">
            {data?.subtitle || "Everything you need to know about booking Jiffy Booth."}
          </p>
        </div>
      </section>

      {/* --- DYNAMIC FAQ GRID --- */}
      <section className="max-w-6xl mx-auto py-12 md:py-16 px-6 sm:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
          {(data?.faqs || []).map((faq: any, index: number) => (
            <div 
              key={index} 
              className={`py-4 md:px-8 space-y-4 md:space-y-6 ${
                index !== 0 ? 'md:border-l border-gray-100' : ''
              }`}
            >
              <h2 className="text-[#1c2431] text-xl md:text-2xl font-extrabold leading-tight tracking-tighter uppercase">
                {faq.question}
              </h2>
              <div className="h-px w-full bg-gray-50 md:hidden"></div>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed font-light">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER CTA (Still have questions?) --- */}
      {/* 2. Added mt-auto to force this section to the bottom and border-t for a clean separation */}
      <section className="mt-auto bg-gray-50 py-10 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto text-center flex flex-col sm:flex-row items-center justify-between gap-6">
          <h2 className="text-xl font-bold text-[#1c2431]">Still have questions?</h2>
          <a 
            href="https://wa.me/60172082266" 
            className="bg-[#25D366] text-white px-10 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform"
          >
            WhatsApp Us
          </a>
        </div>
      </section>
    </main>
  );
}