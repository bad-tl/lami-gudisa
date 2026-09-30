import "server-only";

import { prisma } from "@/lib/prisma";

export async function getPublishedHero() {
  return prisma.hero.findFirst({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
}