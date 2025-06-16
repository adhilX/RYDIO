
import  { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, User, Mail, Phone, Lock, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom" 
import { signupSchema, type SignupSchema } from "@/Types/User/validation/SignupForm"
import toast from "react-hot-toast"
import { userSignup, verifyOtp } from "@/services/user/authService"
import OtpModal from "@/components/modal/EnterOtpModal"


export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const [openOtpModal, setOpenOtpModal] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  })

  const password = watch("password")
  const confirmPassword = watch("confirmPassword")
  const passwordsMatch = password === confirmPassword && password !== ""
  const passwordsDontMatch = password && confirmPassword && !passwordsMatch
  const [user, setUser] = useState<SignupSchema>({confirmPassword:'',email:'',name:'',password:'',phone:''})
  const onSubmit = async(data: SignupSchema) => {
    try {
      setWaiting(true)
      setUser({...data})
      const response = await userSignup(data)
        toast.success('OTP sent successfully! Please check your email.');
        setOpenOtpModal(true);
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred"
      toast.error(`Signup failed: ${errorMessage}`)
      console.error("Signup Error:", error)
    } finally {
      setWaiting(false)
    }
  }

  const handleOtpSubmit = async (otp: string,data:SignupSchema) => {
    try {
      const response = await verifyOtp(otp,data)
      toast.success('OTP verified successfully!');
      
      navigate('/login');
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred"
      toast.error(`Signup failed: ${errorMessage}`)
      console.error("Signup Error:", error)
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background and animation elements */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-red-900/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-800/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <Card className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl relative z-10">
        <CardHeader className="space-y-2 pb-2">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white tracking-wider">
              RY<span className="text-red-700">DIO</span>
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-red-700 to-red-500 mx-auto mt-2 rounded-full"></div>
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-2xl font-semibold text-white">Create Account</h2>
            <p className="text-gray-400">Join RYDIO and start your journey</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-1">
          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300 font-medium">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  {...register("name")}
                  className="pl-11 bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              {errors.name && <p className="text-red-400 text-sm">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className="pl-11 bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300 font-medium">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  {...register("phone")}
                  className="pl-11 bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              {errors.phone && <p className="text-red-400 text-sm">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  {...register("password")}
                  className="pl-11 pr-12 bg-gray-800/50 border-gray-600 text-white"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300 font-medium">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  className={`pl-11 pr-12 bg-gray-800/50 text-white border-gray-600 ${passwordsDontMatch ? "border-red-500" : passwordsMatch ? "border-green-500" : ""}`}
                />
                <div className="absolute right-12 top-1/2 -translate-y-1/2">
                  {passwordsMatch && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {passwordsDontMatch && <XCircle className="h-4 w-4 text-red-500" />}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword.message}</p>}
            </div>

            {waiting ? <Button type="submit" className="w-full bg-red-200 text-white font-semibold h-12">
            please wait...
            </Button> : <Button type="submit" className="w-full bg-red-700 hover:bg-red-600 text-white font-semibold h-12">
              Create Account
            </Button>}
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-2 text-gray-400">Or continue with</span>
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

          <div className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{" "}
            <Link to={"/login"} className="text-red-400 hover:text-red-300 font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
      <OtpModal
        isOpen={openOtpModal}
        onClose={() => setOpenOtpModal(false)}
        onSubmit={handleOtpSubmit}
        data={user}
      />
    </div>
  )
}
