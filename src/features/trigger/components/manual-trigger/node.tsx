import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerNodeDialog } from "./dialog";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchManualTriggerRealTimeToken } from "./actions";
import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/manual-trigger";

export const ManualTriggerNode = memo((props : NodeProps) =>{
    const [dialogOpen , setDialogOpen] = useState(false) ;
    const handleOpenSettings = () => setDialogOpen(true) ;

    const status : NodeStatus = useNodeStatus({
        nodeId : props.id,
        channel : MANUAL_TRIGGER_CHANNEL_NAME,
        topic : "status",
        refreshToken : fetchManualTriggerRealTimeToken
    }) ;
    
    return (
        <>
            <ManualTriggerNodeDialog open={dialogOpen} onOpenChange={setDialogOpen} />
            <BaseTriggerNode 
                {...props}
                icon={MousePointerIcon}
                name="when clicking 'Execute Workflow'"
                status={status} 
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})