import { Form, FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient, useTRPC } from "@/main";
import { Skeleton } from "@/components/ui/skeleton";

const resourceCreateSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(4095),
  tags: z.array(z.string()).min(1),
  teamId: z.string(),
});

export interface ResourceCreateProps {
  id?: string;
}

const defaultTagOptions = [
  {
    value: "next.js",
    label: "Next.js",
  },
];

export function ResourceCreate({ id }: ResourceCreateProps) {
  if (!id) {
    console.log("id", id);
  }

  const form = useForm<z.infer<typeof resourceCreateSchema>>({
    resolver: zodResolver(resourceCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      teamId: "",
    },
  });

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

  function handleSubmit(data: z.infer<typeof resourceCreateSchema>) {
    resourceCreateMutation.mutate(data);
  }

  return (
    <>
      <h1>Create Resource</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div
            id="form-container"
            className="flex flex-col gap-2 animate-fade-in py-4"
          >
            <FormField
              name="title"
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value ?? ""}
                  className="w-full"
                  placeholder="Title"
                  required
                />
              )}
            />
            {form.formState.errors.title && (
              <FormMessage>{form.formState.errors.title.message}</FormMessage>
            )}

            <FormField
              name="description"
              render={({ field }) => (
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  className="w-full"
                  placeholder="Description"
                  required
                />
              )}
            />
            {form.formState.errors.description && (
              <FormMessage>
                {form.formState.errors.description.message}
              </FormMessage>
            )}

            <FormField
              name="tags"
              render={({ field }) => (
                <>
                  <Label>Multiselect with placeholder and clear</Label>
                  <Select
                    value={field.value?.[0] ?? ""} // Ensure we take the first item if available
                    onValueChange={(val) => field.onChange([val])} // Store as an array
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select tags" />
                    </SelectTrigger>
                    <SelectContent>
                      {defaultTagOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            />
            {form.formState.errors.tags && (
              <FormMessage>{form.formState.errors.tags.message}</FormMessage>
            )}

            <FormField
              name="teamId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamsQuery.isLoading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        <SelectItem key={index} value="Loading...">
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
            />
            {form.formState.errors.teamId && (
              <FormMessage>{form.formState.errors.teamId.message}</FormMessage>
            )}
            <Button type="submit" className="w-full my-10">
              Create Resource
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
