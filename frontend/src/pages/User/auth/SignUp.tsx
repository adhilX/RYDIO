import { useState } from "react";
import { Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import toast from "react-hot-toast";
import { userSignup, verifyOtp } from "@/services/user/authService";
import { signupSchema, type SignupSchema } from "@/Types/User/validation/SignupForm";
import OtpModal from "@/components/modal/EnterOtpModal";
import Google from "./Google";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SignupSchema>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleOtpSubmit = async (otp: string, data: SignupSchema) => {
    try {
      await verifyOtp(otp, data);
      toast.success("OTP verified successfully!");
      navigate("/login");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Signup failed: ${errorMessage}`);
      console.error("Signup Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-red-900/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-800/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <Card className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl relative z-10">
        <CardHeader className="space-y-2 pb-2">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white tracking-wider">
              RY<span className="text-[#e63946]">DIO</span>
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-[#e63946] to-red-500 mx-auto mt-2 rounded-full"></div>
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-semibold text-white">Create Account</h2>
            <p className="text-gray-400">Join RYDIO and start your journey</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Formik
            initialValues={{
              name: "",
              email: "",
              phone: "",
              password: "",
              confirmPassword: "",
            } as SignupSchema}
            validationSchema={signupSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                setUser({ ...values });
                console.log("Submitting:", values);
                await userSignup(values);
                toast.success("OTP sent successfully! Please check your email.");
                setIsOpen(true);
              } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
                toast.error(`Signup failed: ${errorMessage}`);
                console.error("Signup Error:", error);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, values, isSubmitting }) => {
              // Debug form values
              console.log("Form values:", values);

              return (
                <Form className="space-y-4" noValidate>
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300 font-medium">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Field
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        as="input"
                        className={`w-full pl-11 bg-gray-800/50 border-gray-600 text-white h-10 rounded-md 
                          ${touched.name && errors.name
                            ? "border border-[#e63946] focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/50"
                            : "border border-gray-600 focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/20"
                          }`}
                        disabled={isSubmitting}
                      />
                    </div>
                    {touched.name && errors.name && (
                      <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300 font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        as="input"
                        className={`w-full pl-11 bg-gray-800/50 border-gray-600 text-white h-10 rounded-md 
                          ${touched.email && errors.email
                            ? "border border-[#e63946] focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/50"
                            : "border border-gray-600 focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/20"
                          }`}
                        disabled={isSubmitting}
                      />
                    </div>
                    {touched.email && errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-300 font-medium">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Field
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        as="input"
                        className={`w-full pl-11 bg-gray-800/50 border-gray-600 text-white h-10 rounded-md 
                          ${touched.phone && errors.phone
                            ? "border border-[#e63946] focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/50"
                            : "border border-gray-600 focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/20"
                          }`}
                        disabled={isSubmitting}
                      />
                    </div>
                    {touched.phone && errors.phone && (
                      <p className="text-red-500 text-sm">{errors.phone}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300 font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        as="input"
                        className={`w-full pl-11 pr-12 bg-gray-800/50 border-gray-600 text-white h-10 rounded-md 
                          ${touched.password && errors.password
                            ? "border border-[#e63946] focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/50"
                            : "border border-gray-600 focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/20"
                          }`}
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isSubmitting}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {touched.password && errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-300 font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Field
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        as="input"
                        className={`w-full pl-11 pr-12 bg-gray-800/50 border-gray-600 text-white h-10 rounded-md 
                          ${touched.confirmPassword && errors.confirmPassword
                            ? "border border-[#e63946] focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/50"
                            : "border border-gray-600 focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/20"
                          }`}
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isSubmitting}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#e63946] hover:bg-red-600 text-white font-semibold h-12"
                  >
                    {isSubmitting ? "Please Wait..." : "Create Account"}
                  </Button>
                </Form>
              );
            }}
          </Formik>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          <Google />

          <div className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-red-400 hover:text-red-300 font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>

      <OtpModal
        data={user}
        isOpen={isOpen}
        handleOtpSubmit={handleOtpSubmit}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}