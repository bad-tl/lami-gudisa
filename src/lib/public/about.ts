
import { prisma } from "@/lib/prisma";

export async function getPublishedAbout() {
  return prisma.about.findFirst({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
