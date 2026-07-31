/**
 * Supabase Edge Function: email the driver when their vehicle is verified.
 *
 * Secrets (Dashboard → Edge Functions → Secrets, or `supabase secrets set`):
 *   RESEND_API_KEY
 *   RESEND_FROM_EMAIL   e.g. Carprise <support@carprise.co.uk>
 *
 * Called by a Database Webhook on public.vehicles UPDATE, or by the SQL
 * trigger helper in vehicle-verified-notify.sql.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const RESEND_FROM =
  Deno.env.get("RESEND_FROM_EMAIL") ?? "Carprise <support@carprise.co.uk>";
const APP_URL =
  Deno.env.get("DRIVER_APP_URL") ?? "https://www.carprise.co.uk/drive";

type VehicleRow = {
  id: string;
  driver_id: string;
  make: string | null;
  model: string | null;
  registration: string | null;
  verification_status: string | null;
};

type WebhookPayload = {
  type?: string;
  table?: string;
  record?: VehicleRow;
  old_record?: VehicleRow;
  // Direct invoke shape
  vehicle_id?: string;
  driver_id?: string;
};

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!RESEND_API_KEY) {
    return json({ error: "Missing RESEND_API_KEY secret" }, 500);
  }

  let body: WebhookPayload;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const record = body.record;
  const oldRecord = body.old_record;

  // Only fire when status becomes verified
  const becameVerified =
    record?.verification_status === "verified" &&
    oldRecord?.verification_status !== "verified";

  if (body.type === "UPDATE" && !becameVerified) {
    return json({ skipped: true, reason: "status did not become verified" });
  }

  const driverId = record?.driver_id ?? body.driver_id;
  if (!driverId) {
    return json({ error: "Missing driver_id" }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!supabaseUrl || !serviceKey) {
    return json({ error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" }, 500);
  }

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: userData, error: userError } = await admin.auth.admin.getUserById(driverId);
  if (userError || !userData.user?.email) {
    return json({ error: userError?.message ?? "Driver email not found" }, 404);
  }

  const email = userData.user.email;
  const firstName =
    (userData.user.user_metadata?.first_name as string | undefined)?.trim() ||
    "driver";
  const vehicleLabel = [record?.year, record?.make, record?.model]
    .filter(Boolean)
    .join(" ")
    .trim() || "your vehicle";
  const reg = record?.registration ? ` (${record.registration})` : "";

  const subject = "Your vehicle has been verified – Carprise";
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#08090b">
      <h2 style="font-weight:500">You're verified</h2>
      <p>Hi ${escapeHtml(firstName)},</p>
      <p>
        Great news – <strong>${escapeHtml(vehicleLabel)}${escapeHtml(reg)}</strong>
        has been reviewed and approved for the Carprise driver network.
      </p>
      <p>
        You can now take part in matched campaigns. Open the driver app to check
        for invitations and keep your profile up to date.
      </p>
      <p>
        <a href="${APP_URL}" style="display:inline-block;padding:12px 18px;background:#08090b;color:#f3f0e8;text-decoration:none;font-weight:700">
          Open driver app
        </a>
      </p>
      <p style="color:#5d5c58;font-size:13px">
        Questions? Reply to this email or contact
        <a href="mailto:support@carprise.co.uk">support@carprise.co.uk</a>.
      </p>
      <p>- The Carprise team</p>
    </div>
  `;
  const text = [
    `Hi ${firstName},`,
    "",
    `Great news – ${vehicleLabel}${reg} has been reviewed and approved for the Carprise driver network.`,
    "",
    `Open the driver app: ${APP_URL}`,
    "",
    "Questions? support@carprise.co.uk",
    "- The Carprise team",
  ].join("\n");

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [email],
      subject,
      html,
      text,
    }),
  });

  if (!resendRes.ok) {
    const detail = await resendRes.text();
    return json({ error: "Resend failed", detail }, 502);
  }

  const result = await resendRes.json();
  return json({ ok: true, email, id: result.id });
});

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
