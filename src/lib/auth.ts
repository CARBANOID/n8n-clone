import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import   pClient from "./db";

export const auth = betterAuth({
    database: prismaAdapter(pClient, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword : {
        enabled: true , 
        autoSignIn : true , // automatically sign in users after user register/sign up
    }
});