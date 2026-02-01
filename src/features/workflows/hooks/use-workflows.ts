import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery} from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";

/**
 * Hook to fetch all workflows using suspense
*/

export const useSuspenseWorkflows = () => {
    const trpc = useTRPC() ; 
    const [params] = useWorkflowsParams() ; 
    return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params)) ;
}

/**
 * Hook to create a workflow
*/

export const useCreateWorkflow = () => {
    const trpc = useTRPC() ; 
    const queryClient = useQueryClient() ;

    return useMutation(trpc.workflows.create.mutationOptions({
        onSuccess : (data) =>{
            toast.success(`workflow "${data.name}" created`) ;
            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({})) ; // invalidates the current data so that new one gets loaded
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
            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({})) ; // invalidates the current data so that new one gets loaded

            // better method to invalidate only the  removed workflow and the list
            // this do not bring change s in the frontend
            // queryClient.invalidateQueries(trpc.workflows.getOne.queryFilter({ 
            //     id : data.id
            // })) ;
        }, 
        onError : (error) =>{
            toast.error(`Failed to remove workflow: ${error.message}`) ;
        }
    })) ;
}

/**
 * Hook to fetch a workflows using suspense
*/

export const useSuspenseWorkflow = (id : string) => {
    const trpc = useTRPC() ; 
    return useSuspenseQuery(trpc.workflows.getOne.queryOptions({id})) ;
}


/**
 * Hook to update a workflow name
*/

export const useUpdateWorkflowName = () => {
    const trpc = useTRPC() ; 
    const queryClient = useQueryClient() ;

    return useMutation(trpc.workflows.updateName.mutationOptions({
        onSuccess : (data) =>{
            toast.success(`workflow "${data.name}" updated`) ;
            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({})) ; // invalidates the current data so that new one gets loaded
            queryClient.invalidateQueries(trpc.workflows.getOne.queryOptions({ id : data.id})) ; // invalidates the current data so that new one gets loaded
        },
        onError : (error) =>{
            toast.error(`Failed to update workflow: ${error.message}`) ;
        } 
    })) ;
}

/**
 * Hook to update a workflow
*/

export const useUpdateWorkflow = () => {
    const trpc = useTRPC() ; 
    const queryClient = useQueryClient() ;

    return useMutation(trpc.workflows.update.mutationOptions({
        onSuccess : (data) =>{
            toast.success(`workflow "${data.name}" saved`) ;
            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({})) ; // invalidates the current data so that new one gets loaded
            queryClient.invalidateQueries(trpc.workflows.getOne.queryOptions({ id : data.id})) ; // invalidates the current data so that new one gets loaded
        },
        onError : (error) =>{
            toast.error(`Failed to save workflow: ${error.message}`) ;
        } 
    })) ;
}