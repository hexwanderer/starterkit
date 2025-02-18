import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthSplitGrid } from "@/features/auth/components/auth-split-grid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUserManagementMutations } from "../api/mutations";

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
              <SignIn />
            </TabsContent>
            <TabsContent value="signup">
              <SignUp />
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

const signInFormSchema = z.object({
  email: z.string().email().min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignInFormSchema = z.infer<typeof signInFormSchema>;

function SignIn() {
  const form = useForm<SignInFormSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInFormSchema),
  });

  const navigate = useNavigate();

  const signInMutation = useMutation({
    mutationKey: ["auth", "signIn"],
    mutationFn: useUserManagementMutations().signIn,
    onSuccess: () => {
      navigate({ to: "/auth/orgs" });
    },
  });

  function handleSubmit(data: SignInFormSchema) {
    signInMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Password</FormLabel>
                <Button
                  variant="link"
                  className="px-0 h-auto font-normal"
                  onClick={() => {
                    /* Handle forgot password */
                  }}
                >
                  Forgot Password?
                </Button>
              </div>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={signInMutation.isPending}
        >
          Sign In
        </Button>
      </form>
    </Form>
  );
}

const signUpFormSchema = z.object({
  email: z.string().email().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  name: z.string().min(1, "Name is required"),
});

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;

function SignUp() {
  const form = useForm<SignUpFormSchema>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    resolver: zodResolver(signUpFormSchema),
  });

  const navigate = useNavigate();

  const signUpMutation = useMutation({
    mutationKey: ["auth", "signUp"],
    mutationFn: useUserManagementMutations().signUp,
    onSuccess: () => {
      navigate({ to: "/auth/orgs" });
    },
  });

  function handleSubmit(data: SignUpFormSchema) {
    signUpMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Create a password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={signUpMutation.isPending}
        >
          Create Account
        </Button>
      </form>
    </Form>
  );
}
