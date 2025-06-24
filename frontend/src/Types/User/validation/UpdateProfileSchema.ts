import { z } from "zod";

export const userProfileSchema = z.object({
  name: z.string()
  .min(1, "Name must be at least 1 characters")
  .max(20, "Name must be less than 20 characters"),
  phone: z.string()
    .transform(val => val === "" ? null : val) 
    .nullable()
    .refine(
      val => val === null || /^[0-9]{10,}$/.test(val),
      { message: "Phone number must be at least 10 digits" }
    )
    .optional()
});
export type UserProfileFormData = z.infer<typeof userProfileSchema>;