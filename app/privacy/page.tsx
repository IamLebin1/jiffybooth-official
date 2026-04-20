import { client } from '@/sanity/lib/client';
import React from 'react';

export default async function PrivacyPolicy() {
  // Fetch data for the specific document with slug "privacy-policy"
  const data = await client.fetch(
    `*[_type == "legalPage" && slug.current == "privacy-policy"][0] {
      title,
      lastUpdated,
      sections[] {
        heading,
        content
      }
    }`,
    {},
    { cache: 'no-store' }
  );

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-inter">
        Please create a "Legal Page" in Sanity with the slug "privacy-policy".
      </div>
    );
  }

return (
    <main className="min-h-screen bg-white font-inter text-[#1c2431] pb-0">
      
      {/* --- HEADER SECTION --- */}
      <section className="bg-[#2c343f] pt-10 pb-10 px-6 text-center">
        <h1 className="section-title text-white italic">
          {data.title}
        </h1>
        <div className="w-24 h-1.5 bg-[#5a87b3] mx-auto mt-8 opacity-50 rounded-full" />
      </section>

      {/* --- CONTENT SECTION --- */}
      <section className="max-w-4xl mx-auto pt-12 pb-2 px-6 space-y-12">
        <div className="space-y-4">
          <p className="text-gray-500 text-lg md:text-xl leading-relaxed italic opacity-80">
            Last Updated: {data.lastUpdated || 'January 2026'}
          </p>
          <p className="text-gray-600 text-lg leading-relaxed font-light">
            Your privacy is important to us. This policy outlines how Jiffy Booth Entertainment handles your data and event media.
          </p>
        </div>

        <div className="space-y-12">
          {data.sections?.map((item: any, index: number) => (
            <div key={index} className="space-y-6">
              <h2 className="section-title text-[#1c2431]">
                {index + 1}. {item.heading}
              </h2>
              <p className="text-gray-500 text-lg md:text-xl leading-relaxed border-l-[6px] border-gray-100 pl-8 whitespace-pre-wrap font-light">
                {item.content}
              </p>
            </div>
          ))}
        </div>

        {/* --- CONTACT FOOTER --- */}
        <div className="pt-6 mb-10 md:mb-0 border-t border-gray-100 text-center space-y-4">
          <p className="text-gray-400 text-lg uppercase tracking-widest font-bold">Questions?</p>
          <p className="text-[#1c2431] text-2xl font-bold underline decoration-[#5a87b3] decoration-4 underline-offset-8">
            hello@jiffybooth.com
          </p>
        </div>
      </section>

    </main>
  );
}