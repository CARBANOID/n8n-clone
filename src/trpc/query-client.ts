import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from '@tanstack/react-query';
// import superjson from 'superjson';

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