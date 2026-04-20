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
      <section className="max-w-6xl mx-auto pt-8 md:pt-28 pb-48 md:pb-56 px-6 sm:px-8 md:px-10 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">
        
        {/* Text Content */}
        <div className="flex-1 space-y-8 text-left z-10 max-w-md lg:max-w-lg">
          <h2 className="section-title leading-[1.1] md:leading-[0.9]">
            {/* FIXED: Using 'pageTitle' from your schema */}
            {sanityTeam.pageTitle || "The Team Behind Your Favorite Memories"}
          </h2>
          <p className="text-gray-500 leading-relaxed 
                        text-base md:text-lg lg:text-[clamp(16px,1.2vw,20px)]">
            {/* FIXED: Using 'description' from your schema */}
            {sanityTeam.description || "We believe that capturing the little moments are the most important part of any event."}
          </p>
        </div>

        {/* --- DYNAMIC PHOTO FAN --- */}
        <div className="flex-1 relative h-[240px] sm:h-[300px] lg:h-[380px] w-full flex justify-center items-center mt-12 md:mt-6 lg:mt-0">
          
          {/* Photo Strip 1 (Back/Left) */}
          <div className="absolute z-10 transform -rotate-[15deg] -translate-x-[22%] sm:-translate-x-[26%] translate-y-2 shadow-2xl transition-all hover:scale-105 duration-500 hover:z-50">
            <div className="w-[60px] sm:w-[85px] md:w-[110px] lg:w-[130px]">
              <Image 
                src={sanityTeam.photoStrip1 ? urlFor(sanityTeam.photoStrip1).url() : defaultStrip} 
                alt="Memory Strip 1" 
                width={170} 
                height={425} 
                className="rounded-sm shadow-xl" 
              />
            </div>
          </div>
          
          {/* Photo Strip 2 (Middle/Center) */}
          <div className="absolute z-20 transform -rotate-[3deg] translate-x-0 -translate-y-4 shadow-2xl transition-all hover:scale-110 duration-500 hover:z-50">
            <div className="w-[68px] sm:w-[95px] md:w-[125px] lg:w-[150px]">
              <Image 
                src={sanityTeam.photoStrip2 ? urlFor(sanityTeam.photoStrip2).url() : defaultStrip} 
                alt="Memory Strip 2" 
                width={150} 
                height={375}
                className="rounded-sm shadow-2xl" 
              />
            </div>
          </div>

          {/* Photo Strip 3 (Front/Right) */}
          <div className="absolute z-30 transform rotate-[12deg] translate-x-[22%] sm:translate-x-[26%] translate-y-3 shadow-2xl transition-all hover:scale-105 duration-500 hover:z-50">
            <div className="w-[60px] sm:w-[85px] md:w-[110px] lg:w-[130px]">
              <Image 
                src={sanityTeam.photoStrip3 ? urlFor(sanityTeam.photoStrip3).url() : defaultStrip} 
                alt="Memory Strip 3" 
                width={130} 
                height={325}
                className="rounded-sm shadow-xl" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. JIFFY TEAM BIO SECTION --- */}
      <section className="border-t border-[#eadfce] bg-white">
        <div className="max-w-3xl mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="text-center space-y-8">


            

            <div className="space-y-4 text-left text-black text-[15px] md:text-base leading-[1.5]">
              <p>
                {sanityTeam.description || "We believe that capturing the little moments are the most important part of any event."}
              </p>
              <p>
                {sanityTeam.teamBio || "All our events will be accompanied by two professional onsite attendants."}
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>

            <div className="overflow-hidden rounded-[2rem]">
              <Image
                src={sanityTeam.teamPhoto ? urlFor(sanityTeam.teamPhoto).url() : defaultTeamPhoto}
                alt="Jiffy Team"
                width={1200}
                height={800}
                className="h-auto w-full object-cover"
              />
            </div>
            

            <div className="pt-6 text-left space-y-4">
              <h4 className="section-title">
                Our Mission
              </h4>
              <p className="text-black text-[15px] md:text-base leading-[1.5]">
                At Jiffy Booth, our mission is to create photo booth experiences that feel polished, welcoming, and enjoyable for every celebration.
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}