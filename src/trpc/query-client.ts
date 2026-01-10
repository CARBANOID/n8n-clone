import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from '@tanstack/react-query';
/**
 * Create a QueryClient configured for tRPC with sensible defaults for caching and dehydration.
 *
 * @returns A QueryClient with a 30-second query `staleTime` and a `shouldDehydrateQuery` policy that preserves queries which are pending or satisfy TanStack's default dehydration criteria.
 */

export function makeQueryClient() {
  // tanstack query configuration for trpc which creates a singleton tanstack query instance
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        // serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {
        // deserializeData: superjson.deserialize,
      },
    },
  });
}