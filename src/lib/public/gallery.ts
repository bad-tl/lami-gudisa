import { prisma } from "@/lib/prisma";

export async function getPublishedGalleryItems() {
  return prisma.gallery.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "asc" },
    ],
  });
}