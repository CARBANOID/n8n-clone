import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { generateText } from "ai"
import { createAnthropic } from "@ai-sdk/anthropic"
import Handlebars from "handlebars" ;
import { anthropicChannel } from "@/inngest/channels/anthropic";
import pClient from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import { CLAUDE_MODELS } from "@/config/ai-models";


Handlebars.registerHelper("json",(context) =>{ 
    let stringifiedJson = JSON.stringify(context,null,2) ;
    let safeString = new Handlebars.SafeString(stringifiedJson) ;
    return safeString ;
}) ;

type AnthropicNodeData = {
    variableName? : string,
    model? : typeof CLAUDE_MODELS[0],
    credentialId? : string,
    systemPrompt? : string,
    userPrompt? : string
} ;

export const anthropicExecutor : NodeExecutor<AnthropicNodeData> 
= async({
    data,
    nodeId,
    userId,
    context,
    step,
    publish
}) => {

    const status = {
        loading : async() => {
            await publish(
            anthropicChannel().status({
                nodeId : nodeId,
                status : "loading"
            }))
        },
        error : async() => {
            await publish(
            anthropicChannel().status({
                nodeId : nodeId,
                status : "error",
            }))
        },
        success : async() => {
            await publish(
            anthropicChannel().status({
                nodeId : nodeId,
                status : "success"
            }))
        }
    }

    await status.loading() ;

    if(!data.variableName){
        await status.error() ;
        throw new NonRetriableError("Anthropic Node : variable name is required") ;
    }

    if(!data.userPrompt){
        await status.error() ;
        throw new NonRetriableError("Anthropic Node : user prompt is missing") ;
    }
    

    if(!data.credentialId){
        await status.error() ;
        throw new NonRetriableError("Anthropic Node : Credential id is required") ;
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
        throw new NonRetriableError("Anthropic Node : Credential not found") ;
    }
    
    const anthropic = createAnthropic({
        apiKey : decrypt(credential.value),
    })

    try{
        const { steps } = await step.ai.wrap(
            "anthropic-generate-text",
            generateText,
            {
                model : anthropic(data.model || "claude-sonnet-4-5"),
                system : systemPrompt,
                prompt : userPrompt,
                experimental_telemetry : {  // will give Sentry Access to our AI Report
                    isEnabled : true,
                    recordInputs : true, 
                    recordOutputs : true
                }
            }
        ) ;

        const text = steps[0].content[0].type === "text" 
                    ? steps[0].content[0].text  
                    : "" ;

        await status.success() ;

        return{
            ...context,
            [data.variableName] : {
                aiResponse : text
            }
        }
    }
    catch(error){
        await status.error() ; 
        throw error ;
    }

}