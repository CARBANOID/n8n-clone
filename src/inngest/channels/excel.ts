import { channel , topic } from "@inngest/realtime"

export const EXCEL_CHANNEL_NAME =  "excel-trigger-execution"
export const excelChannel = channel(EXCEL_CHANNEL_NAME).addTopic(
    topic("status").type<{
        nodeId : string,
        status : "loading" | "success" | "error" ;
    }>()
)