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