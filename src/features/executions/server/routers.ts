import pClient from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { PAGINATION } from "@/config/constants";

export const executionsRouter = createTRPCRouter({
    getOne : protectedProcedure
        .input(z.object({
            id : z.string()
        }))
        .query(({ ctx , input }) =>{
            return pClient.execution.findUniqueOrThrow({
                where : {
                    id : input.id ,
                    workflow : {
                        userId : ctx.auth.user.id
                    }
                },
                include : {
                    workflow : {
                        select : {
                            id : true,
                            name : true
                        }
                    }
                }
            })
        }
    ),
    getMany : protectedProcedure
        .input(z.object({
            page : z.number().min(1).default(PAGINATION.DEFAULT_PAGE) ,
            pageSize : z
            .number()
            .min(PAGINATION.MIN_PAGE_SIZE)
            .max(PAGINATION.MAX_PAGE_SIZE)
            .default(PAGINATION.DEFAULT_PAGE_SIZE),
        }))
        .query(async({ ctx , input }) =>{
        const { page , pageSize } = input ;
        const [items , totalCount] = await Promise.all([
            pClient.execution.findMany({   // fetch the items of a particular page acc. to updatedAt field in desc order 
                skip  : (page - 1) * pageSize ,  // no of page to skip
                take  : pageSize ,   // no of items to take
                where : {
                    workflow : {
                        userId : ctx.auth.user.id
                    }
                },
                orderBy : {
                    startedAt : "desc" 
                },
                include : {
                    workflow : {
                        select : {
                            id : true,
                            name : true
                        }
                    }
                }
            }),
            
            pClient.execution.count({ 
                where : {
                    workflow : {
                        userId : ctx.auth.user.id
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

