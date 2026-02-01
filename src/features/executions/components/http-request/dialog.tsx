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

const formSchema = z.object({
    endPoint : z.url({message : "Invalid URL"}),
    method : z.enum(['GET' , 'POST' , 'PUT' , 'DELETE' , 'PATCH']),
    body :  z.
            string(). 
            optional()
            // .refine()  TODO JSONS
}) ;

export type FormType = z.infer<typeof formSchema> ;

interface HttpRequestNodeDialogProps{
    open : boolean,
    onOpenChange : (open : boolean) => void
    onSubmit : (values : z.infer<typeof formSchema>) => void ;
    defaultEndPoint? : string ;
    defaultMethod? : 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' ;
    defaultBody? : string ;
}

export const HttpRequestDialog = ({ 
    open , 
    onOpenChange ,
    onSubmit ,
    defaultEndPoint="" ,
    defaultMethod="GET" ,
    defaultBody=""
} : HttpRequestNodeDialogProps) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema) ,
        defaultValues : {
            method : defaultMethod ,
            endPoint : defaultEndPoint ,
            body : defaultBody
        }
    })

    useEffect(() =>{
        if(open){
            form.reset({
                method : defaultMethod ,
                endPoint : defaultEndPoint ,
                body : defaultBody
            }) ;
        }
    },[open, defaultEndPoint, defaultMethod, defaultBody, form]) ;

    const watchMethod = form.watch("method") ; // watches the method field to conditionally show body field
    const showBodyField = ["POST" , "PUT" , "PATCH"].includes(watchMethod) ;

    const handleSubmit = (values : z.infer<typeof formSchema>) => {
        onSubmit(values) ;
        onOpenChange(false) ;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle> Http Request </DialogTitle>
                    <DialogDescription>
                        Configure settings for the HTTP Request node.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-4 mt-4"
                        >
                            <FormField
                                control={form.control}
                                name="method"
                                render={({field}) =>(
                                    <FormItem>
                                        <FormLabel> Method </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue 
                                                        placeholder = "Select a method"
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="GET"> GET </SelectItem>
                                                <SelectItem value="POST"> POST </SelectItem>
                                                <SelectItem value="PUT"> PUT </SelectItem>  
                                                <SelectItem value="PATCH"> PATCH </SelectItem>
                                                <SelectItem value="DELETE"> DELETE </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            The HTTP method for this request.
                                        </FormDescription>
                                        <FormMessage />     {/* Appears when there is an error */}
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endPoint"
                                render={({field}) =>(
                                    <FormItem>
                                        <FormLabel> Endpoint URL </FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="https://api.example.com/{{httpResponse.data.id}}"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Static URL or Use {"{{variables}}"} for 
                                            simple values or {"{{json variable}}"} to 
                                            stringify objects.
                                        </FormDescription>
                                        <FormMessage />     {/* Appears when there is an error */}
                                    </FormItem>
                                )}
                            />
                            { 
                                showBodyField 
                                && 
                                (
                                <FormField
                                    control={form.control}
                                    name="body"
                                    render={({field}) =>(
                                        <FormItem>
                                            <FormLabel> Request Body </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder={
                                                        '{\n    "userId" : "{{httpResponse.data.id}}",\n    "name" : "{{httpResponse.data.name}}",\n    "items" : "{{json httpResponse.data.items}"\n}'
                                                    }
                                                    className="min-h-[120px] font-mono text-sm"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                JSON with template variables , Use {"{{variables}}"} for 
                                                simple values or {"{{json  variable}}"} to 
                                                stringify objects.
                                            </FormDescription>
                                            <FormMessage />     {/* Appears when there is an error */}
                                        </FormItem>
                                    )}
                                />                            
                                )
                            }
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