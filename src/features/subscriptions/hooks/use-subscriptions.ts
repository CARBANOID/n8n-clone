import { useQuery } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client' ;

export const useSubscriptions = () => {
    return useQuery({
        queryKey : ['subscriptions'] ,
        queryFn  : async() => {
            const { data } = await authClient.customer.state() ;  // will give subscription state of user i.e base or pro tier
            return data ;  
        } 
    })
}


export const useHasActiveSubscription = () => {
    const { data : customerState , isLoading  , ...rest} = useSubscriptions() ; 
    // console.log(customerState) ; 
    const hasActiveSubscriptions = customerState?.activeSubscriptions && customerState.activeSubscriptions.length > 0  // user can have more than one active subscription
    
    return {
        hasActiveSubscriptions ,
        subscription : customerState?.activeSubscriptions?.[0],
        isLoading,
        ...rest
    } 
}

