import { useEffect , useState } from "react"
import { PAGINATION } from "@/config/constants"

interface UseEntitySearchProps <T extends {  // T is a generic type parameter that is constrained to have at least those 2 properties. 
    search : string , 
    page   : number
}>{
    params : T ;
    setParams : (params : T) => void ;
    debounceMs? : number ;
}


/*
 the current timeout will always be cleared before the next re-render even if it's callback is not called yet

 if (the next re-render happens before decounceMs time)
 then "callback will not be called" 
 else "callback will be called" .

 thus this works as a debouncer 
*/

export function useEntitySearch<T extends {  // debounce the search input to avoid too many updates
search : string , 
page   : number
}>({
    params,
    setParams,
    debounceMs = 500 ,
}: UseEntitySearchProps<T>){
    const [localSearch,setLocalSearch] = useState(params.search) ;

    useEffect(() =>{
        if(localSearch === "" && params.search !== ""){
            setParams({
                ...params,
                search : "",
                page : PAGINATION.DEFAULT_PAGE
            })
            return ; 
        }
        
        const timer = setTimeout(() =>{
            if(localSearch !== params.search){
                setParams({
                    ...params,
                    search : localSearch,
                    page : PAGINATION.DEFAULT_PAGE
                })
            } 
        },debounceMs) ;

        return () => clearTimeout(timer) ;
    },[localSearch, params, setParams, debounceMs]) ;

    useEffect(() =>{
        setLocalSearch(params.search) ;
    },[params.search]) ;

    return {
        searchValue : localSearch,
        onSearchChange : setLocalSearch
    }
} 