import { Button } from "@/components/ui/button"; 
import { useExecteWorkflow } from "@/features/workflows/hooks/use-workflows";
import { FlaskConicalIcon } from "lucide-react";

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
            <FlaskConicalIcon className="size-4"/>
            Execute Workflow 
        </Button>
    )
}