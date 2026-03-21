import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient, useSuspenseQuery} from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook to fetch all conversation names using suspense
*/
export const useSuspenseConversationNames = (workflowId : string) => {
    const trpc = useTRPC() ; 
    return useSuspenseQuery(trpc.conversations.getNames.queryOptions({workflowId})) ;
}

/**
 * Hook to create a conversation
*/

export const useCreateConversation = () => {
    const trpc = useTRPC() ; 
    const queryClient = useQueryClient() ;

    return useMutation(trpc.conversations.create.mutationOptions({
        onSuccess : (data) =>{
            toast.success(`conversation "${data.title}" created`) ;
            queryClient.invalidateQueries(trpc.conversations.getNames.queryOptions({workflowId : data.workflowId})) ; // invalidates the current data so that new one gets loaded
        },
        onError : (error) =>{
            toast.error(`Failed to create conversation: ${error.message}`) ;
        }
    })) ;
}

/**
 *  Hook to remove a conversation
*/

export const useRemoveConversation = () => {
    const trpc = useTRPC() ; 
    const queryClient = useQueryClient() ;

    return useMutation(trpc.conversations.remove.mutationOptions({
        onSuccess : (data) =>{
            toast.success(`conversation "${data.title}" removed`) ;
            queryClient.invalidateQueries(trpc.conversations.getNames.queryOptions({workflowId : data.workflowId})) ; // invalidates the current data so that new one gets loaded
        },
        onError : (error) =>{
            toast.error(`Failed to remove conversation: ${error.message}`) ;
        }
    })) ;
}

/**
 * Hook to fetch a conversation chats
*/

export const useGetConversationChats = (conversationId : string) => {
    const trpc = useTRPC() ; 
    return useQuery({
        ...trpc.conversations.getChats.queryOptions({conversationId}),
        enabled : (conversationId.length != 0)
    }) ;
}