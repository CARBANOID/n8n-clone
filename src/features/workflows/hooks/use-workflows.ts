/**
 * Hook to fetch all workflows using suspense
 */

import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";

export const useSuspenseWorkflows = () => {
    const trpc = useTRPC() ; 
    const [params] = useWorkflowsParams() ; 
    return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params)) ;
}

/**
 * Hook to create a workflows using suspense
*/

export const useCreateWorkflow = () => {
    const trpc = useTRPC() ; 
    const queryClient = useQueryClient() ;

    return useMutation(trpc.workflows.create.mutationOptions({
        onSuccess : (data) =>{
            toast.success(`workflow "${data.name}" created`) ;
            // queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({})) ; // invalidates the current data so that new one gets loaded

            // better method to invalidate only the created workflow
            queryClient.invalidateQueries(trpc.workflows.getOne.queryFilter({ 
                id : data.id
            })) ; 
        },
        onError : (error) =>{
            toast.error(`Failed to create workflow: ${error.message}`) ;
        }
    })) ;
}

/**
 *  Hook to remove a workflow
*/

export const useRemoveWorkflow = () => {
    const trpc = useTRPC() ; 
    const queryClient = useQueryClient() ;

    return useMutation(trpc.workflows.remove.mutationOptions({
        onSuccess : (data) =>{
            toast.success(`workflow "${data.name}" removed`) ;
            // better method to invalidate only the  removed workflow and the list
            queryClient.invalidateQueries(trpc.workflows.getOne.queryFilter({ 
                id : data.id
            })) ; // invalidates the current data so that new one gets loaded
        }, 
        onError : (error) =>{
            toast.error(`Failed to remove workflow: ${error.message}`) ;
        }
    })) ;
}