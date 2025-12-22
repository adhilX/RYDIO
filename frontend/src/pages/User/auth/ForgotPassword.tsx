import OtpModal from "@/components/modal/EnterOtpModal";
import ChangePasswordModal from "@/components/modal/NewPassword";
import { changePassword, forgotpasswordsendOpt, verfysendOpt } from "@/services/user/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom"; // Added for back to login link
import { z } from "zod";
import Particles from "@/components/common/Particles";
import BlurText from "@/components/common/BlurText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {

  const [isOpen, setIsOpen] = useState(false)
  const [changePassModal, setChangePassModal] = useState(false)
  const [emailData, setEmailData] = useState<string>('')
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setEmailData(data.email)
      await forgotpasswordsendOpt(data.email);
      toast.success("OTP sent to your email");
      setIsOpen(true)
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
      console.error(err);
    }
  };
  const handleOtpSubmit = async (otp: string, data: string) => {
    try {
      await verfysendOpt(data, otp)
      toast.success('otp verfied')
      setIsOpen(false)
      setChangePassModal(true)
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
      console.error(err);
    }
  }

  const handleChangePass = async (pass: string, email: string) => {
    try {
      // console.log(pass,email)
      await changePassword(pass, email)
      toast.success('password changed')
      navigate('/login')
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
      console.error(err);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 relative overflow-hidden selection:bg-white/20">
        <div className="absolute inset-0 bg-neutral-950/80 z-0" /> {/* Slight overlay */}
        <Particles className="absolute inset-0 z-0 animate-fade-in" quantity={100} ease={80} refresh />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black pointer-events-none z-0" />

        <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)] relative z-10 animate-in fade-in zoom-in-95 duration-500 rounded-3xl overflow-hidden group">
          {/* Decorative glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />

          <CardHeader className="space-y-6 pb-2">
            <div className="text-center space-y-2 flex flex-col items-center">
              <Link to="/login" className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors duration-200">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="pt-2">
                <BlurText
                  text="Forgot Password?"
                  className="text-2xl font-bold text-white tracking-tight justify-center"
                  delayStep={0.05}
                />
              </div>
              <p className="text-gray-400 font-medium text-sm px-4">
                Enter your email address and we'll send you an OTP to reset your password.
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 font-medium pl-1">
                  Email Address
                </Label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register('email')}
                  className={`w-full px-4 py-3 bg-white/5 border text-white placeholder:text-gray-500 rounded-xl transition-all duration-300 
                    ${errors.email
                      ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                      : "border-white/10 focus:border-white/30 focus:bg-white/10 focus:ring-1 focus:ring-white/20"
                    }`}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs pl-1">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black hover:bg-gray-200 font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="mr-2 border-black border-t-transparent" />
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>

            <div className="text-center pt-2">
              <p className="text-gray-400 text-sm">
                Remember your password?{" "}
                <Link to="/login" className="text-white hover:text-gray-200 font-medium hover:underline transition-all duration-200">
                  Sign In
                </Link>
              </p>
            </div>

          </CardContent>
        </Card>
      </div>
      <OtpModal<string> data={emailData} isOpen={isOpen} onClose={() => setIsOpen(false)} handleOtpSubmit={handleOtpSubmit} />
      <ChangePasswordModal isOpen={changePassModal} onClose={() => setChangePassModal(false)} emailData={emailData} onSubmit={handleChangePass} />
    </>
  );
}
