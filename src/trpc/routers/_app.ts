import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../init';
import pClient from '@/lib/db';

/*
baseProcedure is used to create endpoints / routes

.query -> get api call
.mutation -> post api call

in express we call the routes through fetch or axios 
but 
in trpc we call the procedure directly as a function
*/

export const appRouter = createTRPCRouter({
  getUsers : protectedProcedure.query(({ctx}) => {      
      return pClient.user.findMany();
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;