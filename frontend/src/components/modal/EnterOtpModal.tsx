import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import toast from "react-hot-toast"
import type { SignupSchema } from "@/Types/User/auth/Tsignupform"
import { resendOpt } from "@/services/user/authService"

type OtpModalProps<T extends string | SignupSchema> = {
  isOpen: boolean;
  onClose: () => void;
  handleOtpSubmit: (otp: string, data: T) => void;
  data: T;
};


export default function OtpModal<T extends string | SignupSchema>({ isOpen, onClose, handleOtpSubmit, data }: OtpModalProps<T>){
  const [otp, setOtp] = useState(Array(6).fill(""))
  const inputsRef = useRef<HTMLInputElement[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (!isOpen){
      setOtp(Array(6).fill(""));
    setTimeLeft(300);
    setCanResend(false);
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen,timeLeft])

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0")
    const s = String(seconds % 60).padStart(2, "0")
    return `${m}:${s}`
  }

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) inputsRef.current[index + 1]?.focus()
  }

  const handleBackspace = (index: number) => {
    if (otp[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async () => {
    const completeOtp = otp.join("")
    if (completeOtp.length !== 6) {
      toast.error("Please enter a complete 6-digit OTP")
      return
    }

    setIsLoading(true)
    try {
      handleOtpSubmit(completeOtp, data)
    } catch (error) {
      toast.error("Invalid OTP. Please try again.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async(user:T) => {
    await resendOpt(user)
    setOtp(Array(6).fill(""))
    setTimeLeft(300) 
    setCanResend(false)
    toast.success("OTP resent successfully!")

  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-zinc-900 text-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-white hover:text-red-400"
              title="Close"
              aria-label="Close"
              disabled={isLoading}
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold mb-2 text-center">Enter OTP</h2>
            <p className="text-sm text-gray-400 text-center mb-4">Sent to your email</p>

            <div className="flex justify-center gap-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  value={digit}
                  maxLength={1}
                  ref={(el: HTMLInputElement | null) => {
                    inputsRef.current[index] = el!
                  }}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace") handleBackspace(index)
                  }}
                  className="w-10 h-12 text-center text-lg rounded-md bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="0"
                  disabled={isLoading}
                />
              ))}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || otp.join("").length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </button>

            <div className="text-center mt-4">
              {canResend ? (
                <button
                  onClick={()=>handleResendOtp(data)}
                  className="text-sm text-red-400 hover:underline mt-2"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-sm text-gray-400">
                  You can resend OTP in <span className="text-white font-medium">{formatTime(timeLeft)}</span>
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
