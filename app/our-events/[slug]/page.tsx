import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";

type EventDetail = {
  title: string;
  category: string;
  description: string;
  slug: string;
  gallery: string[];
};

export async function generateStaticParams() {
  const slugs = await client.fetch(
    `*[_type == "ourEvents" && defined(slug.current)]{ "slug": slug.current }`
  );

  return (slugs || []).map((event: { slug: string }) => ({ slug: event.slug }));
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EventDetailPage({ params }: Params) {
  const { slug } = await params;

  const event = await client.fetch<EventDetail | null>(
    `*[_type == "ourEvents" && slug.current == $slug][0] {
      title,
      category,
      description,
      "slug": slug.current,
      "gallery": gallery[].asset->url
    }`,
    { slug },
    { cache: "no-store" }
  );

  if (!event) {
    notFound();
  }

  const galleryImages = event.gallery && event.gallery.length > 0 ? event.gallery : [];

  return (
    <main className="min-h-screen bg-white text-slate-900 font-inter">
      <section className="bg-slate-50 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-orange-500 mb-4">Event Gallery</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">{event.title}</h1>
          <p className="mt-4 text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            {event.description}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-500">
              {event.category}
            </span>
            <span className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs uppercase tracking-[0.35em] text-orange-600">
              Templates & Gallery
            </span>
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row justify-center items-center">
            <Link
              href="/our-events"
              className="inline-flex rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 shadow-sm transition hover:bg-slate-100"
            >
              Back to Events
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-xl transition hover:bg-orange-600"
            >
              Book This Event
            </Link>
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
                alt={`${event.title} gallery ${index + 1}`}
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
