import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET() {
  try {
    const events = await client.fetch(
      `*[_type == "ourEvents"] | order(coalesce(order, 9999) asc, _createdAt asc) {
        title,
        category,
        description,
        "slug": slug.current,
        "image": image.asset->url
      }`,
      {},
      { cache: "no-store" }
    );

    return NextResponse.json(Array.isArray(events) ? events : []);
  } catch (error) {
    console.error("Error loading events:", error);
    return NextResponse.json({ error: "Failed to load events" }, { status: 500 });
  }
}
