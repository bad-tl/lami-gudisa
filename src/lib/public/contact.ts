import { prisma } from "@/lib/prisma";

const SOCIAL_PLATFORMS = [
  "Facebook",
  "Telegram",
  "Instagram",
  "LinkedIn",
] as const;

export async function getPublicContactData() {
  const [contact, socialLinks] = await Promise.all([
    prisma.contact.findFirst({
      where: {
        status: "PUBLISHED",
      },
      orderBy: {
        createdAt: "asc",
      },
    }),

    prisma.socialLink.findMany({
      where: {
        status: "PUBLISHED",
        platform: {
          in: [...SOCIAL_PLATFORMS],
        },
      },
      orderBy: {
        sortOrder: "asc",
      },
    }),
  ]);

  const socialMap = new Map(
    socialLinks.map((social) => [social.platform, social.url]),
  );

  return {
    contact: contact
      ? {
          email: contact.email ?? "",
          phone: contact.phone ?? "",
          location: contact.location ?? "",
          availability: contact.availability ?? "",
          description: contact.description ?? "",
        }
      : null,

    social: {
      facebook: socialMap.get("Facebook") ?? "",
      telegram: socialMap.get("Telegram") ?? "",
      instagram: socialMap.get("Instagram") ?? "",
      linkedin: socialMap.get("LinkedIn") ?? "",
    },
  };
}