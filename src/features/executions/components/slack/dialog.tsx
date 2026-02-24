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
    content : z
            .string()
            .min(1,{message : "Content is required"}),
    webhookUrl : z.string().min(1,{message : "Webhook URL is required"})
}) ;

export type SlackFormValues = z.infer<typeof formSchema> ;

interface SlackNodeDialogProps{
    open : boolean,
    onOpenChange : (open : boolean) => void
    onSubmit : (values : z.infer<typeof formSchema>) => void ;
    defaultValues? : Partial<SlackFormValues>
}

export const SlackDialog = ({ 
    open , 
    onOpenChange ,
    onSubmit ,
    defaultValues = {}
} : SlackNodeDialogProps) => {

    const defaultSlackFormValues = {
        variableName : defaultValues.variableName || "",
        content : defaultValues.content || "",
        webhookUrl : defaultValues.webhookUrl || ""
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema) ,
        defaultValues : defaultSlackFormValues
    })

    useEffect(() =>{
        if(open){
            form.reset(defaultSlackFormValues) ;
        }
    },[open, defaultValues , form]) ;

    const watchVariableName = form.watch("variableName") || "mySlack" ;

    const handleSubmit = (values : z.infer<typeof formSchema>) => {
        onSubmit(values) ;
        onOpenChange(false) ;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle> Slack Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the Slack webhook setting for this node.
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
                                                placeholder="mySlack" 
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
                                                placeholder="https://hooks.slack.com/services/..." 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            {/* Webhook can be made with both workflow or App in slack */}
                                            <h4 className="font-medium text-sm"> Get this from Slack : </h4>
                                            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                                                <li> Open your Slack Channel</li>
                                                <li> Go to <u>More</u> &rarr; <u>Tools</u> &rarr; <u>New</u> &rarr; <u>Build Workflow</u></li>
                                                <li> Select <u>Choose an event</u> &rarr; <u>From a webhook</u> </li>
                                                <li> Select <u>Create the Webhook</u>  &rarr; Select <u>Set Up Variables</u></li>
                                                <li> Make sure the name of the Key is <u><b>content</b></u> and click <u>done</u></li>
                                                <li> Go to Workflow and Open the created workflow </li>
                                                <li> Select <u>Starts with a webhook</u> &rarr; <u>Copy Web request URL</u> </li>
                                            </ol>                    
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