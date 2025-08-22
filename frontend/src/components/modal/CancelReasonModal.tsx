import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CancelReasonModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  reason: string
  onReasonChange: (reason: string) => void
}

const CancelReasonModal: React.FC<CancelReasonModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  reason,
  onReasonChange
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md bg-gray-900 text-white p-6 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Cancel Booking
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <p className="text-sm text-gray-400">
            Please provide a reason for cancelling your booking:
          </p>
          <textarea
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Enter your reason for cancellation..."
            className="w-full h-24 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <div className="flex gap-3 pt-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!reason.trim()}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default React.memo(CancelReasonModal)
