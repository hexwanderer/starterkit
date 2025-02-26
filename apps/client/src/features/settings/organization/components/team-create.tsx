import { Title } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { authClient, useTRPC } from "@/main";
import { zodResolver } from "@hookform/resolvers/zod";
import { type TeamCreate, TeamSchema } from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
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

  const form = useForm<TeamCreate>({
    resolver: zodResolver(TeamSchema.create),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      visibility: "public",
      organizationId: organization.data?.id ?? "",
      createdBy: session.data?.user.id ?? "",
    },
  });

  function handleSubmit(data: TeamCreate) {
    createTeamMutation.mutate(data);
  }

  return (
    <div className="max-w-md mx-auto">
      <Title>Create Team</Title>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col gap-4">
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" placeholder="Name" />
                  </FormControl>
                  {form.formState.errors.name && (
                    <FormMessage>
                      {form.formState.errors.name.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Description"
                    />
                  </FormControl>
                  {form.formState.errors.description && (
                    <FormMessage>
                      {form.formState.errors.description.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Slug"
                      required
                    />
                  </FormControl>
                  {form.formState.errors.slug && (
                    <FormMessage>
                      {form.formState.errors.slug.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            {form.formState.errors.slug && (
              <FormMessage>{form.formState.errors.slug.message}</FormMessage>
            )}

            <FormField
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <div className="border-input has-data-[state=checked]:border-ring relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
                    <div className="grid grow gap-2">
                      <FormLabel>Private Team</FormLabel>
                      <FormDescription>
                        {field.value === "public"
                          ? "Public teams can be viewed and joined to everyone in the organization."
                          : "Private teams are only visible to those who are invited to the team."}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        {...field}
                        checked={field.value !== "public"}
                        onCheckedChange={(e) => {
                          if (!e.valueOf()) {
                            field.onChange("public");
                          } else {
                            field.onChange("private");
                          }
                        }}
                      />
                    </FormControl>
                    {form.formState.errors.visibility && (
                      <FormMessage>
                        {form.formState.errors.visibility.message}
                      </FormMessage>
                    )}
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Create Team
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
