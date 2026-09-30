import { prisma } from "@/lib/prisma";

export async function getPublishedExperiences() {
  return prisma.experience.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        startDate: "desc",
      },
    ],
  });
}