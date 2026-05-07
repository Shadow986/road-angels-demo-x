import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PAYSTACK_SECRET = Deno.env.get("PAYSTACK_SECRET_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  const { reference, userId } = await req.json();

  // Verify with Paystack
  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
  });
  const { data } = await res.json();

  if (data?.status !== "success") {
    return new Response(JSON.stringify({ error: "Payment not successful" }), { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Save payment record
  await supabase.from("payments").upsert({
    email: data.customer.email,
    amount: data.amount / 100,
    reference: data.reference,
    status: data.status,
    user_id: userId,
  }, { onConflict: "reference" });

  // Mark user as active member
  await supabase.from("profiles").update({ is_active_member: true }).eq("id", userId);

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
