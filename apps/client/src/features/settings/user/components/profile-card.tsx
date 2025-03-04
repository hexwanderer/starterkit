import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { SaveIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useProfileMutations } from "../api/mutations";
import { authClient, useAppForm } from "@/main";

const profileSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  // avatar: z.string().url(),
});

export type Profile = z.infer<typeof profileSchema>;

export function ProfileCard() {
  const user = authClient.useSession();

  const userUpdateMutation = useMutation({
    mutationKey: ["auth", "userUpdate"],
    mutationFn: useProfileMutations().update,
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
    onError: (err) => {
      toast.error("Error updating profile");
      throw err;
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: user.data?.user?.name ?? "",
      email: user.data?.user?.email ?? "",
      // avatar: user.data?.session?.avatar ?? "",
    } as Profile,
    validators: {
      onChange: profileSchema,
    },
    onSubmit: async ({ value }) => {
      userUpdateMutation.mutate(value);
    },
  });

  return (
    <Card className="flex-grow w-full h-full">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
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
              name="email"
              children={(field) => <field.InputWithLabel label="Email" />}
            />

            <form.AppForm>
              <form.SubmitButton
                label="Save"
                disabled={userUpdateMutation.isPending}
              />
            </form.AppForm>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full h-12 text-sm font-medium">
          <SaveIcon />
          <span>Save</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
