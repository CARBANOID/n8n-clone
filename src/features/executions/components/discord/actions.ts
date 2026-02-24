"use server";

import { discordChannel } from "@/inngest/channels/discord";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { getSession } from "better-auth/api";

export type DiscordRequestToken = Realtime.Token<
    typeof discordChannel, 
    ["status"]
>;

export async function fetchDiscordRequestRealTimeToken(): Promise<DiscordRequestToken> {
  const userId  =  getSession();
  
  const token = await getSubscriptionToken(inngest, {
    channel: discordChannel(),
    topics: ["status"],
  });

  return token;
}