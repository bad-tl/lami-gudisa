"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  contactSchema,
  type ContactFormData,
} from "@/lib/validations/contact";

const SOCIAL_PLATFORMS = [
  "Facebook",
  "Telegram",
  "Instagram",
  "LinkedIn",
] as const;

async function requireOwner() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function getContactData() {
  await requireOwner();

  const [contact, socialLinks] = await Promise.all([
    prisma.contact.findFirst({
      orderBy: {
        createdAt: "asc",
      },
    }),
    prisma.socialLink.findMany({
      where: {
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
          id: contact.id,
          email: contact.email ?? "",
          phone: contact.phone ?? "",
          location: contact.location ?? "",
          availability: contact.availability ?? "",
          description: contact.description ?? "",
          status: contact.status,
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

export async function saveContactData(data: ContactFormData) {
  await requireOwner();

  const parsed = contactSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const values = parsed.data;

  const existingContact = await prisma.contact.findFirst({
    orderBy: {
      createdAt: "asc",
    },
  });

  const contact = existingContact
    ? await prisma.contact.update({
        where: {
          id: existingContact.id,
        },
        data: {
          email: values.email,
          phone: values.phone,
          location: values.location,
          availability: values.availability || null,
          description: values.description || null,
          status: "PUBLISHED",
          updatedAt: new Date(),
        },
      })
    : await prisma.contact.create({
        data: {
          id: crypto.randomUUID(),
          email: values.email,
          phone: values.phone,
          location: values.location,
          availability: values.availability || null,
          description: values.description || null,
          status: "PUBLISHED",
        },
      });

  const socialValues = [
    {
      platform: "Facebook",
      url: values.facebook,
      sortOrder: 0,
    },
    {
      platform: "Telegram",
      url: values.telegram,
      sortOrder: 1,
    },
    {
      platform: "Instagram",
      url: values.instagram,
      sortOrder: 2,
    },
    {
      platform: "LinkedIn",
      url: values.linkedin,
      sortOrder: 3,
    },
  ];

  for (const social of socialValues) {
    const existingSocial = await prisma.socialLink.findFirst({
      where: {
        platform: social.platform,
      },
    });

    if (social.url) {
      if (existingSocial) {
        await prisma.socialLink.update({
          where: {
            id: existingSocial.id,
          },
          data: {
            url: social.url,
            label: social.platform,
            sortOrder: social.sortOrder,
            status: "PUBLISHED",
            updatedAt: new Date(),
          },
        });
      } else {
        await prisma.socialLink.create({
          data: {
            id: crypto.randomUUID(),
            platform: social.platform,
            label: social.platform,
            url: social.url,
            sortOrder: social.sortOrder,
            status: "PUBLISHED",
          },
        });
      }
    } else if (existingSocial) {
      await prisma.socialLink.update({
        where: {
          id: existingSocial.id,
        },
        data: {
          url: "",
          status: "DRAFT",
          updatedAt: new Date(),
        },
      });
    }
  }

  revalidatePath("/dashboard/contact");
  revalidatePath("/");
  revalidatePath("/contact");

  return {
    success: true,
    contact,
  };
}