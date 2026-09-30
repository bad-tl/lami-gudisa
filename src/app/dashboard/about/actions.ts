"use server";

import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteCloudinaryImage } from "@/lib/cloudinary";
import {
  aboutSchema,
  type AboutFormData,
} from "@/lib/validations/about";

async function requireOwner() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized.");
  }

  return session;
}

/**
 * Get the current About record for the dashboard.
 */
export async function getAbout() {
  await requireOwner();

  return prisma.about.findFirst({
    orderBy: {
      createdAt: "asc",
    },
  });
}

/**
 * Save About content as either DRAFT or PUBLISHED.
 */
async function saveAboutData(
  data: AboutFormData,
  status: "DRAFT" | "PUBLISHED"
) {
  await requireOwner();

  const validatedData = aboutSchema.parse(data);

  const existingAbout = await prisma.about.findFirst({
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      imagePublicId: true,
    },
  });

  const aboutData = {
    title: validatedData.title,
    shortDescription:
      validatedData.shortDescription || null,
    fullDescription:
      validatedData.fullDescription || null,
    yearsOfExperience:
      validatedData.yearsOfExperience || null,
    location: validatedData.location || null,
    position: validatedData.position || null,
    organization:
      validatedData.organization || null,
    educationSummary:
      validatedData.educationSummary || null,
    imageUrl: validatedData.imageUrl || null,
    imagePublicId:
      validatedData.imagePublicId || null,
    status,
  };

  const oldImagePublicId =
    existingAbout?.imagePublicId;

  const about = existingAbout
    ? await prisma.about.update({
        where: {
          id: existingAbout.id,
        },
        data: aboutData,
      })
    : await prisma.about.create({
        data: {
          id: randomUUID(),
          ...aboutData,
        },
      });

  const newImagePublicId = about.imagePublicId;

  /*
   * If the owner replaced or removed the About image,
   * delete the old Cloudinary image.
   */
  if (
    oldImagePublicId &&
    oldImagePublicId !== newImagePublicId
  ) {
    try {
      await deleteCloudinaryImage(oldImagePublicId);
    } catch (error) {
      console.error(
        "Failed to delete old Cloudinary About image:",
        error
      );
    }
  }

  /*
   * Refresh the public portfolio immediately.
   */
  revalidatePath("/");

  return {
    success: true,
    about,
  };
}

/**
 * Save About as draft.
 */
export async function saveAbout(
  data: AboutFormData
) {
  return saveAboutData(data, "DRAFT");
}

/**
 * Publish About to the public portfolio.
 */
export async function publishAbout(
  data: AboutFormData
) {
  return saveAboutData(data, "PUBLISHED");
}