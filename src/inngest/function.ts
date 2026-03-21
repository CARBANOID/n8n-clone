import { inngest } from "./client";
import { NonRetriableError } from "inngest";
import pClient from "@/lib/db";
import { topologicalSort } from "./utils";
import { ExecutionStatus, NodeType } from "@prisma/client";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import { geminiChannel } from "./channels/gemini";
import { openAIChannel } from "./channels/openai";
import { anthropicChannel } from "./channels/anthropic";
import { discordChannel } from "./channels/discord";
import { slackChannel } from "./channels/slack";
import { excelChannel } from "./channels/excel";
import { aiWorkflowChannel } from "./channels/ai-workflow";
import { createId } from "@paralleldrive/cuid2";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: 0 , // remove in production
    onFailure : async({event,step}) =>{
      return pClient.execution.update({
        where : {
          inngestEventId : event.data.event.id
        },
        data : {
          status : ExecutionStatus.FAILED,
          error : event.data.error.message,
          errorStack : event.data.error.stack,
        }
      })
    }
  },
  {
    event: "workflows/execute.workflow",
    // adding channels for real-time node status 
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      geminiChannel(),
      openAIChannel(),
      anthropicChannel(),
      discordChannel(),
      slackChannel(),
      excelChannel()
    ]
  },
  async ({ event, step, publish }) => {
    const inngestEventId = event.id ;
    const workflowId = event.data.workflowId;

    if (!inngestEventId || !workflowId) {
      throw new NonRetriableError("Event ID or Workflow ID is missing");  // inngest will not retry
    }

    await step.run("create-exection", async () => {
      return pClient.execution.create({
        data : {
          workflowId,
          inngestEventId
        }
      })
    })

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await pClient.workflow.findUniqueOrThrow({
        where: {
          id: workflowId
        },
        include: {
          nodes: true,
          connections: true
        }
      });
      return topologicalSort(workflow.nodes, workflow.connections);
    })

    const userId = await step.run("find-user-id",async() => {
      const workflow  = await pClient.workflow.findUniqueOrThrow({
        where : {
          id : workflowId
        },
        select : {
          userId : true
        }
      })

      return workflow.userId
    })

    // Initilize the context with any initial data from trigger 
    let context = event.data.initialData || {};

    // Execute each node 
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        userId,
        context,
        step,
        publish
      })
    }

    await step.run("update-execution", async () => {
      return pClient.execution.update({
        where : {
          inngestEventId,
          workflowId
        },
        data : {
          status : ExecutionStatus.SUCCESS,
          completedAt : new Date(),
          output : context
        }
      })
    })

    return {
      workflowId,
      result: context
    };
  },
);  

export const createAIWorkflow = inngest.createFunction(
  {
    id: "create-ai-workflow",
    retries: 0 , // remove in production
  },
  {
    event: "workflows/create.ai.workflow",
    channels: [ aiWorkflowChannel() ]
  },
  async ({ event, step, publish }) => {

    const inngestEventId  = event.id ;
    const workflowId = event.data.workflowId;

    if (!inngestEventId || !workflowId) {
      throw new NonRetriableError("Event ID or Workflow ID is missing");  // inngest will not retry
    }

    await step.run("create-execution", async () => {
      return pClient.execution.create({
        data : {
          workflowId,
          inngestEventId
        }
      })
    })

    const rawNodes      : any[] = event.data.nodes       || [] ;
    const rawConnections: any[] = event.data.connections || [] ;

    await step.run("publish-workflow", async () => {
      const IdMap = new Map<string, string>() ;

      const nodes = rawNodes.map((node: any, index: number) => {
        const nodeId = createId() ;
        IdMap.set(node.id.toString(), nodeId) ;
        return {
          id       : nodeId,
          type     : node.type,
          position : { x: 0, y: 0 },  // setting the position according to viewport on client side
          data     : node.data || {},
          _index   : index         // for respective positioning of nodes
        };
      }) ;

      const connections = rawConnections.map((connection: any) => ({
        id          : createId(),
        source      : IdMap.get(connection.source?.toString()) || "",
        target      : IdMap.get(connection.target?.toString()) || "",
        sourceHandle: "source-1",
        targetHandle: "target-1",
      })) ;
      
      await publish(
        aiWorkflowChannel().workflow({
          workflowId,
          nodes,
          connections
        })
      ) ;

      return { nodes, connections } ;
    })

    return { workflowId } ;
});

