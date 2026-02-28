import { client } from '@/sanity/lib/client';
import React from 'react';

export default async function TermsOfService() {
  // Fetch data for the specific document with slug "terms-of-service"
  const data = await client.fetch(
    `*[_type == "legalPage" && slug.current == "terms-of-service"][0] {
      title,
      lastUpdated,
      sections[] {
        heading,
        content
      }
    }`,
    {},
    { cache: 'no-store' } // Ensures your team sees Sanity updates immediately
  );

  // Guard clause if the document hasn't been created in Sanity Studio yet
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-inter">
        Please create a "Legal Page" in Sanity with the slug "terms-of-service".
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white font-inter text-[#1c2431] pb-10">
      
      {/* --- HEADER SECTION --- */}
      <section className="bg-[#2c343f] pt-10 pb-10 px-6 text-center">
        <h1 className="text-white text-5xl md:text-7xl font-bold tracking-tighter uppercase italic">
          {data.title}
        </h1>
        <div className="w-24 h-1.5 bg-[#5a87b3] mx-auto mt-8 opacity-50 rounded-full" />
      </section>

      {/* --- CONTENT SECTION --- */}
      <section className="max-w-4xl mx-auto pt-12 pb-2 px-6 space-y-4 md:space-y-12">
        <div className="space-y-4">
          <p className="text-gray-500 text-lg md:text-xl leading-relaxed italic opacity-80">
            Last Updated: {data.lastUpdated || 'January 2026'}
          </p>
          <p className="text-gray-600 text-lg leading-relaxed font-light">
            By confirming a booking with Jiffy Booth Entertainment, you agree to comply with and be bound by the following terms and conditions.
          </p>
        </div>

        <div className="space-y-12">
          {data.sections?.map((item: any, index: number) => (
            <div key={index} className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1c2431] uppercase">
                {item.heading}
              </h2>
              {/* whitespace-pre-wrap preserves formatting from the Sanity text area */}
              <p className="text-gray-500 text-lg md:text-xl leading-relaxed border-l-[6px] border-gray-100 pl-8 whitespace-pre-wrap font-light">
                {item.content}
              </p>
            </div>
          ))}
        </div>

        {/* --- CONTACT FOOTER --- */}
        <div className="pt-15 border-t border-gray-100 text-center space-y-4">
          <p className="text-gray-400 text-lg uppercase tracking-widest font-bold">Questions?</p>
          <p className="text-[#1c2431] text-2xl font-bold underline decoration-[#5a87b3] decoration-4 underline-offset-8">
            hello@jiffybooth.com
          </p>
        </div>
      </section>

    </main>
  );
}