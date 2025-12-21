import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import toast from "react-hot-toast";
import { loginUser } from "@/services/user/authService";
import { useDispatch } from "react-redux";
import { addToken } from "@/store/slice/user/UserTokenSlice";
import { addUser } from "@/store/slice/user/UserSlice";
import Google from "../pages/User/auth/Google";
import { Spinner } from "@/components/ui/spinner";
import { loginFormSchema, type TLoginForm } from "@/Types/User/validation/LoginFrom";
import BlurText from "@/components/common/BlurText";
import Particles from "@/components/common/Particles";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 relative overflow-hidden selection:bg-white/20">
      <div className="absolute inset-0 bg-neutral-950/80 z-0" /> {/* Slight overlay */}
      <Particles className="absolute inset-0 z-0 animate-fade-in" quantity={100} ease={80} refresh />

      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black pointer-events-none z-0" />

      <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)] relative z-10 animate-in fade-in zoom-in-95 duration-500 rounded-3xl overflow-hidden group">
        {/* Decorative glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />

        <CardHeader className="space-y-6 pb-8">
          <div className="text-center">
            <div className="flex justify-center">
              <img src="/logo.png" alt="RYDIO Logo" className="h-12 w-auto object-contain" />
            </div>
          </div>
          <div className="text-center space-y-2 flex flex-col items-center">
            <BlurText
              text="Welcome Back"
              className="text-2xl font-bold text-white tracking-tight justify-center" // Center the text
              delayStep={0.05}
            />
            <p className="text-gray-400 font-medium">Sign in to continue your journey</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Formik
            initialValues={{ email: "", password: "" } as TLoginForm}
            validationSchema={loginFormSchema}
            onSubmit={async (values, { resetForm }) => {
              setIsLoading(true);
              try {
                const response = await loginUser(values);
                dispatch(addToken(response.accessToken));
                dispatch(addUser(response.user));
                toast.success("Login successful!");
                navigate("/", { replace: true });
              } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
                toast.error(`Login failed: ${errorMessage}`);
                resetForm({ values: { email: values.email, password: "" } });
              } finally {
                setIsLoading(false);
              }
            }}
          >
            {({ errors, touched }) => {
              return (
                <Form className="space-y-5" noValidate>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300 font-medium pl-1">
                      Email Address
                    </Label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      as="input"
                      className={`w-full px-4 py-3 bg-white/5 border text-white placeholder:text-gray-500 rounded-xl transition-all duration-300 
                        ${touched.email && errors.email
                          ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                          : "border-white/10 focus:border-white/30 focus:bg-white/10 focus:ring-1 focus:ring-white/20"
                        }`}
                      disabled={isLoading}
                    />
                    {touched.email && errors.email && (
                      <p className="text-red-400 text-xs pl-1">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300 font-medium pl-1">
                      Password
                    </Label>
                    <div className="relative">
                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        as="input"
                        className={`w-full px-4 py-3 bg-white/5 border text-white placeholder:text-gray-500 rounded-xl transition-all duration-300
                          ${touched.password && errors.password
                            ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                            : "border-white/10 focus:border-white/30 focus:bg-white/10 focus:ring-1 focus:ring-white/20"
                          }`}
                        disabled={isLoading}
                      />
                      {touched.password && errors.password && (
                        <p className="text-red-400 text-xs pl-1 absolute -bottom-5 left-0">{errors.password}</p>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">Toggle password visibility</span>
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Link
                      to="/forgetpassword"
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-gray-200 font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all duration-300 transform hover:-translate-y-0.5"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner size="sm" className="mr-2 border-black border-t-transparent" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </Form>
              );
            }}
          </Formik>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-gray-500 backdrop-blur-sm">Or continue with</span>
            </div>
          </div>

          <Google />

          <div className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-white hover:underline font-semibold transition-all duration-200"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}