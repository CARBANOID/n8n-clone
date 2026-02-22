"use server";

import { anthropicChannel } from "@/inngest/channels/anthropic";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { getSession } from "better-auth/api";

export type AnthropicRequestToken = Realtime.Token<
    typeof anthropicChannel, 
    ["status"]
>;

export async function fetchAnthropicRequestRealTimeToken(): Promise<AnthropicRequestToken> {
  const userId  =  getSession();
  
  const token = await getSubscriptionToken(inngest, {
    channel: anthropicChannel(),
    topics: ["status"],
  });

  return token;
}