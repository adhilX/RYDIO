import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string()
      .min(1, "Full name is required")
      .max(100, "Name must be less than 100 characters")
      .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),
    
    email: z.string()
      .min(1, "Email is required")
      .email("Enter a valid email")
      .max(100, "Email must be less than 100 characters")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
    
    phone: z.string()
      .min(1, "Phone number is required")
      .regex(/^\d+$/, "Phone number must contain only numbers")
      .refine((val) => val.length >= 10, {
        message: "Phone number must be at least 10 digits",
      }),
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be less than 50 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    
    confirmPassword: z.string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignupSchema = z.infer<typeof signupSchema>;