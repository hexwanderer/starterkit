import { useServer } from "@/hooks/use-server";
import type { treaty } from "@elysiajs/eden";
import type { App } from "@repo/server";
import { infiniteQueryOptions } from "@tanstack/react-query";

export type EdenClient = ReturnType<typeof treaty<App>>;

export const users = () => {
  const { serverClient } = useServer();

  return {
    getAll: () =>
      infiniteQueryOptions({
        queryKey: ["users"],
        queryFn: async () => {
          const response = await serverClient.api.index.get();
          if (response.error) throw response.error;
          return response.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.length,
      }),
  };
};
