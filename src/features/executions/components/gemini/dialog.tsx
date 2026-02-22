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
 'gemini-1.5-flash',
 'gemini-1.5-flash-latest',
 'gemini-1.5-flash-001',
 'gemini-1.5-flash-002',
 'gemini-1.5-flash-8b',
 'gemini-1.5-flash-8b-latest',
 'gemini-1.5-flash-8b-001',
 'gemini-1.5-pro',
 'gemini-1.5-pro-latest',
 'gemini-1.5-pro-001',
 'gemini-1.5-pro-002',
 'gemini-2.0-flash',
 'gemini-2.0-flash-001',
 'gemini-2.0-flash-live-001',
 'gemini-2.0-flash-lite',
 'gemini-2.0-pro-exp-02-05',
 'gemini-2.0-flash-thinking-exp-01-21',
 'gemini-2.0-flash-exp',
 'gemini-2.5-pro',
 'gemini-2.5-flash',
 'gemini-2.5-flash-image-preview',
 'gemini-2.5-flash-lite',
 'gemini-2.5-flash-lite-preview-09-2025',
 'gemini-2.5-flash-preview-04-17',
 'gemini-2.5-flash-preview-09-2025',
 'gemini-3-pro-preview',
 'gemini-3-pro-image-preview',
 'gemini-3-flash-preview',
 'gemini-pro-latest',
 'gemini-flash-latest',
 'gemini-flash-lite-latest',
 'gemini-2.5-pro-exp-03-25',
 'gemini-exp-1206',
 'gemma-3-12b-it',
 'gemma-3-27b-it'
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

export type GeminiFormValues = z.infer<typeof formSchema> ;

interface GeminiNodeDialogProps{
    open : boolean,
    onOpenChange : (open : boolean) => void
    onSubmit : (values : z.infer<typeof formSchema>) => void ;
    defaultValues? : Partial<GeminiFormValues>
}

export const GeminiDialog = ({ 
    open , 
    onOpenChange ,
    onSubmit ,
    defaultValues = {}
} : GeminiNodeDialogProps) => {

    const defaultGeminiFormValues = {
        variableName : defaultValues.variableName || "",
        model : defaultValues.model || AVAILABLE_MODELS[0],
        systemPrompt : defaultValues.systemPrompt || "",
        userPrompt : defaultValues.userPrompt || "",
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema) ,
        defaultValues : defaultGeminiFormValues
    })

    useEffect(() =>{
        if(open){
            form.reset(defaultGeminiFormValues) ;
        }
    },[open, defaultValues , form]) ;

    const watchVariableName = form.watch("variableName") || "myGemini" ;

    const handleSubmit = (values : z.infer<typeof formSchema>) => {
        onSubmit(values) ;
        onOpenChange(false) ;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle> Gemini Configuration</DialogTitle>
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
                                                placeholder="myGemini" 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Use this name to refrence the result in other nodes : {""}
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
                                            The Google Gemini model to use for completion
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
                                                    "Summarize the text : {{json myGemini}} ."
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