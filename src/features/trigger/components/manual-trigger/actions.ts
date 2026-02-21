"use server";

import { inngest } from "@/inngest/client";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { getSession } from "better-auth/api";

export type ManualTriggerToken = Realtime.Token<
    typeof manualTriggerChannel, 
    ["status"]
>;

export async function fetchManualTriggerRealTimeToken(): Promise<ManualTriggerToken> {
  const userId  =  getSession();
  
  const token = await getSubscriptionToken(inngest, {
    channel: manualTriggerChannel(),
    topics: ["status"],
  });

  return token;
}