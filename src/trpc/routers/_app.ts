import { credentialRouter } from '@/features/credentials/server/routers';
import { createTRPCRouter } from '../init';
import { workflowsRouter } from '@/features/workflows/servers/routers';


/*
baseProcedure is used to create endpoints / routes

.query -> get api call
.mutation -> post api call

in express we call the routes through fetch or axios 
but 
in trpc we call the procedure directly as a function
*/

export const appRouter = createTRPCRouter({
  workflows : workflowsRouter , 
  credentials : credentialRouter

});
// export type definition of API
export type AppRouter = typeof appRouter;