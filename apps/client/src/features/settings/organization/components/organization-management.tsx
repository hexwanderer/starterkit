import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { SettingsCard } from "../../settings-card";
import { useAppForm, useTRPC } from "@/main";
import { organizationSchema, type OrganizationUpdate } from "@repo/types";

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface OrganizationManageProps {
  organization: Organization;
}

export function OrganizationManage({ organization }: OrganizationManageProps) {
  const trpc = useTRPC();
  const updateOrgMutation = useMutation(
    trpc.organization.edit.mutationOptions({
      onSuccess: () => {
        toast.success("Organization updated successfully");
      },
      onError: (err) => {
        toast.error("Error updating organization");
        throw err;
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      id: organization.id ?? "",
      name: organization.name ?? "",
      slug: organization.slug ?? "",
    } as OrganizationUpdate,
    validators: {
      onBlur: organizationSchema.update,
    },
    onSubmit: async ({ value }) => {
      updateOrgMutation.mutate(value);
    },
  });

  return (
    <>
      <SettingsCard title="Details">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="flex flex-col gap-4">
            <form.AppField name="name">
              {(field) => <field.InputWithLabel label="Name" />}
            </form.AppField>

            <form.AppField name="slug">
              {(field) => <field.InputWithLabel label="Slug" />}
            </form.AppField>

            <form.AppForm>
              <form.SubmitButton
                label="Save"
                disabled={updateOrgMutation.isPending}
              />
            </form.AppForm>
          </div>
        </form>
      </SettingsCard>
    </>
  );
}
