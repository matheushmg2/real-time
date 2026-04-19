import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/nextjs/webhooks";
import { Webhook } from "svix";

import { internal } from "./_generated/api";

const validadePayload = async (
  req: Request,
): Promise<WebhookEvent | undefined> => {
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("Missing svix headers");
    return;
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET_KEY;

  if (!webhookSecret) {
    console.error("Missing CLERK_WEBHOOK_SECRET_KEY");
    return;
  }

  const webhook = new Webhook(webhookSecret);

  try {
    const event = webhook.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;

    return event;
  } catch (error) {
    console.error("Clerk webhook verification failed:", error);
    return;
  }
};

const handleClerkWebhook = httpAction(async (ctx, req) => {
  const event = await validadePayload(req);

  if (!event) {
    return new Response("Could not validate Clerk payload", {
      status: 400,
    });
  }

  if (!event.type.startsWith("user.")) {
    return new Response(null, { status: 200 });
  }

  switch (event.type) {
    case "user.created": {
      const existingUser = await ctx.runQuery(internal.user.get, {
        clerkId: event.data.id,
      });

      if (!existingUser) {
        await ctx.runMutation(internal.user.create, {
          username:
            `${event.data.first_name || ""} ${event.data.last_name || ""}`.trim(),
          imageUrl: event.data.image_url,
          clerkId: event.data.id,
          email: event.data.email_addresses?.[0]?.email_address || "",
        });
      }

      break;
    }

    case "user.updated": {
      await ctx.runMutation(internal.user.update, {
        clerkId: event.data.id,
        username:
          `${event.data.first_name || ""} ${event.data.last_name || ""}`.trim(),
        imageUrl: event.data.image_url,
        email: event.data.email_addresses?.[0]?.email_address || "",
      });

      break;
    }

    default:
      console.log(`Clerk webhook event not supported: ${event.type}`);
      break;
  }

  return new Response(null, {
    status: 200,
  });
});

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

export default http;
