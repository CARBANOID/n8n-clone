import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { StripeTriggerDialog } from "./dialog";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchStripeTriggerRealTimeToken } from "./actions";
import { STRIPE_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/stripe-trigger";

export const StripeTriggerNode = memo((props : NodeProps) =>{
    const [dialogOpen , setDialogOpen] = useState(false) ;
    const handleOpenSettings = () => setDialogOpen(true) ;

    const status : NodeStatus = useNodeStatus({
        nodeId : props.id ,
        channel : STRIPE_TRIGGER_CHANNEL_NAME,
        topic : "status",
        refreshToken : fetchStripeTriggerRealTimeToken
    })
    
    return (
        <>
            <StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
            <BaseTriggerNode 
                {...props}
                icon={"/logos/stripe.svg"}
                name="Stripe"
                description="When stripe event is captured"
                status={status} 
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})