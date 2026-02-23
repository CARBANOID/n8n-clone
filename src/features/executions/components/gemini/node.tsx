"use client" ;

import { Node , NodeProps, useReactFlow } from "@xyflow/react" ;
import { memo, useState } from "react" ;
import { BaseExecutionNode } from "../base-execution-node"; 
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchGeminiRequestRealTimeToken } from "./actions";
import { GeminiDialog , GeminiFormValues } from "./dialog";
import { GEMINI_CHANNEL_NAME } from "@/inngest/channels/gemini";

type GeminiNodeData = {
    variableName? : string ;
    model? : string ;
    credentialId? : string ;
    systemPrompt?: string ;
    userPrompt?: string ;
}; 

type GeminiNodeType = Node<GeminiNodeData> ;

export const GeminiNode = memo((props : NodeProps<GeminiNodeType>) => {
    const nodeData = props.data ;
    const description = (nodeData.userPrompt) ? 
                        `${nodeData.model || "gemini-2.5-flash"} : ${nodeData.userPrompt.slice(0,50)}...` 
                        : "Not configured" ;

    const status : NodeStatus = useNodeStatus({
        nodeId : props.id,
        channel : GEMINI_CHANNEL_NAME,
        topic : "status",
        refreshToken : fetchGeminiRequestRealTimeToken
    }) ;
    
    const [dialogOpen , setDialogOpen] = useState(false) ;
    const handleOpenSettings = () => setDialogOpen(true) ;

    const { setNodes } = useReactFlow() ;

    const handleSubmit = (values : GeminiFormValues) => {
        setNodes((nodes) =>
            nodes.map((node) =>{
                if(node.id === props.id){
                    return {
                        ...node,
                        data : {
                            ...node.data ,
                            ...values
                        }
                    }
                }
                return node ;
            })
        )
    }

    return (
        <>
            <GeminiDialog
              open={dialogOpen} 
              onOpenChange={setDialogOpen} 
              onSubmit={handleSubmit}
              defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={"/logos/gemini.svg"}
                name="Gemini"
                status={status}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})

GeminiNode.displayName = "GeminiNode" ;