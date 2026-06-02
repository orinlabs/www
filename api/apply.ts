/**
 * POST /api/apply
 *
 * Receives a job application from the website and posts it to a Slack
 * incoming webhook. Configure the webhook URL in Vercel as `SLACK_WEBHOOK_URL`.
 *
 * Setup:
 *   1. In Slack, create an Incoming Webhook for the #hiring (or similar) channel.
 *      https://api.slack.com/messaging/webhooks
 *   2. In Vercel, set the env var:
 *        Project Settings → Environment Variables → SLACK_WEBHOOK_URL
 *   3. Redeploy.
 */

export const config = {
  runtime: "edge",
};

interface ApplyPayload {
  roleSlug?: string;
  roleTitle?: string;
  name?: string;
  email?: string;
  links?: string;
  resumeUrl?: string;
  pitch?: string;
}

const MAX_FIELD_LEN = 5000;

function truncate(s: string, n = MAX_FIELD_LEN): string {
  if (s.length <= n) return s;
  return `${s.slice(0, n)}… [truncated]`;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let payload: ApplyPayload;
  try {
    payload = (await req.json()) as ApplyPayload;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const name = (payload.name ?? "").trim();
  const email = (payload.email ?? "").trim();
  const pitch = (payload.pitch ?? "").trim();
  const roleTitle = (payload.roleTitle ?? "Unknown role").trim();
  const roleSlug = (payload.roleSlug ?? "unknown").trim();
  const links = (payload.links ?? "").trim();
  const resumeUrl = (payload.resumeUrl ?? "").trim();

  if (!name || !email.includes("@") || !pitch) {
    return json({ error: "Missing required fields" }, 400);
  }

  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    // Fail loudly so misconfiguration is obvious in logs but don't leak the
    // missing-secret detail to the public response.
    console.error("[apply] SLACK_WEBHOOK_URL is not configured");
    return json({ error: "Server is not configured to accept applications" }, 500);
  }

  const blocks: unknown[] = [
    {
      type: "header",
      text: { type: "plain_text", text: `New application: ${roleTitle}` },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Name:*\n${truncate(name, 200)}` },
        { type: "mrkdwn", text: `*Email:*\n<mailto:${email}|${truncate(email, 200)}>` },
        { type: "mrkdwn", text: `*Role:*\n${truncate(roleTitle, 200)} \`${roleSlug}\`` },
        {
          type: "mrkdwn",
          text: `*Resume:*\n${resumeUrl ? `<${resumeUrl}|link>` : "_none_"}`,
        },
      ],
    },
  ];

  if (links) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*Links:*\n${truncate(links, 1500)}` },
    });
  }

  blocks.push({
    type: "section",
    text: { type: "mrkdwn", text: `*Why Orin:*\n${truncate(pitch, 2500)}` },
  });

  const slackRes = await fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      text: `New application from ${name} for ${roleTitle}`,
      blocks,
    }),
  });

  if (!slackRes.ok) {
    const text = await slackRes.text().catch(() => "");
    console.error("[apply] Slack webhook failed", slackRes.status, text);
    return json({ error: "Failed to deliver application" }, 502);
  }

  return json({ ok: true });
}
