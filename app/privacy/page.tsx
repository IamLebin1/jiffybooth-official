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
    { cache: 'no-store' } // Ensures your team sees updates immediately
  );

  // Guard clause if the document hasn't been created in Sanity yet
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Please create a "Legal Page" in Sanity with the slug "privacy-policy".
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white font-inter text-[#1c2431] pb-40">
      
      {/* --- HEADER SECTION --- */}
      <section className="bg-[#2c343f] pt-48 pb-24 px-6 text-center">
        <h1 className="text-white text-5xl md:text-7xl font-bold tracking-tighter uppercase">
          {data.title}
        </h1>
        <div className="w-20 h-1 bg-[#5a87b3] mx-auto mt-6 rounded-full" />
      </section>

      {/* --- CONTENT SECTION --- */}
      <section className="max-w-4xl mx-auto py-24 px-6 space-y-16">
        <p className="text-gray-500 text-lg md:text-xl leading-relaxed italic">
          Last Updated: {data.lastUpdated || 'January 2026'}. Your privacy is important to us. This policy outlines how Jiffy Booth Entertainment handles your data and event media.
        </p>

        <div className="space-y-12">
          {data.sections?.map((item: any, index: number) => (
            <div key={index} className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">
                {index + 1}. {item.heading}
              </h2>
              {/* whitespace-pre-wrap ensures line breaks from Sanity are preserved */}
              <p className="text-gray-600 text-lg leading-relaxed border-l-4 border-gray-100 pl-6 whitespace-pre-wrap font-light">
                {item.content}
              </p>
            </div>
          ))}
        </div>

        {/* --- CONTACT FOOTER --- */}
        <div className="pt-12 border-t border-gray-100 text-center">
          <p className="text-gray-400">
            For any questions regarding this policy, please contact us at <br />
            <span className="text-[#1c2431] font-bold">hello@jiffybooth.com</span>
          </p>
        </div>
      </section>

    </main>
  );
}