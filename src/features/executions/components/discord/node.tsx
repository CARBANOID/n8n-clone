"use client" ;

import { Node , NodeProps, useReactFlow } from "@xyflow/react" ;
import { memo, useState } from "react" ;
import { BaseExecutionNode } from "../base-execution-node"; 
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchDiscordRequestRealTimeToken } from "./actions";
import { DiscordDialog , DiscordFormValues } from "./dialog";
import { DISCORD_CHANNEL_NAME } from "@/inngest/channels/discord";

type DiscordNodeData = {
    webhookUrl? : string,
    content? : string,
    username? : string
}; 

type DiscordNodeType = Node<DiscordNodeData> ;

export const DiscordNode = memo((props : NodeProps<DiscordNodeType>) => {
    const nodeData = props.data ;
    const description = (nodeData.content) 
                        ? `${nodeData.content.slice(0,50)}...` 
                        : "Not configured" ;

    const status : NodeStatus = useNodeStatus({
        nodeId : props.id,
        channel : DISCORD_CHANNEL_NAME,
        topic : "status",
        refreshToken : fetchDiscordRequestRealTimeToken
    }) ;
    
    const [dialogOpen , setDialogOpen] = useState(false) ;
    const handleOpenSettings = () => setDialogOpen(true) ;

    const { setNodes } = useReactFlow() ;

    const handleSubmit = (values : DiscordFormValues) => {
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
            <DiscordDialog
              open={dialogOpen} 
              onOpenChange={setDialogOpen} 
              onSubmit={handleSubmit}
              defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={"/logos/discord.svg"}
                name="Discord"
                status={status}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})

DiscordNode.displayName = "DiscordNode" ;