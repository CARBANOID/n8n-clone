"use server";

import { inngest } from "@/inngest/client";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { getSession } from "better-auth/api";

export type HttpRequestToken = Realtime.Token<
    typeof httpRequestChannel, 
    ["status"]
>;

export async function fetchHttpRequestRealTimeToken(): Promise<HttpRequestToken> {
  const userId  =  getSession();
  
  const token = await getSubscriptionToken(inngest, {
    channel: httpRequestChannel(),
    topics: ["status"],
  });

  return token;
}