"use client"
import { ErrorView, LoadingView } from "@/components/entity-components"
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows"
import { useState , useCallback } from "react"
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge,Background, Controls, MiniMap , Panel } from '@xyflow/react';
import type { Node, Edge, NodeChange, EdgeChange, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "@/components/add-node-button";
import { useSetAtom } from "jotai";
import { editorAtom } from "../store/atoms";

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
      > 
        <Background/> {/* To add grids in the background */}
        <Controls/>   {/* To add zoom in and out with lock functionality*/}
        <MiniMap/>   {/* To create a mini map of the flow */}
      
        <Panel position="top-right">
            {/* To add an custom panel to react flow canvas */}
            <AddNodeButton/>
        </Panel>
      </ReactFlow>  
    </div>
    )
}