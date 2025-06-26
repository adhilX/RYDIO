import { useState } from 'react';
import { Button } from '@/components/ui/button';
import StepOne from '@/components/user/Dashboard/addVehicle/StepOne';
import StepTwo from '@/components/user/Dashboard/addVehicle/StepTwo';
import StepThree from '@/components/user/Dashboard/addVehicle/StepThree';
import { postVehicle } from '@/services/user/vehicleService';
import type { StepOneFormData, StepThreeFormData, StepTwoFormData } from '@/Types/User/addVehicle/TaddVehicle';
import type { Vehicle } from '@/Types/User/addVehicle/Ivehicle';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { uploadToCloudinary } from '@/lib/utils/cloudinaryUpload';

interface FormData {
  stepOne?: StepOneFormData;
  stepTwo?: StepTwoFormData;
  stepThree?: StepThreeFormData;
}

export default function AddVehicleForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const user = useSelector((state: RootState) => state.auth.user)

  const nextStep = () => document.querySelector('form')?.requestSubmit();
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleStepOneSubmit = (data: StepOneFormData) => {
    setFormData((prev) => ({ ...prev, stepOne: data }));
    setStep(2);
  };

  const handleStepTwoSubmit = (data: StepTwoFormData) => {
    upload(data)
    setStep(3);
  };

  const upload = async (data: StepTwoFormData) => {
    const promises: Promise<string>[] = [];
    console.log(data.image_urls)
    const files = Array.isArray(data.image_urls) ? data.image_urls : [data.image_urls];
    for (const file of files) {
      if (file instanceof File) {
        promises.push(uploadToCloudinary(file));
      }
    }
    console.log(promises)
    const result = await Promise.all(promises)
    console.log(result)
    setFormData((prev) => ({ ...prev, stepTwo: { ...data, image_urls: result } }));
  }
  const handleStepThreeSubmit = (data: StepThreeFormData) => {
    setFormData((prev) => ({ ...prev, stepThree: data }));
  }

  const handleApi = async () => {
    console.log(formData)
    if (!formData.stepOne || !formData.stepTwo || !formData.stepThree || !user?._id) {
      alert("Missing form data or user info.");
      return;
    }
  

    const vehicle: Vehicle = {
      ...formData.stepOne,
      owner_id: user._id,
      admin_approve: 'pending',
      image_urls: Array.isArray(formData.stepTwo.image_urls)
        ? formData.stepTwo.image_urls
        : [],
    };

    const Location = {...formData.stepThree}
    await postVehicle(vehicle,Location);
    alert("✅ Vehicle uploaded successfully.");
    setStep(1);
    setFormData({});

  };


  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Progress bar */}
      <div className="flex justify-between items-center mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 mx-1 py-2 rounded-full text-center text-sm font-semibold ${step === s ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400'
              }`}
          >
            Step {s}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
        {step === 1 && (
          <StepOne
            onSubmit={handleStepOneSubmit}
            defaultValues={formData.stepOne}
          />
        )}
        {step === 2 && (
          <StepTwo
            onSubmit={handleStepTwoSubmit}
            defaultValues={formData.stepTwo}
          />
        )}
        {step === 3 && (
          <StepThree
            onSubmit={handleStepThreeSubmit}
            defaultValues={formData.stepThree}
          />
        )}

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          <Button
            variant="secondary"
            onClick={prevStep}
            disabled={step === 1}
          >
            Back
          </Button>
          {step < 3 ? (
            <Button onClick={nextStep}>Next</Button>
          ) : (
            <Button onClick={handleApi}>
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

