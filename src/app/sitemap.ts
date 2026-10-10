
import type { MetadataRoute } from "next";

const baseUrl = "https://lemigudisa.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/gallery`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/certificates`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
