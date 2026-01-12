import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import pClient from '@/lib/db';
import { inngest } from '@/inngest/client';


/*
baseProcedure is used to create endpoints / routes

.query -> get api call
.mutation -> post api call

in express we call the routes through fetch or axios 
but 
in trpc we call the procedure directly as a function
*/

export const appRouter = createTRPCRouter({
  testAI : baseProcedure.mutation(async() =>{
    await inngest.send({
      name : "testAI/sum" ,
    }) ;

    return { success : true , message : "Job Queued"}
  }),
  getWorkFlows : protectedProcedure.query(({ctx}) => {       // .query -> Fetch/read data without changing anything

      return pClient.workflow.findMany();
  }), 
  createWorkFlow : protectedProcedure.mutation(async() => {     // .mutation -> create / update / delete data

    // invoking background job through inngest
    await inngest.send({
      name : "test/hello.world" ,
      data : {
        email : "test1123gmail.com"
      },
    }) ;

     return pClient.workflow.create({
        data : {
          name : "test-workflow"
        }
     })
  }), 
});
// export type definition of API
export type AppRouter = typeof appRouter;