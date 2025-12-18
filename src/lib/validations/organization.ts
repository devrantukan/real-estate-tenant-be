import { z } from "zod";

export const OrganizationFormSchema = z.object({
  name: z.string().min(2, "Organizasyon adı en az 2 karakter olmalıdır"),
  slug: z.string().optional(),
  description: z.string().optional(),
});

export type OrganizationFormType = z.infer<typeof OrganizationFormSchema>;

