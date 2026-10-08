"use server";

import { prisma } from "@/lib/db";

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email")?.toString();

    if (!email || !email.includes("@")) {
      return { status: "error", message: "Please enter a valid email address." };
    }

    // Upsert to handle existing unsubscribed users re-subscribing
    await prisma.subscriber.upsert({
      where: { email },
      update: { isActive: true, deletedAt: null },
      create: { email, isActive: true },
    });

    return { status: "success", message: "Success! You're on the list for the best deals." };
  } catch (error) {
    console.error("Subscription error:", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }
}
