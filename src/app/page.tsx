"use client" ;

import { Button } from "@/components/ui/button";
import { LogOutButton } from "./logout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";

const Home = () => {
    const  trpc = useTRPC() ; 
    const { data } = useQuery(trpc.getWorkFlows.queryOptions()) ;

    const queryClient = useQueryClient() ; 
    const create = useMutation(trpc.createWorkFlow.mutationOptions({
      onSuccess : () => {
        toast.success("Job Queued") ;  // refetchs data/worklow in case of successul creation
      }
    })) ;

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
      protected server component
      <div>
        {JSON.stringify(data,null,2)}
      </div>
      <Button disabled={create.isPending} onClick={ () => create.mutate() }>
        Create workflow
      </Button>

      <LogOutButton/>
    </div>
  )
}

export default Home ;