import { client } from '@/sanity/lib/client';
import Image from "next/image";
import Link from "next/link";

const eventTypes = [
  { title: 'Wedding', description: 'Beautiful celebrations for couples and families.' },
  { title: 'Birthday', description: 'Memorable parties for every milestone.' },
  { title: 'Corporate', description: 'Professional events with polished branding.' },
  { title: 'Bazaar', description: 'Market-style events with a festive atmosphere.' },
  { title: 'Pet Parties', description: 'Fun, pet-friendly gatherings and photo moments.' },
  { title: 'Babies', description: 'Charming baby showers, arrivals, and first celebrations.' },
  { title: 'Festives', description: 'Seasonal and cultural events with joyful themes.' },
];

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
      <section className="bg-[#2c343f] py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-white text-3xl font-bold">Our Services</h1>
          <div className="h-1 w-12 bg-blue-400 mt-1 rounded-full"></div>
        </div>
      </section>

      {/* --- EVENT TYPES SECTION --- */}
      <section className="py-10 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Event Types</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Events we bring to life</h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Choose the perfect experience for your next event with our curated event type offerings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventTypes.map((event) => (
              <div key={event.title} className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-slate-900 text-white font-bold text-lg mb-4">
                  {event.title.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{event.title}</h3>
                <p className="text-gray-600">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SERVICES GRID --- */}
      <section className="py-4 md:py-10 px-6 max-w-7xl mx-auto">
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
    </main>
  );
}