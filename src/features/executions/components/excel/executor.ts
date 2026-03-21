import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars" ;
import { excelChannel } from "@/inngest/channels/excel";
import { decode } from "html-entities" ;
import ExcelJS from "exceljs"
import fs from "fs"

Handlebars.registerHelper("json",(context) =>{ 
    let stringifiedJson = JSON.stringify(context,null,2) ;
    let safeString = new Handlebars.SafeString(stringifiedJson) ;
    return safeString ;
}) ;

type ExcelNodeData = {
    fileName? : string,
    directoryPath? : string,
    sheetName? : string,
    content? : string
} ;

export const excelExecutor : NodeExecutor<ExcelNodeData> 
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
            excelChannel().status({
                nodeId : nodeId,
                status : "loading"
            }))
        },
        error : async() => {
            await publish(
            excelChannel().status({
                nodeId : nodeId,
                status : "error",
            }))
        },
        success : async() => {
            await publish(
            excelChannel().status({
                nodeId : nodeId,
                status : "success"
            }))
        }
    }

    await status.loading() ;

    if(!data.content){
        await status.error() ;
        throw new NonRetriableError("Excel Node : JSON content is required") ;
    }
    
    const rawContent = Handlebars.compile(data.content)(context) ;
    const content = decode(rawContent) ;  // decode cause handlebar can't handle excel messages

    const fileName = data.fileName 
                    ? decode(Handlebars.compile(data.fileName)(context)) 
                    : undefined ;

    const directoryPath = data.directoryPath 
                    ? decode(Handlebars.compile(data.directoryPath)(context)) 
                    : undefined ;
                    
    const sheetName = data.sheetName 
                    ? decode(Handlebars.compile(data.sheetName)(context)) 
                    : undefined ;

    try{    
        const result = await step.run("json-to-xlsx",async() =>{
            if(!fileName){
                await status.error() ;
                throw new NonRetriableError("Excel Node : File name  is required") ;
            }

            if(!directoryPath){
                await status.error() ;
                throw new NonRetriableError("Excel Node : Directory path is required") ;
            }

            if(!sheetName){
                await status.error() ;
                throw new NonRetriableError("Excel Node : Sheet name is required") ;
            }

            const jsonContent = JSON.parse(content) ;
            const filePath =`${directoryPath}\\${fileName}.xlsx` ;

            const workbook = new ExcelJS.Workbook() ;
            let sheet : ExcelJS.Worksheet | undefined ;

            const columns = Object.keys(jsonContent[0]).map(key =>({
                header : key,
                key,
                width : 20
            })) ;

            if(fs.existsSync(filePath)){
              await workbook.xlsx.readFile(filePath) ;
              sheet = workbook.getWorksheet(sheetName) ;

              if(!sheet){
                sheet = workbook.addWorksheet(sheetName) ;
              }  
            }
            else {
                sheet = workbook.addWorksheet(sheetName) ;
            }

            sheet.columns = columns ;
            sheet.addRows(jsonContent) ;
            await workbook.xlsx.writeFile(filePath) ;

            return{
                ...context,
                [fileName] : {
                    content : content
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