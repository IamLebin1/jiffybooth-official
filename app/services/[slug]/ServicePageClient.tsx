'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import * as LucideIcons from 'lucide-react';
// @ts-ignore - Glide.js doesn't have built-in types
import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.min.css';

interface Feature {
  title: string;
  iconName: string;
}

interface BackdropColor {
  name: string;
  hex: string;
  image: string;
}

interface FeaturedMedia {
  mediaType: 'image' | 'video';
  image?: string;
  videoUrl?: string;
}

interface AddOn {
  title: string;
  description: string;
  image: string;
}

interface SetupRequirement {
  item: string;
}

interface CarouselItem {
  image: string;
  title?: string;
  description?: string;
}

interface Section {
  sectionType: 'setup' | 'backdrop' | 'templates' | 'addons' | 'custom' | 'carousel';
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  customBackgroundColor?: string;
  layout?: 'image-left' | 'image-right' | 'image-center';
  content?: string;
  image?: string;
  description?: string;
  requirements?: SetupRequirement[];
  backdropColors?: BackdropColor[];
  templates?: string[];
  addOns?: AddOn[];
  items?: CarouselItem[];
  autoplay?: boolean;
  autoplaySpeed?: number;
}

interface PageData {
  title: string;
  heroTitle: string;
  heroSubtitle?: string;
  heroBackgroundImage: string;
  featuredMedia?: FeaturedMedia;
  features: Feature[];
  sections?: Section[];
  ctaTitle?: string;
}

interface ServicePageClientProps {
  pageData: PageData;
}

