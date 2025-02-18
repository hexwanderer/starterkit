import { useAuth } from "@/features/auth/hooks/use-auth";
import type { OrganizationUpdate } from "../components/organization-management";

export const organizationManagementMutations = () => {
  const { authClient } = useAuth();

  return {
    organizationUpdate: async (params: OrganizationUpdate) => {
      if (!params.id) throw new Error("No organization id provided");
      const { data, error } = await authClient.organization.update({
        data: {
          name: params.name,
          slug: params.slug,
        },
        organizationId: params.id,
      });

      if (error) throw error;

      return data;
    },
    organizationDelete: async (id: string) => {
      const { data, error } = await authClient.organization.delete({
        organizationId: id,
      });

      if (error) throw error;

      return data;
    },
    userUpdate: async (params: { name?: string; email?: string }) => {
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
