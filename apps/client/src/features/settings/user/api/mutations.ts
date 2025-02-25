import { authClient } from "@/main";

export const useProfileMutations = () => ({
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
});
