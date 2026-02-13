import { groq } from 'next-sanity';

export const photoboothPageQuery = groq`
  *[_type == "photoboothPage"][0] {
    heroTitle,
    "heroImage": heroImage.asset->url,
    featuredMedia {
      mediaType,
      "image": image.asset->url,
      videoUrl
    },
    features[] {
      title,
      iconName
    },
    setupTitle,
    "setupImage": setupImage.asset->url,
    setupDescription,
    "setupRequirements": setupRequirements[] {
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
    }
  }
`;