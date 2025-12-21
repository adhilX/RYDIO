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
import { Spinner } from "@/components/ui/spinner";
import Particles from "@/components/common/Particles";
import Google from "@/pages/User/auth/Google";
import BlurText from "@/components/common/BlurText";

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
      toast.error(errorMessage);
      console.error("Signup Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 relative overflow-hidden selection:bg-white/20">
      <div className="absolute inset-0 bg-neutral-950/80 z-0" /> {/* Slight overlay */}
      <Particles className="absolute inset-0 z-0 animate-fade-in" quantity={100} ease={80} refresh />

      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black pointer-events-none z-0" />




      <Card className="w-full max-w-lg bg-black/40 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)] relative z-10 animate-in fade-in zoom-in-95 duration-700 rounded-[2.5rem] overflow-hidden group hover:shadow-[0_0_60px_rgba(255,255,255,0.08)] transition-all">
        {/* Decorative glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />

        <CardHeader className="space-y-4 pb-4">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <img src="/logo.png" alt="RYDIO Logo" className="h-10 w-auto object-contain" />
            </div>
          </div>
          <div className="text-center space-y-1 flex flex-col items-center">
            <BlurText
              text="Create Account"
              className="text-2xl font-bold text-white tracking-tight justify-center"
              delayStep={0.05}
            />
            <p className="text-gray-400 font-medium">Join RYDIO and start your journey</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 px-6 pb-6">
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
                await userSignup(values);
                toast.success("OTP sent successfully! Please check your email.");
                setIsOpen(true);
              } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
                toast.error(`Signup failed: ${errorMessage}`);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, isSubmitting }) => {
              return (
                <Form className="space-y-4" noValidate>
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300 font-medium pl-1">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Field
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        as="input"
                        className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border text-white placeholder:text-gray-500 rounded-xl transition-all duration-200 
                            ${touched.name && errors.name
                            ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                            : "border-white/10 focus:border-white/30 focus:bg-white/10 focus:ring-1 focus:ring-white/20"
                          }`}
                        disabled={isSubmitting}
                      />
                    </div>
                    {touched.name && errors.name && (
                      <p className="text-red-400 text-xs pl-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300 font-medium pl-1">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        as="input"
                        className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border text-white placeholder:text-gray-500 rounded-xl transition-all duration-200 
                            ${touched.email && errors.email
                            ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                            : "border-white/10 focus:border-white/30 focus:bg-white/10 focus:ring-1 focus:ring-white/20"
                          }`}
                        disabled={isSubmitting}
                      />
                    </div>
                    {touched.email && errors.email && (
                      <p className="text-red-400 text-xs pl-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-300 font-medium pl-1">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Field
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        as="input"
                        className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border text-white placeholder:text-gray-500 rounded-xl transition-all duration-200 
                            ${touched.phone && errors.phone
                            ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                            : "border-white/10 focus:border-white/30 focus:bg-white/10 focus:ring-1 focus:ring-white/20"
                          }`}
                        disabled={isSubmitting}
                      />
                    </div>
                    {touched.phone && errors.phone && (
                      <p className="text-red-400 text-xs pl-1">{errors.phone}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Password */}
                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="text-gray-400 text-xs font-semibold uppercase tracking-wider pl-1">
                        Password
                      </Label>
                      <div className="relative group/input">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-white transition-colors duration-300 h-4 w-4" />
                        <Field
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          as="input"
                          className={`w-full pl-11 pr-10 py-2.5 bg-white/5 border text-white placeholder:text-gray-600 rounded-2xl transition-all duration-300 outline-none
                            ${touched.password && errors.password
                              ? "border-red-500/50 focus:border-red-500/80 focus:bg-red-500/5"
                              : "border-white/5 hover:border-white/10 focus:border-white/20 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                            }`}
                          disabled={isSubmitting}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isSubmitting}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {touched.password && errors.password && (
                        <p className="text-red-400 text-[10px] pl-1 font-medium">{errors.password}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword" className="text-gray-400 text-xs font-semibold uppercase tracking-wider pl-1">
                        Confirm
                      </Label>
                      <div className="relative group/input">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-white transition-colors duration-300 h-4 w-4" />
                        <Field
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Repeat"
                          as="input"
                          className={`w-full pl-11 pr-10 py-2.5 bg-white/5 border text-white placeholder:text-gray-600 rounded-2xl transition-all duration-300 outline-none
                            ${touched.confirmPassword && errors.confirmPassword
                              ? "border-red-500/50 focus:border-red-500/80 focus:bg-red-500/5"
                              : "border-white/5 hover:border-white/10 focus:border-white/20 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                            }`}
                          disabled={isSubmitting}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isSubmitting}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {touched.confirmPassword && errors.confirmPassword && (
                        <p className="text-red-400 text-[10px] pl-1 font-medium">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-black hover:bg-gray-200 font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all duration-300 transform hover:-translate-y-0.5 mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner size="sm" className="mr-2 border-black border-t-transparent" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </Form>
              );
            }}
          </Formik>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-gray-500 backdrop-blur-sm">Or continue with</span>
            </div>
          </div>

          <Google />

          <div className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-white hover:underline font-semibold transition-all duration-200">
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
    </div >
  );
}