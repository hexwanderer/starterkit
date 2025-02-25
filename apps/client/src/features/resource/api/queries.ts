import { serverClient } from "@/main";
import { queryOptions } from "@tanstack/react-query";

export const useResourceQueries = () => ({
  getAll: (teamId?: string) => {
    return queryOptions({
      queryKey: ["resources", teamId],
      queryFn: async () => {
        const { data, error } = await serverClient.api.resources.index.get({
          filter: teamId ? { teamId } : undefined,
        });
        if (error) throw error;
        return data;
      },
    });
  },
  getById: (id: string) => {
    return queryOptions({
      queryKey: ["resources", id],
      queryFn: async () => {
        const { data, error } = await serverClient.api.resources({ id }).get();
        if (error) throw error;
        return data;
      },
    });
  },
});
