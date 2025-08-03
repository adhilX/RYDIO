import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageCropper } from '@/components/modal/ImageCroper';
import type { StepTwoFormData } from '@/Types/User/addVehicle/TaddVehicle';
import { motion, AnimatePresence } from 'framer-motion';

interface StepTwoProps {
  onSubmit: (data: StepTwoFormData) => void;
  defaultValues?: StepTwoFormData;
}

export default function StepTwo({ onSubmit, defaultValues }: StepTwoProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState('');
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const formik = useFormik<StepTwoFormData>({
    initialValues: defaultValues || { image_urls: [] },
    onSubmit: (values) => {
      onSubmit(values);
    },
    validationSchema: Yup.object().shape({
      image_urls: Yup.array()
        .of(Yup.mixed()
          .test('fileType', 'Only image files are allowed', (file) =>
            file instanceof File &&
            ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)
          )
        )
        .min(1, 'Please upload at least one image')
        .max(5, 'You can upload up to 5 images')
    }),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageURL = URL.createObjectURL(file);
    setCropImageSrc(imageURL);
    setCurrentIndex(Array.isArray(formik.values.image_urls) ? formik.values.image_urls.length : 0);
    setCropModalOpen(true);
  };

  const handleCropComplete = (cropped: File | null) => {
    if (!cropped || currentIndex === null) return;

    const updatedImages = [
      ...(Array.isArray(formik.values.image_urls) ? formik.values.image_urls : []),
      cropped
    ];
    formik.setFieldValue('image_urls', updatedImages);

    const previewUrl = URL.createObjectURL(cropped);
    setPreviews((prev) => [...prev, previewUrl]);

    setCropModalOpen(false);
    setCurrentIndex(null);
  };

  const handleRemoveImage = (index: number) => {
    const images = Array.isArray(formik.values.image_urls) ? formik.values.image_urls : [formik.values.image_urls];
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    formik.setFieldValue('image_urls', updatedImages);
    setPreviews(updatedPreviews);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 font-sans">
      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Upload Vehicle Images</label>
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#6DA5C0] bg-[#f8fafc] dark:bg-white/5 rounded-xl p-6 mb-4 transition-all duration-200 hover:bg-[#eaf6fa] dark:hover:bg-[#1a232a] cursor-pointer group">
        <Input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-gray-700 dark:text-gray-200" />
        <span className="text-xs text-gray-400 mt-2">Drag & drop or click to select images. Only image files are allowed.</span>
        {formik.errors.image_urls && typeof formik.errors.image_urls === 'string' && (
          <p className="text-red-500 text-sm mt-2">{formik.errors.image_urls}</p>
        )}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-xl"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.08 }}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <AnimatePresence>
          {previews.map((src, index) => (
            <motion.div
              key={index}
              className="relative group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
            >
              <img src={src} alt={`Preview ${index}`} className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-white/10 shadow-sm" />
              <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }} className="absolute top-1 right-1">
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 w-7 h-7 flex items-center justify-center shadow-md opacity-80 group-hover:opacity-100 transition-all duration-200"
                  onClick={() => handleRemoveImage(index)}
                >
                  ×
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* Hidden Submit */}
      <button type="submit" className="hidden" aria-label="Submit Step Two" />
      {/* Image Cropper Modal */}
      {cropModalOpen && cropImageSrc && (
        <ImageCropper
          imageSrc={cropImageSrc}
          open={cropModalOpen}
          onOpenChange={setCropModalOpen}
          onCropComplete={handleCropComplete}
        />
      )}
    </form>
  );
}
