import { useQueryStates } from "nuqs" ;
import { credentialsParams } from "../params";

export const useCredentialsParams = () => { // returns the value of the params present in url
    return useQueryStates(credentialsParams) ;    //useQueryStates for parsing params from url in client side
};