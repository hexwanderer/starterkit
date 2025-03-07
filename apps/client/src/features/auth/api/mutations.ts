import type { UserCreate, UserSignIn } from "@repo/types";
import { authClient } from "@/main";

export const useOrganizationManagementMutations = () => ({
  organizationSelect: async (id: string) => {
    const { data, error } = await authClient.organization.setActive({
      organizationId: id,
    });

    if (error) throw error;

    return data;
  },
});

export const useUserManagementMutations = () => ({
  signIn: async (params: UserSignIn) => {
    const { data, error } = await authClient.signIn.email(
      {
        email: params.email,
        password: params.password,
      },
      {
        onSuccess(ctx) {
          const authToken = ctx.response.headers.get("set-auth-token");
          if (!authToken) throw new Error("No auth token");
          localStorage.setItem("authToken", authToken);
        },
      },
    );

    if (error) throw error;

    return data;
  },
  signUp: async (params: UserCreate) => {
    const { data, error } = await authClient.signUp.email({
      email: params.email,
      password: params.password,
      name: params.name,
    });

    if (error) throw error;

    return data;
  },
  signOut: async () => {
    const { data, error } = await authClient.signOut();

    if (error) throw error;

    return data;
  },
});
