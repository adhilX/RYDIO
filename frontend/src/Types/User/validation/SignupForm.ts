import { z } from "zod"

export const signupSchema = z
  .object({
    name: z.string().min(1, "Full name is required"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().min(10, "Phone number is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

export type SignupSchema = z.infer<typeof signupSchema>