import { client } from '@/sanity/lib/client';
import Image from "next/image";
import Link from "next/link";

export default async function OurServicesPage() {
  // Fetch all booths from 'ourServices' collection
  const sanityServices = await client.fetch(
    `*[_type == "ourServices"] | order(order asc) {
      _id,
      title,
      description,
      "slug": slug.current,
      "image": image.asset->url,
      accentColor
    }`,
    {},
    { cache: 'no-store' } 
  );

  return (
    <main className="min-h-screen bg-white font-inter">
      {/* --- HEADER --- */}
      <section className="px-6 pt-14 md:pt-20 pb-8 md:pb-10">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="mt-3 text-jiffy-dark font-black tracking-tight text-4xl md:text-6xl leading-[0.95]">
            Our Services
          </h1>
          <p className="mt-4 text-jiffy-dark/70 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
            Choose from premium booth experiences designed to match your event style and create unforgettable memories.
          </p>
          <div className="mt-6 flex justify-center">
            <span className="h-1 w-24 rounded-full bg-[#9b5744]/70" />
          </div>
        </div>
      </section>

      {/* --- SERVICES GRID --- */}
      <section id="services" className="py-4 md:py-10 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {sanityServices.map((service: any) => (
            <div key={service._id} className="group flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 hover:-translate-y-2 transition-all duration-500">
              {/* Image with Accent Color */}
              <div className="relative aspect-[16/9] md:aspect-[4/3] w-full p-2 md:p-4" style={{ backgroundColor: service.accentColor || '#f5ebe0' }}>
                <div className="relative w-full h-full overflow-hidden rounded-2xl">
                  {service.image && (
                    <Image src={service.image} alt={service.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-8 flex flex-col flex-grow space-y-2">
                <h2 className="text-2xl font-bold uppercase">{service.title}</h2>
                <p className="text-gray-600 line-clamp-3 flex-grow">{service.description}</p>
                
                {/* DYNAMIC LINK: Correctly linking to the dynamic slug page */}
                <Link 
                  href={`/services/${service.slug}`} 
                  className="mt-4 block w-full py-2 md:py-4 bg-slate-800 text-white text-center rounded-xl font-bold uppercase tracking-widest hover:bg-black transition-all"
                >
                  Explore Service
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State message */}
        {sanityServices.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            No services found. Create one in Sanity to see it here.
          </div>
        )}
      </section>

      {/* --- PAGE CTA --- */}
      <section className="py-20 md:py-24 text-center px-6">
        <h2 className="section-title mb-10">
          Ready to Capture the Moment?
        </h2>
        <Link
          href="/contact-us#contact-form"
          className="inline-block text-white px-16 py-6 rounded-full font-bold uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
          style={{ backgroundColor: '#9b5744' }}
        >
          Enquire Now
        </Link>
      </section>
    </main>
  );
}