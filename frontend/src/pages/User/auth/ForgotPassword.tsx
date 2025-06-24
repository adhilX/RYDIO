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
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="bg-zinc-900 p-6 rounded-xl shadow-lg w-full max-w-md text-white">
        <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>
        <p className="text-sm text-zinc-400 mb-6 text-center">
          Enter your email to receive OTP.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="string"
            placeholder="Enter your email"
            {...register('email')}
            className="w-full px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
     {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition disabled:opacity-50"
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
