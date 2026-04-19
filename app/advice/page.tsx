import Link from "next/link";
import { Heart } from "lucide-react";

const featuredArticles = [
  {
    title: "How To Choose The Right Booth Setup For Your Guest Count",
    tag: "How-To",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Don't Get Fooled: Event Vendor Red Flags To Watch Out For",
    tag: "How-To",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "7 Timeline Tips To Keep Your Booth Busy From Start To End",
    tag: "Planning",
    image:
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Print Template Design Rules For Better-Looking Photo Strips",
    tag: "Design",
    image:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1400&q=80",
  },
];

export default function AdvicePage() {
  return (
    <main className="min-h-screen bg-[#f3f1ee] text-jiffy-dark font-inter">
      <section className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 pt-14 md:pt-16 pb-14 md:pb-16">
        <h1 className="text-[#9b5744] text-base md:text-lg uppercase tracking-[0.28em] font-bold mb-6 md:mb-8">
          Articles
        </h1>

        <div className="flex items-end justify-between gap-4 border-b border-[#ddd6cd] pb-6 mb-8">
          <h2 className="text-[clamp(1.65rem,3.4vw,2.8rem)] font-medium tracking-tight leading-none">Recently Published</h2>
          <button className="text-[#9b5744] text-base md:text-xl font-medium tracking-tight hover:opacity-80 transition-opacity">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
          {featuredArticles.map((article) => (
            <article
              key={article.title}
              className="group rounded-[2rem] overflow-hidden border border-[#ddd6cd] bg-[#f3f1ee] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-[250px] sm:h-[300px] md:h-[340px] lg:h-[360px] w-full object-cover rounded-t-[2rem]"
                />
                <button
                  aria-label="Save article"
                  className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white flex items-center justify-center text-jiffy-dark shadow-md"
                >
                  <Heart size={20} strokeWidth={2.1} />
                </button>
              </div>
              <div className="p-4 md:p-5">
                <p className="text-jiffy-dark/60 text-xs md:text-sm uppercase tracking-wide mb-2 font-semibold">{article.tag}</p>
                <h3 className="text-[1.35rem] md:text-[1.6rem] font-medium leading-tight">{article.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 py-20 md:py-24 text-center">
        <h2 className="text-jiffy-dark font-bold tracking-tight text-4xl md:text-5xl mb-10">Need Help Planning Your Setup?</h2>
        <Link
          href="/contact-us#contact-form"
          className="inline-block text-white px-16 py-6 rounded-full font-bold uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
          style={{ backgroundColor: "#9b5744" }}
        >
          Ask Us
        </Link>
      </section>
    </main>
  );
}
