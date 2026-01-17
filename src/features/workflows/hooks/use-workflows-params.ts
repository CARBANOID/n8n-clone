import { useQueryStates } from "nuqs" ;
import { workflowsParams } from "../params";

export const useWorkflowsParams = () => { // returns the value of the params present in url
    return useQueryStates(workflowsParams) ;    //useQueryStates for parsing params from url in client side
};