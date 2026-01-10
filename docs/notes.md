# How to use ShadCN

```tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Home1(){
  const temp : boolean = true ; 
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      <Button variant="outline">Click Me</Button>
    </div>
  )
}

export  function Home2(){
  const temp : boolean = true ; 
  return (
    // Applying multiple conditional tailwind classes to a element (here div)
    <div className={cn("text-amber-700 font-extrabold",temp && "text-green-500")}>
      Welcome to the Home Page
    </div>
  )
}
```


# TRPC Procedures vs Express Routes
in express we call the routes through fetch or axios 
but 
in trpc we call the procedure directly as a function

baseProcedure is used to create endpoints / routes
.query -> get api call
.mutation -> post api call


1) **Express**
``` ts 
// EXPRESS - Manual everything
app.get('/api/user/:id', (req, res) => {
  const id = req.params.id; // ❌ No type safety
  // ... logic
  res.json({ user: data }); // ❌ No type checking
});

// Client
const res = await fetch('/api/user/123');
const data = await res.json(); // ❌ No idea what shape this is

```


2) **TRPC**
```ts

// TRPC - Automatic type safety
userById: baseProcedure
  .input(z.object({ id: z.string() })) // ✅ Validated input
  .query(({ input }) => {
    return { user: data }; // ✅ Type-checked output
  })

// Client
const data = await trpc.userById.query({ id: '123' }); // ✅ Fully typed!

```


# Proper Way of Fetching Data from TRPC

1) Server Component

**NOTE** : caller is `server-only`  i.e can only be used in server components 

```tsx
import { caller } from "@/trpc/server";

export default async function Home1(){
  const users = await caller.getUsers() ; 
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      <div> {JSON.stringify(users)}</div>
    </div>
  )
}
```

2) Client Component

**Method 1**

```tsx
"use client"
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export default  function Home(){
  const trpc = useTRPC() ;
  const { data : users } = useQuery(trpc.getUsers.queryOptions())
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      <div> {JSON.stringify(users)}</div>
    </div>
  )
}
```

**Method 2** : Passing Data from Server Component to Client Component

-> let page.tsx be server component by default
-> create a new file client.tsx for client component

* Disadvantage : only the data will be fetched on server side, any further data fetching or interaction will not be possible on client side

client.tsx
----------

```tsx
"use client" ; 

export const Client = ({ users } : { users : Record<string,any>[] } ) =>{
    return (
        <div>
            Client Component : {JSON.stringify(users)}
        </div>
    )
}
```


page.tsx
--------

```tsx
import { caller } from "@/trpc/server";
import { Client } from "./client";

export default async function Home(){
  const users : Record<string,any>[] = await caller.getUsers() ; 
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      <Client users = {users} />
    </div>
  )
}
```

3) Creating Boundary between Server and Client Component

page.tsx
--------

```tsx
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { Client } from "./client";
import { getQueryClient , trpc} from "@/trpc/server";

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
```


client.tsx
----------
```tsx
"use client" ;
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Client = () => {
    const trpc = useTRPC() ;
    const {data : users} = useSuspenseQuery(trpc.getUsers.queryOptions()) ;  // this will return multiple properties 
    return (
        <div>
            Client Component : {JSON.stringify(users)}
        </div>
    )
}

```