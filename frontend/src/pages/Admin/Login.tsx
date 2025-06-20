import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, Eye, EyeOff, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { loginadmin } from "@/services/admin/authService";
import { useDispatch } from "react-redux";
import { addToken } from "@/store/slice/admin/AdminTokenSlice";
import { useNavigate } from "react-router";

const LoginSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string()
  .min(7, "Password must be at least 8 characters")
      .max(50, "Password must be less than 50 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character")
    });

type LoginForm = z.infer<typeof LoginSchema>;

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await loginadmin(data);
      dispatch(addToken(response.accessToken));
      toast.success("Login success");
      navigate("/admin", { replace: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Login failed: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div className="text-center mb-8" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Car className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">RYDIO</h1>
        </motion.div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <motion.div className="flex justify-center mb-2" initial={{ x: -20 }} animate={{ x: 0 }} transition={{ delay: 0.3 }}>
              <Shield className="w-5 h-5 text-blue-400 mr-2" />
              <CardTitle className="text-xl text-white">Admin Login</CardTitle>
            </motion.div>
            <CardDescription className="text-center text-slate-400">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">Email Address</Label>
                <Input
                  id="email"
                  placeholder="admin@rydio.com"
                  {...register("email")}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-slate-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col py-6 space-y-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? "Signing In..." : "Sign In to Dashboard"}
              </Button>
              {/* <Button variant="link" type="button" className="text-slate-400 hover:text-slate-200 text-sm">
                Forgot your password?
              </Button> */}
            </CardFooter>
          </form>
        </Card>

        <motion.div
          className="text-center mt-8 text-slate-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>© 2024 RYDIO. All rights reserved.</p>
          <p className="mt-1">Secure admin access • Protected by encryption</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
