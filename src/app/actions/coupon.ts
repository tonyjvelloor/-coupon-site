"use server";

import { couponService } from "@/lib/services/coupon.service";
import { revalidatePath } from "next/cache";

export async function voteCouponAction(couponId: string, isSuccess: boolean) {
  try {
    await couponService.voteCoupon(couponId, isSuccess);
    // Revalidate paths that might show the coupon's success rate
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to vote for coupon:", error);
    return { success: false, error: "Failed to submit vote" };
  }
}
