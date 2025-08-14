import { X, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  title?: string;
  description?: string;
  submitButtonText?: string;
  cancelButtonText?: string;
  placeholder?: string;
}

const ReasonModal = ({
  isOpen,
  onClose,
  onSubmit,
  title ,
  description,
  submitButtonText,
  cancelButtonText,
  placeholder,
}: ReasonModalProps) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    console.log(isOpen,'isOpen')
    if (isOpen) {
      setReason('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }
    onSubmit(reason);
  };

  if (!isOpen) return null;

  return createPortal(
      <div className="fixed inset-0 z-[9999] overflow-y-auto pointer-events-auto">
        <div className="flex min-h-screen items-center justify-center p-4 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9998] pointer-events-auto"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
          />

          {/* Modal panel */}
          <div
            className="inline-block w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-900 border border-gray-700 text-left align-middle shadow-2xl transition-all sm:my-8 sm:max-w-lg relative z-[9999] pointer-events-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 pb-0">
              <div>
                <h3 className="text-lg font-semibold leading-6 text-white">
                  {title}
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  {description}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 pt-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-2">
                    Reason
                  </label>
                  <div className="relative ">
                    <textarea
                      id="reason"
                      rows={4}
                      className={`block w-full rounded-lg border bg-gray-800/50 border-gray-700 p-3 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500 sm:text-sm ${
                        error ? 'border-red-500' : ''
                      }`}
                      placeholder={placeholder}
                      value={reason}
                      onChange={(e) => {
                        console.log('Input change:', e.target.value);
                        setReason(e.target.value);
                        if (error) setError('');
                      }}
                      onFocus={() => console.log('Input focused')}
                      onKeyDown={(e) => console.log('Key pressed:', e.key)}
                    />
                    {error && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {error && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      {error}
                    </p>
                  )}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition-colors"
                  >
                    {submitButtonText}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex w-full justify-center rounded-lg bg-gray-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 transition-colors"
                  >
                    {cancelButtonText}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>,
    document.body
  );
};

export default ReasonModal;