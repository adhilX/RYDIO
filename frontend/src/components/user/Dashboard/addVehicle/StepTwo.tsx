import { useState } from 'react';
import { useFormik } from 'formik';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageCropper } from '@/components/modal/ImageCroper';
import type { StepTwoFormData } from '@/Types/User/addVehicle/TaddVehicle';

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
    const images = Array.isArray(formik.values.image_urls)? formik.values.image_urls: [formik.values.image_urls];
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    formik.setFieldValue('image_urls', updatedImages);
    setPreviews(updatedPreviews);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <label className="block font-medium">Upload Image</label>
      <Input type="file" accept="image/*" onChange={handleFileChange} />

      <div className="grid grid-cols-4 gap-4">
        {previews.map((src, index) => (
          <div key={index} className="relative">
            <img src={src} alt={`Preview ${index}`} className="w-full h-32 object-cover rounded" />
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="absolute top-1 right-1"
              onClick={() => handleRemoveImage(index)}
            >
              X
            </Button>
          </div>
        ))}
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
