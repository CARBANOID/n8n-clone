"use server";

import { inngest } from "@/inngest/client";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { getSession } from "better-auth/api";

export type GoogleFormTriggerToken = Realtime.Token<
    typeof googleFormTriggerChannel, 
    ["status"]
>;

export async function fetchGoogleFormTriggerRealTimeToken(): Promise<GoogleFormTriggerToken> {
  const userId  =  getSession();
  
  const token = await getSubscriptionToken(inngest, {
    channel: googleFormTriggerChannel(),
    topics: ["status"],
  });

  return token;
}