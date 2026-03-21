"use client"
import { ErrorView, LoadingView } from "@/components/entity-components"
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows"
import { useState , useCallback, useMemo, useEffect } from "react"
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge,Background, Controls, MiniMap , Panel } from '@xyflow/react';
import type { Node, Edge, NodeChange, EdgeChange, Connection, ColorMode } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "@/components/add-node-button";
import { useSetAtom } from "jotai";
import { editorAtom } from "../store/atoms";
import { NodeType } from "@prisma/client";
import { ExecuteWorkflowButton } from "./execute-worklfow-button";
import { useTheme } from "next-themes";
import { AIButton } from "@/components/chatbot/ai-button";
import { useAIWorkflow } from "../hooks/use-ai-workflow";

function AIWorkflowListener({
    workflowId,
    setNodes,
    setEdges
}: {
    workflowId: string;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
}) {
    useAIWorkflow({ workflowId, setNodes, setEdges });
    return null;
}

export const EditorLoading = () => {
   return <LoadingView message="Loading editor..."/>
}

export const EditorError = () => {
    return <ErrorView message="Error in loading editor!!"/>
}

export const Editor = ( { workflowId } : { workflowId : string }) => {
    const { data : workflow } = useSuspenseWorkflow(workflowId) ; 

    const setEditor = useSetAtom(editorAtom) ;

    const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
    const [edges, setEdges] = useState<Edge[]>(workflow.edges);
    
    const onNodesChange = useCallback(
        (changes : NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params : Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );
 
    const hasManualTrigger = useMemo(() => {
        return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER) ;
    },[nodes])

    const {theme,setTheme} = useTheme() ;
    const [mounted,setMounted] = useState(false) ;

    useEffect(() => {
        setMounted(true) ;
    },[])

    if(!mounted) return null ;

    return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeComponents}
        proOptions={{
            hideAttribution : true,  // to hide the reactflow logo at left bottom
        }}
        onInit={setEditor}
        fitView
        snapGrid={[10,10]}
        snapToGrid
        panOnScroll
        panOnDrag={false}
        selectionOnDrag
        colorMode={theme as ColorMode}
      > 
        <Background/>
        <Controls/>
        <MiniMap/>
        
        <AIWorkflowListener workflowId={workflowId} setNodes={setNodes} setEdges={setEdges} />
      
        <Panel position="top-right">
            {/* To add an custom panel to react flow canvas */}
            <div className="flex flex-col gap-4">
            <AddNodeButton/>
            <AIButton/>
            </div>
            
        </Panel>
        {
            hasManualTrigger 
            &&
            <Panel position="bottom-center">
                <ExecuteWorkflowButton workflowId={workflowId}/>
            </Panel>
        }
      </ReactFlow>  
    </div>
    )
}