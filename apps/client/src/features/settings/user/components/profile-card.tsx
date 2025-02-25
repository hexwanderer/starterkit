import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useProfileMutations } from "../api/mutations";
import { authClient } from "@/main";

const profileSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  // avatar: z.string().url(),
});

export type Profile = z.infer<typeof profileSchema>;

export function ProfileCard() {
  const user = authClient.useSession();

  const form = useForm<Profile>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "Name",
      email: "email@example.com",
      // avatar: "https://example.com/avatar.png",
    },
    values: {
      name: user.data?.user.name ?? "Name",
      email: user.data?.user.email ?? "email@example.com",
      // avatar: user.data?.user.avatar ?? "https://example.com/avatar.png",
    },
  });

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

  function handleSubmit(data: Profile) {
    const changedData = {
      name: data.name === "Name" ? undefined : data.name,
      email: data.email === "email@example.com" ? undefined : data.email,
    };
    userUpdateMutation.mutate(changedData);
  }

  return (
    <Card className="flex-grow w-full h-full">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-4">
              <FormField
                name="name"
                render={({ field }) => (
                  <>
                    <FormLabel>Name</FormLabel>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Name"
                      required
                    />
                  </>
                )}
              />
              {form.formState.errors.name && (
                <FormMessage>{form.formState.errors.name.message}</FormMessage>
              )}

              <FormField
                name="email"
                render={({ field }) => (
                  <>
                    <FormLabel>Email</FormLabel>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Email"
                      required
                    />
                  </>
                )}
              />
              {form.formState.errors.email && (
                <FormMessage>{form.formState.errors.email.message}</FormMessage>
              )}

              {/* <FormField
              name="avatar"
              render={({ field }) => (
                <Input
                  {...field}
                  className="w-full"
                  placeholder="Avatar"
                  required
                />
              )}
            />
            {form.formState.errors.avatar && (
              <FormMessage>
                {form.formState.errors.avatar.message}
              </FormMessage>
            )} */}
            </div>
          </form>
        </Form>
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
