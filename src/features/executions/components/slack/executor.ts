import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars" ;
import { slackChannel } from "@/inngest/channels/slack";
import { decode } from "html-entities" ;
import ky from "ky";

Handlebars.registerHelper("json",(context) =>{ 
    let stringifiedJson = JSON.stringify(context,null,2) ;
    let safeString = new Handlebars.SafeString(stringifiedJson) ;
    return safeString ;
}) ;

type SlackNodeData = {
    variableName? : string,
    webhookUrl? : string,
    content? : string,
} ;

export const slackExecutor : NodeExecutor<SlackNodeData> 
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
            slackChannel().status({
                nodeId : nodeId,
                status : "loading"
            }))
        },
        error : async() => {
            await publish(
            slackChannel().status({
                nodeId : nodeId,
                status : "error",
            }))
        },
        success : async() => {
            await publish(
            slackChannel().status({
                nodeId : nodeId,
                status : "success"
            }))
        }
    }

    await status.loading() ;

    if(!data.content){
        await status.error() ;
        throw new NonRetriableError("Slack Node : Message content is required") ;
    }
    
    const rawContent = Handlebars.compile(data.content)(context) ;
    const content = decode(rawContent) ;  // decode cause handlebar can't handle slack messages


    try{    
        const result = await step.run("slack-webhook",async() =>{
            if(!data.variableName){
                await status.error() ;
                throw new NonRetriableError("Slack Node : variable name is required") ;
            }

            if(!data.webhookUrl){
                await status.error() ;
                throw new NonRetriableError("Slack Node : Webhook url is required") ;
            }
             
            await ky.post(data.webhookUrl,{
                json : {
                    content : content, // the key depends on workflow config
                }
            });

            return{
                ...context,
                [data.variableName] : {
                    messageContent : content
                }
            } 
        })

        await status.success() ;
        return result ;
    }
    catch(error){
        await status.error() ; 
        throw error ;
    }

}