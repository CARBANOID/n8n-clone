import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky from "ky";
import type { Options as KyOptions } from "ky";
import Handlebars from "handlebars" ;


Handlebars.registerHelper("json",(context) =>{ 
    let stringifiedJson = JSON.stringify(context,null,2) ;
    let safeString = new Handlebars.SafeString(stringifiedJson) ;
    return safeString ;
}) ;

type HttpRequestData = {
    variableName : string,
    endpoint : string ,
    method : "GET" | "POST" | "PUT" | "PATCH" | "DELETE" ;
    body? : string
} ;

export const httpRequestExecutor : NodeExecutor<HttpRequestData> 
= async({
    data,
    nodeId,
    context,
    step
}) => {
    // TODO : Publish "loading" state for http request
    
    if(!data.endpoint){
        // TODO : Publish "error" state for http request
        throw new NonRetriableError("HTTP Request node : No endpoint configured") ;
    }

    if(!data.variableName){
        // TODO : Publish "error" state for http request
        throw new NonRetriableError("Variable name not configured") ;
    }

    if(!data.method){
        // TODO : Publish "error" state for http request
        throw new NonRetriableError("Method not configured") ;
    }

    const result = await step.run("http-request",async() => {
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

    // TODO : Publish "success" state for  http request
    return result ;
}