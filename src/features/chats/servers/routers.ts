import pClient from "@/lib/db";
import { generateSlug } from "random-word-slugs"
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { UIMessage } from "ai";
import { ChatRole } from "@prisma/client";

export const conversationRouter = createTRPCRouter({
    create: premiumProcedure.input(
        z.object({
            title: z.string().optional(),
            workflowId: z.string(),
        })
    ).mutation(async ({ ctx, input }) => {
        return pClient.conversation.create({
            data: {
                title: input.title || generateSlug(3),
                workflowId: input.workflowId,
                userId: ctx.auth.user.id
            }
        })
    }),
    remove: protectedProcedure
        .input(z.object({
            conversationId: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            return pClient.conversation.delete({
                where: {
                    id : input.conversationId,
                    userId: ctx.auth.user.id,
                }
            })
        }),
    getChats: protectedProcedure
        .input(z.object({
            conversationId: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const conversation = await pClient.conversation.findUniqueOrThrow({
                where: {
                    id: input.conversationId,
                    userId: ctx.auth.user.id
                },
                include: {
                   chats : {
                        orderBy : {
                            createdAt : "asc"
                        }
                   }
                }
            })

            const history : UIMessage[] = conversation.chats.map((chat) => ({
                id : chat.id,
                role : (chat.role == ChatRole.AI) ? "assistant" : "user",
                parts : [{ type: 'text' as const ,text : chat.message}]
            }));

            return history ;
        }),
    getNames: protectedProcedure
        .input(z.object({
            workflowId: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const conversations = await pClient.conversation.findMany({
                where: {
                    workflowId: input.workflowId ,
                    userId: ctx.auth.user.id
                },
                orderBy : {
                    updatedAt : "desc"
                }
            })

            return conversations ;
        }),
});