export default function ServicePageClient({ pageData }: ServicePageClientProps) {
  const { 
    title,
    heroTitle,
    heroSubtitle,
    heroBackgroundImage,
    featuredMedia,
    features,
    sections,
    ctaTitle
  } = pageData;

  const isValidSrc = (src: any) => src && typeof src === 'string' && src.trim() !== "";

  const getIconForFeature = (iconName: string, className = "w-7 h-7 lg:w-12 lg:h-12") => {
  const IconName = iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  // @ts-ignore
  const Icon = LucideIcons[IconName] || LucideIcons.Camera;
  return <Icon className={className} />;
};

  const getVideoEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const getBackgroundColor = (section: Section) => {
    if (section.backgroundColor === 'custom' && section.customBackgroundColor) {
      return section.customBackgroundColor;
    }
    return section.backgroundColor || '#FFFFFF';
  };

  return (
    <main className="min-h-screen bg-white font-sans text-black overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative w-full h-[450px] md:h-[650px] flex flex-col items-center justify-center text-center overflow-hidden">
        {isValidSrc(heroBackgroundImage) ? (
          <Image 
            src={heroBackgroundImage}
            alt={`${heroTitle || title} background`}
            fill
            className="object-cover brightness-[0.4]"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-slate-800" />
        )}
        <div className="relative z-10 px-6">
          <Link href="/our-services" className="text-white/70 hover:text-white text-xs tracking-[0.2em] mb-6 inline-block transition-colors">
            ← Back to All Services
          </Link>
          <h1 className="text-white text-5xl md:text-8xl font-bold tracking-tight mb-4">
            {heroTitle || title} 
          </h1>
          <p className="text-white/90 text-lg md:text-2xl max-w-2xl mx-auto font-light">
            {heroSubtitle || title}
          </p>
          <div className="w-24 h-1.5 bg-white mx-auto mt-8 opacity-40 rounded-full" />
        </div>
      </section>

      {/* Featured Media Section */}
      <section className="max-w-6xl mx-auto -mt-20 md:-mt-24 px-6 relative z-20">
        <div className="bg-white p-3 md:p-4 rounded-3xl shadow-2xl border-8 border-white overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            {featuredMedia?.mediaType === 'image' && isValidSrc(featuredMedia.image) ? (
              <Image 
                src={featuredMedia.image!}
                alt={`${heroTitle || title} Samples`}
                fill
                className="object-cover"
              />
            ) : featuredMedia?.mediaType === 'video' && isValidSrc(featuredMedia.videoUrl) ? (
              <iframe
                src={getVideoEmbedUrl(featuredMedia.videoUrl!)}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <LucideIcons.Camera className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-gray-400 text-lg">{heroTitle || title} Samples</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      {features && features.length > 0 && (
        <section className="bg-white py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-slate-800 text-center tracking-tight">
              What We Provide
            </h2>
            
            <div className="grid grid-cols-3 lg:flex lg:flex-wrap justify-center gap-x-4 gap-y-10 lg:gap-x-8 lg:gap-y-16">
  {features.map((feature, idx) => (
    <div 
      key={idx} 
      className="flex flex-col items-center text-center space-y-4 lg:space-y-6 group lg:w-[220px]"
    >
<div className="w-16 h-16 lg:w-28 lg:h-28 rounded-full bg-slate-800 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl text-white">
                    {getIconForFeature(feature.iconName)}
                  </div>
<h3 className="text-s lg:text-xl font-semibold leading-snug text-slate-800 tracking-tight">
                    {feature.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Sections */}
      {sections && sections.map((section, index) => (
        <React.Fragment key={index}>
          {section.sectionType === 'setup' && (
            <SetupSection section={section} isValidSrc={isValidSrc} />
          )}
          {section.sectionType === 'backdrop' && (
            <BackdropSection section={section} isValidSrc={isValidSrc} />
          )}
          {section.sectionType === 'templates' && (
            <TemplatesSection section={section} isValidSrc={isValidSrc} />
          )}
          {section.sectionType === 'addons' && (
            <AddOnsSection section={section} isValidSrc={isValidSrc} />
          )}
          {section.sectionType === 'carousel' && (
            <CarouselSection section={section} isValidSrc={isValidSrc} />
          )}
          {section.sectionType === 'custom' && (
            <CustomSection section={section} isValidSrc={isValidSrc} />
          )}
        </React.Fragment>
      ))}

      {/* Call to Action */}
      <section className="py-24 text-center px-6 bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-8 tracking-tight">
          {ctaTitle || "Ready to Capture the Moment?"}
        </h2>
        <Link href="/contact-us">
          <button className="inline-block bg-slate-800 text-white px-12 py-5 rounded-full font-bold tracking-[0.2em] shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs">
            Enquire Now
          </button>
        </Link>
      </section>

    </main>
  );
}

// Setup Section Component
function SetupSection({ section, isValidSrc }: { section: Section; isValidSrc: (src: any) => boolean }) {
  const bgColor = section.backgroundColor === 'custom' && section.customBackgroundColor 
    ? section.customBackgroundColor 
    : section.backgroundColor || '#F9FAFB';
  
  const borderColor = bgColor === '#FFFFFF' ? 'border-gray-100' : 'border-gray-200';

  return (
    <section 
      className={`py-24 px-6 border-y ${borderColor}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold mb-16 text-slate-800 text-center tracking-tight">
          {section.title || 'Our Set Up'}
        </h2>

        <div className="flex flex-col lg:flex-row items-stretch gap-12 lg:gap-16">
          <div className="flex-1 min-w-0 flex items-center justify-center">
            {isValidSrc(section.image) ? (
              <div className="inline-block rounded-3xl overflow-hidden shadow-xl border-8 border-white max-w-full relative">
                <img
                  src={section.image!}
                  alt={section.title || 'Our Set Up'}
                  className="w-auto h-auto max-w-full max-h-[600px] object-contain"
                />
              </div>
            ) : (
              <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-8 border-white bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <div className="text-center p-8">
                  <LucideIcons.Layout className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400 text-sm">Upload a set-up image in Sanity</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-8">
            {section.description && (
              <p className="text-gray-600 text-lg leading-relaxed">
                {section.description}
              </p>
            )}

            {section.requirements && section.requirements.length > 0 && (
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 tracking-tight">
                  Requirements
                </h3>
                <ul className="space-y-3">
                  {section.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-[6px] flex-shrink-0 w-2.5 h-2.5 rounded-full bg-slate-800" />
                      <span className="text-gray-600 text-base leading-relaxed">
                        {req.item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Backdrop Section Component
function BackdropSection({ section, isValidSrc }: { section: Section; isValidSrc: (src: any) => boolean }) {
  const [activeColor, setActiveColor] = useState(section.backdropColors?.[0]?.hex || "#E5E4E2");
  const activeBackdropData = section.backdropColors?.find(c => c.hex === activeColor);

  const bgColor = section.backgroundColor === 'custom' && section.customBackgroundColor 
    ? section.customBackgroundColor 
    : section.backgroundColor || '#FFFFFF';

  return (
    <section 
      className="py-24 px-6"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-6xl mx-auto space-y-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800 tracking-tight">
            {section.title || 'Crafting your Moment'}
          </h2>
        </div>

        {section.backdropColors && section.backdropColors.length > 0 && (
          <div className="space-y-10">
            <div className="text-center">
              <h3 className="text-2xl md:text-4xl font-bold mb-3 text-slate-800 tracking-tight">Backdrop Selection</h3>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto font-light">
                Choose the perfect canvas to match your event's unique aesthetic.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="w-full lg:w-3/5 order-1">
                <div className="sticky top-8">
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-gray-50">
                    {isValidSrc(activeBackdropData?.image) ? (
                      <Image 
                        src={activeBackdropData!.image}
                        alt={activeBackdropData!.name}
                        fill
                        className="object-cover transition-all duration-700"
                      />
                    ) : (
                      <div 
                        className="absolute inset-0 transition-all duration-700" 
                        style={{ backgroundColor: activeColor }} 
                      />
                    )}
                    
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-white/95 backdrop-blur-xl px-6 py-4 rounded-xl shadow-2xl border border-gray-100">
                        <p className="text-xs text-gray-400 tracking-widest mb-1">Currently Viewing</p>
                        <p className="text-slate-800 font-bold text-xl tracking-tight">
                          {activeBackdropData?.name || 'Standard'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-2/5 order-2">
                <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                  {section.backdropColors.map((color) => {
                    const isActive = activeColor === color.hex;
                    return (
                      <button 
                        key={color.hex}
                        onClick={() => setActiveColor(color.hex)}
                        className="group flex flex-col items-center gap-3 transition-all duration-300 hover:scale-110"
                      >
                        <div className="relative">
                          <div 
                            className="w-20 h-20 md:w-24 md:h-24 rounded-full shadow-lg border-4 border-white"
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className={`absolute inset-0 rounded-full border-4 transition-all duration-300 ${
                            isActive 
                              ? 'border-slate-800 scale-110' 
                              : 'border-transparent group-hover:border-slate-300'
                          }`} />
                          {isActive && (
                            <div className="absolute -top-1 -right-1 w-7 h-7 bg-slate-800 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                              <LucideIcons.Check className="w-4 h-4 text-white" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <p className={`text-xs font-bold tracking-widest transition-all duration-300 text-center max-w-[100px] ${
                          isActive ? 'text-slate-800' : 'text-gray-400 group-hover:text-gray-700'
                        }`}>
                          {color.name}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Templates Section Component
function TemplatesSection({ section, isValidSrc }: { section: Section; isValidSrc: (src: any) => boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const animationRef = useRef<number>();
  const autoScrollSpeed = useRef(1);
  const isPaused = useRef(false);

  const bgColor = section.backgroundColor === 'custom' && section.customBackgroundColor
    ? section.customBackgroundColor
    : section.backgroundColor || '#FFFFFF';

  // Auto-scroll loop
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const scroll = () => {
      if (!isPaused.current && track) {
        track.scrollLeft += autoScrollSpeed.current;
        // When we've scrolled halfway (one full set), reset to start for seamless loop
        if (track.scrollLeft >= track.scrollWidth / 2) {
          track.scrollLeft = 0;
        }
      }
      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, []);

  // Drag to scroll
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    isPaused.current = true;
    startX.current = e.pageX - (trackRef.current?.offsetLeft || 0);
    scrollLeft.current = trackRef.current?.scrollLeft || 0;
    if (trackRef.current) trackRef.current.style.cursor = 'grabbing';
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUp = () => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = 'grab';
    setTimeout(() => { isPaused.current = false; }, 800);
  };

  // Touch support
  const onTouchStart = (e: React.TouchEvent) => {
    isPaused.current = true;
    startX.current = e.touches[0].pageX;
    scrollLeft.current = trackRef.current?.scrollLeft || 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!trackRef.current) return;
    const walk = (startX.current - e.touches[0].pageX) * 1.5;
    trackRef.current.scrollLeft = scrollLeft.current + walk;
  };

  const onTouchEnd = () => {
    setTimeout(() => { isPaused.current = false; }, 800);
  };

  if (!section.templates || section.templates.length === 0) return null;

  // Duplicate templates for seamless loop
  const loopedTemplates = [...section.templates, ...section.templates];

  return (
    <section className="py-24 overflow-hidden" style={{ backgroundColor: bgColor }}>
      <div className="max-w-6xl mx-auto px-6 mb-12 text-center">
        <h3 className="text-2xl md:text-4xl font-bold mb-2 text-slate-800 tracking-tight">
          {section.title || 'Customisable Templates'}
        </h3>
        {section.subtitle && (
          <p className="text-gray-500 text-lg max-w-xl mx-auto font-light">{section.subtitle}</p>
        )}
        <p className="text-gray-400 text-sm mt-3 tracking-wide">Drag to explore →</p>
      </div>

      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto select-none"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          cursor: 'grab',
          WebkitOverflowScrolling: 'touch',
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>

        {loopedTemplates.map((template, i) => (
          <div key={i} className="flex-shrink-0 pl-4 first:pl-6 last:pr-6">
            <div className="h-[320px] md:h-[420px] rounded-2xl shadow-lg border-8 border-white overflow-hidden bg-white pointer-events-none">
              {isValidSrc(template) ? (
                <img
                  src={template}
                  alt={`Template ${(i % section.templates!.length) + 1}`}
                  className="h-full w-auto object-contain"
                  draggable={false}
                />
              ) : (
                <div className="h-full aspect-[3/4] bg-gray-50 flex items-center justify-center text-gray-300 text-sm">
                  Template
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Add-Ons Section Component
function AddOnsSection({ section, isValidSrc }: { section: Section; isValidSrc: (src: any) => boolean }) {
  const bgColor = section.backgroundColor === 'custom' && section.customBackgroundColor 
    ? section.customBackgroundColor 
    : section.backgroundColor || '#F9FAFB';

  return (
    <section 
      className="py-24 px-6"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold mb-16 text-slate-800 text-center tracking-tight">
          {section.title || 'Optional Add-Ons'}
        </h2>
        {section.addOns && section.addOns.length > 0 && (
<div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
            {section.addOns.map((addon, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="aspect-[4/5] rounded-3xl mb-6 overflow-hidden shadow-lg transition-all duration-500 group-hover:rounded-2xl transform group-hover:scale-[0.98] relative bg-white">
                  {isValidSrc(addon.image) ? (
                    <Image 
                      src={addon.image}
                      alt={addon.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-200">
                      <LucideIcons.Plus className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <h4 className="text-2xl font-bold mb-3 text-slate-800 tracking-tight">{addon.title}</h4>
                <p className="text-gray-600 text-base leading-relaxed font-light">
                  {addon.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// NEW: Carousel Section Component
function CarouselSection({ section, isValidSrc }: { section: Section; isValidSrc: (src: any) => boolean }) {
  const glideRef = useRef<HTMLDivElement>(null);

  const bgColor = section.backgroundColor === 'custom' && section.customBackgroundColor 
    ? section.customBackgroundColor 
    : section.backgroundColor || '#F9FAFB';

  useEffect(() => {
    if (glideRef.current && section.items && section.items.length > 0) {
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
      style={{ backgroundColor: bgColor }}
    >
      {/* Section Title */}
      {section.title && (
        <div className="max-w-6xl mx-auto px-6 mb-16 flex justify-center">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800 text-center tracking-tight">
            {section.title}
          </h2>
        </div>
      )}

      {/* Carousel */}
      <div className="glide relative w-full overflow-visible py-12 md:py-16" ref={glideRef}>
        <div className="glide__track overflow-visible" data-glide-el="track">
          <ul className="glide__slides items-center min-h-[550px] md:min-h-[600px]">
            {section.items.map((item, index) => (
              <li key={index} className="glide__slide flex justify-center items-center">
                <div className="carousel-container transition-all duration-500 flex flex-col items-center">
                  {/* Image */}
                  {isValidSrc(item.image) && (
                    <img
                      src={item.image}
                      alt={item.title || `Slide ${index + 1}`}
                      className="carousel-img carousel-shadow rounded-sm mb-6"
                    />
                  )}
                  
                  {/* Text Content - Only shows on active slide */}
                  <div className="carousel-text-content opacity-0 transition-opacity duration-500 text-center max-w-md px-4">
                    {item.title && (
                      <h3 className="text-slate-800 font-bold text-xl md:text-2xl mb-2">
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
            className="glide__arrow pointer-events-auto p-4 bg-slate-800 text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all"
            data-glide-dir="<"
            aria-label="Previous slide"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            className="glide__arrow pointer-events-auto p-4 bg-slate-800 text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all"
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
          {section.items.map((_, index) => (
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

// Custom Section Component
function CustomSection({ section, isValidSrc }: { section: Section; isValidSrc: (src: any) => boolean }) {
  const bgColor = section.backgroundColor === 'custom' && section.customBackgroundColor 
    ? section.customBackgroundColor 
    : section.backgroundColor || '#FFFFFF';

  const borderColor = bgColor === '#FFFFFF' ? 'border-gray-100' : 'border-gray-200';

  if (section.layout === 'image-center') {
    return (
      <section 
        className={`py-24 px-6 border-y ${borderColor}`}
        style={{ backgroundColor: bgColor }}
      >
        <div className="max-w-4xl mx-auto">
          {section.title && (
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-slate-800 text-center tracking-tight">
              {section.title}
            </h2>
          )}
          
          {isValidSrc(section.image) && (
            <div className="mb-12 rounded-3xl overflow-hidden shadow-xl border-8 border-white">
              <img
                src={section.image!}
                alt={section.title || 'Section image'}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          
          {section.content && (
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap text-center">
              {section.content}
            </div>
          )}
        </div>
      </section>
    );
  }

  const isImageLeft = section.layout === 'image-left';

  return (
    <section 
      className={`py-24 px-6 border-y ${borderColor}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-6xl mx-auto">
        {section.title && (
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-slate-800 text-center tracking-tight">
            {section.title}
          </h2>
        )}

        <div className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 ${!isImageLeft ? 'lg:flex-row-reverse' : ''}`}>
          {isValidSrc(section.image) && (
            <div className="flex-1 min-w-0">
              <div className="rounded-3xl overflow-hidden shadow-xl border-8 border-white">
                <img
                  src={section.image!}
                  alt={section.title || 'Section image'}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          )}

          {section.content && (
            <div className="flex-1 flex flex-col justify-center">
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                {section.content}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}