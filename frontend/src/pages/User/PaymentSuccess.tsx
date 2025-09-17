import { motion } from "framer-motion"
import { CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocation, useNavigate } from "react-router-dom"
import QRGenerator from "@/components/user/QRGenerator"

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const {booking_id} = useLocation().state as { booking_id: string } 
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#232b3a] via-[#1a1f2a] to-[#232b3a] text-white flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-400" />
          </motion.div>
          {/* Success Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold bg-gradient-to-r from-green-400 to-[#6DA5C0] bg-clip-text text-transparent mb-4"
          >
            Booking Successful!
          </motion.h1>

          <QRGenerator action='start' booking_id={booking_id}/>
          {/* Success Message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 text-lg mb-8"
          >
            Your payment has been processed successfully and your booking is confirmed.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <Button
              onClick={() => navigate('/userProfile/my-bookings',{replace:true})}
              className="w-full bg-gradient-to-r from-[#6DA5C0] to-[#4a90a8] hover:from-[#5a8ba0] hover:to-[#3a7a8c] text-white font-semibold py-3 rounded-xl shadow-lg"
            >
              Go to Dashboard
            </Button>
            
            <Button
              onClick={() => navigate('/vehicle-list',{replace:true})}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 py-3 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse More Vehicles
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default PaymentSuccess