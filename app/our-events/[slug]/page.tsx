import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";

type EventDetail = {
  title: string;
  category: string;
  image?: string;
  description: string;
  slug: string;
  gallery: string[];
};

const toEventTypeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export async function generateStaticParams() {
  const events = await client.fetch<Array<{ slug: string; category: string }>>(
    `*[_type == "ourEvents" && defined(slug.current)]{ "slug": slug.current, category }`
  );

  const allSlugs = new Set<string>();
  (events || []).forEach((event) => {
    if (event.slug) {
      allSlugs.add(event.slug);
    }
    if (event.category) {
      allSlugs.add(toEventTypeSlug(event.category));
    }
  });

  return Array.from(allSlugs).map((eventSlug) => ({ slug: eventSlug }));
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EventDetailPage({ params }: Params) {
  const { slug } = await params;

  const events = await client.fetch<EventDetail[]>(
    `*[_type == "ourEvents"] {
      title,
      category,
      description,
      "image": image.asset->url,
      "slug": slug.current,
      "gallery": gallery[].asset->url
    }`,
    {},
    { cache: "no-store" }
  );

  const directEvent = (events || []).find((item) => item.slug === slug);
  if (directEvent) {
    const galleryImages = directEvent.gallery && directEvent.gallery.length > 0 ? directEvent.gallery : [];

    return (
      <main className="min-h-screen bg-white text-slate-900 font-inter">
        <section className="bg-slate-50 py-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-orange-500 mb-4">Event Gallery</p>
            <h1 className="section-title text-slate-900">{directEvent.title}</h1>
            <p className="mt-4 text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              {directEvent.description}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-500">
                {directEvent.category}
              </span>
              <span className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs uppercase tracking-[0.35em] text-orange-600">
                Templates & Gallery
              </span>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="group relative h-96 overflow-hidden bg-slate-950 shadow-2xl"
              >
                <Image
                  src={image}
                  alt={`${directEvent.title} gallery ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {index === 2 && (
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent p-6 flex items-end">
                    <div className="text-white">
                      <p className="text-xs uppercase tracking-[0.35em] text-orange-300">Real Weddings</p>
                      <h2 className="mt-3 text-2xl font-bold">Autumn Whispers & Candlelit Elegance</h2>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {galleryImages.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
              Gallery images will appear here once added in Sanity Studio.
            </div>
          )}
        </section>
      </main>
    );
  }

  const eventTypeEvents = (events || []).filter(
    (item) => toEventTypeSlug(item.category || "") === slug
  );

  if (eventTypeEvents.length === 0) {
    notFound();
  }

  const eventTypeTitle = eventTypeEvents[0].category;

  return (
    <main className="min-h-screen bg-white text-slate-900 font-inter">
      <section className="bg-[#f3f3f3] py-10 md:py-14 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-inter font-semibold tracking-tight text-2xl md:text-4xl text-jiffy-dark">
            {eventTypeTitle}
          </h1>
          <p className="mt-4 font-inter text-sm md:text-base text-jiffy-dark/80 max-w-3xl mx-auto leading-relaxed">
            Browse highlights from our {eventTypeTitle.toLowerCase()} events.
          </p>
        </div>
      </section>

      <section className="bg-[#f3f3f3]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {eventTypeEvents.map((item) => (
            <div
              key={item.slug}
              className="group relative block overflow-hidden aspect-[4/5] md:aspect-[5/6]"
            >
              <Image
                src={item.image || (item.gallery && item.gallery[0]) || "/logo-01.svg"}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-400" />

              <div className="absolute inset-x-0 bottom-0 p-4 md:p-7 flex flex-col justify-end text-white z-10 pointer-events-none">
                <div className="translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-400 ease-out">
                  <p className="font-inter text-[11px] md:text-sm font-bold uppercase tracking-[0.18em] mb-2">
                    {item.category}
                  </p>
                  <h2 className="font-inter text-lg md:text-[32px] leading-tight font-semibold tracking-tight max-w-[14ch]">
                    {item.title}
                  </h2>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
