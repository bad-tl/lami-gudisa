"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

async function requireOwner() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized.");
  }

  return session;
}

export async function uploadCertificateImage(
  formData: FormData,
) {
  await requireOwner();

  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw new Error("No certificate image was provided.");
  }

  const result = await uploadImage(
    file,
    "certificates",
  );

  return {
    success: true,
    imageUrl: result.imageUrl,
    imagePublicId: result.imagePublicId,
  };
}