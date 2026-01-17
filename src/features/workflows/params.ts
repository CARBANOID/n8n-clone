import { parseAsInteger , parseAsString } from "nuqs/server" ; 
// we are importing from nuqs/server cause it can be used in both server and client side whereas "nuqs" is only for client side
import { PAGINATION } from "@/config/constants"

export const workflowsParams = { // we define the parameters which are present in url 
    page : parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE)   // if it hit the default page then remove the default from the url i.e default page is 1 
    .withOptions({ clearOnDefault : true}),  // so http://localhost:3000/workflows?page=1 will be http://localhost:3000/workflows
    pageSize : parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE_SIZE) 
    .withOptions({ clearOnDefault : true})  ,
    search : parseAsString
    .withDefault("") 
    .withOptions({ clearOnDefault : true})  ,
}


