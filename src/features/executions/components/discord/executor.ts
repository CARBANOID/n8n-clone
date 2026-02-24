import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars" ;
import { discordChannel } from "@/inngest/channels/discord";
import { decode } from "html-entities" ;
import ky from "ky";

Handlebars.registerHelper("json",(context) =>{ 
    let stringifiedJson = JSON.stringify(context,null,2) ;
    let safeString = new Handlebars.SafeString(stringifiedJson) ;
    return safeString ;
}) ;

type DiscordNodeData = {
    variableName? : string,
    webhookUrl? : string,
    content? : string,
    username? : string} ;

export const discordExecutor : NodeExecutor<DiscordNodeData> 
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
            discordChannel().status({
                nodeId : nodeId,
                status : "loading"
            }))
        },
        error : async() => {
            await publish(
            discordChannel().status({
                nodeId : nodeId,
                status : "error",
            }))
        },
        success : async() => {
            await publish(
            discordChannel().status({
                nodeId : nodeId,
                status : "success"
            }))
        }
    }

    await status.loading() ;

    if(!data.content){
        await status.error() ;
        throw new NonRetriableError("Discord Node : Message content is required") ;
    }
    
    const rawContent = Handlebars.compile(data.content)(context) ;
    const content = decode(rawContent) ;  // decode cause handlebar can't handle discord messages
    const username = data.username 
                    ? decode(Handlebars.compile(data.username)(context)) 
                    : undefined ;

    try{    
        const result = await step.run("discord-webhook",async() =>{
            if(!data.variableName){
                await status.error() ;
                throw new NonRetriableError("Discord Node : variable name is required") ;
            }

            if(!data.webhookUrl){
                await status.error() ;
                throw new NonRetriableError("Discord Node : Webhook url is required") ;
            }
             
            await ky.post(data.webhookUrl,{
                json : {
                    content : content.slice(0,2000),
                    username
                }
            });

            return{
                ...context,
                [data.variableName] : {
                    messageContent : content.slice(0,2000),
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