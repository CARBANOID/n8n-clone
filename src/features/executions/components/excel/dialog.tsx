"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog" ;
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form" ;
import { Input } from "@/components/ui/input" ;
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Textarea } from "@/components/ui/textarea";


const formSchema = z.object({
    fileName : z
               .string()
               .min(1,{message : "File name is required"})
                .regex(/^[a-zA-Z_$][a-zA-Z0-9_]*$/ , {
                    message : "File name must start with a letter or underscore and can contain letters, numbers, and underscores."
                }),
    directoryPath : z
                    .string()
                    .min(1,{message : "File Directory Path is required"}),
    sheetName : z
                .string()
                .min(1,{message : "Sheet name is required"})
                .max(31,{message : "Sheet name cannot be more than 31 characters"}),
    content : z
            .string()
            .min(1,{message : "no content present to convert"}),
}) ;

export type ExcelFormValues = z.infer<typeof formSchema> ;

interface ExcelNodeDialogProps{
    open : boolean,
    onOpenChange : (open : boolean) => void
    onSubmit : (values : z.infer<typeof formSchema>) => void ;
    defaultValues? : Partial<ExcelFormValues>
}

export const ExcelDialog = ({ 
    open , 
    onOpenChange ,
    onSubmit ,
    defaultValues = {}
} : ExcelNodeDialogProps) => {

    const defaultExcelFormValues = {
        fileName : defaultValues.fileName || "",
        directoryPath : defaultValues.directoryPath || "",
        sheetName : defaultValues.sheetName || "",
        content : defaultValues.content || ""
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema) ,
        defaultValues : defaultExcelFormValues
    })

    useEffect(() =>{
        if(open){
            form.reset(defaultExcelFormValues) ;
        }
    },[open, defaultValues , form]) ;

    const watchFileName = form.watch("fileName") || "myExcel" ;
    const watchDirectoryPath = form.watch("directoryPath") || "C:" ;

    const handleSubmit = (values : z.infer<typeof formSchema>) => {
        onSubmit(values) ;
        onOpenChange(false) ;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle> Excel Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the Excel setting for this node.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-4 mt-4"
                        >
                            <FormField
                                control={form.control}
                                name="fileName"
                                render={({field}) =>(
                                    <FormItem>
                                        <FormLabel> File Name </FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="myExcel" 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            If file does not exist it will be created <br />
                                            Use this name to refrence the result in other nodes : {""}
                                            {`{{${watchFileName}.content}}`}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />                  

                            <FormField
                                control={form.control}
                                name="directoryPath"
                                render={({field}) =>(
                                    <FormItem>
                                        <FormLabel> Directory Path </FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder={`C:\\`} 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            File path of the created file : {""}
                                            {`${watchDirectoryPath}\\${watchFileName}.xlsx`}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
   
                            <FormField
                                control={form.control}
                                name="sheetName"
                                render={({field}) =>(
                                    <FormItem>
                                        <FormLabel> Sheet Name </FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="sheet1" 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Sheet to store the content
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> 

                            <FormField
                                control={form.control}
                                name="content"
                                render={({field}) =>(
                                    <FormItem>
                                        <FormLabel> JSON content to store in .xlsx format file</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={
                                                    '{\n    "userId" : "{{httpResponse.data.id}}",\n    "name" : "{{httpResponse.data.name}}",\n    "item" : "{{json httpResponse.data.item}"\n}'
                                                }
                                                className="min-h-[100px] max-h-[140px] font-mono text-sm scroll-y-auto"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            The content to be stored in the .xlsx file , content must be in <b> <u>JSON</u> </b> format or {"{{ aiResponse.text }}"}
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="mt-4">
                                <Button type="submit">
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}