import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient, useAppForm, useTRPC } from "@/main";
import { Skeleton } from "@/components/ui/skeleton";
import { Title } from "@/components/header";
import { type ResourceCreate, ResourceSchema } from "@repo/types";
import { Combobox, ComboboxOption } from "@/components/combobox";

export interface ResourceCreateProps {
  id?: string;
}

const defaultTagOptions = [
  {
    id: "123",
    name: "next.js",
  },
];

export function ResourceCreatePage({ id }: ResourceCreateProps) {
  if (!id) {
    console.log("id", id);
  }

  const navigate = useNavigate();
  const trpc = useTRPC();

  const resourceCreateMutation = useMutation(
    trpc.resource.create.mutationOptions({
      onSuccess: () => {
        toast.success("Resource created successfully");
        navigate({ to: "/dashboard" });
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      teamId: "",
    } as ResourceCreate,
    validators: {
      onChange: ResourceSchema.create,
    },
    onSubmit: async ({ value }) => {
      resourceCreateMutation.mutate(value);
    },
  });

  const organization = authClient.useActiveOrganization();
  const teamsQuery = useQuery(
    trpc.team.getAll.queryOptions(
      {
        filter: {
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          organizationId: organization.data?.id!,
        },
      },
      {
        enabled: !!organization.data?.id,
      },
    ),
  );

  return (
    <>
      <Title>Create Resource</Title>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-4">
          <form.AppField name="title">
            {(field) => <field.InputWithLabel label="Title" />}
          </form.AppField>

          <form.AppField name="description">
            {(field) => <field.LongInputWithLabel label="Description" />}
          </form.AppField>

          <form.Field name="tags" mode="array">
            {(field) => (
              <>
                <Label htmlFor="tags">
                  Multiselect with placeholder and clear
                </Label>
                <Combobox
                  id="tags"
                  mode="multiple"
                  value={field.state.value.map((v) => v.name)}
                  onValueChange={(val) => {
                    const selectedVals = defaultTagOptions.filter((option) =>
                      val?.includes(option.name),
                    );
                    field.setValue(selectedVals);
                  }}
                >
                  {defaultTagOptions.map((option) => (
                    <ComboboxOption key={option.id} value={option.name}>
                      {option.name}
                    </ComboboxOption>
                  ))}
                </Combobox>
              </>
            )}
          </form.Field>

          <form.Field name="teamId">
            {(field) => (
              <Select value={field.state.value} onValueChange={field.setValue}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teamsQuery.isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      <SelectItem key={index} value={index.toString()}>
                        <Skeleton />
                      </SelectItem>
                    ))
                  ) : teamsQuery.data?.length ? (
                    teamsQuery.data.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="No teams found">
                      No teams found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          </form.Field>

          <form.AppForm>
            <form.SubmitButton
              label="Create Resource"
              disabled={resourceCreateMutation.isPending}
            />
          </form.AppForm>
        </div>
      </form>
    </>
  );
}
