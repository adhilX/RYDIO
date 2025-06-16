import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, type Tloginform } from "@/Types/User/validation/LoginFrom";
import toast from "react-hot-toast";
import type { TloginForm } from "@/Types/User/auth/Tloginform";
import { loginUser } from "@/services/user/authService";
import { useDispatch } from "react-redux";
import { addToken } from "@/store/slice/user/UserTokenSlice";
import { addUser } from "@/store/slice/user/UserSlice";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
   const navigate = useNavigate();
   const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Tloginform>({
    resolver: zodResolver(loginFormSchema),
  });

const onSubmit = async(data: TloginForm) => {
  try {
    const response = await loginUser(data);
    console.log(response)
    dispatch(addToken(response.accessToken))
    dispatch(addUser(response.user))
    toast.success("Login successful!");
    navigate('/', { replace: true });
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred";
    toast.error(`Login failed: ${errorMessage}`);
    
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-black to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background overlay with subtle pattern */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Animated background elements */}

      {/* <div className="absolute  left-5 w-120 h-200 bg-red-900/40 blur-3xl animate-pulse"></div> */}
      <div className="absolute bottom-20 top-5 w-120 h-200 bg-red-900/20 blur-3xl animate-pulse delay-2000"></div>

      <Card className="w-full max-w-md bg-dark-400 backdrop-blur-xl border-gray-700/50 shadow-2xl relative z-10">
        <CardHeader className="space-y-6 pb-8">
          {/* RYDIO Logo */}
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
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                  className={`bg-gray-800/50 text-white placeholder:text-gray-500 h-12 transition-all duration-200 
    ${
      errors.email
        ? "border border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/50"
        : "border border-gray-600 focus:border-red-700 focus:ring-2 focus:ring-red-700/20"
    }`}                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`bg-gray-800/50 text-white placeholder:text-gray-500 h-12 transition-all duration-200 
    ${
      errors.email
        ? "border border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/50"
        : "border border-gray-600 focus:border-red-700 focus:ring-2 focus:ring-red-700/20"
    }`}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700/50"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle password visibility</span>
                </Button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to={"/forgot-password"}
                className="text-sm text-red-400 hover:text-red-300 transition-colors duration-200"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-white font-semibold h-12 shadow-lg hover:shadow-red-900/25 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Sign In
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-2 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full bg-gray-800/30 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 transition-all duration-200 h-12"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="text-center text-sm text-gray-400">
            {"Don't have an account? "}
            <Link
              to={"/signup"}
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
