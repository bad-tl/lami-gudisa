import { prisma } from "@/lib/prisma";

export async function getPublishedEducations() {
  return prisma.education.findMany({
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