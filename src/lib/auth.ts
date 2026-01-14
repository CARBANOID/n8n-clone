import { checkout , polar , portal } from "@polar-sh/better-auth";
import { betterAuth, check } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import   pClient from "./db";
import { polarClient } from "./polar";

export const auth = betterAuth({
    database: prismaAdapter(pClient, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword : {
        enabled: true , 
        autoSignIn : true , // automatically sign in users after user register/sign up
    },
    plugins : [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "4fb9810c-92e4-4cae-99bf-c1b04302a462",
                            slug: "pro" // Custom slug for easy reference in Checkout URL, e.g. /checkout/n8n-clone-dev
                                        // slug is like a nickname of product
                        }
                    ],
                    successUrl: process.env.POLAR_SUCCESS_URL,
                    authenticatedUsersOnly: true
                }),
                portal() 
            ],
        })
    ]
});