"use client" ; 

import { NodeProps , Position } from "@xyflow/react" ;
import type { LucideIcon } from "lucide-react";
import Image from "next/image" ;
import { memo } from "react";
import type { ReactNode } from "react";
import { BaseNode , BaseNodeContent } from "@/components/react-flow/base-node";
import { BaseHandle } from "@/components/react-flow/base-handle" ;
import { WorkflowNode } from "@/components/workflow-node"; 

interface BaseTriggerNodeProps extends NodeProps {
    icon: LucideIcon | string ;
    name: string ;
    description?: string ;
    children?: ReactNode ;
    // status?: NodeStatus ;
    onDoubleClick?: () => void ;
    onSettings?: () => void ;
}

export const BaseTriggerNode = memo(({
    id ,
    icon : Icon ,
    name ,
    description ,
    children ,
    onSettings,
    onDoubleClick
} : BaseTriggerNodeProps) =>{

    // TODO : Add Delete method
    const handleDelete = () => {

    } ;
    
    return (
        <WorkflowNode
            name = {name}
            description = {description}
            onDelete = {handleDelete}
            onSettings = {onSettings}
        >
            {/* TODO : Wrap within NodeStatus */}
            <BaseNode
                onDoubleClick = {onDoubleClick}
                className="rounded-l-2xl relative group:"
            >
                <BaseNodeContent>
                    { 
                        (typeof Icon === "string") ? 
                        (
                            <Image 
                                src={Icon}
                                alt={name}
                                width={16}
                                height={16}
                            />
                        )
                        :
                        (
                            <Icon className="size-4"/>
                        )
                    }

                    { children }
                    
                    <BaseHandle
                        id="source-1"
                        type="source"
                        position={Position.Right}
                    />                  
                </BaseNodeContent>
            </BaseNode>
        </WorkflowNode>
    )
})

BaseTriggerNode.displayName = "BaseTriggerNode" ;