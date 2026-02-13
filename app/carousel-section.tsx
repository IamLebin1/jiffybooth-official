'use client';

import { useEffect, useRef } from 'react';
// @ts-ignore - Bypasses type declaration error for Glide.js in Vercel production build
import Glide from '@glidejs/glide';
import imageUrlBuilder from '@sanity/image-url';
import { createClient } from 'next-sanity';

// Glide Styles
import '@glidejs/glide/dist/css/glide.core.min.css';

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

interface CarouselItem {
  image: any;
  title?: string;
  description?: string;
}

interface CarouselSectionProps {
  section: {
    title?: string;
    backgroundColor?: string;
    customBackgroundColor?: string;
    items: CarouselItem[];
    autoplay?: boolean;
    autoplaySpeed?: number;
  };
}

export default function CarouselSection({ section }: CarouselSectionProps) {
  const glideRef = useRef(null);

  // Determine background color
  const getBgColor = () => {
    if (section.backgroundColor === 'custom' && section.customBackgroundColor) {
      return section.customBackgroundColor;
    }
    return section.backgroundColor || '#F9FAFB';
  };

  useEffect(() => {
    if (glideRef.current && section.items?.length > 0) {
      const glide = new Glide(glideRef.current, {
        type: 'carousel',
        startAt: 0,
        focusAt: 'center',
        perView: 3,
        gap: 120,
        autoplay: section.autoplay !== false ? (section.autoplaySpeed || 4000) : false,
        animationDuration: 200,
        throttle: 10,
        animationTimingFunc: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
        breakpoints: {
          1024: { perView: 2, gap: 180 },
          768: { perView: 1, gap: 20 }
        }
      });

      glide.mount();
      const handleResize = () => glide.update();
      window.addEventListener('resize', handleResize);

      return () => {
        glide.destroy();
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [section.items, section.autoplay, section.autoplaySpeed]);

  if (!section.items || section.items.length === 0) return null;

  return (
    <section 
      className="w-full py-12 scroll-mt-24" 
      style={{ backgroundColor: getBgColor() }}
    >
      {/* Section Title */}
      {section.title && (
        <div className="max-w-7xl mx-auto px-6 mb-16 flex justify-center">
          <h2 className="text-jiffy-dark font-bold text-center text-3xl md:text-[clamp(32px,4vw,48px)]">
            {section.title}
          </h2>
        </div>
      )}

      {/* Carousel */}
      <div className="glide relative w-full overflow-visible py-12 md:py-16" ref={glideRef}>
        <div className="glide__track overflow-visible" data-glide-el="track">
          <ul className="glide__slides items-center min-h-[550px] md:min-h-[600px]">
            {section.items.map((item: CarouselItem, index: number) => (
              <li key={index} className="glide__slide flex justify-center items-center">
                <div className="carousel-container transition-all duration-500 flex flex-col items-center">
                  {/* Image */}
                  {item.image && (
                    <img
                      src={urlFor(item.image).url()}
                      alt={item.title || `Slide ${index + 1}`}
                      className="carousel-img carousel-shadow rounded-sm mb-6"
                    />
                  )}
                  
                  {/* Text Content - Only shows on active slide */}
                  <div className="carousel-text-content opacity-0 transition-opacity duration-500 text-center max-w-md px-4">
                    {item.title && (
                      <h3 className="text-jiffy-dark font-bold text-xl md:text-2xl mb-2">
                        {item.title}
                      </h3>
                    )}
                    {item.description && (
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation Arrows */}
        <div
          className="glide__arrows pointer-events-none absolute inset-0 flex items-center justify-between px-4 md:px-20 z-20"
          data-glide-el="controls"
        >
          <button
            className="glide__arrow pointer-events-auto p-4 bg-jiffy-dark text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all"
            data-glide-dir="<"
            aria-label="Previous slide"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            className="glide__arrow pointer-events-auto p-4 bg-jiffy-dark text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all"
            data-glide-dir=">"
            aria-label="Next slide"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Bullet Navigation */}
        <div className="glide__bullets flex justify-center items-center gap-3 mt-12" data-glide-el="controls[nav]">
          {section.items.map((_, index: number) => (
            <button
              key={index}
              className="glide__bullet focus:outline-none"
              data-glide-dir={`=${index}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style jsx global>{`
        /* Carousel slide transitions */
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

        /* Show text only on active slide */
        .glide__slide--active .carousel-text-content {
          opacity: 1 !important;
        }

        /* Image styling */
        .carousel-img {
          max-height: 450px;
          max-width: 80vw;
          width: auto;
          height: auto;
          object-fit: contain;
        }

        .carousel-shadow {
          box-shadow: -20px 0 25px -5px rgba(0, 0, 0, 0.1),
                      20px 0 25px -5px rgba(0, 0, 0, 0.1);
        }

        /* Modern pill dots style */
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
        
        .glide__bullet:hover {
          background-color: #9ca3af;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .carousel-img {
            max-height: 400px;
            max-width: 90vw;
          }
          .glide__slide--active {
            transform: scale(1.05) !important;
          }
        }
      `}</style>
    </section>
  );
}