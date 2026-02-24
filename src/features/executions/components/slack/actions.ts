"use server";

import { slackChannel } from "@/inngest/channels/slack";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { getSession } from "better-auth/api";

export type SlackRequestToken = Realtime.Token<
    typeof slackChannel, 
    ["status"]
>;

export async function fetchSlackRequestRealTimeToken(): Promise<SlackRequestToken> {
  const userId  =  getSession();
  
  const token = await getSubscriptionToken(inngest, {
    channel: slackChannel(),
    topics: ["status"],
  });

  return token;
}