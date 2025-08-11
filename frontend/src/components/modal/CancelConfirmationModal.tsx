import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CancelConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  totalAmount: number
  reason: string
  isLoading: boolean
}

const CancelConfirmationModal: React.FC<CancelConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  totalAmount,
  reason,
  isLoading
}) => {
  const refundAmount = Math.round(totalAmount * 0.7)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md bg-gray-900 text-white p-6 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Confirm Cancellation
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
            <p className="text-yellow-200 text-sm font-medium mb-2">
              ⚠️ Refund Policy
            </p>
            <p className="text-yellow-100 text-sm">
              You will only receive <strong>70% refund</strong> of the total amount (₹{refundAmount.toLocaleString('en-IN')}) if you cancel this booking.
            </p>
          </div>
          <div className="p-3 bg-gray-800 rounded-lg">
            <p className="text-gray-400 text-xs mb-1">Cancellation Reason:</p>
            <p className="text-white text-sm">{reason}</p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Go Back
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
            >
              {isLoading ? 'Cancelling...' : 'Confirm Cancel'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default React.memo(CancelConfirmationModal)
