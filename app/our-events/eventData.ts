export type EventType = {
  title: string;
  category: string;
  description: string;
  image: string;
  slug: string;
  gallery: string[];
};

export const eventTypes: EventType[] = [
  {
    title: 'Wedding Venue',
    category: 'Wedding',
    description: 'Venue styling, floral arches, and timeless reception experiences.',
    image: '/wedding-sample.png',
    slug: 'wedding-venue',
    gallery: ['/wedding-sample.png', '/temp2.png', '/temp3.png', '/hero-background.jpg'],
  },
  {
    title: 'Wedding Photographer',
    category: 'Wedding',
    description: 'Capture every emotion with premium photography packages.',
    image: '/photo-booth-hero.jpg',
    slug: 'wedding-photographer',
    gallery: ['/photo-booth-hero.jpg', '/temp4.png', '/temp5.png', '/temp2.png'],
  },
  {
    title: 'Caterer',
    category: 'Birthday',
    description: 'Curated menus designed for celebrations of every size.',
    image: '/party-sample.png',
    slug: 'caterer',
    gallery: ['/party-sample.png', '/temp1.png', '/temp3.png', '/temp5.png'],
  },
  {
    title: 'Corporate Launch',
    category: 'Corporate',
    description: 'Executive planning and polished event production.',
    image: '/corporate-sample.png',
    slug: 'corporate-launch',
    gallery: ['/corporate-sample.png', '/temp1.png', '/temp2.png', '/temp3.png'],
  },
  {
    title: 'Pet Party',
    category: 'Pet Parties',
    description: 'Fun, pet-friendly gatherings designed for furry guests.',
    image: '/temp4.png',
    slug: 'pet-party',
    gallery: ['/temp4.png', '/temp1.png', '/temp5.png', '/temp2.png'],
  },
  {
    title: 'Festive Design',
    category: 'Festives',
    description: 'Themed décor and warm atmospheres for every season.',
    image: '/temp5.png',
    slug: 'festive-design',
    gallery: ['/temp5.png', '/temp3.png', '/temp4.png', '/temp1.png'],
  },
  {
    title: 'Baby Shower',
    category: 'Babies',
    description: 'Soft palettes and thoughtful details for milestone moments.',
    image: '/temp1.png',
    slug: 'baby-shower',
    gallery: ['/temp1.png', '/temp2.png', '/temp3.png', '/temp5.png'],
  },
];
