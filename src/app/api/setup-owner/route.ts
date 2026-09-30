import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: "lamigudisa94@gmail.com",
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Existing user was not found." },
        { status: 404 }
      );
    }

    const existingAccount = await prisma.account.findFirst({
      where: {
        userId: user.id,
        providerId: "credential",
      },
    });

    if (existingAccount) {
      return NextResponse.json(
        { error: "Credential account already exists." },
        { status: 409 }
      );
    }

    const result = await auth.api.signUpEmail({
      body: {
        name: user.name,
        email: user.email,
        password,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Owner account created successfully.",
      result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create owner account." },
      { status: 500 }
    );
  }
}