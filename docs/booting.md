npx create-next-app@15.5.4

# shadcn
npx shadcn@3.3.1 init
npx shadcn@3.3.1 add --all

# prisma
npm install prisma tsx --save-dev
npm install @prisma/client
npm install @prisma/adapter-pg   (for prisma version above 7.0.0)
npx prisma init
npx prisma migrate dev 

npx prisma studio  (shows the database in a web interface)
npx prisma migrate reset  (resets the database / to remove all the data)

# install trpc modules 
https://trpc.io/docs/client/tanstack-react-query/server-components

-> npm install @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query@latest zod client-only server-only

# better oauth 
https://www.better-auth.com/docs/installation

-> npm install better-auth
* Follow the steps between these commnads from above link 
-> npx @better-auth/cli generate
-> npx prisma migrate dev   (since we are using prisma)

# For Themes and Styling (tweakcn)
https://tweakcn.com/editor/theme

# For Logos
https://logoipsum.com/


# Background Jobs (using Ingest)
-> Background Jobs are required since a task may require multiple services and if one service fails we may need to retry or resume by pushing them in background queue again .

https://www.inngest.com/docs/getting-started/nextjs-quick-start?ref=docs-home
-> npm install inngest
-> npx --ignore-scripts=false inngest-cli@latest --version
-> npx inngest-cli@latest dev

# Install mprocs 
(for running multiple processes )
-> npm install -D mprocs
-> npm i -D inngest-cli

mprocs.yaml
-----------

```yaml
procs:
  inngest:
    cmd: ["cmd", "/c", "npm", "run", "inngest:dev"]
  
  next:
    cmd: ["cmd", "/c", "npm", "run", "dev"]
```


package.json
------------
```json
    "inngest:dev": "inngest-cli dev",
    "dev:all" : "mprocs"
```

# Choosing AI Providers (AI-SDK)
https://ai-sdk.dev/providers/ai-sdk-providers

-> npm i ai

1) Choose your AI Model 
   Gemini    -> npm install @ai-sdk/google
   OpenAI    -> npm install @ai-sdk/openai
   Anthropic -> npm install @ai-sdk/anthropic

2) Set AI SDK 
   gemini   -> https://ai.google.dev/
   OpenAI   -> https://platform.openai.com/settings/organization/api-keys
   Anthropic -> 

3) use AI SDK with Inngest
   gemini -> https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai
   OpenAI -> https://ai-sdk.dev/providers/ai-sdk-providers/openai


# Error Tracking (Sentry)
does 
-> session replays (how UI looked when error occured)
-> logs 
-> AI monitoring

https://cwa.run/sentry
https://none-l1o.sentry.io/issues/?referrer=onboarding-skip

-> npx @sentry/wizard@latest -i nextjs
   select Sentry Saas (sentry.io) option
   Copy the SENTRY_AUTH_TOKEN which will come in terminal while setting up sentry

* Adding AI Agent (https://none-l1o.sentry.io/insights/ai-agents/?integration=vercel_ai)


# Setting the default route to /workflows

next.config.ts 
--------------
```tsx
const nextConfig: NextConfig = {
  async redirects(){
    return [{
      source : "/" ,
      destination : "/workflows",
      permanent : false 
    }] ; 
  }
};
```

**NOTE** : permantent = true  -> will set the default opening route to /workflows for every nextJs project in the system 


# Payment (Polar)  
http://sandbox.polar.sh/dashboard/n8n-clone-devlopment-sonu/onboarding/integrate?productId=4fb9810c-92e4-4cae-99bf-c1b04302a462

**Do the devlopment in sandbox mode always**

-> npm install @polar-sh/better-auth @polar-sh/sdk

* create 2 organizations : 
1) for production 
2) another through sandbox dashboard for testing payments

* select the betterAuth Intergration and follow the steps

-> npx prisma migrate reset  (because we introducted createCustomerOnSignUp field in betterAuth config file i.e src/lib/auth.ts )

*createCustomerOnSignUp* -> this field creates a customer in polar dashboard whenever a user signs up in our app

**POLAR is much easier to setup compared to stripe**


# To get random slugs
-> npm install random-word-slugs

# Adding react Error Boundary
-> npm i react-error-boundary


# Add NUQS for param handling 
* store the params in the url and retrieving them using NUQS package
-> npm install nuqs
https://nuqs.dev/docs/adapters#nextjs-app-router

# Adding superjson for handling complex data types b/w trpc ,database and frontend 
-> npm install superjson

* Note : our js date type present in frontend are not present in the postgres database and vice versa. So we use superjson to convert these complex data types to normal data types which can be stored in the database and can be used in the frontend without any issues


* add superjson transformer in init.ts , query-client.ts and client.tsx

-> npm i date-fns


# Biome 
-> To use biome install biome extension in vscode 

# react-flow
-> npm install @xyflow/react
https://reactflow.dev/learn
  
* Adding shadcn components for reactflow nodes (https://reactflow.dev/ui/components)
-> npx shadcn@3.3.1 add https://ui.reactflow.dev/placeholder-node