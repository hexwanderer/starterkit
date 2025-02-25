import { serverClient } from "@/main";

export const useResourceMutations = () => ({
  create: async (params: {
    title: string;
    description: string;
    tags: string[] | { id: string; name: string }[];
    teamId: string;
  }) => {
    const { data, error } = await serverClient.api.resources.index.put({
      title: params.title,
      description: params.description,
      tags: params.tags,
      teamId: params.teamId,
    });
    if (error) throw error;
    return data;
  },
});
