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
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const formSchema = z.object({
    variableName : z
                  .string()
                  .min(1,{message : "ai request name is required"})
                  .regex(/^[a-zA-Z_$][a-zA-Z0-9_]*$/ , {
                    message : "Variable name must start with a letter or underscore and can contain letters, numbers, and underscores."
                  }),
    username : z.string().optional(),
    content : z
            .string()
            .min(1,{message : "Content is required"})
            .max(2000,"Discord messages cannot exceed 2000 characters"),
    webhookUrl : z.string().min(1,{message : "Webhook URL is required"})
}) ;

export type DiscordFormValues = z.infer<typeof formSchema> ;

interface DiscordNodeDialogProps{
    open : boolean,
    onOpenChange : (open : boolean) => void
    onSubmit : (values : z.infer<typeof formSchema>) => void ;
    defaultValues? : Partial<DiscordFormValues>
}

export const DiscordDialog = ({ 
    open , 
    onOpenChange ,
    onSubmit ,
    defaultValues = {}
} : DiscordNodeDialogProps) => {

    const defaultDiscordFormValues = {
        variableName : defaultValues.variableName || "",
        username : defaultValues.username || "",
        content : defaultValues.content || "",
        webhookUrl : defaultValues.webhookUrl || ""
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema) ,
        defaultValues : defaultDiscordFormValues
    })

    useEffect(() =>{
        if(open){
            form.reset(defaultDiscordFormValues) ;
        }
    },[open, defaultValues , form]) ;

    const watchVariableName = form.watch("variableName") || "myDiscord" ;

    const handleSubmit = (values : z.infer<typeof formSchema>) => {
        onSubmit(values) ;
        onOpenChange(false) ;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle> Discord Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the Discord webhook setting for this node.
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
                                name="variableName"
                                render={({field}) =>(
                                    <FormItem>
                                        <FormLabel> Variable Name </FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="myDiscord" 
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
                                name="webhookUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Webhook URL</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="https://discord.com/api/webhooks/..." 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Get this from Discord :<br/> Your joined server &rarr;  Edit Channel &rarr; Integration &rarr; Webhooks
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
                                        <FormLabel> Message Content </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={
                                                    "Summary: {{aiResponse}}"
                                                }
                                                className="min-h-[120px] max-h-[140px] font-mono text-sm scroll-y-auto"
                                                {...field}
                                        />
                                        </FormControl>
                                        <FormDescription>
                                            The message to send. Use {"{{variables}}"} for 
                                            simple values or <br/> 
                                            {"{{json  variable}}"} to stringify objects.
                                        </FormDescription>
                                        <FormMessage />     {/* Appears when there is an error */}
                                    </FormItem>
                                )}
                            />          

                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bot Username (Optional)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="Workflow bot" 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Override the webhook's default username
                                        </FormDescription>
                                        <FormMessage />
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