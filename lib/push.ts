import webpush from "web-push";

let configured = false;

function ensureConfigured() {
  if (configured) return;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:hello@peptibrain.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
  configured = true;
}

export type PushSubscriptionRow = { endpoint: string; p256dh: string; auth: string };

export async function sendPush(
  sub: PushSubscriptionRow,
  payload: { title: string; body: string; url?: string }
): Promise<{ ok: boolean; expired: boolean }> {
  ensureConfigured();
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify(payload)
    );
    return { ok: true, expired: false };
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode;
    return { ok: false, expired: status === 404 || status === 410 };
  }
}
