import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const PAYSTACK_SECRET = Deno.env.get("PAYSTACK_SECRET_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  // Validate webhook signature
  const hash = createHmac("sha512", PAYSTACK_SECRET).update(body).digest("hex");
  if (hash !== signature) {
    return new Response("Unauthorized", { status: 401 });
  }

  const event = JSON.parse(body);
  if (event.event !== "charge.success") {
    return new Response("OK", { status: 200 });
  }

  const data = event.data;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  await supabase.from("payments").upsert({
    email: data.customer.email,
    amount: data.amount / 100,
    reference: data.reference,
    status: data.status,
    user_id: data.metadata?.userId ?? null,
  }, { onConflict: "reference" });

  if (data.metadata?.userId) {
    await supabase.from("profiles").update({ is_active_member: true }).eq("id", data.metadata.userId);
  }

  return new Response("OK", { status: 200 });
});
