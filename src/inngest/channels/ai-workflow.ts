import { channel , topic } from "@inngest/realtime" ;

export const AI_WORKFLOW_CHANNEL_NAME = "ai-workflow-creation" ;

export type AIWorkflowNode = {
    id      : string ;
    type    : string ;
    position: { x : number ; y : number } ;
    data    : Record<string, unknown> ;
}

export type AIWorkflowEdge = {
    id     : string ;
    source : string ;
    target : string ;
}

export const aiWorkflowChannel = channel(AI_WORKFLOW_CHANNEL_NAME).addTopic(
    topic("workflow").type<{
        workflowId  : string ;
        nodes       : AIWorkflowNode[] ;
        connections : AIWorkflowEdge[] ;
    }>(),
) ; 
