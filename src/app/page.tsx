// "use client"   // for Client Components
import { cn } from "@/lib/utils";
import { caller } from "@/trpc/server";
import { useTRPC } from "@/trpc/client";
import { dehydrate, HydrationBoundary, useQuery } from "@tanstack/react-query";
import { Client } from "./client";
import { getQueryClient , trpc} from "@/trpc/server";
import { Suspense } from "react";

/**
 * Render a centered full-screen container that hydrates server-prefetched TRPC user data and mounts the client component inside a Suspense boundary.
 *
 * @returns A React element containing a full-screen centered layout with a HydrationBoundary (seeded from the server-prefetched query client) and a Suspense-wrapped Client component.
 */
export default  function Home(){
  const queryClient = getQueryClient() ;
  void  queryClient.prefetchQuery(trpc.getUsers.queryOptions()) ; // leveraging the speed of an Server Component by prefetching the data

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      <HydrationBoundary state={dehydrate(queryClient)}>
         <Suspense fallback={ <div>Loading...</div> }>
           <Client/>
         </Suspense>
      </HydrationBoundary>
    </div>
  )
}

/*
// To fetch the TRPC data in Client Component

export default  function Home(){
  const trpc = useTRPC() ;
  const { data : users } = useQuery(trpc.getUsers.queryOptions())
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      <div> {JSON.stringify(users)}</div>
    </div>
  )
}
*/

/*
// To fetch the TRPC data in Client Component by passing data from Server Component to Client Component

export default async function Home(){
  const users : Record<string,any>[] = await caller.getUsers() ; 
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      <Client users = {users} />
    </div>
  )
}
*/


/**
 * Renders a styled "Welcome to the Home Page" message with a conditional green color.
 *
 * The component applies base amber, extra-bold text styles and conditionally adds a green text color when the internal `temp` flag is true.
 *
 * @returns A JSX element containing the styled welcome text.
 */

export  function Home2(){
  const temp : boolean = true ; 
  return (
    <div className={cn("text-amber-700 font-extrabold",temp && "text-green-500")}>
      Welcome to the Home Page
    </div>
  )
}