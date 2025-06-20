import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { changePasswordSchema, type ChangePasswordSchema } from "@/Types/User/validation/changePasswordSchema";

type ChangePasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: string ,emailData:string) => void;
  emailData: string
};

export default function ChangePasswordModal({
  isOpen,
  onClose,
  onSubmit,
  emailData,
}: ChangePasswordModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
  });

  const closeAndReset = () => {
    reset();
    onClose();
  };

  const submitHandler = (data: ChangePasswordSchema) => {
    
       onSubmit(data.newPassword,emailData);
      closeAndReset();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white dark:bg-zinc-900 text-black dark:text-white p-6 rounded-2xl shadow-lg w-full max-w-md relative"
          >
            <button
              onClick={closeAndReset}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              disabled={isSubmitting}
              title="Close"
              aria-label="Close"
            >
              <X />
            </button>

            <h2 className="text-lg font-semibold mb-4 text-center">Change Password</h2>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  {...register("newPassword")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-zinc-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {errors.newPassword && (
                  <p className="text-sm text-red-500 mt-1">{errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-zinc-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Change Password"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
