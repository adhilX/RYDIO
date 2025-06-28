import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uploadToCloudinary } from "@/lib/utils/cloudinaryUpload";
import { AnimatePresence, motion } from "framer-motion";

interface UploadIdProofModalProps {
  open: boolean;
  onClose: () => void;
  onUploadComplete: (url: string) => void;
}

const docTypes = [
  "Aadhar Card",
  "Passport",
  "Driving License",
  "Voter ID",
  "Other",
];

export const UploadIdProofModal = ({
  open,
  onClose,
  onUploadComplete,
}: UploadIdProofModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState(docTypes[0]);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onUploadComplete(url);
      onClose();
    } catch (err) {
      alert("❌ Failed to upload. Try again.");
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
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Document Type</label>
                  <select
                    value={docType}
                    onChange={e => setDocType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black focus:ring-[#6DA5C0] focus:border-[#6DA5C0] transition-all duration-200"
                  >
                    {docTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
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
                {preview && (
                  <motion.img
                    src={preview}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg border border-gray-200 dark:border-white/10 shadow-sm"
                    initial={{ opacity: 0, scale: 0.95 }}
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
                  disabled={!file || uploading}
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
