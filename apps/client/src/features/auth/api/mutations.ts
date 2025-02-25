import type { OrganizationCreate } from "../components/organization-select";
import type {
  SignInFormSchema,
  SignUpFormSchema,
} from "../components/sign-state";
import { authClient, serverClient } from "@/main";

export const useOrganizationManagementMutations = () => ({
  organizationCreate: async (params: OrganizationCreate) => {
    const { data, error } = await serverClient.api.organizations.index.put({
      name: params.name,
      slug: params.slug,
    });

    if (error) throw error;

    return data;
  },
  organizationSelect: async (id: string) => {
    const { data, error } = await authClient.organization.setActive({
      organizationId: id,
    });

    if (error) throw error;

    return data;
  },
});

export const useUserManagementMutations = () => ({
  signIn: async (params: SignInFormSchema) => {
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
  signUp: async (params: SignUpFormSchema) => {
    console.log("params", params);
    const { data, error } = await authClient.signUp.email({
      email: params.email,
      password: params.password,
      name: params.name,
    });
    console.log(error);

    if (error) throw error;

    return data;
  },
  signOut: async () => {
    const { data, error } = await authClient.signOut();

    if (error) throw error;

    return data;
  },
});
