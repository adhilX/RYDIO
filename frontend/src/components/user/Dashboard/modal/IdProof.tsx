import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { uploadToCloudinary } from "@/lib/utils/cloudinaryUpload";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { ImageCropper } from "@/components/modal/ImageCroper";
import { uploadIdProof } from "@/services/user/UpdateProfileService";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Upload, Shield } from "lucide-react";

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
          <DialogContent className="sm:max-w-md bg-black/80 backdrop-blur-xl border border-white/10 text-white rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.1)] p-0 overflow-hidden">

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* Ambient Glow */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm"></div>

              <div className="p-6 md:p-8 space-y-6">
                <DialogHeader>
                  <div className="mx-auto bg-white/5 border border-white/10 p-3 rounded-full mb-4 w-fit">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <DialogTitle className="text-2xl font-bold text-center text-white tracking-tight">Verify Your Identity</DialogTitle>
                  <DialogDescription className="text-gray-400 text-center text-sm">
                    Upload a government-issued ID to unlock all features. Your data is encrypted and secure.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {!croppedFile ? (
                    <div className="relative group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const selected = e.target.files?.[0];
                          if (selected) setFile(selected);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center bg-white/5 transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/10 text-center h-48">
                        <div className="bg-black/40 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-white mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG or PDF (max. 5MB)</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 group">
                      <motion.img
                        src={URL.createObjectURL(croppedFile)}
                        alt="Preview"
                        className="w-full h-56 object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCroppedFile(null);
                            setFile(null);
                          }}
                          className="text-white hover:bg-white/20"
                        >
                          Change Image
                        </Button>
                      </div>
                    </div>
                  )}

                  {showCropper && file && (
                    <ImageCropper
                      imageSrc={URL.createObjectURL(file)}
                      onCropComplete={setCroppedFile}
                      onOpenChange={setShowCropper}
                      open={showCropper}
                    />
                  )}
                </div>

                <DialogFooter className="grid grid-cols-2 gap-3 pt-2">
                  <Button variant="outline" onClick={onClose} className="rounded-xl border-white/10 text-white hover:bg-white/5 hover:text-white h-12">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={(!file && !croppedFile) || uploading || showCropper}
                    className="rounded-xl bg-white text-black hover:bg-gray-200 font-bold h-12 shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50"
                  >
                    {uploading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                        Uploading...
                      </span>
                    ) : "Submit Proof"}
                  </Button>
                </DialogFooter>
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
