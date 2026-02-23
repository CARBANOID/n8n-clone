"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { useNodeStatus } from "../../hooks/use-node-status";
import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai";
import { fetchOpenAIRequestRealTimeToken } from "./actions";
import { OpenAIDialog, OpenAIFormValues } from "./dialog";

type OpenAINodeData = {
    variableName?: string;
    model?: string;
    credentialId? : string ;
    systemPrompt?: string;
    userPrompt?: string;
};

type OpenAINodeType = Node<OpenAINodeData>;

export const OpenAINode = memo((props: NodeProps<OpenAINodeType>) => {
    const nodeData = props.data;
    const description = (nodeData.userPrompt) ?
        `${nodeData.model || "gpt-5"} : ${nodeData.userPrompt.slice(0, 50)}...`
        : "Not configured";

    const status: NodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: OPENAI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchOpenAIRequestRealTimeToken
    });

    const [dialogOpen, setDialogOpen] = useState(false);
    const handleOpenSettings = () => setDialogOpen(true);

    const { setNodes } = useReactFlow();

    const handleSubmit = (values: OpenAIFormValues) => {
        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === props.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            ...values
                        }
                    }
                }
                return node;
            })
        )
    }

    return (
        <>
            <OpenAIDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={"/logos/openai.svg"}
                name="OpenAI"
                status={status}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})

OpenAINode.displayName = "OpenAINode";