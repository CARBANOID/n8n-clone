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
import { useCredentialByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@prisma/client";
import Image from "next/image";
import { OPENAI_MODELS } from "@/config/ai-models";


const formSchema = z.object({
    variableName : z
                  .string()
                  .min(1,{message : "ai request name is required"})
                  .regex(/^[a-zA-Z_$][a-zA-Z0-9_]*$/ , {
                    message : "Variable name must start with a letter or underscore and can contain letters, numbers, and underscores."
                  }),
    credentialId : z.string().min(1,{message : "Credential is required"}),
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
        model : defaultValues.model || OPENAI_MODELS[0],
        credentialId : defaultValues.credentialId || "",
        systemPrompt : defaultValues.systemPrompt || "",
        userPrompt : defaultValues.userPrompt || "",
    }

    const { 
        data : credentials ,
        isLoading : isLoadingCredentials,
    } = useCredentialByType(CredentialType.OPENAI) ;

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
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-4 mt-2"
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
                                name="credentialId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>OpenAI Credential</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={
                                                isLoadingCredentials || !credentials?.length
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a Credential" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {credentials?.map((credential) => (
                                                    <SelectItem 
                                                        key={credential.id} 
                                                        value={credential.id}
                                                    >
                                                    <div className="flex items-center gap-2">
                                                            <Image
                                                                src={"/logos/openai.svg"}
                                                                alt={"OpenAI"}
                                                                width={16}
                                                                height={16}
                                                            />
                                                            { credential.name }                                                                
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                                                {OPENAI_MODELS.map((model) =>(
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
                                                className="min-h-[100px] max-h-[140px] font-mono text-sm scroll-y-auto"
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
                                                className="min-h-[100px] max-h-[140px] font-mono text-sm scroll-y-auto"
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

                            <DialogFooter className="-mt-2">
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