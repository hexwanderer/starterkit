import { useAuth } from "@/features/auth/hooks/use-auth";

export const profileMutations = () => {
  const { authClient } = useAuth();

  return {
    update: async (params: { name?: string; email?: string }) => {
      if (params.name) {
        const { error } = await authClient.updateUser({
          name: params.name,
        });

        if (error) throw error;
      }

      if (params.email) {
        const { error: error2 } = await authClient.changeEmail({
          newEmail: params.email,
        });

        if (error2) throw error2;
      }
    },
  };
};
