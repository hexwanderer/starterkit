import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthSplitGrid } from "@/features/auth/components/auth-split-grid";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useOrganizationManagementMutations } from "../api/mutations";
import { authClient, useAppForm, useTRPC } from "@/main";
import { OrganizationSchema } from "@repo/types";

interface Organization {
  id: string;
  name: string;
  slug: string;
}

export function OrganizationSelect() {
  const organizationsQuery = authClient.useListOrganizations();

  const navigate = useNavigate();
  const trpc = useTRPC();

  const createOrgMutation = useMutation(
    trpc.organization.create.mutationOptions({
      onSuccess: () => {
        toast.success("Organization created successfully");
        navigate({ to: "/dashboard" });
      },
    }),
  );

  const selectOrgMutation = useMutation({
    mutationKey: ["auth", "organizationSelect"],
    mutationFn: useOrganizationManagementMutations().organizationSelect,
    onSuccess: () => {
      toast.success("Organization selected successfully");
      navigate({ to: "/dashboard" });
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: "",
      slug: "",
    },
    validators: {
      onBlur: OrganizationSchema.create,
    },
    onSubmit: async ({ value }) => {
      createOrgMutation.mutate(value);
    },
  });

  return (
    <AuthSplitGrid>
      <Dialog>
        <div className="max-w-md mx-auto w-full space-y-6 flex-1">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
              Select Organization
            </h2>
            <p className="text-sm text-muted-foreground">
              Choose an organization to continue
            </p>
          </div>

          {/* Organizations List */}
          <div className="flex-1">
            <div className="h-[400px] overflow-y-auto pr-2 -mr-2 space-y-2">
              {organizationsQuery.isPending &&
                Array.from({ length: 5 }).map((_, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <div key={index} className="w-full p-2 animate-pulse">
                    <Skeleton />
                  </div>
                ))}

              {organizationsQuery.data && organizationsQuery.data.length > 0 ? (
                <>
                  {organizationsQuery.data.map((org: Organization) => (
                    <Button
                      key={org.id}
                      variant="outline"
                      className="w-full justify-start font-normal"
                      onClick={() => {
                        selectOrgMutation.mutate(org.id);
                      }}
                      disabled={selectOrgMutation.isPending}
                    >
                      <span className="text-sm font-medium">{org.name}</span>
                      <p className="text-xs text-muted-foreground">
                        {org.slug}
                      </p>
                      {selectOrgMutation.isPending && (
                        <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                      )}
                    </Button>
                  ))}
                </>
              ) : (
                <div className="rounded-md border border-dashed border-muted-foreground/25 p-8">
                  <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <p className="font-medium text-foreground">
                      No organizations found
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Add your first organization to get started
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Add Organization Button */}
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-12 text-sm font-medium mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                <span>Add Organization</span>
              </Button>
            </DialogTrigger>

            <Button
              variant="destructive"
              className="w-full h-12 text-sm font-medium mt-4"
              onClick={() => authClient.signOut()}
            >
              Sign Out
            </Button>
          </div>
        </div>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Organization</DialogTitle>
          </DialogHeader>

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
                  label="Create Organization"
                  disabled={createOrgMutation.isPending}
                />
              </form.AppForm>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AuthSplitGrid>
  );
}
