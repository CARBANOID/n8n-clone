npx create-next-app@15.5.4
npx shadcn@3.3.1 init
npx shadcn@3.3.1 add --all

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
