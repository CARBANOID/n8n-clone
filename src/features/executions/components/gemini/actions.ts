"use server";

import { geminiChannel } from "@/inngest/channels/gemini";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { getSession } from "better-auth/api";

export type GeminiRequestToken = Realtime.Token<
    typeof geminiChannel, 
    ["status"]
>;

export async function fetchGeminiRequestRealTimeToken(): Promise<GeminiRequestToken> {
  const userId  =  getSession();
  
  const token = await getSubscriptionToken(inngest, {
    channel: geminiChannel(),
    topics: ["status"],
  });

  return token;
}