'use client';
// ^-- to make sure we can mount the Provider from a server component
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { useState } from 'react';
import { makeQueryClient } from './query-client';
import type { AppRouter } from './routers/_app';

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
let browserQueryClient: QueryClient;

/**
 * Provides a TanStack QueryClient appropriate for the current environment.
 *
 * On the server, returns a new QueryClient instance for each call. In the browser,
 * returns a shared singleton QueryClient, creating it if it does not yet exist.
 *
 * @returns A QueryClient instance: a fresh instance on the server, or a shared singleton in the browser.
 */
function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

/**
 * Resolve the full URL for the application's tRPC HTTP endpoint based on runtime environment.
 *
 * @returns The endpoint URL string:
 * - In browsers: "/api/trpc"
 * - On server with `VERCEL_URL` set: "https://<VERCEL_URL>/api/trpc"
 * - On server without `VERCEL_URL`: "http://localhost:3000/api/trpc"
 */
function getUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') return '';
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return 'http://localhost:3000';
  })();
  
  return `${base}/api/trpc`;
}


/**
 * Supplies TRPC and TanStack Query contexts to its children by creating and wiring a TRPC client with a QueryClient.
 *
 * The TRPC client is initialized once for the provider's lifetime and is paired with a QueryClient appropriate for the environment (server vs. browser).
 *
 * @param props.children - React nodes to be rendered within the TRPC and QueryClient providers
 * @returns The React element tree that provides TRPC and QueryClient context to its descendants
 */
export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          // transformer: superjson, <-- if you use a data transformer
          url: getUrl(),
        }),
      ],
    }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}