import { Button } from "@/components/ui/button"; 
import { useExecteWorkflow } from "@/features/workflows/hooks/use-workflows";
import { PlayIcon } from "lucide-react";

export const ExecuteWorkflowButton = ({
    workflowId
} : { workflowId : string }) =>{
    const executeWorkflow = useExecteWorkflow() ;

    const handleExecute = () =>{
        executeWorkflow.mutate({
            id : workflowId
        })
    }; 

    return (
        <Button 
            size="lg"
            onClick={handleExecute} 
            disabled={executeWorkflow.isPending}    
        >
            <PlayIcon className="size-5 mt-0.5"/>
            Execute Workflow 
        </Button>
    )
}