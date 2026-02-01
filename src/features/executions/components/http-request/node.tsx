"use client" ;

import { Node , NodeProps, useReactFlow } from "@xyflow/react" ;
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react" ;
import { BaseExecutionNode } from "../base-execution-node"; 
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { FormType, HttpRequestDialog } from "./dialog";

type HttpRequestNodeData = {
    endpoint?: string ;
    method? : "GET" | "POST" | "PUT" | "PATCH" | "DELETE" ;
    body?: string ;
    [key : string] : unknown ;  // any key value pairs
}; 

type HttpRequestNodeType = Node<HttpRequestNodeData> ;

export const HttpRequestNode = memo((props : NodeProps<HttpRequestNodeType>) => {
    const nodeData = props.data ;
    const description = (nodeData?.endpoint) ? 
                        `${nodeData.method || "GET"} : ${nodeData.endpoint}` 
                        : "Not configured" ;

    const status : NodeStatus = "initial" ;
    
    const [dialogOpen , setDialogOpen] = useState(false) ;
    const handleOpenSettings = () => setDialogOpen(true) ;

    const { setNodes } = useReactFlow() ;

    const handleSubmit = (values : FormType) => {
        setNodes((nodes) =>
            nodes.map((node) =>{
                if(node.id === props.id){
                    return {
                        ...node,
                        data : {
                            ...node.data ,
                            endpoint : values.endPoint ,
                            method : values.method ,
                            body : values.body
                        }
                    }
                }
                return node ;
            })
        )
    }

    return (
        <>
            <HttpRequestDialog
              open={dialogOpen} 
              onOpenChange={setDialogOpen} 
              onSubmit={handleSubmit}
              defaultEndPoint={nodeData.endpoint}  // TODO : check if it can be improved by just passing nodeData
              defaultMethod={nodeData.method}
              defaultBody={nodeData.body}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={GlobeIcon}
                name="HTTP Request"
                status={status}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})

HttpRequestNode.displayName = "HttpRequestNode" ;