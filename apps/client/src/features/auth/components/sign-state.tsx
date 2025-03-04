import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthSplitGrid } from "@/features/auth/components/auth-split-grid";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useUserManagementMutations } from "../api/mutations";
import { useAppForm } from "@/main";
import { UserSchema } from "@repo/types";

export function SignState() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  return (
    <AuthSplitGrid>
      <div id="auth-content" className="animate-fade-in">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Welcome back
          </h2>
          <p className="text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>

          <Tabs
            value={tab}
            onValueChange={(value) => setTab(value as "signin" | "signup")}
            className="animate-in zoom-in-95"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <SignIn className="animate-fade-left" />
            </TabsContent>
            <TabsContent value="signup">
              <SignUp className="animate-fade-right" />
            </TabsContent>
          </Tabs>

          <p className="text-xs text-muted-foreground text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </AuthSplitGrid>
  );
}

function SignIn({ className }: { className?: string }) {
  const navigate = useNavigate();

  const signInMutation = useMutation({
    mutationKey: ["auth", "signIn"],
    mutationFn: useUserManagementMutations().signIn,
    onSuccess: () => {
      navigate({ to: "/auth/orgs" });
    },
  });

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onBlur: UserSchema.signIn,
    },
    onSubmit: async ({ value }) => {
      signInMutation.mutate(value);
    },
  });

  return (
    <div className={className}>
      <form
        id="sign-in-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-4">
          <form.AppField name="email">
            {(field) => <field.InputWithLabel label="Email" />}
          </form.AppField>

          <form.AppField name="password">
            {(field) => <field.PasswordWithLabel label="Password" />}
          </form.AppField>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => console.log("forgot password")}
          >
            Forgot password?
          </Button>

          <form.AppForm>
            <form.SubmitButton
              label="Sign In"
              disabled={signInMutation.isPending}
            />
          </form.AppForm>
        </div>
      </form>
    </div>
  );
}

function SignUp({ className }: { className?: string }) {
  const signUpMutation = useMutation({
    mutationKey: ["auth", "signUp"],
    mutationFn: useUserManagementMutations().signUp,
  });

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    validators: {
      onBlur: UserSchema.create,
    },
    onSubmit: async ({ value }) => {
      signUpMutation.mutate(value);
    },
  });

  return (
    <div className={className}>
      <form
        id="sign-up-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-4">
          <form.AppField name="email">
            {(field) => <field.InputWithLabel label="Email" />}
          </form.AppField>

          <form.AppField name="password">
            {(field) => <field.PasswordWithLabel label="Password" />}
          </form.AppField>

          <form.AppField name="name">
            {(field) => <field.InputWithLabel label="Name" />}
          </form.AppField>

          <form.AppForm>
            <form.SubmitButton
              label="Sign Up"
              formId="sign-up-form"
              disabled={signUpMutation.isPending}
            />
          </form.AppForm>
        </div>
      </form>
    </div>
  );
}
