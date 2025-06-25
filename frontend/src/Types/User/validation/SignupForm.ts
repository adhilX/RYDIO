import * as Yup from "yup";

export const signupSchema = Yup.object({
  name: Yup.string()
    .required("Full name is required")
    .max(100, "Name must be less than 100 characters")
    .matches(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^\d+$/, "Phone number must contain only numbers")
    .min(10, "Phone number must be at least 10 digits"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be less than 50 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords do not match"),
});

export type SignupSchema = Yup.InferType<typeof signupSchema>;