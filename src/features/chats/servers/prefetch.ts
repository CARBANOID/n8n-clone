import type { inferInput } from "@trpc/tanstack-react-query"; 
import { prefetch , trpc } from "@/trpc/server";
import { conversationRouter } from "./routers";


/**
 * Prefetch all conversations Name with their ids
*/

export const prefetchConversationNames = async (workflowId : string) => {
    return prefetch(trpc.conversations.getNames.queryOptions({workflowId}))
} 
