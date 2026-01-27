import pClient from "@/lib/db";
import { generateSlug } from "random-word-slugs"
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { PAGINATION } from "@/config/constants";
import { NodeType } from "@prisma/client";
import type { Node, Edge } from "@xyflow/react";

export const workflowsRouter = createTRPCRouter({
    create : premiumProcedure.mutation(async({ ctx }) =>{
        return pClient.workflow.create({
            data : {
                name   : generateSlug(3),
                userId : ctx.auth.user.id,
                nodes   : {
                    create : {
                        type : NodeType.INITIAL,
                        position : { x : 0 , y : 0},
                        name : NodeType.INITIAL
                    }
                }
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
        const workflow = await pClient.workflow.findUniqueOrThrow({
            where : {
                id : input.id ,
                userId : ctx.auth.user.id
            },
            include : {
                nodes : true ,
                connections : true
            }
        })

        // Transforming server nodes to react-flow compatiable nodes

        const nodes : Node[] = workflow.nodes.map((node) => {
            return {
                id : node.id,
                type : node.type,
                position : node.position as { x : number , y : number },
                data : (node.data as Record<string,unknown>) || {},
            }
        })

        // Transforming server connections to react-flow compatiable edges

        const edges : Edge[] = workflow.connections.map((connection) => {
            return {
                id : connection.id,
                source : connection.fromNodeId,
                target : connection.toNodeId,
                sourceHandle : connection.fromOutput,
                targetHandle : connection.toInput
            }
        })

        return {
            id : workflow.id,
            name : workflow.name,
            nodes,
            edges
        }
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

