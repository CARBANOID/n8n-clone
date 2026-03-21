"use server";

import { excelChannel } from "@/inngest/channels/excel";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { getSession } from "better-auth/api";

export type ExcelRequestToken = Realtime.Token<
    typeof excelChannel, 
    ["status"]
>;

export async function fetchExcelRequestRealTimeToken(): Promise<ExcelRequestToken> {
  const userId  =  getSession();
  
  const token = await getSubscriptionToken(inngest, {
    channel: excelChannel(),
    topics: ["status"],
  });

  return token;
}