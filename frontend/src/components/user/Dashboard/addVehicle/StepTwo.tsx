import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Cropper from 'react-easy-crop';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getCroppedImg } from '@/lib/utils/cropImage';
import type { Area } from 'react-easy-crop';

interface StepTwoProps {
  onSubmit: (data: StepTwoFormData) => void;
  defaultValues?: StepTwoFormData;
}

interface StepTwoFormData {
  images: File[];
}

export default function StepTwo({ onSubmit, defaultValues }: StepTwoProps) {
  const form = useForm<StepTwoFormData>({ defaultValues: defaultValues || { images: [] } });
  const [previews, setPreviews] = useState<string[]>([]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropData, setCropData] = useState<{ image: string; index: number; pixels: Area | null } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + previews.length < 4) {
      alert('Minimum 4 images required');
      return;
    }
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
    form.setValue('images', [...form.getValues('images'), ...files]);
  };

  const handleRemoveImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    form.setValue('images', form.getValues('images').filter((_, i) => i !== index));
  };

  const handleCropImage = (index: number) => {
    setCropData({ image: previews[index], index, pixels: null });
  };

  const handleCropComplete = (_: unknown, pixels: Area) => {
    setCropData((prev) => prev ? { ...prev, pixels } : null);
  };

  const saveCroppedImage = async () => {
    if (!cropData?.image || !cropData?.pixels || cropData.index === null) return;
    const croppedImage = await getCroppedImg(cropData.image, cropData.pixels);
    const newPreviews = [...previews];
    newPreviews[cropData.index] = URL.createObjectURL(croppedImage);
    setPreviews(newPreviews);
    const newImages = [...form.getValues('images')];
    newImages[cropData.index] = croppedImage;
    form.setValue('images', newImages);
    setCropData(null);
  };

  const handleSubmit = (data: StepTwoFormData) => {
    if (data.images.length < 4) {
      alert('Please upload at least 4 images');
      return;
    }
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Upload Images (Minimum 4)</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" multiple onChange={handleFileChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <img src={preview} alt={`Preview ${index}`} className="w-full h-32 object-cover rounded" />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-0 right-0"
                onClick={() => handleRemoveImage(index)}
              >
                X
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-0 right-0"
                onClick={() => handleCropImage(index)}
              >
                Crop
              </Button>
            </div>
          ))}
        </div>
        {cropData ? (
          <div className="relative h-96 border border-gray-300">
            <Cropper
              image={cropData.image}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
            <Button onClick={saveCroppedImage} className="mt-4">
              Save Cropped Image
            </Button>
          </div>
        ) : (
          <p className="text-gray-500">Select an image to crop</p>
        )}
        <button type="submit" className="hidden" aria-label="Submit form" />
      </form>
    </Form>
  );
}