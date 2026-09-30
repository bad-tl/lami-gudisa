"use server";

import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  experienceSchema,
  type ExperienceFormData,
} from "@/lib/validations/experience";

async function requireOwner() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized.");
  }

  return session;
}

/* -------------------------------------------------------------------------- */
/* GET ALL EXPERIENCES                                                        */
/* -------------------------------------------------------------------------- */

export async function getExperiences() {
  await requireOwner();

  return prisma.experience.findMany({
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

/* -------------------------------------------------------------------------- */
/* GET SINGLE EXPERIENCE                                                      */
/* -------------------------------------------------------------------------- */

export async function getExperience(id: string) {
  await requireOwner();

  return prisma.experience.findUnique({
    where: {
      id,
    },
  });
}

/* -------------------------------------------------------------------------- */
/* SAVE EXPERIENCE                                                            */
/* -------------------------------------------------------------------------- */

async function saveExperienceData(
  id: string | null,
  data: ExperienceFormData,
  status: "DRAFT" | "PUBLISHED",
) {
  await requireOwner();

  const validatedData = experienceSchema.parse(data);

  const experienceData = {
    position: validatedData.position,
    company: validatedData.company,
    employmentType:
      validatedData.employmentType || null,
    location: validatedData.location || null,

    startDate: validatedData.startDate,

    endDate: validatedData.isCurrent
      ? null
      : validatedData.endDate ?? null,

    isCurrent: validatedData.isCurrent,

    description:
      validatedData.description || null,

    achievements:
      validatedData.achievements || null,

    status,
  };

  let experience;

  if (id) {
    experience = await prisma.experience.update({
      where: {
        id,
      },
      data: experienceData,
    });
  } else {
    const lastExperience =
      await prisma.experience.findFirst({
        orderBy: {
          sortOrder: "desc",
        },
        select: {
          sortOrder: true,
        },
      });

    const nextSortOrder =
      (lastExperience?.sortOrder ?? -1) + 1;

    experience = await prisma.experience.create({
      data: {
        id: randomUUID(),
        ...experienceData,
        sortOrder: nextSortOrder,
      },
    });
  }

  revalidatePath("/dashboard/experience");
  revalidatePath("/");

  return {
    success: true,
    experience,
  };
}

/* -------------------------------------------------------------------------- */
/* CREATE                                                                     */
/* -------------------------------------------------------------------------- */

export async function createExperience(
  data: ExperienceFormData,
) {
  return saveExperienceData(null, data, "DRAFT");
}

/* -------------------------------------------------------------------------- */
/* UPDATE                                                                     */
/* -------------------------------------------------------------------------- */

export async function updateExperience(
  id: string,
  data: ExperienceFormData,
) {
  return saveExperienceData(id, data, "DRAFT");
}

/* -------------------------------------------------------------------------- */
/* PUBLISH                                                                    */
/* -------------------------------------------------------------------------- */

export async function publishExperience(
  id: string,
  data: ExperienceFormData,
) {
  return saveExperienceData(id, data, "PUBLISHED");
}

/* -------------------------------------------------------------------------- */
/* DELETE                                                                     */
/* -------------------------------------------------------------------------- */

export async function deleteExperience(id: string) {
  await requireOwner();

  const existingExperience =
    await prisma.experience.findUnique({
      where: {
        id,
      },
    });

  if (!existingExperience) {
    throw new Error("Experience not found.");
  }

  await prisma.experience.delete({
    where: {
      id,
    },
  });

  revalidatePath("/dashboard/experience");
  revalidatePath("/");

  return {
    success: true,
  };
}

/* -------------------------------------------------------------------------- */
/* UNPUBLISH                                                                  */
/* -------------------------------------------------------------------------- */

export async function unpublishExperience(
  id: string,
) {
  await requireOwner();

  const experience =
    await prisma.experience.update({
      where: {
        id,
      },
      data: {
        status: "DRAFT",
      },
    });

  revalidatePath("/dashboard/experience");
  revalidatePath("/");

  return {
    success: true,
    experience,
  };
}

/* -------------------------------------------------------------------------- */
/* REORDER                                                                    */
/* -------------------------------------------------------------------------- */

export async function reorderExperience(
  id: string,
  direction: "up" | "down",
) {
  await requireOwner();

  const experiences =
    await prisma.experience.findMany({
      orderBy: {
        sortOrder: "asc",
      },
    });

  const currentIndex = experiences.findIndex(
    (experience) => experience.id === id,
  );

  if (currentIndex === -1) {
    throw new Error("Experience not found.");
  }

  const targetIndex =
    direction === "up"
      ? currentIndex - 1
      : currentIndex + 1;

  if (
    targetIndex < 0 ||
    targetIndex >= experiences.length
  ) {
    return {
      success: true,
    };
  }

  const current = experiences[currentIndex];
  const target = experiences[targetIndex];

  await prisma.$transaction([
    prisma.experience.update({
      where: {
        id: current.id,
      },
      data: {
        sortOrder: target.sortOrder,
      },
    }),

    prisma.experience.update({
      where: {
        id: target.id,
      },
      data: {
        sortOrder: current.sortOrder,
      },
    }),
  ]);

  revalidatePath("/dashboard/experience");
  revalidatePath("/");

  return {
    success: true,
  };
}