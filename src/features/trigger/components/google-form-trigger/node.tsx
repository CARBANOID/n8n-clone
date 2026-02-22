import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { GoogleFormTriggerDialog } from "./dialog";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchGoogleFormTriggerRealTimeToken } from "./actions";
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/google-form-trigger";

export const GoogleFormTrigger = memo((props : NodeProps) =>{
    const [dialogOpen , setDialogOpen] = useState(false) ;
    const handleOpenSettings = () => setDialogOpen(true) ;

    const status : NodeStatus = useNodeStatus({
        nodeId : props.id ,
        channel : GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
        topic : "status",
        refreshToken : fetchGoogleFormTriggerRealTimeToken
    })
    
    return (
        <>
            <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
            <BaseTriggerNode 
                {...props}
                icon={"/logos/googleform.svg"}
                name="Google Form"
                description="When form is submitted"
                status={status} 
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})