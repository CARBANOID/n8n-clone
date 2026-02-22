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
'claude-sonnet-4-5',
'claude-3-5-haiku-20241022',
'claude-3-5-haiku-latest',
'claude-3-7-sonnet-20250219',
'claude-3-7-sonnet-latest',
'claude-3-haiku-20240307',
'claude-haiku-4-5-20251001',
'claude-haiku-4-5',
'claude-opus-4-0',
'claude-opus-4-1-20250805',
'claude-opus-4-1',
'claude-opus-4-20250514',
'claude-opus-4-5',
'claude-opus-4-5-20251101',
'claude-sonnet-4-0',
'claude-sonnet-4-20250514',
'claude-sonnet-4-5-20250929',
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

export type AnthropicFormValues = z.infer<typeof formSchema> ;

interface AnthropicNodeDialogProps{
    open : boolean,
    onOpenChange : (open : boolean) => void
    onSubmit : (values : z.infer<typeof formSchema>) => void ;
    defaultValues? : Partial<AnthropicFormValues>
}

export const AnthropicDialog = ({ 
    open , 
    onOpenChange ,
    onSubmit ,
    defaultValues = {}
} : AnthropicNodeDialogProps) => {

    const defaultAnthropicFormValues = {
        variableName : defaultValues.variableName || "",
        model : defaultValues.model || AVAILABLE_MODELS[0],
        systemPrompt : defaultValues.systemPrompt || "",
        userPrompt : defaultValues.userPrompt || "",
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema) ,
        defaultValues : defaultAnthropicFormValues
    })

    useEffect(() =>{
        if(open){
            form.reset(defaultAnthropicFormValues) ;
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
                    <DialogTitle> Anthropic Configuration</DialogTitle>
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
                                            The Anthropic model to use for completion
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