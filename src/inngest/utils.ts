import toposort from "toposort" ;
import type { Node , Connection } from "@prisma/client" ;
import { inngest } from "./client";

export const topologicalSort = (
    nodes : Node[] , 
    connections : Connection[]
) : Node[] => {
    // if no connection then nodes as it is
    if(connections.length === 0) return nodes ;

    // create edges 2D array for toposort 
    const edges : [string , string][] = connections.map((connection) =>[
        connection.fromNodeId ,
        connection.toNodeId
    ])

    // Adding nodes that are having any connection
    const connectedNodeIds = new Set<string>() ;
    for(const conn of connections){
      connectedNodeIds.add(conn.fromNodeId) ;  
      connectedNodeIds.add(conn.toNodeId) ;  
    }

    // Add nodes with no connection as self-edges to ensure they are included
    for(const node of nodes){
        if(!connectedNodeIds.has(node.id)){
            edges.push([node.id,node.id]) ;  // adding self edges for isolated nodes (having no connection)
        }
    }

    // Perform Topological Sort 
    let sortedNodeIds : string[] ;
    try{
        sortedNodeIds = toposort(edges) ;
        // Remove duplicate from self-edges 
        sortedNodeIds = [...new Set(sortedNodeIds)] ;
    }
    catch(error){
        if(error instanceof Error && error.message.includes("Cyclic")){
            throw new Error("Workflow has a cycle") ;
        }
        throw error ;
    }

    // Map sorted Ids back to node ids
    const nodeMap = new Map(nodes.map((node) => [node.id,node])) ;
    return sortedNodeIds.map((nodeId) => nodeMap.get(nodeId)!).filter(Boolean) ;
}

export const sendWorkflowExecution = async(data : {
    workflowId : string ;
    [key : string] : any ;
}) => {
    return inngest.send({
        name : "workflows/execute.workflow" ,
        data
    });
}