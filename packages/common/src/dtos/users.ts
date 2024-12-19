import { z } from "zod";

const usernameSchema = z.string().regex(/^[a-z][a-z0-9]{0,49}$/);

export const createUserSchema = z.object({
  username: usernameSchema,
});

export const authenticateUserSchema = z.object({
  username: usernameSchema,
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type AuthenticateUserDto = z.infer<typeof authenticateUserSchema>;
