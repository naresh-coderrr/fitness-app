import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toUserMessage } from './errors';

function logError(error: unknown) {
  console.error(toUserMessage(error));
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: logError,
  }),
  mutationCache: new MutationCache({
    onError: logError,
  }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
