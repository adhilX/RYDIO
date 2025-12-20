import { AlertCircle, Flag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from "@/components/ui/spinner";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  isSubmitting?: boolean;
  bookingId?: string;
}

const ReportModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  bookingId,
}: ReportModalProps) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('ReportModal isOpen changed:', isOpen);
    if (isOpen) {
      setReason('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      setError('Please describe the issue you experienced');
      return;
    }

    if (reason.trim().length < 10) {
      setError('Please provide at least 10 characters describing the issue');
      return;
    }

    onSubmit(reason.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg bg-gray-900 text-white p-0 rounded-lg">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600/20 rounded-full flex items-center justify-center">
              <Flag className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <div className="text-lg font-semibold text-white">Report Issue</div>
              <div className="text-sm text-gray-400 font-normal">Help us improve by reporting any issues</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 space-y-4">
          {/* Booking ID Display */}
          {bookingId && (
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Booking ID</p>
              <p className="text-sm font-mono text-white">{bookingId}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="report-reason" className="block text-sm font-medium text-gray-300 mb-2">
                What issue did you experience? <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <textarea
                  id="report-reason"
                  rows={5}
                  className={`block w-full rounded-lg border bg-gray-800/50 border-gray-700 p-3 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500 sm:text-sm resize-none ${error ? 'border-red-500' : ''
                    }`}
                  placeholder="Please describe the issue in detail (e.g., vehicle condition, cleanliness, mechanical problems, safety concerns, etc.)"
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (error) setError('');
                  }}
                  disabled={isSubmitting}
                  maxLength={500}
                  autoFocus
                />
                {error && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>

              {/* Character count and error */}
              <div className="flex justify-between items-center mt-2">
                <div>
                  {error && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      {error}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {reason.length}/500 characters
                </p>
              </div>
            </div>

            {/* Info box */}
            <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-300">
                  <p className="font-medium mb-1">Your report helps us:</p>
                  <ul className="space-y-1 text-blue-200">
                    <li>• Improve vehicle quality and maintenance</li>
                    <li>• Take action against problematic listings</li>
                    <li>• Enhance overall user experience</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2 pb-6">
              <Button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !reason.trim()}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" variant="light" className="-ml-1 mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Flag className="w-4 h-4 mr-2" />
                    Submit Report
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
