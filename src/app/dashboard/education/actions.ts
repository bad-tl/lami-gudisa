"use server";

import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  educationSchema,
  type EducationFormData,
} from "@/lib/validations/education";

async function requireOwner() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized.");
  }

  return session;
}

export async function getEducations() {
  await requireOwner();

  return prisma.education.findMany({
    orderBy: [
      { sortOrder: "asc" },
      { startDate: "desc" },
    ],
  });
}

export async function getEducation(id: string) {
  await requireOwner();

  return prisma.education.findUnique({
    where: { id },
  });
}

export async function createEducation(data: EducationFormData) {
  await requireOwner();

  const validatedData = educationSchema.parse(data);

  const lastEducation = await prisma.education.findFirst({
    orderBy: {
      sortOrder: "desc",
    },
    select: {
      sortOrder: true,
    },
  });

  const education = await prisma.education.create({
    data: {
      id: randomUUID(),
      degree: validatedData.degree,
      field: validatedData.field || null,
      institution: validatedData.institution,
      location: validatedData.location || null,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate ?? null,
      isCurrent: validatedData.isCurrent,
      description: validatedData.description || null,
      sortOrder: (lastEducation?.sortOrder ?? -1) + 1,
      status: "DRAFT",
    },
  });

  revalidatePath("/dashboard/education");
  revalidatePath("/");

  return {
    success: true,
    education,
  };
}

export async function updateEducation(
  id: string,
  data: EducationFormData,
) {
  await requireOwner();

  const validatedData = educationSchema.parse(data);

  const existingEducation = await prisma.education.findUnique({
    where: { id },
  });

  if (!existingEducation) {
    throw new Error("Education record not found.");
  }

  const education = await prisma.education.update({
    where: { id },
    data: {
      degree: validatedData.degree,
      field: validatedData.field || null,
      institution: validatedData.institution,
      location: validatedData.location || null,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate ?? null,
      isCurrent: validatedData.isCurrent,
      description: validatedData.description || null,
    },
  });

  revalidatePath("/dashboard/education");
  revalidatePath("/");

  return {
    success: true,
    education,
  };
}

export async function publishEducation(
  id: string,
) {
  await requireOwner();

  const existingEducation = await prisma.education.findUnique({
    where: { id },
  });

  if (!existingEducation) {
    throw new Error("Education record not found.");
  }

  const education = await prisma.education.update({
    where: { id },
    data: {
      status: "PUBLISHED",
    },
  });

  revalidatePath("/dashboard/education");
  revalidatePath("/");

  return {
    success: true,
    education,
  };
}

export async function unpublishEducation(
  id: string,
) {
  await requireOwner();

  const existingEducation = await prisma.education.findUnique({
    where: { id },
  });

  if (!existingEducation) {
    throw new Error("Education record not found.");
  }

  const education = await prisma.education.update({
    where: { id },
    data: {
      status: "DRAFT",
    },
  });

  revalidatePath("/dashboard/education");
  revalidatePath("/");

  return {
    success: true,
    education,
  };
}

export async function deleteEducation(id: string) {
  await requireOwner();

  const existingEducation = await prisma.education.findUnique({
    where: { id },
  });

  if (!existingEducation) {
    throw new Error("Education record not found.");
  }

  await prisma.education.delete({
    where: { id },
  });

  revalidatePath("/dashboard/education");
  revalidatePath("/");

  return {
    success: true,
  };
}

export async function reorderEducation(
  id: string,
  direction: "up" | "down",
) {
  await requireOwner();

  const education = await prisma.education.findUnique({
    where: { id },
    select: {
      id: true,
      sortOrder: true,
    },
  });

  if (!education) {
    throw new Error("Education record not found.");
  }

  const adjacentEducation =
    direction === "up"
      ? await prisma.education.findFirst({
          where: {
            sortOrder: {
              lt: education.sortOrder,
            },
          },
          orderBy: {
            sortOrder: "desc",
          },
          select: {
            id: true,
            sortOrder: true,
          },
        })
      : await prisma.education.findFirst({
          where: {
            sortOrder: {
              gt: education.sortOrder,
            },
          },
          orderBy: {
            sortOrder: "asc",
          },
          select: {
            id: true,
            sortOrder: true,
          },
        });

  if (!adjacentEducation) {
    return {
      success: true,
    };
  }

  await prisma.$transaction([
    prisma.education.update({
      where: { id: education.id },
      data: {
        sortOrder: adjacentEducation.sortOrder,
      },
    }),

    prisma.education.update({
      where: { id: adjacentEducation.id },
      data: {
        sortOrder: education.sortOrder,
      },
    }),
  ]);

  revalidatePath("/dashboard/education");
  revalidatePath("/");

  return {
    success: true,
  };
}