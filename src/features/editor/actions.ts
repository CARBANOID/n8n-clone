"use server";

import { inngest } from "@/inngest/client";
import { aiWorkflowChannel } from "@/inngest/channels/ai-workflow";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type AIWorkflowToken = Realtime.Token<
    typeof aiWorkflowChannel, 
    ["workflow"]
>;

export async function fetchAIWorkflowRealTimeToken(workflowId: string): Promise<AIWorkflowToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: aiWorkflowChannel(),
    topics: ["workflow"],
  });

  return token;
}
