// import { useAuth } from "@/features/auth/hooks/use-auth";
import { useServer } from "@/hooks/use-server";

export const useResourceMutations = () => {
  const { serverClient } = useServer();
  // const { authClient } = useAuth();

  return {
    create: async (params: {
      title: string;
      description: string;
      tags: string[] | { id: string; name: string }[];
      teamId: string;
    }) => {
      // const session = await authClient.getSession();
      const { data, error } = await serverClient.api.resources.index.put({
        title: params.title,
        description: params.description,
        tags: params.tags,
        teamId: params.teamId,
      });
      if (error) throw error;
      return data;
    },
  };
};
