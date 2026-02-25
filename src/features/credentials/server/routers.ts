import pClient from "@/lib/db";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { PAGINATION } from "@/config/constants";
import { CredentialType } from "@prisma/client";

export const credentialsRouter = createTRPCRouter({
    create : premiumProcedure
        .input(z.object({
            name : z.string().min(1,"Name is Required"),
            type : z.enum(CredentialType),
            value : z.string().min(1,"Value is Required")
        }))
        .mutation(async({ ctx , input }) =>{
            const { name , type , value } = input ;
            return pClient.credential.create({
                data : {
                    name,
                    type,
                    value,  // TODO : Consider encrypting in production  -> Amazon Secrets Manager
                    userId : ctx.auth.user.id
                }
            })
        }),
    remove : protectedProcedure
        .input(z.object({
            id : z.string()
        }))
        .mutation(({ ctx , input }) =>{
        return pClient.credential.delete({
            where : {
                id : input.id ,
                userId : ctx.auth.user.id 
            }
        })
    }),
    update : protectedProcedure
        .input(z.object({
            id : z.string(),
            name : z.string().min(1,"Name is Required"),
            type : z.enum(CredentialType),
            value : z.string().min(1,"Value is Required")        
        }))
        .mutation(({ ctx , input }) =>{
            const { id , name , type , value } = input ;
            return pClient.credential.update({
                where : {
                    id,
                    userId : ctx.auth.user.id
                },
                data : {
                    name,
                    type,
                    value  // TODO : Consider encrypting in production  -> Amazon Secrets Manager
                }
            });
        }),
    getOne : protectedProcedure
        .input(z.object({
            id : z.string()
        }))
        .query(({ ctx , input }) =>{
            return pClient.credential.findUniqueOrThrow({
                where : {
                    id : input.id ,
                    userId : ctx.auth.user.id
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
            search : z.string().default("")
        }))
        .query(async({ ctx , input }) =>{
        const { page , pageSize , search } = input ;
        const [items , totalCount] = await Promise.all([
            pClient.credential.findMany({   // fetch the items of a particular page acc. to updatedAt field in desc order 
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
            
            pClient.credential.count({ 
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
    getByType : protectedProcedure
        .input(z.object({
            type : z.enum(CredentialType)
        }))
        .query(async({ ctx , input }) =>{
            const { type } = input ;
            return await pClient.credential.findMany({
                where : {
                    type,
                    userId : ctx.auth.user.id
                },
                orderBy : {
                    updatedAt : "desc"
                }
            })
        }
    ),
}) ;

