"use client";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import CheckoutSkeleton from "./checkoutSkeleton";
import CheckoutSuspense from "./checkoutSkeleton";

function CheckoutPage() {
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!paypalClientId) {
    // กรณีที่ PAYPAL_CLIENT_ID ไม่ถูกกำหนด คุณอาจจะแสดงข้อความ error
    // หรือทำการ redirect ไปหน้าอื่น
    console.error("PayPal Client ID is not defined.");
    return <div>Error: PayPal Client ID is missing.</div>;
  }

  const option = {
    clientId: paypalClientId,
  };
  return (
    <PayPalScriptProvider options={option}>
      <CheckoutSuspense />
    </PayPalScriptProvider>
  );
}

export default CheckoutPage;
