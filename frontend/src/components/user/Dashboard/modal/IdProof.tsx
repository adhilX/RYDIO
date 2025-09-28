import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uploadToCloudinary } from "@/lib/utils/cloudinaryUpload";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { ImageCropper } from "@/components/modal/ImageCroper";
import { uploadIdProof } from "@/services/user/UpdateProfileService";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface UploadIdProofModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const UploadIdProofModal = ({
  open,
  onClose,
  onSuccess,
}: UploadIdProofModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const user = useSelector((state: RootState) => state.auth.user)
  useEffect(() => {
    if (file) {
      setShowCropper(true);
    }
  }, [file]);

  const handleUpload = async () => {
    if (!user) return 
    const uploadTarget = croppedFile
    if (!uploadTarget) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(uploadTarget);
      const updatedUser = await uploadIdProof(url, user._id!)
      setCroppedFile(null)
      toast.success(updatedUser.message)
      onClose()
      // Call onSuccess callback to trigger parent component re-render
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <AnimatePresence>
        {open && (
          <DialogContent className="max-w-md w-full p-0 bg-white dark:bg-black rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="p-6 md:p-8 font-sans"
            >
              <DialogHeader className="mb-4">
                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white text-center">Submit ID Proof</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Upload Document Image</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const selected = e.target.files?.[0];
                      if (selected) setFile(selected);
                    }}
                    className="w-full text-gray-700 dark:text-gray-200"
                  />
                </div>
                {showCropper && file && (
                  <ImageCropper
                    imageSrc={URL.createObjectURL(file)}
                    onCropComplete={setCroppedFile}
                    onOpenChange={setShowCropper}
                    open={showCropper}
                  />
                )}
                {croppedFile && !showCropper && (
                  <motion.img
                    src={URL.createObjectURL(croppedFile)}
                    alt="Preview"
                    className="w-full object-cover rounded-lg border border-gray-200 dark:border-white/10 shadow-sm"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Please upload a clear image of your government-issued ID. Accepted formats: JPG, PNG, PDF. Max size: 5MB.
                </div>
              </div>
              <DialogFooter className="pt-6 flex flex-row gap-3 justify-end">
                <Button variant="secondary" onClick={onClose} className="rounded-lg px-6 py-2 font-semibold">
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={(!file && !croppedFile) || uploading || showCropper}
                  className="rounded-lg px-6 py-2 font-semibold bg-[#6DA5C0] text-white hover:bg-[#5b8ca3] transition-all duration-200 shadow-sm"
                >
                  {uploading ? "Uploading..." : "Submit"}
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
