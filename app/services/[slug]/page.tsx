import { client } from '@/sanity/lib/client';
import ServicePageClient from './ServicePageClient';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const services = await client.fetch(
    `*[_type == "ourServices"]{ "slug": slug.current }`
  );

  return services.map((service: any) => ({
    slug: service.slug,
  }));
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const data = await client.fetch(
    `*[_type == "ourServices" && slug.current == $slug][0] {
      title,
      heroTitle,
      heroSubtitle,
      "heroBackgroundImage": heroBackgroundImage.asset->url,
      featuredMedia {
        mediaType,
        "image": image.asset->url,
        videoUrl
      },
      features[] {
        title,
        iconName
      },
      sections[] {
        sectionType,
        title,
        subtitle,
        backgroundColor,
        customBackgroundColor,
        layout,
        content,
        "image": image.asset->url,
        description,
        requirements[] {
          item
        },
        backdropColors[] {
          name,
          hex,
          "image": image.asset->url
        },
        "templates": templates[].asset->url,
        addOns[] {
          title,
          description,
          "image": image.asset->url
        },
        // Carousel section fields
        items[] {
          "image": image.asset->url,
          title,
          description
        },
        autoplay,
        autoplaySpeed
      },
      ctaTitle
    }`,
    { slug }, 
    { cache: 'no-store' }
  );

  if (!data) {
    notFound();
  }

  return <ServicePageClient pageData={data} />;
}