import OtpModal from "@/components/modal/EnterOtpModal";
import ChangePasswordModal from "@/components/modal/NewPassword";
import { changePassword, forgotpasswordsendOpt, verfysendOpt } from "@/services/user/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export default function ForgotPassword() {

  const [isOpen,setIsOpen]= useState(false)
  const [changePassModal,setChangePassModal]= useState(false)
  const [emailData,setEmailData] = useState<string>('')
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
const handleOtpSubmit = async(otp:string,data:string)=>{
    try {
        await verfysendOpt(data,otp)
        toast.success('otp verfied')
        setIsOpen(false)
        setChangePassModal(true)
    }  catch (err) {
    if (err instanceof Error) {
      toast.error(err.message); 
    } else {
      toast.error("Something went wrong");
    }
    console.error(err);
    }
}

const handleChangePass = async(pass:string ,email:string)=>{
   try {
    // console.log(pass,email)
    await changePassword(pass,email)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-red-900/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-800/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl w-full max-w-md text-white p-6 rounded-xl relative z-10">
        <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>
        <p className="text-sm text-gray-400 mb-6 text-center">
          Enter your email to receive OTP.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="string"
            placeholder="Enter your email"
            {...register('email')}
            className="w-full px-4 py-2 rounded-md bg-gray-800/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#e63946]"
          />
     {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#e63946] hover:bg-red-600 text-white py-2 rounded-md transition disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
 <OtpModal<string> data={emailData} isOpen={isOpen} onClose={()=>setIsOpen(false)} handleOtpSubmit={handleOtpSubmit}  />
    <ChangePasswordModal isOpen={changePassModal} onClose={()=>setChangePassModal(false)} emailData={emailData} onSubmit={handleChangePass}  />
    </>
  );
}
