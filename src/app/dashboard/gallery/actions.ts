"use server";

import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteCloudinaryImage } from "@/lib/cloudinary";
import {
  gallerySchema,
  type GalleryFormData,
} from "@/lib/validations/gallery";

async function requireOwner() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized.");
  }

  return session;
}

export async function getGalleryItems() {
  await requireOwner();

  return prisma.gallery.findMany({
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "asc" },
    ],
  });
}

export async function getGalleryItem(id: string) {
  await requireOwner();

  return prisma.gallery.findUnique({
    where: { id },
  });
}

export async function createGalleryItem(
  data: GalleryFormData,
) {
  await requireOwner();

  const validated = gallerySchema.parse(data);

  const lastItem = await prisma.gallery.findFirst({
    orderBy: {
      sortOrder: "desc",
    },
    select: {
      sortOrder: true,
    },
  });

  const sortOrder = lastItem
    ? lastItem.sortOrder + 1
    : 0;

  const galleryItem = await prisma.gallery.create({
    data: {
      id: randomUUID(),
      title: validated.title,
      category: validated.category || null,
      description: validated.description || null,
      imageUrl: validated.imageUrl,
      imagePublicId: validated.imagePublicId,
      sortOrder,
      status: "DRAFT",
    },
  });

  revalidatePath("/dashboard/gallery");
  revalidatePath("/");

  return galleryItem;
}

export async function updateGalleryItem(
  id: string,
  data: GalleryFormData,
) {
  await requireOwner();

  const validated = gallerySchema.parse(data);

  const existingItem = await prisma.gallery.findUnique({
    where: { id },
  });

  if (!existingItem) {
    throw new Error("Gallery item not found.");
  }

  const imageChanged =
    existingItem.imagePublicId !==
    validated.imagePublicId;

  const galleryItem = await prisma.gallery.update({
    where: { id },
    data: {
      title: validated.title,
      category: validated.category || null,
      description: validated.description || null,
      imageUrl: validated.imageUrl,
      imagePublicId: validated.imagePublicId,
    },
  });

  if (
    imageChanged &&
    existingItem.imagePublicId
  ) {
    try {
      await deleteCloudinaryImage(
        existingItem.imagePublicId,
      );
    } catch (error) {
      console.error(
        "Failed to delete previous gallery image:",
        error,
      );
    }
  }

  revalidatePath("/dashboard/gallery");
  revalidatePath("/");

  return galleryItem;
}

export async function publishGalleryItem(
  id: string,
) {
  await requireOwner();

  const galleryItem = await prisma.gallery.update({
    where: { id },
    data: {
      status: "PUBLISHED",
    },
  });

  revalidatePath("/dashboard/gallery");
  revalidatePath("/");

  return galleryItem;
}

export async function unpublishGalleryItem(
  id: string,
) {
  await requireOwner();

  const galleryItem = await prisma.gallery.update({
    where: { id },
    data: {
      status: "DRAFT",
    },
  });

  revalidatePath("/dashboard/gallery");
  revalidatePath("/");

  return galleryItem;
}

export async function deleteGalleryItem(
  id: string,
) {
  await requireOwner();

  const existingItem = await prisma.gallery.findUnique({
    where: { id },
  });

  if (!existingItem) {
    throw new Error("Gallery item not found.");
  }

  await prisma.gallery.delete({
    where: { id },
  });

  if (existingItem.imagePublicId) {
    try {
      await deleteCloudinaryImage(
        existingItem.imagePublicId,
      );
    } catch (error) {
      console.error(
        "Failed to delete gallery image from Cloudinary:",
        error,
      );
    }
  }

  revalidatePath("/dashboard/gallery");
  revalidatePath("/");

  return {
    success: true,
  };
}

export async function reorderGalleryItem(
  id: string,
  direction: "up" | "down",
) {
  await requireOwner();

  const currentItem = await prisma.gallery.findUnique({
    where: { id },
  });

  if (!currentItem) {
    throw new Error("Gallery item not found.");
  }

  const neighbor =
    direction === "up"
      ? await prisma.gallery.findFirst({
          where: {
            sortOrder: {
              lt: currentItem.sortOrder,
            },
          },
          orderBy: {
            sortOrder: "desc",
          },
        })
      : await prisma.gallery.findFirst({
          where: {
            sortOrder: {
              gt: currentItem.sortOrder,
            },
          },
          orderBy: {
            sortOrder: "asc",
          },
        });

  if (!neighbor) {
    return currentItem;
  }

  await prisma.$transaction([
    prisma.gallery.update({
      where: { id: currentItem.id },
      data: {
        sortOrder: neighbor.sortOrder,
      },
    }),

    prisma.gallery.update({
      where: { id: neighbor.id },
      data: {
        sortOrder: currentItem.sortOrder,
      },
    }),
  ]);

  revalidatePath("/dashboard/gallery");
  revalidatePath("/");

  return {
    success: true,
  };
}