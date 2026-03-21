"use client" ;

import { Node , NodeProps, useReactFlow } from "@xyflow/react" ;
import { memo, useState } from "react" ;
import { BaseExecutionNode } from "../base-execution-node"; 
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchExcelRequestRealTimeToken } from "./actions";
import { ExcelDialog , ExcelFormValues } from "./dialog";
import { EXCEL_CHANNEL_NAME } from "@/inngest/channels/excel";

type ExcelNodeData = {
    fileName? : string,
    directoryPath? : string,
    sheetName? : string,
    content? : string
}; 

type ExcelNodeType = Node<ExcelNodeData> ;

export const ExcelNode = memo((props : NodeProps<ExcelNodeType>) => {
    const nodeData = props.data ;
    const description = (nodeData.content) 
                        ? `${nodeData.content.slice(0,50)}...` 
                        : "Not configured" ;

    const status : NodeStatus = useNodeStatus({
        nodeId : props.id,
        channel : EXCEL_CHANNEL_NAME,
        topic : "status",
        refreshToken : fetchExcelRequestRealTimeToken
    }) ;
    
    const [dialogOpen , setDialogOpen] = useState(false) ;
    const handleOpenSettings = () => setDialogOpen(true) ;

    const { setNodes } = useReactFlow() ;

    const handleSubmit = (values : ExcelFormValues) => {
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
            <ExcelDialog
              open={dialogOpen} 
              onOpenChange={setDialogOpen} 
              onSubmit={handleSubmit}
              defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={"/logos/excel.svg"}
                name="Excel"
                status={status}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})

ExcelNode.displayName = "ExcelNode" ;