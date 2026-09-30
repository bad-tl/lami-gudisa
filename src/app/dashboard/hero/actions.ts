"use server";
import { deleteCloudinaryImage } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { randomUUID } from "crypto";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  heroSchema,
  type HeroFormData,
} from "@/lib/validations/hero";

async function requireOwner() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized.");
  }

  return session;
}

export async function getHero() {
  await requireOwner();

  return prisma.hero.findFirst({
    orderBy: {
      sortOrder: "asc",
    },
  });
}

async function saveHeroData(
  data: HeroFormData,
  status: "DRAFT" | "PUBLISHED"
) {
  await requireOwner();

  const validatedData = heroSchema.parse(data);

const existingHero = await prisma.hero.findFirst({
  orderBy: {
    sortOrder: "asc",
  },
  select: {
    id: true,
    imagePublicId: true,
  },
});

  const heroData = {
    eyebrow: validatedData.eyebrow || null,
    name: validatedData.name,
    title: validatedData.title,
    headline: validatedData.headline,
    description: validatedData.description || null,
    imageUrl: validatedData.imageUrl || null,
    imagePublicId: validatedData.imagePublicId || null,
    primaryButtonText:
      validatedData.primaryButtonText || null,
    primaryButtonUrl:
      validatedData.primaryButtonUrl || null,
    secondaryButtonText:
      validatedData.secondaryButtonText || null,
    secondaryButtonUrl:
      validatedData.secondaryButtonUrl || null,
    status,
  };

const oldImagePublicId = existingHero?.imagePublicId;

const hero = existingHero
  ? await prisma.hero.update({
      where: {
        id: existingHero.id,
      },
      data: heroData,
    })
  : await prisma.hero.create({
      data: {
        id: randomUUID(),
        ...heroData,
      },
    });

const newImagePublicId = hero.imagePublicId;

if (
  oldImagePublicId &&
  oldImagePublicId !== newImagePublicId
) {
  try {
    await deleteCloudinaryImage(oldImagePublicId);
  } catch (error) {
    console.error(
      "Failed to delete old Cloudinary hero image:",
      error
    );
  }
}

revalidatePath("/");

  return {
    success: true,
    hero,
  };
}

export async function saveHero(data: HeroFormData) {
  return saveHeroData(data, "DRAFT");
}

export async function publishHero(data: HeroFormData) {
  return saveHeroData(data, "PUBLISHED");
}