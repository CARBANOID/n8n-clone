"use client" ;

import { Node , NodeProps, useReactFlow } from "@xyflow/react" ;
import { memo, useState } from "react" ;
import { BaseExecutionNode } from "../base-execution-node"; 
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { useNodeStatus } from "../../hooks/use-node-status";
import { SlackDialog , SlackFormValues } from "./dialog";
import { fetchSlackRequestRealTimeToken } from "./actions";
import { SLACK_CHANNEL_NAME } from "@/inngest/channels/slack";

type SlackNodeData = {
    webhookUrl? : string,
    content? : string,
}; 

type SlackNodeType = Node<SlackNodeData> ;

export const SlackNode = memo((props : NodeProps<SlackNodeType>) => {
    const nodeData = props.data ;
    const description = (nodeData.content) 
                        ? `${nodeData.content.slice(0,50)}...` 
                        : "Not configured" ;

    const status : NodeStatus = useNodeStatus({
        nodeId : props.id,
        channel : SLACK_CHANNEL_NAME,
        topic : "status",
        refreshToken : fetchSlackRequestRealTimeToken
    }) ;
    
    const [dialogOpen , setDialogOpen] = useState(false) ;
    const handleOpenSettings = () => setDialogOpen(true) ;

    const { setNodes } = useReactFlow() ;

    const handleSubmit = (values : SlackFormValues) => {
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
            <SlackDialog
              open={dialogOpen} 
              onOpenChange={setDialogOpen} 
              onSubmit={handleSubmit}
              defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={"/logos/slack.svg"}
                name="Slack"
                status={status}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})

SlackNode.displayName = "SlackNode" ;