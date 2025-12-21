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


export default function OtpModal<T extends string | SignupSchema>({ isOpen, onClose, handleOtpSubmit, data }: OtpModalProps<T>) {
  const [otp, setOtp] = useState(Array(6).fill(""))
  const inputsRef = useRef<HTMLInputElement[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (!isOpen) {
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
  }, [isOpen, timeLeft])

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0")
    const s = String(seconds % 60).padStart(2, "0")
    return `${m}:${s}`
  }

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return
    const newOtp = [...otp]

    // Take only the last character entered
    const val = value.slice(-1);

    newOtp[index] = val
    setOtp(newOtp)

    // Auto-advance
    if (val && index < 5) inputsRef.current[index + 1]?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)

    if (!/^[0-9]+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char
    })
    setOtp(newOtp)

    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, 5)
    inputsRef.current[nextIndex]?.focus()
  }

  const handleBackspace = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputsRef.current[index - 1]?.focus()
      }
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

  const handleResendOtp = async (user: T) => {
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
          className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md flex justify-center items-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-md bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.1)] rounded-[2rem] p-8 relative overflow-hidden group"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors duration-200"
              title="Close"
              aria-label="Close"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">

              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Verify Email</h2>
              <p className="text-sm text-gray-400">
                Please enter the 6-digit code sent to your email address.
              </p>
            </div>

            <div className="flex justify-center gap-3 mb-8">
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
                  onKeyDown={(e) => handleBackspace(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:bg-white/10 focus:border-white/30 focus:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-200"
                  placeholder="-"
                  disabled={isLoading}
                />
              ))}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-white text-black hover:bg-gray-200 font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isLoading || otp.join("").length !== 6}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Verify Code"
              )}
            </button>

            <div className="text-center mt-6">
              {canResend ? (
                <button
                  onClick={() => handleResendOtp(data)}
                  className="text-sm text-white hover:text-gray-300 font-medium hover:underline transition-colors"
                >
                  Resend verification code
                </button>
              ) : (
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Resend code in <span className="text-white">{formatTime(timeLeft)}</span>
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
