import Razorpay from "razorpay";

/**
 * Server-only Razorpay instance.
 * Never import in client components.
 */
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
});
