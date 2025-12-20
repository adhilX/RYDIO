import React, { useState } from 'react';
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
const StepTwo = ({ onSubmit, defaultValues }: StepTwoProps) => {
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
    <form onSubmit={formik.handleSubmit} className="space-y-8 font-sans">
      <div className="space-y-4">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Upload Vehicle Images</label>
        <div className="relative group flex flex-col items-center justify-center border-2 border-dashed border-white/20 bg-white/5 rounded-2xl p-10 transition-all duration-300 hover:bg-white/10 hover:border-white/40 cursor-pointer overflow-hidden">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center space-y-3 pointer-events-none">
            <div className="p-4 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or WEBP (max. 5 images)</p>
            </div>
          </div>
          {formik.errors.image_urls && typeof formik.errors.image_urls === 'string' && (
            <p className="text-red-400 text-sm mt-4 font-medium animate-pulse">{formik.errors.image_urls}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <AnimatePresence>
          {previews.map((src, index) => (
            <motion.div
              key={index}
              className="relative group aspect-video"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={src}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover rounded-xl border border-white/10 shadow-lg"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  className="p-2 bg-red-500 rounded-full text-white shadow-lg hover:bg-red-600 transition-colors"
                  onClick={() => handleRemoveImage(index)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              </div>
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

export default React.memo(StepTwo);