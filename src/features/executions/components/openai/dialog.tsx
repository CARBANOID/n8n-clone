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
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select" ;

import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export const AVAILABLE_MODELS = [
'o1',
'o1-2024-12-17',
'o3-mini',
'o3-mini-2025-01-31',
'o3',
'o3-2025-04-16',
'gpt-4.1',
'gpt-4.1-2025-04-14',
'gpt-4.1-mini',
'gpt-4.1-mini-2025-04-14',
'gpt-4.1-nano',
'gpt-4.1-nano-2025-04-14',
'gpt-4o',
'gpt-4o-2024-05-13',
'gpt-4o-2024-08-06',
'gpt-4o-2024-11-20',
'gpt-4o-mini',
'gpt-4o-mini-2024-07-18',
'gpt-4-turbo',
'gpt-4-turbo-2024-04-09',
'gpt-4',
'gpt-4-0613',
'gpt-4.5-preview',
'gpt-4.5-preview-2025-02-27',
'gpt-3.5-turbo-0125',
'gpt-3.5-turbo',
'gpt-3.5-turbo-1106',
'chatgpt-4o-latest',
'gpt-5',
'gpt-5-2025-08-07',
'gpt-5-mini',
'gpt-5-mini-2025-08-07',
'gpt-5-nano',
'gpt-5-nano-2025-08-07',
'gpt-5-chat-latest',
'gpt-5.1',
'gpt-5.1-chat-latest',
'gpt-5.2',
'gpt-5.2-chat-latest',
'gpt-5.2-pro',
]as const ;

const formSchema = z.object({
    variableName : z
                  .string()
                  .min(1,{message : "ai request name is required"})
                  .regex(/^[a-zA-Z_$][a-zA-Z0-9_]*$/ , {
                    message : "Variable name must start with a letter or underscore and can contain letters, numbers, and underscores."
                  }),
    model : z.string().min(1,{message : "Model is required"}),
    systemPrompt : z.string().optional(),
    userPrompt : z.string().min(1,{message : "User prompt is required"}),
}) ;

export type OpenAIFormValues = z.infer<typeof formSchema> ;

interface OpenAINodeDialogProps{
    open : boolean,
    onOpenChange : (open : boolean) => void
    onSubmit : (values : z.infer<typeof formSchema>) => void ;
    defaultValues? : Partial<OpenAIFormValues>
}

export const OpenAIDialog = ({ 
    open , 
    onOpenChange ,
    onSubmit ,
    defaultValues = {}
} : OpenAINodeDialogProps) => {

    const defaultOpenAIFormValues = {
        variableName : defaultValues.variableName || "",
        model : defaultValues.model || AVAILABLE_MODELS[0],
        systemPrompt : defaultValues.systemPrompt || "",
        userPrompt : defaultValues.userPrompt || "",
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema) ,
        defaultValues : defaultOpenAIFormValues
    })

    useEffect(() =>{
        if(open){
            form.reset(defaultOpenAIFormValues) ;
        }
    },[open, defaultValues , form]) ;

    const watchVariableName = form.watch("variableName") || "myApiCall" ;

    const handleSubmit = (values : z.infer<typeof formSchema>) => {
        onSubmit(values) ;
        onOpenChange(false) ;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle> OpenAI Configuration</DialogTitle>
                    <DialogDescription>
                        Configure AI model and prompts for this node.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-1">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-4 mt-4"
                        >
                            <FormField
                                control={form.control}
                                name="variableName"
                                render={({field}) =>(
                                    <FormItem>
                                        <FormLabel> Variable Name </FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="myApiCall" 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Use this name to refrence the result in other nodes : {""}.
                                            {`{${watchVariableName}.text}}`}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />                 

                            <FormField
                                control={form.control}
                                name="model"
                                render={({field}) =>(
                                    <FormItem>
                                        <FormLabel> Model </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a model" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {AVAILABLE_MODELS.map((model) =>(
                                                    <SelectItem key={model} value={model}>
                                                        {model}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            The OpenAI model to use for completion
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />    

                            <FormField
                                control={form.control}
                                name="systemPrompt"
                                render={({field}) =>(
                                    <FormItem>
                                        <FormLabel> System Prompt (Optional) </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={
                                                    "You are a helpful assistant."
                                                }
                                                className="min-h-[120px] max-h-[140px] font-mono text-sm scroll-y-auto"
                                                {...field}
                                        />
                                        </FormControl>
                                        <FormDescription>
                                            Sets the behavior of the assistant. Use {"{{variables}}"} for 
                                            simple values or <br/> 
                                            {"{{json  variable}}"} to stringify objects.
                                        </FormDescription>
                                        <FormMessage />     {/* Appears when there is an error */}
                                    </FormItem>
                                )}
                            />          

                            <FormField
                                control={form.control}
                                name="userPrompt"
                                render={({field}) =>(
                                    <FormItem>
                                        <FormLabel> User Prompt </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={
                                                    "Summarize the text : {{json aiResponse.data}} ."
                                                }
                                                className="min-h-[120px] max-h-[140px] font-mono text-sm scroll-y-auto"
                                                {...field}
                                        />
                                        </FormControl>
                                        <FormDescription>
                                            The Prompt to send to the AI. Use {"{{variables}}"} for 
                                            simple values or <br/> 
                                            {"{{json  variable}}"} to stringify objects.
                                        </FormDescription>
                                        <FormMessage />     {/* Appears when there is an error */}
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