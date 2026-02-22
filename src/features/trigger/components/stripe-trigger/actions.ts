"use server";

import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { getSession } from "better-auth/api";

export type StripeTriggerToken = Realtime.Token<
    typeof stripeTriggerChannel, 
    ["status"]
>;

export async function fetchStripeTriggerRealTimeToken(): Promise<StripeTriggerToken> {
  const userId  =  getSession();
  
  const token = await getSubscriptionToken(inngest, {
    channel: stripeTriggerChannel(),
    topics: ["status"],
  });

  return token;
}