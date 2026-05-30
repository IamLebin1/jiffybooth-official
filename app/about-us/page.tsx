"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

type AboutUsDocument = {
  pageTitle?: string;
  description?: string;
  teamBio?: string;
  photoStrip1?: unknown;
  photoStrip2?: unknown;
  photoStrip3?: unknown;
  teamPhoto?: unknown;
};

export default function AboutPage() {
  const [sanityTeam, setSanityTeam] = useState<AboutUsDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const data = await client.fetch(`*[_type == "aboutUs"][0]`, {}, { cache: 'no-store' });
        setSanityTeam(data);
      } catch (error) {
        console.error("Error fetching Sanity data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, []);

  const defaultStrip = "/template2.png";
  const defaultTeamPhoto = "/Hero.png";

  if (loading) return <div className="min-h-screen bg-white" />;
  if (!sanityTeam) return <div className="min-h-screen bg-white" />;

  return (
    <main className="min-h-screen bg-white font-inter overflow-x-hidden">

      {/* --- 1. THE TEAM BEHIND SECTION --- */}
      <section className="pt-8 md:pt-28 pb-20 sm:pb-28 md:pb-56 px-6 sm:px-8 md:px-10">

        {/* MOBILE VIEW — untouched */}
        <div className="md:hidden px-0">
          <div className="float-right ml-0 mb-2 relative h-[294px] w-[52vw] max-w-[212px] min-w-[160px] translate-x-16 sm:translate-x-20">
            <div className="absolute z-10 transform -rotate-[15deg] -translate-x-[10%] translate-y-2 shadow-2xl">
              <div className="w-[88px]">
                <Image
                  src={sanityTeam.photoStrip1 ? urlFor(sanityTeam.photoStrip1).url() : defaultStrip}
                  alt="Memory Strip 1"
                  width={170}
                  height={425}
                  className="rounded-sm shadow-xl"
                />
              </div>
            </div>
            <div className="absolute z-20 transform -rotate-[3deg] translate-x-[6%] -translate-y-1 shadow-2xl">
              <div className="w-[88px]">
                <Image
                  src={sanityTeam.photoStrip2 ? urlFor(sanityTeam.photoStrip2).url() : defaultStrip}
                  alt="Memory Strip 2"
                  width={150}
                  height={375}
                  className="rounded-sm shadow-2xl"
                />
              </div>
            </div>
            <div className="absolute z-30 transform rotate-[12deg] translate-x-[32%] translate-y-4 shadow-2xl">
              <div className="w-[88px]">
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

          <h2 className="max-w-[11rem] text-[#1c2431] font-bold leading-[0.93] tracking-tighter text-[clamp(2.4rem,9vw,3.6rem)] pr-0">
            {sanityTeam.pageTitle || "The Team Behind Your Favorite Memories"}
          </h2>
          <p className="mt-3 max-w-[15rem] pr-0 text-gray-500 leading-relaxed text-sm">
            {sanityTeam.description || "We believe that capturing the little moments are the most important part of any event."}
          </p>
        </div>

        {/* DESKTOP VIEW — truly centered */}
        <div className="hidden md:flex items-center justify-center gap-14 w-full">

          {/* Left: Title + Description — fixed width to match strip cluster */}
          <div className="flex flex-col gap-8 w-[420px] lg:w-[500px]">
            <h2 className="text-[#1c2431] font-bold leading-[0.9] tracking-tighter text-[clamp(48px,6vw,96px)]">
              {sanityTeam.pageTitle || "The Team Behind Your Favorite Memories"}
            </h2>
            <p className="text-gray-500 leading-relaxed text-base md:text-lg lg:text-[clamp(16px,1.2vw,20px)]">
              {sanityTeam.description || "We believe that capturing the little moments are the most important part of any event."}
            </p>
          </div>

          {/* Right: Photo Strips — fixed width matching left */}
          <div className="relative h-[240px] sm:h-[300px] lg:h-[380px] w-[420px] lg:w-[500px] flex-shrink-0">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[300px] lg:w-[360px] h-full">

                <div className="absolute z-10 transform -rotate-[15deg] left-0 top-2 shadow-2xl transition-all hover:scale-105 duration-500 hover:z-50">
                  <div className="w-[100px] md:w-[110px] lg:w-[130px]">
                    <Image
                      src={sanityTeam.photoStrip1 ? urlFor(sanityTeam.photoStrip1).url() : defaultStrip}
                      alt="Memory Strip 1"
                      width={170}
                      height={425}
                      className="rounded-sm shadow-xl"
                    />
                  </div>
                </div>

                <div className="absolute z-20 transform -rotate-[3deg] left-[50%] -translate-x-1/2 -top-4 shadow-2xl transition-all hover:scale-110 duration-500 hover:z-50">
                  <div className="w-[115px] md:w-[125px] lg:w-[150px]">
                    <Image
                      src={sanityTeam.photoStrip2 ? urlFor(sanityTeam.photoStrip2).url() : defaultStrip}
                      alt="Memory Strip 2"
                      width={150}
                      height={375}
                      className="rounded-sm shadow-2xl"
                    />
                  </div>
                </div>

                <div className="absolute z-30 transform rotate-[12deg] right-0 top-3 shadow-2xl transition-all hover:scale-105 duration-500 hover:z-50">
                  <div className="w-[100px] md:w-[110px] lg:w-[130px]">
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
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. JIFFY TEAM BIO SECTION --- */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 md:px-8 pt-2 md:pt-6 pb-10 md:pb-12">
          <div className="text-center space-y-2">
            <div className="space-y-4 text-left text-black text-[17px] md:text-lg leading-[1.7]">
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

            <div className="overflow-hidden rounded-[2rem] py-6 md:py-10">
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
              <p className="text-black text-[17px] md:text-lg leading-[1.7]">
                At Jiffy Booth, our mission is to create photo booth experiences that feel polished, welcoming, and enjoyable for every celebration.
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
