import { useState } from 'react';
import { Button } from '@/components/ui/button';
import StepOne from '@/components/user/Dashboard/addVehicle/StepOne';
import StepTwo from '@/components/user/Dashboard/addVehicle/StepTwo';
import StepThree from '@/components/user/Dashboard/addVehicle/StepThree';

interface StepOneFormData {
  name: string;
  brand: string;
  registrationNumber: string;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  seats: 2 | 4 | 5 | 7;
  carType: 'Sedan' | 'Hatchback' | 'XUV' | 'SUV' | 'Sports';
  isAutomatic: boolean;
  pricePerDay: number;
}

interface StepTwoFormData {
  images: File[];
}

interface StepThreeFormData {
  location: string;
}

interface FormData {
  stepOne?: StepOneFormData; // Fixed type from StepOne to StepOneFormData
  stepTwo?: StepTwoFormData;
  stepThree?: StepThreeFormData;
}

const AddVehicleForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});

  const nextStep = () => {
    const form = document.querySelector('form');
    if (form) {
      form.requestSubmit();
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepOneSubmit = (data: StepOneFormData) => {
    setFormData((prev) => ({ ...prev, stepOne: data }));
    setStep(2);
  };

  const handleStepTwoSubmit = (data: StepTwoFormData) => {
    setFormData((prev) => ({ ...prev, stepTwo: data }));
    setStep(3);
  };

  const handleStepThreeSubmit = async (data: StepThreeFormData) => {
    const finalData = { ...formData, stepThree: data };
    setFormData(finalData);

    const formDataToSend = new FormData();
    if (finalData.stepOne) {
      Object.entries(finalData.stepOne).forEach(([key, value]) => {
        formDataToSend.append(key, String(value));
      });
    }
    if (finalData.stepTwo?.images) {
      finalData.stepTwo.images.forEach((image, index) => {
        formDataToSend.append(`images[${index}]`, image);
      });
    }
    if (finalData.stepThree) {
      formDataToSend.append('location', finalData.stepThree.location);
    }

    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        body: formDataToSend,
      });
      if (!response.ok) throw new Error('Submission failed');
      console.log('Vehicle added successfully:', await response.json());
      setStep(1);
      setFormData({});
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit vehicle data');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Step progress bar */}
      <div className="flex justify-between items-center mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 mx-1 py-2 rounded-full text-center text-sm font-semibold
              ${step === s ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            Step {s}
          </div>
        ))}
      </div>

      {/* Step form content */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
        {step === 1 && <StepOne onSubmit={handleStepOneSubmit} defaultValues={formData.stepOne} />}
        {step === 2 && <StepTwo onSubmit={handleStepTwoSubmit} defaultValues={formData.stepTwo} />}
        {step === 3 && <StepThree onSubmit={handleStepThreeSubmit} defaultValues={formData.stepThree} />}

        {/* Navigation buttons */}
        <div className="mt-6 flex justify-between">
          <Button variant="secondary" onClick={prevStep} disabled={step === 1}>
            Back
          </Button>
          {step < 3 ? (
            <Button onClick={nextStep}>Next</Button>
          ) : (
            <Button onClick={() => document.querySelector('form')?.requestSubmit()}>
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddVehicleForm