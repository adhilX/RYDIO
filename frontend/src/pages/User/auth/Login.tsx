import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
import Google from "./Google";
import { loginFormSchema, type TLoginForm } from "@/Types/User/validation/LoginFrom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-black to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="absolute bottom-20 top-5 w-120 h-200 bg-red-900/20 blur-3xl animate-pulse delay-2000"></div>

      <Card className="w-full max-w-md bg-dark-400 backdrop-blur-xl border-gray-700/50 shadow-2xl relative z-10">
        <CardHeader className="space-y-6 pb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white tracking-wider">
              RY<span className="text-red-700">DIO</span>
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-red-700 to-red-500 mx-auto mt-2 rounded-full"></div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-white">Welcome Back</h2>
            <p className="text-gray-400">Sign in to your account</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Formik
            initialValues={{ email: "", password: "" } as TLoginForm}
            validationSchema={loginFormSchema}
            onSubmit={async (values, { resetForm }) => {
              setIsLoading(true);
              try {
                console.log("Submitting:", values);
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
                    <Label htmlFor="email" className="text-gray-300 font-medium">
                      Email Address
                    </Label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      as="input"
                      className={`w-full px-3 py-2 bg-gray-800/50 text-white placeholder:text-gray-500 h-12 transition-all duration-200 
                        ${touched.email && errors.email
                          ? "border border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/50"
                          : "border border-gray-600 focus:border-red-700 focus:ring-2 focus:ring-red-700/20"
                        }`}
                      disabled={isLoading}
                    />
                    {touched.email && errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300 font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        as="input"
                        className={`w-full px-3 py-2 bg-gray-800/50 text-white placeholder:text-gray-500 h-12 transition-all duration-200 
                          ${touched.password && errors.password
                            ? "border border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/50"
                            : "border border-gray-600 focus:border-red-700 focus:ring-2 focus:ring-red-700/20"
                          }`}
                        disabled={isLoading}
                      />
                      {touched.password && errors.password && (
                        <p className="text-red-500 text-sm">{errors.password}</p>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700/50"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">Toggle password visibility</span>
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Link
                      to="/forgetpassword"
                      className="text-sm text-red-400 hover:text-red-300 transition-colors duration-200"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-white font-semibold h-12 shadow-lg hover:shadow-red-900/25 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
              <span className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          <Google />

          <div className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-red-400 hover:text-red-300 font-medium transition-colors duration-200"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}