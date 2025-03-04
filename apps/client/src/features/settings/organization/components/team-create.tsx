import { Title } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { authClient, useAppForm, useTRPC } from "@/main";
import { type TeamCreate, TeamSchema } from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function TeamCreatePage() {
  const trpc = useTRPC();

  const createTeamMutation = useMutation(
    trpc.team.create.mutationOptions({
      onSuccess: () => {
        toast.success("Team created successfully");
      },
      onError: (err) => {
        toast.error("Error creating team");
        throw err;
      },
    }),
  );

  const organization = authClient.useActiveOrganization();
  const session = authClient.useSession();

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      visibility: "public",
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      organizationId: organization.data?.id!,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      createdBy: session.data?.session?.userId!,
    } as TeamCreate,
    validators: {
      onBlur: TeamSchema.create,
    },
    onSubmit: async ({ value }) => {
      createTeamMutation.mutate(value);
    },
  });

  return (
    <div className="max-w-md mx-auto">
      <Title>Create Team</Title>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-4">
          <form.AppField
            name="name"
            children={(field) => <field.InputWithLabel label="Name" />}
          />

          <form.AppField
            name="description"
            children={(field) => <field.InputWithLabel label="Description" />}
          />

          <form.AppField
            name="slug"
            children={(field) => <field.InputWithLabel label="Slug" />}
          />

          <form.Field name="visibility">
            {(field) => (
              <div className="border-input has-data-[state=checked]:border-ring relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
                <div className="grid grow gap-2">
                  <Label htmlFor="visibility">Private Team</Label>
                  <p>
                    {field.state.value === "public"
                      ? "Public teams can be viewed and joined to everyone in the organization."
                      : "Private teams are only visible to those who are invited to the team."}
                  </p>
                  <Switch
                    checked={field.state.value !== "public"}
                    onCheckedChange={(e) => {
                      if (!e.valueOf()) {
                        field.setValue("public");
                      } else {
                        field.setValue("private");
                      }
                    }}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <em className="text-destructive text-sm">
                      {field.state.meta.errors
                        .map((err) => err?.message)
                        .join(", ")}
                    </em>
                  )}
                </div>
              </div>
            )}
          </form.Field>

          <Button type="submit" className="w-full">
            Create Team
          </Button>
        </div>
      </form>
    </div>
  );
}
