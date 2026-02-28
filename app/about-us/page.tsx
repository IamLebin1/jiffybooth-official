'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "next-sanity";
import imageUrlBuilder from '@sanity/image-url';

// --- 1. SANITY CLIENT CONFIGURATION ---
const client = createClient({
  projectId: "g8867hcl", 
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true, // Set to false for "live" updates
});

// --- 2. IMAGE URL BUILDER ---
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export default function AboutPage() {
  const [sanityTeam, setSanityTeam] = useState<any>(null);

  useEffect(() => {
    async function fetchTeam() {
      try {
        // Fetch the aboutUs document and force fresh data
        const data = await client.fetch(
          `*[_type == "aboutUs"][0]`,
          {},
          { cache: 'no-store' } 
        );
        setSanityTeam(data);
      } catch (error) {
        console.error("Error fetching Sanity data:", error);
      }
    }
    fetchTeam();
  }, []);

  // Fallback Placeholders
  const defaultStrip = "/template2.png"; 
  const defaultTeamPhoto = "/Hero.png";

  // Prevent crash if data hasn't loaded yet
  if (!sanityTeam) return <div className="min-h-screen bg-white" />;

  return (
    <main className="min-h-screen bg-white font-inter overflow-x-hidden">

      {/* --- 1. THE TEAM BEHIND SECTION --- */}
      <section className="max-w-7xl mx-auto pt-8 md:pt-32 pb-60 px-8 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Text Content */}
        <div className="flex-1 space-y-8 text-center lg:text-left z-10">
          <h2 className="text-[#1c2431] font-bold leading-[1.1] md:leading-[0.9] tracking-tighter 
                         text-4xl sm:text-5xl md:text-[clamp(48px,6vw,96px)]">
            {/* FIXED: Using 'pageTitle' from your schema */}
            {sanityTeam.pageTitle || "The Team Behind Your Favorite Memories"}
          </h2>
          <p className="text-gray-500 leading-relaxed max-w-2xl mx-auto lg:mx-0 
                        text-base md:text-lg lg:text-[clamp(16px,1.2vw,20px)]">
            {/* FIXED: Using 'description' from your schema */}
            {sanityTeam.description || "We believe that capturing the little moments are the most important part of any event."}
          </p>
        </div>

        {/* --- DYNAMIC PHOTO FAN --- */}
        <div className="flex-1 relative h-[400px] sm:h-[500px] lg:h-[600px] w-full flex justify-center items-center mt-40 md:mt-24 lg:mt-10">
          
          {/* Photo Strip 1 (Back/Left) */}
          <div className="absolute z-10 transform -rotate-[15deg] -translate-x-[25%] sm:-translate-x-[30%] translate-y-4 shadow-2xl transition-all hover:scale-105 duration-500 hover:z-50">
            <div className="w-[100px] sm:w-[140px] md:w-[180px] lg:w-[220px]">
              <Image 
                src={sanityTeam.photoStrip1 ? urlFor(sanityTeam.photoStrip1).url() : defaultStrip} 
                alt="Memory Strip 1" 
                width={220} 
                height={550} 
                className="rounded-sm shadow-xl" 
              />
            </div>
          </div>
          
          {/* Photo Strip 2 (Middle/Center) */}
          <div className="absolute z-20 transform -rotate-[3deg] translate-x-0 -translate-y-6 shadow-2xl transition-all hover:scale-110 duration-500 hover:z-50">
            <div className="w-[110px] sm:w-[150px] md:w-[200px] lg:w-[240px]">
              <Image 
                src={sanityTeam.photoStrip2 ? urlFor(sanityTeam.photoStrip2).url() : defaultStrip} 
                alt="Memory Strip 2" 
                width={240} 
                height={600} 
                className="rounded-sm shadow-2xl" 
              />
            </div>
          </div>

          {/* Photo Strip 3 (Front/Right) */}
          <div className="absolute z-30 transform rotate-[12deg] translate-x-[25%] sm:translate-x-[30%] translate-y-8 shadow-2xl transition-all hover:scale-105 duration-500 hover:z-50">
            <div className="w-[100px] sm:w-[140px] md:w-[180px] lg:w-[220px]">
              <Image 
                src={sanityTeam.photoStrip3 ? urlFor(sanityTeam.photoStrip3).url() : defaultStrip} 
                alt="Memory Strip 3" 
                width={220} 
                height={550} 
                className="rounded-sm shadow-xl" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. JIFFY TEAM BIO SECTION --- */}
      <section className="max-w-7xl mx-auto pt-20 md:pt-40 pb-24 md:pb-40 px-6 flex flex-col md:flex-row items-center gap-16 md:gap-24 border-t border-gray-100">
        
        {/* Dynamic Team Image */}
        <div className="flex-1 w-full order-2 md:order-1 flex justify-center md:justify-end">
          <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl border-[8px] md:border-[12px] border-white max-w-[350px]">
            <Image 
              src={sanityTeam.teamPhoto ? urlFor(sanityTeam.teamPhoto).url() : defaultTeamPhoto} 
              alt="Jiffy Team" 
              width={800} 
              height={600} 
              className="w-full h-auto transform transition-transform duration-1000 group-hover:scale-110" 
            />
          </div>
        </div>

        {/* Dynamic Team Name & Bio */}
        <div className="flex-1 space-y-8 text-center md:text-left order-1 md:order-2">
          <h3 className="text-[#1c2431] font-bold tracking-tighter text-4xl md:text-[clamp(32px,5vw,72px)]">
            {sanityTeam.teamName || "Jiffy Team"}
          </h3>
          <p className="text-gray-500 leading-relaxed max-w-md mx-auto md:mx-0 font-medium italic 
                        text-lg md:text-[clamp(18px,1.5vw,24px)]">
            {/* FIXED: Using 'teamBio' from your schema */}
            “{sanityTeam.teamBio || "All our events will be accompanied by two professional onsite attendants."}”
          </p>
          <div className="w-16 h-1 bg-[#1c2431] mx-auto md:mx-0 rounded-full opacity-20" />
        </div>
      </section>

      {/* --- 3. CALL TO ACTION SECTION --- */}
      <section className="py-32 text-center px-6">
        <h2 className="text-[#1c2431] font-bold mb-12 tracking-tighter text-4xl md:text-[clamp(32px,4.5vw,60px)]">
          Let's build a memory.
        </h2>
        <a 
          href="/contact-us" 
          className="inline-block bg-[#1c2431] text-white px-16 py-6 rounded-full font-bold uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          Work with Us
        </a>
      </section>

    </main>
  );
}