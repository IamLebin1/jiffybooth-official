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
    title: "Weddings",
    slug: "wedding-photographer",
    category: "Private Event",
    description: "Elegant, timeless, and fun. Give your guests a beautifully printed keepsake they will cherish forever.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    title: "Corporate Launches",
    slug: "corporate-launch",
    category: "Corporate",
    description: "Amplify your brand presence with fully customizable photo experiences that your attendees will love to share.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1475721028070-2051152cb004?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    title: "Pet Parties",
    slug: "pet-party",
    category: "Specialty",
    description: "Pawsitively perfect booths tailored for your furry friends. Capture their best angles with custom props.",
    image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    title: "Private Galas",
    slug: "private-gala",
    category: "Private Event",
    description: "Exclusive entertainment for birthdays, anniversaries, and VIP nights. Step in and strike a pose.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200&auto=format&fit=crop"
    ]
  }
];