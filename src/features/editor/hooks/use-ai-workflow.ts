import { useInngestSubscription } from "@inngest/realtime/hooks";
import { useEffect } from "react";
import type { Node, Edge } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";
import { AI_WORKFLOW_CHANNEL_NAME } from "@/inngest/channels/ai-workflow";
import { fetchAIWorkflowRealTimeToken } from "../actions";

interface UseAIWorkflowOptions {
    workflowId : string ;
    setNodes   : (nodes: Node[]) => void ;
    setEdges   : (edges: Edge[]) => void ;
}

export function useAIWorkflow({
    workflowId,
    setNodes,
    setEdges,
}: UseAIWorkflowOptions) {

    const { screenToFlowPosition } = useReactFlow() ;

    const { data } = useInngestSubscription({
        refreshToken : () => fetchAIWorkflowRealTimeToken(workflowId),
        enabled      : true,
    }) ;

    useEffect(() => {
        if (!data?.length) return ;

        const latestMessage = data
            .filter(
                (msg) =>
                    msg.kind    === "data"                   &&
                    msg.channel === AI_WORKFLOW_CHANNEL_NAME &&
                    msg.topic   === "workflow"               &&
                    msg.data.workflowId === workflowId
            )
            .sort((a, b) => {
                if (a.kind === "data" && b.kind === "data") {
                    return (
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    );
                }
                return 0 ;
            })[0] ;

        if (latestMessage?.kind === "data") {
            const { nodes, connections } = latestMessage.data ;

            const centerX = window.innerWidth / 2 ;
            const centerY = window.innerHeight / 2 ;

            const positionedNodes = (nodes as any[]).map((node) => {
                const index = node._index ?? 0 ;
                const flowPosition = screenToFlowPosition({
                    x : centerX + (index - Math.floor((nodes as any[]).length / 2)) * 280,
                    y : centerY + (Math.random() - 0.5) * 80,
                }) ;    

                const { _index, ...rest } = node ; 
                return { ...rest, position: flowPosition } as Node ;
            }) ;

            setNodes(positionedNodes) ;
            setEdges(connections as Edge[]) ;
        }

    }, [data, workflowId, setNodes, setEdges, screenToFlowPosition]) ;
}
