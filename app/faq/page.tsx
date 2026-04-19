'use client';

import { useEffect, useState } from "react";
import { createClient } from "next-sanity";

const client = createClient({
  projectId: "g8867hcl", 
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

export default function FAQPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

  const faqs = data?.faqs || [];

  if (loading) return <div className="min-h-screen bg-[#f5ebe1]" />;

  return (
    <main className="min-h-screen flex flex-col bg-[#f5ebe1] text-[#212121] overflow-x-hidden">
      <section className="max-w-7xl w-full mx-auto px-6 md:px-10 lg:px-12 pt-20 md:pt-24 pb-10 md:pb-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-none mb-7">
            {data?.title || "Frequently Asked Questions"}
          </h1>
          <hr className="w-full max-w-3xl mx-auto border-[#e3dbd0]" />
        </div>
      </section>

      <section className="max-w-7xl w-full mx-auto px-6 md:px-10 lg:px-12 pb-16 md:pb-20">
        {data?.subtitle && (
          <p className="text-center text-sm md:text-base text-[#6f685a] max-w-3xl mx-auto mb-10 md:mb-12">
            {data.subtitle}
          </p>
        )}

        <div className="max-w-6xl mx-auto">
          <h2 className="text-[#212121] uppercase text-xl md:text-2xl tracking-wide font-bold mb-6 md:mb-8">
            General
          </h2>

          <div className="border-t border-b border-[#e3dbd0] bg-transparent">
            {faqs.map((faq: any, faqIndex: number) => {
              const isOpen = openIndex === faqIndex;

              return (
                <div
                  key={`${faq.question}-${faqIndex}`}
                  className={faqIndex !== faqs.length - 1 ? 'border-b border-[#e3dbd0]' : ''}
                >
                  <button
                    type="button"
                    className="w-full text-left py-5 md:py-6 flex items-start justify-between gap-6"
                    onClick={() => setOpenIndex(isOpen ? null : faqIndex)}
                    aria-expanded={isOpen}
                  >
                    <span className="text-lg md:text-2xl font-semibold tracking-tight leading-snug pr-2">
                      {faq.question}
                    </span>
                    <span className="text-2xl md:text-3xl leading-none text-[#212121] flex-shrink-0 mt-0.5">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  <div
                    className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="min-h-0">
                      <div className="pb-5 md:pb-7 pr-2">
                        <p className="text-[#3d3a35] text-sm md:text-lg leading-relaxed whitespace-pre-line max-w-5xl">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {faqs.length === 0 && (
          <div className="text-center py-16 text-[#6f685a]">
            No FAQs yet. Add questions in Sanity to show them here.
          </div>
        )}
      </section>

      <section className="mt-auto py-16 md:py-20 text-center px-6 border-t border-[#e3dbd0] bg-[#f5ebe1]">
        <h2 className="text-[#212121] font-bold tracking-tight text-4xl md:text-5xl mb-10">
          Still Have Questions?
        </h2>
        <a
          href="https://wa.me/60172082266"
          className="inline-block text-white px-14 md:px-16 py-5 md:py-6 rounded-full font-bold uppercase tracking-[0.12em] shadow-xl hover:brightness-95 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          style={{ backgroundColor: '#9b5744' }}
        >
          WhatsApp Us
        </a>
      </section>
    </main>
  );
}