import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import Handlebars from "handlebars";
import { openAIChannel } from "@/inngest/channels/openai";
import pClient from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import { OPENAI_MODELS } from "@/config/ai-models";


Handlebars.registerHelper("json", (context) => {
    let stringifiedJson = JSON.stringify(context, null, 2);
    let safeString = new Handlebars.SafeString(stringifiedJson);
    return safeString;
});

type OpenAINodeData = {
    variableName?: string,
    model?: typeof OPENAI_MODELS[0],
    credentialId? : string,
    systemPrompt?: string,
    userPrompt?: string
};

export const openAIExecutor: NodeExecutor<OpenAINodeData>
    = async ({
        data,
        nodeId,
        userId,
        context,
        step,
        publish
    }) => {

        const status = {
            loading: async () => {
                await publish(
                    openAIChannel().status({
                        nodeId: nodeId,
                        status: "loading"
                    }))
            },
            error: async () => {
                await publish(
                    openAIChannel().status({
                        nodeId: nodeId,
                        status: "error",
                    }))
            },
            success: async () => {
                await publish(
                    openAIChannel().status({
                        nodeId: nodeId,
                        status: "success"
                    }))
            }
        }

        await status.loading();

        if (!data.variableName) {
            await status.error();
            throw new NonRetriableError("OpenAI Node : variable name is required");
        }

        if (!data.userPrompt) {
            await status.error();
            throw new NonRetriableError("OpenAI Node : user prompt is missing");
        }


        if(!data.credentialId){
            await status.error() ;
            throw new NonRetriableError("OpenAI Node : Credential id is required") ;
        }

        const systemPrompt = data.systemPrompt
            ? Handlebars.compile(data.systemPrompt)(context)
            : "You are a helpful assistant"

        const userPrompt = data.userPrompt
            ? Handlebars.compile(data.userPrompt)(context)
            : ""

        const credential = await step.run("get-credential",() =>{
            return pClient.credential.findUnique({
                where : {
                    id : data.credentialId,
                    userId
                }
            })
        }) 

        if(!credential){
            await status.error() ;
            throw new NonRetriableError("OpenAI Node : Credential not found") ;
        }
        
        const openAI = createOpenAI({
            apiKey : decrypt(credential.value),
        })

        try {
            const { steps } = await step.ai.wrap(
                "openai-generate-text",
                generateText,
                {
                    model: openAI(data.model || "gpt-5"),
                    system: systemPrompt,
                    prompt: userPrompt,
                    experimental_telemetry: {  // will give Sentry Access to our AI Report
                        isEnabled: true,
                        recordInputs: true,
                        recordOutputs: true
                    }
                }
            );

            const text = steps[0].content[0].type === "text"
                ? steps[0].content[0].text
                : "";

            await status.success();

            return {
                ...context,
                [data.variableName]: {
                    aiResponse: text
                }
            }
        }
        catch (error) {
            await status.error();
            throw error;
        }

    }