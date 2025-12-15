import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

export default async function CheckoutPage() {
  const token = (await cookies()).get("token")?.value;

  if (!token) redirect("/login");

  try {
    verifyToken(token);
  } catch {
    redirect("/login");
  }

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1>Checkout</h1>
      <p>Тут буде оформлення замовлення ✅</p>
    </div>
  );
}
