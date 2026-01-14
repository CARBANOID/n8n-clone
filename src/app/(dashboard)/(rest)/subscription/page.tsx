"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const Page = () => {
    const trpc = useTRPC() ; 
    const testAI = useMutation(trpc.testAI.mutationOptions({
        onSuccess : () => {
            toast.success("Job Queued") ;
        },
        onError : ({message}) =>{
            toast.error(message)
        }
    }))

    return(
       <Button 
       onClick={() => testAI.mutate()}
       disabled ={testAI.isPending}    
       
       > Test AI</Button>
    )
} 

export default Page;