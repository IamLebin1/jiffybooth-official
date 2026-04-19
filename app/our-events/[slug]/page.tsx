import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eventTypes } from "../eventData";
import { ArrowLeft } from "lucide-react";

// Next.js 15+ requires params to be a Promise
type Params = { params: Promise<{ slug: string }> };

export default async function EventDetailPage({ params }: Params) {
  // Safely unwrap the params promise to fix your previous error
  const resolvedParams = await params;
  const event = eventTypes.find((item) => item.slug === resolvedParams.slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white font-inter flex flex-col">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 md:pt-40 md:pb-24 bg-jiffy-dark text-white overflow-hidden">
        {/* Blurred Background Image */}
        <div className="absolute inset-0 opacity-20">
          <Image 
            src={event.image} 
            alt={event.title} 
            fill 
            className="object-cover blur-sm" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-jiffy-dark via-jiffy-dark/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <Link 
            href="/our-events" 
            className="inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-widest text-gray-300 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>
          
          <p className="text-orange-300 uppercase tracking-[0.3em] text-xs md:text-sm font-bold mb-4">
            {event.category}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6">
            {event.title}
          </h1>
          <p className="text-gray-300 text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
            {event.description}
          </p>
        </div>
      </section>

      {/* --- GALLERY GRID SECTION --- */}
      <section className="py-20 px-6 md:py-32 bg-slate-50 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {event.gallery.map((imgSrc, index) => (
              <div 
                key={index} 
                className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 bg-stone-200"
              >
                <Image 
                  src={imgSrc} 
                  alt={`${event.title} gallery image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                {/* Subtle dark overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="py-24 text-center bg-white border-t border-gray-100 px-6">
        <h2 className="text-jiffy-dark font-inter font-bold tracking-tight text-3xl md:text-5xl mb-10">
          Ready to create memories?
        </h2>
        <Link 
          href="/contact-us" 
          className="inline-block bg-[#9b5744] text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          Book This Booth
        </Link>
      </section>
    </div>
  );
}