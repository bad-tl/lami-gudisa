
"use server";

import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactMessageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name is too long."),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .max(200, "Email is too long."),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(5000, "Message is too long."),
});

export async function sendContactMessage(formData: FormData) {
  const rawData = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

//   const website = String(formData.get("website") ?? "");

//   // Honeypot: bots should never fill this hidden field.
//   if (website) {
//     return {
//       success: true,
//     };
//   }

  const result = contactMessageSchema.safeParse(rawData);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;

    console.error("❌ Contact validation errors:", fieldErrors);

    return {
      success: false,
      error: "Please check your information and try again.",
      fieldErrors,
    };
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY is not configured.");

    return {
      success: false,
      error: "Email service is not configured.",
    };
  }

  const { name, email, message } = result.data;

  try {
    console.log("📨 Sending contact email to Resend...");
    console.log("From:", "onboarding@resend.dev");
    console.log("To:", process.env.CONTACT_EMAIL);
    console.log("Reply-To:", email);

    const { data, error } = await resend.emails.send({
      from: "Lami Gudisa Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_EMAIL ?? "lamigudisa94@gmail.com"],
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    console.log("📬 Resend response:", {
      data,
      error,
    });

    if (error) {
      console.error("❌ Resend error:", error);

      return {
        success: false,
        error: "We could not send your message. Please try again.",
      };
    }

    console.log("✅ Resend accepted the email.");

    return {
      success: true,
    };
  } catch (error) {
    console.error("❌ Contact email error:", error);

    return {
      success: false,
      error: "Something went wrong while sending your message.",
    };
  }
}

