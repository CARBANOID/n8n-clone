import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerNodeDialog } from "./dialog";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";

export const ManualTriggerNode = memo((props : NodeProps) =>{
    const [dialogOpen , setDialogOpen] = useState(false) ;
    const handleOpenSettings = () => setDialogOpen(true) ;

    const nodeStatus : NodeStatus = "initial" ;
    
    return (
        <>
            <ManualTriggerNodeDialog open={dialogOpen} onOpenChange={setDialogOpen} />
            <BaseTriggerNode 
                {...props}
                icon={MousePointerIcon}
                name="when clicking 'Execute Workflow'"
                status={nodeStatus} 
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})