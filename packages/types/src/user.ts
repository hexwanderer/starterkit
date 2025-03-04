import { z } from "zod";

export const UserSchema = {
  create: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1),
  }),
  signIn: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
};

export type UserCreate = z.infer<typeof UserSchema.create>;
export type UserSignIn = z.infer<typeof UserSchema.signIn>;
