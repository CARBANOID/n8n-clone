import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import Handlebars from "handlebars";
import { AVAILABLE_MODELS } from "./dialog";
import { openAIChannel } from "@/inngest/channels/openai";


Handlebars.registerHelper("json", (context) => {
    let stringifiedJson = JSON.stringify(context, null, 2);
    let safeString = new Handlebars.SafeString(stringifiedJson);
    return safeString;
});

type OpenAINodeData = {
    variableName?: string,
    model?: typeof AVAILABLE_MODELS[0],
    systemPrompt?: string,
    userPrompt?: string
};

export const openAIExecutor: NodeExecutor<OpenAINodeData>
    = async ({
        data,
        nodeId,
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

        const systemPrompt = data.systemPrompt
            ? Handlebars.compile(data.systemPrompt)(context)
            : "You are a helpful assistant"

        const userPrompt = data.userPrompt
            ? Handlebars.compile(data.userPrompt)(context)
            : ""

        // TODO : Throw for credential missing

        const credentialsValue = process.env.OPENAI_API_KEY;

        const openAI = createOpenAI({
            apiKey: credentialsValue,
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