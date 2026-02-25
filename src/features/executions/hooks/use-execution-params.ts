import { useQueryStates } from "nuqs" ;
import { executionsParams } from "../params";

export const useExecutionsParams = () => { // returns the value of the params present in url
    return useQueryStates(executionsParams) ;    //useQueryStates for parsing params from url in client side
};