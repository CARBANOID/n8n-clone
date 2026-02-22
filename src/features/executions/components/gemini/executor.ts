import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import Handlebars from "handlebars" ;
import { AVAILABLE_MODELS } from "./dialog";
import { geminiChannel } from "@/inngest/channels/gemini";


Handlebars.registerHelper("json",(context) =>{ 
    let stringifiedJson = JSON.stringify(context,null,2) ;
    let safeString = new Handlebars.SafeString(stringifiedJson) ;
    return safeString ;
}) ;

type GeminiNodeData = {
    variableName? : string,
    model? : typeof AVAILABLE_MODELS[0],
    systemPrompt? : string,
    userPrompt? : string
} ;

export const geminiExecutor : NodeExecutor<GeminiNodeData> 
= async({
    data,
    nodeId,
    context,
    step,
    publish
}) => {

    const status = {
        loading : async() => {
            await publish(
            geminiChannel().status({
                nodeId : nodeId,
                status : "loading"
            }))
        },
        error : async() => {
            await publish(
            geminiChannel().status({
                nodeId : nodeId,
                status : "error",
            }))
        },
        success : async() => {
            await publish(
            geminiChannel().status({
                nodeId : nodeId,
                status : "success"
            }))
        }
    }

    await status.loading() ;

    if(!data.variableName){
        await status.error() ;
        throw new NonRetriableError("Gemini Node : variable name is required") ;
    }

    if(!data.userPrompt){
        await status.error() ;
        throw new NonRetriableError("Gemini Node : user prompt is missing") ;
    }
    
    const systemPrompt = data.systemPrompt 
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant"

    const userPrompt = data.userPrompt 
    ? Handlebars.compile(data.userPrompt)(context)
    : ""

    // TODO : Throw for credential missing
    
    const credentialsValue = process.env.GOOGLE_GENERATIVE_AI_API_KEY ;

    const google = createGoogleGenerativeAI({
        apiKey : credentialsValue,
    })

    try{
        const { steps } = await step.ai.wrap(
            "gemini-generate-text",
            generateText,
            {
                model : google(data.model || "gemini-2.5-flash"),
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
                text
            }
        }
    }
    catch(error){
        await status.error() ; 
        throw error ;
    }

}