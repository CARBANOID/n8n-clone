import { InitialNode } from "@/components/initial-node";
import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { GoogleFormTrigger } from "@/features/trigger/components/google-form-trigger/node";
import { ManualTriggerNode } from "@/features/trigger/components/manual-trigger/node";
import { NodeType } from "@prisma/client";
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
    [NodeType.INITIAL] : InitialNode,
    [NodeType.MANUAL_TRIGGER] : ManualTriggerNode, 
    [NodeType.HTTP_REQUEST] : HttpRequestNode,
    [NodeType.GOOGLE_FORM_TRIGGER] : GoogleFormTrigger
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents ; 