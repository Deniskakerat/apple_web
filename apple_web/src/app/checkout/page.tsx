import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

export default async function CheckoutPage() {
  const jar = await cookies();
  const token = jar.get("token")?.value;

  if (!token) redirect("/login?next=/checkout");

  try { verifyToken(token); }
  catch { redirect("/login?next=/checkout"); }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h1>Оформлення замовлення</h1>
      <p>Тут зробимо форму і створення ордеру.</p>
    </div>
  );
}
