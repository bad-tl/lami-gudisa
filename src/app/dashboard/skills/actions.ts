"use server";

import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  skillSchema,
  type SkillFormData,
} from "@/lib/validations/skill";

async function requireOwner() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized.");
  }

  return session;
}

export async function getSkills() {
  await requireOwner();

  return prisma.skill.findMany({
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });
}

export async function getSkill(id: string) {
  await requireOwner();

  return prisma.skill.findUnique({
    where: { id },
  });
}

export async function createSkill(data: SkillFormData) {
  await requireOwner();

  const validatedData = skillSchema.parse(data);

  const lastSkill = await prisma.skill.findFirst({
    orderBy: {
      sortOrder: "desc",
    },
    select: {
      sortOrder: true,
    },
  });

  const skill = await prisma.skill.create({
    data: {
      id: randomUUID(),
      name: validatedData.name,
      category: validatedData.category || null,
      level: validatedData.level ?? null,
      icon: validatedData.icon || null,
      sortOrder: (lastSkill?.sortOrder ?? -1) + 1,
      status: "DRAFT",
    },
  });

  revalidatePath("/dashboard/skills");
  revalidatePath("/");

  return {
    success: true,
    skill,
  };
}

export async function updateSkill(
  id: string,
  data: SkillFormData,
) {
  await requireOwner();

  const validatedData = skillSchema.parse(data);

  const existingSkill = await prisma.skill.findUnique({
    where: { id },
  });

  if (!existingSkill) {
    throw new Error("Skill not found.");
  }

  const skill = await prisma.skill.update({
    where: { id },
    data: {
      name: validatedData.name,
      category: validatedData.category || null,
      level: validatedData.level ?? null,
      icon: validatedData.icon || null,
    },
  });

  revalidatePath("/dashboard/skills");
  revalidatePath("/");

  return {
    success: true,
    skill,
  };
}

export async function publishSkill(id: string) {
  await requireOwner();

  const existingSkill = await prisma.skill.findUnique({
    where: { id },
  });

  if (!existingSkill) {
    throw new Error("Skill not found.");
  }

  const skill = await prisma.skill.update({
    where: { id },
    data: {
      status: "PUBLISHED",
    },
  });

  revalidatePath("/dashboard/skills");
  revalidatePath("/");

  return {
    success: true,
    skill,
  };
}

export async function unpublishSkill(id: string) {
  await requireOwner();

  const existingSkill = await prisma.skill.findUnique({
    where: { id },
  });

  if (!existingSkill) {
    throw new Error("Skill not found.");
  }

  const skill = await prisma.skill.update({
    where: { id },
    data: {
      status: "DRAFT",
    },
  });

  revalidatePath("/dashboard/skills");
  revalidatePath("/");

  return {
    success: true,
    skill,
  };
}

export async function deleteSkill(id: string) {
  await requireOwner();

  const existingSkill = await prisma.skill.findUnique({
    where: { id },
  });

  if (!existingSkill) {
    throw new Error("Skill not found.");
  }

  await prisma.skill.delete({
    where: { id },
  });

  revalidatePath("/dashboard/skills");
  revalidatePath("/");

  return {
    success: true,
  };
}

export async function reorderSkill(
  id: string,
  direction: "up" | "down",
) {
  await requireOwner();

  const skill = await prisma.skill.findUnique({
    where: { id },
    select: {
      id: true,
      sortOrder: true,
    },
  });

  if (!skill) {
    throw new Error("Skill not found.");
  }

  const adjacentSkill =
    direction === "up"
      ? await prisma.skill.findFirst({
          where: {
            sortOrder: {
              lt: skill.sortOrder,
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
      : await prisma.skill.findFirst({
          where: {
            sortOrder: {
              gt: skill.sortOrder,
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

  if (!adjacentSkill) {
    return {
      success: true,
    };
  }

  await prisma.$transaction([
    prisma.skill.update({
      where: { id: skill.id },
      data: {
        sortOrder: adjacentSkill.sortOrder,
      },
    }),

    prisma.skill.update({
      where: { id: adjacentSkill.id },
      data: {
        sortOrder: skill.sortOrder,
      },
    }),
  ]);

  revalidatePath("/dashboard/skills");
  revalidatePath("/");

  return {
    success: true,
  };
}