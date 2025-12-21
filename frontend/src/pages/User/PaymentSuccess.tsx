import { motion } from "framer-motion"
import { CheckCircle, ArrowLeft, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocation, useNavigate } from "react-router-dom"
import QRGenerator from "@/components/user/QRGenerator"
import { useEffect, useState } from "react"
import GridBackground from "@/components/common/GridBackground"

const ConfettiPiece = ({ delay }: { delay: number }) => {
  const randomColor = ["#ffffff", "#d1d5db", "#9ca3af", "#6b7280", "#4b5563"][Math.floor(Math.random() * 5)]
  const randomX = (Math.random() - 0.5) * 500
  const randomY = (Math.random() - 0.5) * 500
  const randomRotate = Math.random() * 360

  return (
    <motion.div
      initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
      animate={{
        opacity: [1, 1, 0],
        scale: [0, 1, 0.5],
        x: randomX,
        y: randomY,
        rotate: randomRotate
      }}
      transition={{ duration: 1.5, delay, ease: "easeOut" }}
      className="absolute w-3 h-3 rounded-full opacity-0 pointer-events-none"
      style={{ backgroundColor: randomColor, left: '50%', top: '50%' }}
    />
  )
}


const PaymentSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const booking_id = location.state?.booking_id
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setShowConfetti(true)
  }, [])

  if (!booking_id) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Booking Found</h1>
          <Button onClick={() => navigate('/')} className="bg-white text-black">Go Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-white flex items-center justify-center p-4 overflow-hidden relative">

      <GridBackground />

      {/* Confetti Explosion */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
          {[...Array(50)].map((_, i) => (
            <ConfettiPiece key={i} delay={Math.random() * 0.2} />
          ))}
        </div>
      )}

      <div className="max-w-4xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
          className="bg-neutral-900/40 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-[0_0_60px_rgba(255,255,255,0.05),inset_0_0_20px_rgba(255,255,255,0.02)] overflow-hidden relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Side: Success Message & Actions */}
            <div className="p-8 md:p-12 flex flex-col justify-center text-left border-b md:border-b-0 md:border-r border-white/10 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">
              {/* Glossy highlight */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.5)] border border-white/20"
              >
                <CheckCircle className="w-8 h-8 text-white" strokeWidth={3} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight tracking-tight drop-shadow-sm">
                  Payment <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 filter drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">Successful!</span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 mb-8 max-w-sm text-lg font-medium"
              >
                Your booking <span className="text-white font-mono bg-white/10 px-2 py-0.5 rounded text-base border border-white/20 shadow-inner">#{booking_id.slice(-6).toUpperCase()}</span> is secure and confirmed.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4 mt-auto"
              >
                <Button
                  onClick={() => navigate('/userProfile/my-bookings', { replace: true })}
                  className="w-full h-14 bg-white text-black hover:bg-gray-100 font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  View Booking
                </Button>

                <Button
                  onClick={() => navigate('/vehicle-list', { replace: true })}
                  variant="ghost"
                  className="w-full h-12 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </motion.div>
            </div>

            {/* Right Side: QR Code Area */}
            <div className="p-8 md:p-12 bg-black/40 flex flex-col items-center justify-center relative overflow-hidden group shadow-[inset_10px_0_20px_rgba(0,0,0,0.2)]">

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45 }}
                className="relative z-10 text-center"
              >
                <div className="bg-white/5 p-4 rounded-3xl shadow-2xl mx-auto w-fit mb-8 transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1 relative border border-white/10 backdrop-blur-sm">
                  <div className="bg-white p-3 rounded-2xl">
                    <QRGenerator action='start' booking_id={booking_id} />
                  </div>
                </div>

                <h3 className="text-white font-bold text-xl mb-2 tracking-wide">Scan to Start Ride</h3>
                <p className="text-sm text-gray-400 mb-6">Show this QR code to the vehicle owner</p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm font-semibold backdrop-blur-md shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Transaction</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PaymentSuccess