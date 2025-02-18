import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SettingsCard } from "../../settings-card";
import { organizationManagementMutations } from "../api/mutations";

interface Organization {
  id: string;
  name: string;
  slug: string;
}

const orgUpdateSchema = z.object({
  id: z.string().min(1).max(255),
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
});

export type OrganizationUpdate = z.infer<typeof orgUpdateSchema>;

interface OrganizationManageProps {
  organization: Organization;
}

export function OrganizationManage({ organization }: OrganizationManageProps) {
  const form = useForm<OrganizationUpdate>({
    resolver: zodResolver(orgUpdateSchema),
    defaultValues: {
      id: "",
      name: "",
      slug: "",
    },
    values: {
      id: organization.id,
      name: organization.name,
      slug: organization.slug ?? "",
    },
  });

  const updateOrgMutation = useMutation({
    mutationKey: ["auth", "organizationUpdate"],
    mutationFn: organizationManagementMutations().organizationUpdate,
    onSuccess: () => {
      toast.success("Organization updated successfully");
    },
    onError: (err) => {
      toast.error("Error updating organization");
      throw err;
    },
  });

  function handleSubmit(data: OrganizationUpdate) {
    updateOrgMutation.mutate(data);
  }

  return (
    <>
      <SettingsCard title="Organization Settings">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-4">
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Name"
                      required
                    />
                  </FormItem>
                )}
              />
              {form.formState.errors.name && (
                <FormMessage>{form.formState.errors.name.message}</FormMessage>
              )}

              <FormField
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Slug"
                      required
                    />
                  </FormItem>
                )}
              />
              {form.formState.errors.slug && (
                <FormMessage>{form.formState.errors.slug.message}</FormMessage>
              )}

              <Button type="submit" variant="outline" className="w-full">
                <SaveIcon />
                <span>Save</span>
              </Button>
            </div>
          </form>
        </Form>
      </SettingsCard>
    </>
  );
}
