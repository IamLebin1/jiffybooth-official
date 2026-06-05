import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET() {
  try {
    const data = await client.fetch(
      `{
        "mainPage": *[_type == "mainPage"] | order(_updatedAt desc)[0] {
          ...,
          "heroVideoUrl": heroBackgroundVideo.asset->url,
          "brands": brands[] {
            name,
            "logo": logo.asset->url
          }
        },
        "services": *[_type == "ourServices"] | order(order asc) {
          title,
          description,
          "slug": slug.current,
          "image": image.asset->url
        },
        "events": *[_type == "ourEvents"] | order(_createdAt asc) {
          title,
          category,
          description,
          "slug": slug.current,
          "image": image.asset->url
        }
      }`,
      {},
      { cache: "no-store" }
    );

    return NextResponse.json(data ?? {});
  } catch (error) {
    console.error("Error loading home data:", error);
    return NextResponse.json({ error: "Failed to load home data" }, { status: 500 });
  }
}
