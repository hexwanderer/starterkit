import { useAuth } from "@/features/auth/hooks/use-auth";
import type { OrganizationCreate } from "../components/organization-select";
import type {
  SignInFormSchema,
  SignUpFormSchema,
} from "../components/sign-state";

export const organizationManagementMutations = () => {
  const { authClient } = useAuth();

  return {
    organizationCreate: async (params: OrganizationCreate) => {
      const { data, error } = await authClient.organization.create({
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
  };
};

export const userManagementMutations = () => {
  const { authClient } = useAuth();

  return {
    signIn: async (params: SignInFormSchema) => {
      const { data, error } = await authClient.signIn.email({
        email: params.email,
        password: params.password,
      });

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
  };
};
