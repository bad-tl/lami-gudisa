import { prisma } from "@/lib/prisma";

export async function getPublishedSkills() {
  return prisma.skill.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "asc" },
    ],
  });
}