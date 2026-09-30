import { prisma } from "@/lib/prisma";

export async function getPublishedCertificates() {
  return prisma.certificate.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        issueDate: "desc",
      },
      {
        createdAt: "asc",
      },
    ],
  });
}

export async function getFeaturedCertificate() {
  return prisma.certificate.findFirst({
    where: {
      status: "PUBLISHED",
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        issueDate: "desc",
      },
      {
        createdAt: "asc",
      },
    ],
    select: {
      id: true,
      title: true,
      issuer: true,
      issueDate: true,
      credentialUrl: true,
      imageUrl: true,
    },
  });
}