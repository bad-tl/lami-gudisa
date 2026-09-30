"use server";

import { headers } from "next/headers";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteCloudinaryImage } from "@/lib/cloudinary";
import { certificateSchema } from "@/lib/validations/certificate";

async function requireOwner() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized.");
  }

  return session;
}

function parseCertificateData(data: unknown) {
  const result = certificateSchema.safeParse(data);

  if (!result.success) {
    throw new Error(
      result.error.issues[0]?.message ??
        "Invalid certificate data.",
    );
  }

  return result.data;
}

export async function getCertificateItems() {
  await requireOwner();

  return prisma.certificate.findMany({
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "asc" },
    ],
  });
}

export async function getCertificateItem(id: string) {
  await requireOwner();

  return prisma.certificate.findUnique({
    where: { id },
  });
}

export async function createCertificate(data: unknown) {
  await requireOwner();

  const validated = parseCertificateData(data);

  const lastCertificate =
    await prisma.certificate.findFirst({
      orderBy: {
        sortOrder: "desc",
      },
      select: {
        sortOrder: true,
      },
    });

  const sortOrder =
    (lastCertificate?.sortOrder ?? -1) + 1;

  const certificate =
    await prisma.certificate.create({
      data: {
        id: randomUUID(),
        title: validated.title,
        issuer: validated.issuer || null,
        issueDate: validated.issueDate
          ? new Date(validated.issueDate)
          : null,
        credentialId:
          validated.credentialId || null,
        credentialUrl:
          validated.credentialUrl || null,
        description:
          validated.description || null,
        imageUrl:
          validated.imageUrl || null,
        imagePublicId:
          validated.imagePublicId || null,
        sortOrder,
        status: "DRAFT",
      },
    });

  revalidatePath("/dashboard/certificates");
  revalidatePath("/");

  return certificate;
}

export async function updateCertificate(
  id: string,
  data: unknown,
) {
  await requireOwner();

  const validated = parseCertificateData(data);

  const existing =
    await prisma.certificate.findUnique({
      where: { id },
    });

  if (!existing) {
    throw new Error("Certificate not found.");
  }

  const imageChanged =
    existing.imagePublicId !==
      (validated.imagePublicId || null);

  const certificate =
    await prisma.certificate.update({
      where: { id },
      data: {
        title: validated.title,
        issuer: validated.issuer || null,
        issueDate: validated.issueDate
          ? new Date(validated.issueDate)
          : null,
        credentialId:
          validated.credentialId || null,
        credentialUrl:
          validated.credentialUrl || null,
        description:
          validated.description || null,
        imageUrl:
          validated.imageUrl || null,
        imagePublicId:
          validated.imagePublicId || null,
      },
    });

  if (
    imageChanged &&
    existing.imagePublicId
  ) {
    try {
      await deleteCloudinaryImage(
        existing.imagePublicId,
      );
    } catch (error) {
      console.error(
        "Failed to delete previous certificate image:",
        error,
      );
    }
  }

  revalidatePath("/dashboard/certificates");
  revalidatePath("/");

  return certificate;
}

export async function publishCertificate(
  id: string,
) {
  await requireOwner();

  const certificate =
    await prisma.certificate.update({
      where: { id },
      data: {
        status: "PUBLISHED",
      },
    });

  revalidatePath("/dashboard/certificates");
  revalidatePath("/");

  return certificate;
}

export async function unpublishCertificate(
  id: string,
) {
  await requireOwner();

  const certificate =
    await prisma.certificate.update({
      where: { id },
      data: {
        status: "DRAFT",
      },
    });

  revalidatePath("/dashboard/certificates");
  revalidatePath("/");

  return certificate;
}

export async function deleteCertificate(
  id: string,
) {
  await requireOwner();

  const certificate =
    await prisma.certificate.findUnique({
      where: { id },
    });

  if (!certificate) {
    throw new Error("Certificate not found.");
  }

  if (certificate.imagePublicId) {
    try {
      await deleteCloudinaryImage(
        certificate.imagePublicId,
      );
    } catch (error) {
      console.error(
        "Failed to delete certificate image:",
        error,
      );
    }
  }

  await prisma.certificate.delete({
    where: { id },
  });

  revalidatePath("/dashboard/certificates");
  revalidatePath("/");

  return {
    success: true,
  };
}

export async function reorderCertificate(
  id: string,
  direction: "up" | "down",
) {
  await requireOwner();

  const certificates =
    await prisma.certificate.findMany({
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "asc" },
      ],
    });

  const currentIndex =
    certificates.findIndex(
      (certificate) =>
        certificate.id === id,
    );

  if (currentIndex === -1) {
    throw new Error("Certificate not found.");
  }

  const targetIndex =
    direction === "up"
      ? currentIndex - 1
      : currentIndex + 1;

  if (
    targetIndex < 0 ||
    targetIndex >= certificates.length
  ) {
    return {
      success: true,
    };
  }

  const current =
    certificates[currentIndex];

  const target =
    certificates[targetIndex];

  await prisma.$transaction([
    prisma.certificate.update({
      where: { id: current.id },
      data: {
        sortOrder: target.sortOrder,
      },
    }),
    prisma.certificate.update({
      where: { id: target.id },
      data: {
        sortOrder: current.sortOrder,
      },
    }),
  ]);

  revalidatePath("/dashboard/certificates");
  revalidatePath("/");

  return {
    success: true,
  };
}