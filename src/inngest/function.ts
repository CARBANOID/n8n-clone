import { inngest } from "./client";
import { NonRetriableError } from "inngest";
import pClient from "@/lib/db";
import { topologicalSort } from "./utils";
import { NodeType } from "@prisma/client";
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

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: 0  // remove in production
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
      slackChannel()
    ]
  },
  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId;

    if (!workflowId) {
      throw new NonRetriableError("Workflow ID is missing");  // inngest will not retry
    }

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

    return {
      workflowId,
      result: context
    };
  },
);  