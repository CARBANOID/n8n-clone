import pClient from "@/lib/db";
import { generateSlug } from "random-word-slugs"
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { PAGINATION } from "@/config/constants";

export const workflowsRouter = createTRPCRouter({
    create : premiumProcedure.mutation(async({ ctx }) =>{
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
        .mutation(async({ ctx , input }) =>{
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
        .mutation(async({ ctx , input }) =>{
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
        .query(async({ ctx , input }) =>{
        return pClient.workflow.findUniqueOrThrow({
            where : {
                id : input.id ,
                userId : ctx.auth.user.id
            }
        })
    }),
    getMany : protectedProcedure
        .input(z.object({
            page : z.number().min(1).default(PAGINATION.DEFAULT_PAGE) ,
            pageSize : z
            .number()
            .min(PAGINATION.MIN_PAGE_SIZE)
            .max(PAGINATION.MAX_PAGE_SIZE)
            .default(PAGINATION.DEFAULT_PAGE_SIZE),
            search : z.string().default("")
        }))
        .query(async({ ctx , input }) =>{
        const { page , pageSize , search } = input ;
        const [items , totalCount] = await Promise.all([
            pClient.workflow.findMany({   // fetch the items of a particular page acc. to updatedAt field in desc order 
                skip  : (page - 1) * pageSize ,  // no of page to skip
                take  : pageSize ,   // no of items to take
                where : {
                    userId : ctx.auth.user.id , 
                    name : {
                        contains : search ,
                        mode : "insensitive"   // case-insensitive
                    }
                },
                orderBy : {
                    updatedAt : "desc" 
                }
            }),
            pClient.workflow.count({ 
                where : {
                    userId : ctx.auth.user.id,
                    name : {
                        contains : search ,
                        mode : "insensitive"   // case-insensitive
                    }
                }   
            })
        ])
        
        const totalPages = Math.ceil(totalCount / pageSize) ;
        const hasNextPage = page < totalPages ;
        const hasPreviousPage = page > 1 ;

        return { 
            items ,
            page ,
            pageSize , 
            totalCount ,
            totalPages ,
            hasNextPage ,
            hasPreviousPage
        }
    }),     
}) ;

