"use server";

import { openAIChannel } from "@/inngest/channels/openai";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { getSession } from "better-auth/api";

export type OpenAIRequestToken = Realtime.Token<
  typeof openAIChannel,
  ["status"]
>;

export async function fetchOpenAIRequestRealTimeToken(): Promise<OpenAIRequestToken> {
  const userId = getSession();

  const token = await getSubscriptionToken(inngest, {
    channel: openAIChannel(),
    topics: ["status"],
  });

  return token;
}