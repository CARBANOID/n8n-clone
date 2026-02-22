import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky from "ky";
import type { Options as KyOptions } from "ky";
import Handlebars from "handlebars" ;
import { httpRequestChannel } from "@/inngest/channels/http-request";


Handlebars.registerHelper("json",(context) =>{ 
    let stringifiedJson = JSON.stringify(context,null,2) ;
    let safeString = new Handlebars.SafeString(stringifiedJson) ;
    return safeString ;
}) ;

type HttpRequestData = {
    variableName? : string,
    endpoint? : string ,
    method? : "GET" | "POST" | "PUT" | "PATCH" | "DELETE" ;
    body? : string
} ;

export const httpRequestExecutor : NodeExecutor<HttpRequestData> 
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
            httpRequestChannel().status({
                nodeId : nodeId,
                status : "loading"
            }))
        },
        error : async() => {
            await publish(
            httpRequestChannel().status({
                nodeId : nodeId,
                status : "error",
            }))
        },
        success : async() => {
            await publish(
            httpRequestChannel().status({
                nodeId : nodeId,
                status : "success"
            }))
        }
    }

    await status.loading() ;
    try{
    const result = await step.run("http-request",async() => {
        if(!data.endpoint){
            await status.error() ;
            throw new NonRetriableError("HTTP Request node : No endpoint configured") ;
        }

        if(!data.variableName){
            await status.error() ;
            throw new NonRetriableError("Variable name not configured") ;
        }
    
        if(!data.method){
            await status.error() ;
            throw new NonRetriableError("Method not configured") ;
        }

        const method = data.method ;
        /*
        using handlebar module we can retrive,
        value of json data (in format of {{variableName.httpResponse.data}}) present in the "endpoint" string
        will be retrieved from the context (here it contains the data of the past nodes)
        */
        const endpoint = Handlebars.compile(data.endpoint)(context) ;  
        const options : KyOptions = { method } ;
 
        if(["POST","PUT","PATCH"].includes(method)){
            const resolved = Handlebars.compile(data.body ?? "{}")(context) ;
            JSON.parse(resolved) ;
            options.body = resolved ;
            options.headers = {
                "Content-Type" : "application/json"
            };
        }

        const response = await ky(endpoint,options) ;
        const contentType = response.headers.get("content-type") ;
        const responseData = contentType?.includes("application/json") 
                            ? await response.json() 
                            : await response.text()  ;

        const responsePayload = {
            httpResponse : {
                status : response.status,
                statusText : response.statusText,
                data : responseData
            }
        }

        return {
            ...context,
            [data.variableName] : responsePayload
        } ; 
    })

    await status.success() ;
    return result ;
    }
    catch(error){
        await status.error() ;
        throw error ;
    }
}