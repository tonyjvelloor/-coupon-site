"use server";

import { couponService } from "@/lib/services/coupon.service";

export async function voteCouponAction(couponId: string, isSuccess: boolean) {
  try {
    await couponService.voteCoupon(couponId, isSuccess);
    // Avoid global revalidatePath("/", "layout") on every user vote to protect ISR cache & Neon Free compute quota
    return { success: true };
  } catch (error) {
    console.warn("Failed to vote for coupon:", error);
    return { success: false, error: "Failed to submit vote" };
  }
}
