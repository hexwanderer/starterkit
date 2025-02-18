import { useServer } from "@/hooks/use-server";
import { queryOptions } from "@tanstack/react-query";

export const useResourceQueries = () => {
  const { serverClient } = useServer();

  return {
    getAll: queryOptions({
      queryKey: ["resources"],
      queryFn: async () => {
        const { data, error } = await serverClient.api.resources.all.get();
        if (error) throw error;
        return data;
      },
    }),
    getById: (id: string) => {
      return queryOptions({
        queryKey: ["resources", id],
        queryFn: async () => {
          const { data, error } = await serverClient.api
            .resources({ id })
            .get();
          if (error) throw error;
          return data;
        },
      });
    },
  };
};
