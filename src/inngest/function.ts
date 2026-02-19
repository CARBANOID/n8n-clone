import { inngest } from "./client";
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from 'ai';
import * as Sentry from "@sentry/nextjs";
import { NonRetriableError } from "inngest";
import pClient from "@/lib/db";
import { topologicalSort } from "./utils";
import { NodeType } from "@prisma/client";
import { getExecutor } from "@/features/executions/lib/executor-registry";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow" },
  { event: "workflows/execute.workflow" },
  async ({ event, step }) => {
    const workflowId = event.data.workflowId ;  

    if(!workflowId){
      throw new NonRetriableError("Workflow ID is missing") ;  // inngest will not retry
    }

    const sortedNodes = await step.run("prepare-workflow",async() => {
      const workflow = await pClient.workflow.findUniqueOrThrow({
        where : {
          id : workflowId
        },
        include : {
          nodes : true , 
          connections : true 
        }
      });
      return topologicalSort(workflow.nodes,workflow.connections) ;
    })

    // Initilize the context with any initial data from trigger 
    let context = event.data.initialData || {} ;
    
    // Execute each node 
    for(const node of sortedNodes){
      const executor = getExecutor(node.type as NodeType) ;
      context = await executor({ 
        data : node.data as Record<string,unknown>,
        nodeId : node.id,
        context,
        step
      })
    }

    return { 
      workflowId ,
      result : context
    } ; 
  },
);  