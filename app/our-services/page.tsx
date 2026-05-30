import { client } from '@/sanity/lib/client';
import Image from "next/image";
import Link from "next/link";

type ServiceItem = {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  image?: string;
  accentColor?: string;
};

export default async function OurServicesPage() {
  // Fetch all booths from 'ourServices' collection
  const sanityServices = (await client.fetch(
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
  )) as ServiceItem[];

  return (
    <main className="min-h-screen bg-white font-inter text-slate-900 overflow-x-hidden">
      {/* --- HEADER --- */}
      <section className="bg-[#f4f4f4] py-16 md:py-20 px-6 border-t border-[#e8e3da]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="section-title mb-4">
            Our Services
          </h1>
          <p className="text-jiffy-dark/75 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
            Choose from premium booth experiences designed to match your event style and create unforgettable memories.
          </p>
        </div>
      </section>

      {/* --- SERVICES GRID --- */}
      <section id="services" className="bg-[#f4f4f4] pb-16 md:pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {sanityServices.map((service) => (
            <div key={service._id} className="group flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 hover:-translate-y-1.5 transition-all duration-500">
              {/* Image with Accent Color */}
              <div className="relative aspect-[16/9] md:aspect-[4/3] w-full p-2 md:p-3" style={{ backgroundColor: service.accentColor || '#f5ebe0' }}>
                <div className="relative w-full h-full overflow-hidden rounded-2xl">
                  {service.image && (
                    <Image src={service.image} alt={service.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-6 flex flex-col flex-grow space-y-3">
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-jiffy-dark">{service.title}</h2>
                <p className="text-jiffy-dark/70 line-clamp-3 flex-grow text-sm md:text-base leading-relaxed">{service.description}</p>
                
                {/* DYNAMIC LINK: Correctly linking to the dynamic slug page */}
                <Link 
                  href={`/services/${service.slug}`} 
                  className="mt-4 block w-full py-3 md:py-4 bg-slate-800 text-white text-center rounded-xl font-bold uppercase tracking-widest hover:bg-black transition-all text-xs md:text-sm"
                >
                  Explore Service
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State message */}
        {sanityServices.length === 0 && (
          <div className="text-center py-20 text-jiffy-dark/50">
            No services found. Create one in Sanity to see it here.
          </div>
        )}
        </div>
      </section>

      {/* --- PAGE CTA --- */}
      <section className="py-20 md:py-24 text-center px-6 bg-white border-t border-gray-100">
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