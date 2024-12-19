import { z } from "zod";

const slugSchema = z.string().regex(/^[a-zA-z0-9]{6}$/);

export const createUrlSchema = z.object({
  url: z.string().url(),
  slug: slugSchema.optional(),
});

export const updateUrlSchema = z.object({
  slug: slugSchema,
});

export const urlParamsSchema = z.object({
  slug: z.string(),
});

export type CreateUrlDto = z.infer<typeof createUrlSchema>;
export type UpdateUrlDto = z.infer<typeof updateUrlSchema>;
export type UrlParamsDto = z.infer<typeof urlParamsSchema>;
