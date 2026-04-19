// main landing page 

'use client'; 

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
// @ts-ignore - Bypasses type declaration error for Glide.js in Vercel production build
import Glide from "@glidejs/glide";
import { createClient } from "next-sanity";
import imageUrlBuilder from '@sanity/image-url';
import Link from 'next/link';
// Added Star icon for the reviews
import { User, Star, ShieldCheck, Heart, Calendar, Sparkles } from "lucide-react"; 

// Glide Styles
import "@glidejs/glide/dist/css/glide.core.min.css"; 

// --- 1. SANITY CLIENT CONFIGURATION ---
const client = createClient({
  projectId: "g8867hcl", 
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}


export default function Home() {
  const glideRef = useRef(null);
  const testimonialsRowRef = useRef<HTMLDivElement | null>(null);
  const [pageData, setPageData] = useState<any>(null);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [eventsData, setEventsData] = useState<any[]>([]);
  const [testimonialsCanScroll, setTestimonialsCanScroll] = useState(false);

  // --- 1. DATA FETCHING ---
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch main page content and booth services for the services grid
        const data = await client.fetch(
          `{
            "mainPage": *[_type == "mainPage"] | order(_updatedAt desc)[0] {
              ...,
              "heroVideoUrl": heroBackgroundVideo.asset->url,
              "brands": brands[] {
                name,
                "logo": logo.asset->url
              }
            },
            "services": *[_type == "ourServices"] | order(order asc) {
              title,
              description,
              "slug": slug.current,
              "image": image.asset->url
            },
            "events": *[_type == "ourEvents"] | order(_createdAt asc) {
              title,
              category,
              description,
              "slug": slug.current,
              "image": image.asset->url
            }
          }`, 
          {}, 
          { 
            next: { revalidate: 0 },
            cache: 'no-store' 
          }
        );
        setPageData(data?.mainPage || null);
        setServicesData(data?.services || []);
        setEventsData(data?.events || []);
      } catch (error) {
        console.error("Error fetching Sanity data:", error);
      }
    }
    fetchData();
  }, []);

  // --- 2. TEMPLATES SLIDER INITIALIZATION ---
  // FIXED: Ensured this is a top-level hook to fix the Runtime Error
  useEffect(() => {
    if (glideRef.current && pageData?.templates?.length > 0) {
      const glide = new Glide(glideRef.current, {
        type: 'carousel',
        startAt: 0,
        focusAt: 'center',
        perView: 3,
        gap: 120, 
        autoplay: false, 
        animationDuration: 500, 
        animationTimingFunc: 'cubic-bezier(0.165, 0.84, 0.44, 1)', 
        breakpoints: {
          1024: { perView: 2, gap: 180 }, 
          768: { perView: 1, gap: 20 }
        }
      });

      let moveDirection = '>'; 
      let autoplayTimer: NodeJS.Timeout;

      
      const startCustomAutoplay = () => {
        clearInterval(autoplayTimer);
        autoplayTimer = setInterval(() => {
          
          glide.go(moveDirection); 
        }, 4000); 
      };

      
      glide.on('run.before', (move: any) => {
        if (move.direction === '<' || move.direction === '>') {
          moveDirection = move.direction; 
          startCustomAutoplay(); 
        }
      });

      glide.mount();
      startCustomAutoplay(); 
      
      const handleResize = () => glide.update();
      window.addEventListener('resize', handleResize);
      
      return () => {
        clearInterval(autoplayTimer);
        glide.destroy();
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [pageData]);

  useEffect(() => {
    const updateTestimonialsScrollState = () => {
      const row = testimonialsRowRef.current;
      if (!row) return;
      setTestimonialsCanScroll(row.scrollWidth > row.clientWidth + 1);
    };

    const raf = requestAnimationFrame(updateTestimonialsScrollState);
    window.addEventListener('resize', updateTestimonialsScrollState);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updateTestimonialsScrollState);
    };
  }, [pageData?.testimonials?.length]);

  if (!pageData) return <div className="min-h-screen bg-white" />;

  // Derive the brands list: fall back to an empty array if none are set in Sanity
  const brands = pageData.brands && pageData.brands.length > 0 ? pageData.brands : [];
  const services = servicesData && servicesData.length > 0 ? servicesData : [];

  return (
    <main className="min-h-screen bg-white font-inter overflow-x-hidden">
      
        {/* --- HERO SECTION: DYNAMIC BACKGROUND --- */}
        <section className="relative w-full min-h-[80vh] md:min-h-screen flex items-center bg-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            {pageData.heroBackgroundType === 'video' && pageData.heroVideoUrl ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-15"
              >
                <source src={pageData.heroVideoUrl} type="video/mp4" />
              </video>
            ) : (
              <Image 
                src={pageData.heroBackgroundImage ? urlFor(pageData.heroBackgroundImage).url() : "/hero-background.jpg"} 
                alt="Hero Background"
                fill
                className="object-cover opacity-10" 
                priority
              />
            )}
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full px-6 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">
            
            <div className="flex flex-col items-center text-center order-1 md:order-2">
              <div className="flex -mb-2 justify-center w-full">
                <Image 

                  src={pageData?.heroLogo ? urlFor(pageData.heroLogo).url() : "/jiffy-logo.png"} 
                  alt="Jiffy Logo"
                  width={300}
                  height={150}
                  className="hidden md:block h-auto w-24 md:w-40 object-contain"
                />
              </div>
              
              <h1 className="text-jiffy-dark font-bold leading-[0.7] tracking-tighter text-5xl md:text-[clamp(60px,8vw,120px)] ">
                {pageData?.heroTitle || ""}
              </h1>
              
              <p className="text-jiffy-dark mt-6 font-light tracking-widest max-w-md text-base md:text-[clamp(18px,1.5vw,20px)] ">
                {pageData?.heroBio || ""}
              </p>

              <Link
                href="/contact-us#contact-form"
                className="inline-block mt-8 px-10 py-4 rounded-full font-bold uppercase tracking-widest text-white shadow-2xl hover:scale-105 active:scale-95 transition-all"
                style={{ backgroundColor: '#9b5744' }}
              >
                Ask Us
              </Link>
            </div>

          </div>
        </section>

      {/* --- SERVICE GRID SECTION --- */}
      {services.length > 0 && (
        <section className="bg-[#b9b2a6] py-16 md:py-24 px-6 scroll-mt-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
              <p className="text-jiffy-dark/70 uppercase tracking-[0.35em] text-xs md:text-sm mb-4">Our Services</p>
              <h2 className="font-inter font-bold text-jiffy-dark text-3xl md:text-5xl lg:text-6xl leading-tight">
                A Booth for All Occasions
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-10">
              {services.map((service: any, index: number) => {
                const slug = service?.slug || `service-${index + 1}`;

                return (
                  <Link
                    key={index}
                    href={`/services/${slug}`}
                    className="group block text-jiffy-dark"
                  >
                    <article className="space-y-4 h-full">
                      <div className="overflow-hidden rounded-[2rem] transition-transform duration-500 group-hover:-translate-y-2">
                        {service.image ? (
                          <Image
                            src={service.image}
                            alt={service.title}
                            width={800}
                            height={1000}
                            className="h-[320px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-[320px] w-full bg-gradient-to-br from-[#f5ebe1] to-[#e7cfb4] flex items-center justify-center px-6 text-center border border-[#d9c0a3]">
                            <div>
                              <p className="text-jiffy-dark font-bold text-lg md:text-xl tracking-tight">
                                {service.title}
                              </p>
                              <p className="text-jiffy-dark/70 text-sm mt-2 uppercase tracking-[0.15em]">
                                Image Coming Soon
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="px-1">
                        <h3 className="font-inter italic text-xl md:text-2xl text-jiffy-dark mb-3">
                          {service.title}
                        </h3>
                        <p className="text-sm md:text-[15px] leading-relaxed text-jiffy-dark/85">
                          {service.description}
                        </p>
                        <div className="mt-5 inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-jiffy-dark">
                          Learn More
                          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* --- OUR EVENTS PREVIEW SECTION --- */}
      <section className="py-20 md:py-32 px-6 bg-white border-t border-[#ddd0be]">
        <div className="max-w-7xl mx-auto">
          {/* Centered Header to match the rest of the homepage */}
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <p className="text-jiffy-dark/70 uppercase tracking-[0.35em] text-xs md:text-sm mb-4">Our Events</p>
            <h2 className="font-inter font-bold text-jiffy-dark text-3xl md:text-5xl lg:text-6xl leading-tight">
              Moments Worth Capturing.
            </h2>
          </div>

          {/* 3-Column Grid for better visual rhythm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {eventsData.slice(0, 3).map((item: any) => (
              <Link 
                key={item.slug}
                href={`/our-events/${item.slug}`} 
                className="group relative block h-[450px] md:h-[500px] overflow-hidden rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="absolute inset-0 bg-stone-200">
                  <Image 
                    src={item.image} 
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-jiffy-dark/90 via-jiffy-dark/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />
                <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end text-white z-10">
                  <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <p className="text-[#e8dfd2] text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">{item.category}</p>
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{item.title}</h3>
                    <span className="inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">Explore <span className="text-orange-400">→</span></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-14 text-center">
            <Link href="/our-events" className="inline-flex items-center justify-center rounded-full bg-[#9b5744] px-10 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-xl transition-all hover:scale-105 active:scale-95">View All Events</Link>
          </div>
        </div>
      </section>

      {/* --- OUR TEMPLATES SECTION --- */}
      <section id="templates" className="w-full py-8 md:py-16 scroll-mt-24 bg-slate-50">
<div className="max-w-7xl mx-auto px-6 mb-6 md:mb-16 flex justify-center">          <h2 className="text-jiffy-dark font-bold text-center text-3xl md:text-[clamp(32px,4vw,48px)]">
            Our Templates
          </h2>
        </div>

        <div className="glide relative w-full overflow-visible py-2 md:py-16" ref={glideRef}>
          <div className="glide__track overflow-visible" data-glide-el="track">
            <ul className="glide__slides items-center min-h-[450px] md:min-h-[500px]">
              {pageData.templates?.map((item: any, index: number) => (
                <li key={index} className="glide__slide flex justify-center items-center px-4 md:px-0">
                  <div className="template-container transition-all duration-500">
                    {item.designImage && (
                      <img 
                        src={urlFor(item.designImage).url()} 
                        alt={item.title || `Template ${index}`}
                        className="template-img template-shadow rounded-sm"
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="glide__arrows" data-glide-el="controls">
  <button className="glide__arrow glide__arrow--left p-3 md:p-4 bg-jiffy-dark text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all" data-glide-dir="<">
    <svg className="w-4 h-4 md:w-7 md:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 18l-6-6 6-6"/></svg>
  </button>
  <button className="glide__arrow glide__arrow--right p-3 md:p-4 bg-jiffy-dark text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all" data-glide-dir=">">
    <svg className="w-4 h-4 md:w-7 md:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 18l6-6-6-6"/></svg>
  </button>
</div>

          <div className="glide__bullets flex justify-center items-center gap-3 mt-12" data-glide-el="controls[nav]">
            {pageData.templates?.map((_: any, index: number) => (
              <button
                key={index}
                className="glide__bullet focus:outline-none"
                data-glide-dir={`=${index}`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* --- USP SECTION --- */}
      <section className="bg-[#e8dfd2] py-16 md:py-24 border-y border-[#ddd0be]">
        <div className="w-full px-6 md:px-10 lg:px-16 xl:px-24">
          <h2 className="text-center text-jiffy-dark font-black uppercase tracking-tight text-3xl md:text-5xl mb-12 md:mb-16">
            Why Jiffy Booth
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 md:gap-y-12 lg:gap-x-10 xl:gap-x-14">
            <div className="text-center space-y-4">
              <div className="flex justify-center text-jiffy-dark">
                <ShieldCheck size={42} strokeWidth={2.2} />
              </div>
              <h3 className="text-jiffy-dark font-black uppercase text-2xl md:text-3xl tracking-tight whitespace-nowrap">
                Premium Quality
              </h3>
              <p className="text-jiffy-dark/85 text-base md:text-lg leading-relaxed max-w-xs mx-auto">
                Professional-grade booths with polished outputs your guests will want to keep.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="flex justify-center text-jiffy-dark">
                <Heart size={42} strokeWidth={2.2} />
              </div>
              <h3 className="text-jiffy-dark font-black uppercase text-2xl md:text-3xl tracking-tight">
                Loved by Guests
              </h3>
              <p className="text-jiffy-dark/85 text-base md:text-lg leading-relaxed max-w-xs mx-auto">
                Easy, fun experiences designed to create genuine smiles and memorable moments.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="flex justify-center text-jiffy-dark">
                <Calendar size={42} strokeWidth={2.2} />
              </div>
              <h3 className="text-jiffy-dark font-black uppercase text-2xl md:text-3xl tracking-tight">
                Reliable Setup
              </h3>
              <p className="text-jiffy-dark/85 text-base md:text-lg leading-relaxed max-w-xs mx-auto">
                On-time arrival, smooth coordination, and support from pre-event planning to wrap-up.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="flex justify-center text-jiffy-dark">
                <Sparkles size={42} strokeWidth={2.2} />
              </div>
              <h3 className="text-jiffy-dark font-black uppercase text-2xl md:text-3xl tracking-tight">
                Fresh Concepts
              </h3>
              <p className="text-jiffy-dark/85 text-base md:text-lg leading-relaxed max-w-xs mx-auto">
                Creative themes, custom templates, and modern booth styles tailored to your event.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION: PRESERVED CUSTOM SCROLLBAR --- */}
      {pageData.testimonials && pageData.testimonials.length > 0 && (
        <section className="bg-slate-50 py-24 md:py-32 overflow-hidden border-y border-gray-100">
          <div className="w-full px-6 md:px-10 lg:px-16 xl:px-24">
            <div className="text-center mb-16">
              <h2 className="text-jiffy-dark font-inter font-bold tracking-tight text-4xl md:text-5xl mb-4">What Our Clients Say</h2>
              <div className="h-1.5 w-24 bg-jiffy-dark mx-auto rounded-full opacity-20" />
            </div>

            <div
              ref={testimonialsRowRef}
              className={`overflow-x-auto testimonial-scroll pb-8 flex flex-row nowrap gap-6 ${testimonialsCanScroll ? 'justify-start' : 'justify-center'}`}
            >
              {pageData.testimonials.map((testimonial: any, i: number) => (
                <div key={i} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 flex flex-col justify-between flex-shrink-0 w-[280px] hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                  <div>
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating || 5 }).map((_, star) => (
                        <Star key={star} size={16} fill="#1F2937" className="text-jiffy-dark" />
                      ))}
                    </div>
                    <div className="testimonial-text-scroll overflow-y-auto mb-6 h-[100px]">
                      <p className="text-gray-600 text-sm italic">"{testimonial.text}"</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center border-2 border-stone-50 text-stone-400 flex-shrink-0">
                      <User size={20} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-jiffy-dark uppercase tracking-tight text-xs">{testimonial.name}</h4>
                      <p className="text-gray-400 text-[10px] uppercase tracking-widest">Verified Client</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- MARQUEE SECTION: LONGER LOOP RANGE --- */}
      <section className="bg-white py-20 md:py-32 border-y border-gray-100 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="mb-16">
            <h2 className="text-jiffy-dark font-bold tracking-tight text-4xl md:text-[clamp(36px,4vw,56px)] mb-4">
              Trusted By
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto font-light">
              Partnering with companies to create unforgettable memories
            </p>
          </div>
        </div>

        {/* Removed centered max-width container to allow full horizontal range */}
        {brands.length > 0 && (
          <div className="w-full overflow-hidden relative">
            <div className="flex gap-16 md:gap-32 animate-marquee-slow items-center">
              {/* LOOP INCREASED: Duplicate 10x to ensure screen is always filled and loop is long */}
              {[...brands, ...brands, ...brands, ...brands, ...brands, ...brands, ...brands, ...brands, ...brands, ...brands].map((brand: any, i: number) => (
                <div key={i} className="flex items-center justify-center shrink-0">
                  <img src={brand.logo} alt={brand.name} className="h-10 md:h-14 w-auto object-contain" />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="py-24 text-center">
        <h2 className="text-jiffy-dark font-inter font-bold tracking-tight text-4xl md:text-5xl mb-10">Ready to book?</h2>
        <Link href="/contact-us" className="inline-block bg-[#9b5744] text-white px-16 py-6 rounded-full font-bold uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">Book Now</Link>
      </section>

      <style jsx global>{`
        /* Template slider styles */
        .glide__slide {
          opacity: 0.35;
          transform: scale(0.85);
          transition: all 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);
          filter: blur(1px);
        }
        .glide__slide--active {
          opacity: 1 !important;
          transform: scale(1.08) !important;
          z-index: 10;
          filter: blur(0px);
        }
        .template-img {
          max-height: 450px;
          max-width: 80vw;
          width: auto;
          height: auto;
          object-fit: contain;
        }
        
        .template-shadow {
          box-shadow: -20px 0 25px -5px rgba(0, 0, 0, 0.1),
                      20px 0 25px -5px rgba(0, 0, 0, 0.1);
        }

        /* MODERN PILL DOTS STYLE */
        .glide__bullet {
          width: 12px;
          height: 12px;
          padding: 0;
          border-radius: 999px;
          background-color: #d1d5db;
          border: none;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .glide__bullet--active {
          width: 42px;
          background-color: #1F2937 !important;
        }
        .glide__bullet:hover { background-color: #9ca3af; }

        /* Desktop arrows: float over the slider */
.glide__arrows {
  pointer-events: none;
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5rem;
  z-index: 20;
}
.glide__arrows button {
  pointer-events: auto;
}

/* Mobile arrows: sit below the slide, centered */
@media (max-width: 768px) {
  .glide__arrows {
    position: relative;
    inset: auto;
    justify-content: center;
    gap: 1.5rem;
    padding: 0;
    margin-top: 1.5rem;
  }
}

        /* INFINITE MARQUEE Range Adjustment */
        @keyframes marquee { 
          from { transform: translateX(0); } 
          to { transform: translateX(-50%); } 
        }
        .animate-marquee-slow { 
          animation: marquee 40s linear infinite; 
          width: max-content; /* FIXED: Ensures range is calculated based on total items length */
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        /* Testimonial scrollbar styling preserved exactly from your code */
        .testimonial-scroll::-webkit-scrollbar { height: 4px; }
        .testimonial-scroll::-webkit-scrollbar-track { background: #e5e7eb; border-radius: 10px; margin: 0 25%; }
        .testimonial-scroll::-webkit-scrollbar-thumb { background: #1F2937; border-radius: 10px; }
        .testimonial-text-scroll::-webkit-scrollbar { width: 4px; }
        .testimonial-text-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }

        @media (max-width: 768px) {
          .template-img { 
            max-height: 400px;
            max-width: 90vw;
          }
          .glide__slide--active { transform: scale(1.05) !important; }
          .testimonial-scroll::-webkit-scrollbar-track { margin: 0 10%; }
        }
      `}</style>
    </main>
  );
}