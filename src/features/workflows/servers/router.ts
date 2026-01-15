import pClient from "@/lib/db";
import { generateSlug } from "random-word-slugs"
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import { z } from "zod";

export const workflowsRouter = createTRPCRouter({
    create : premiumProcedure.mutation(async( { ctx }) =>{
        return pClient.workflow.create({
            data : {
                name   : generateSlug(3),
                userId : ctx.auth.user.id 
            }
        })
    }),
    remove : protectedProcedure
        .input(z.object({
            id : z.string()
        }))
        .mutation(async( { ctx , input }) =>{
        return pClient.workflow.delete({
            where : {
                id : input.id ,
                userId : ctx.auth.user.id 
            }
        })
    }),
    updateName : protectedProcedure
        .input(z.object({
            id : z.string() , 
            name : z.string().min(1)
        }))
        .mutation(async( { ctx , input }) =>{
        return pClient.workflow.update({
            where : {
                id : input.id ,
                userId : ctx.auth.user.id 
            },
            data : {
                name : input.name
            }
        })
    }),
    getOne : protectedProcedure
        .input(z.object({
            id : z.string()
        }))
        .query(async( { ctx , input }) =>{
        return pClient.workflow.findUnique({
            where : {
                id : input.id ,
                userId : ctx.auth.user.id
            }
        })
    }),
    getMany : protectedProcedure
        .query(async( { ctx }) =>{
        return pClient.workflow.findMany({
            where : {
                userId : ctx.auth.user.id
            }
        })
    }),
}) ;
