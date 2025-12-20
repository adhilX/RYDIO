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
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

interface FormData {
  stepOne?: StepOneFormData;
  stepTwo?: StepTwoFormData;
  stepThree?: StepThreeFormData;
}

export default function AddVehicleForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const user = useSelector((state: RootState) => state.auth.user)
  const navigate = useNavigate()
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

    const files = Array.isArray(data.image_urls) ? data.image_urls : [data.image_urls];
    for (const file of files) {
      if (file instanceof File) {
        promises.push(uploadToCloudinary(file));
      }
    }

    const result = await Promise.all(promises)

    setFormData((prev) => ({ ...prev, stepTwo: { ...data, image_urls: result } }));
  }
  const handleStepThreeSubmit = (data: StepThreeFormData) => {
    setFormData((prev) => ({ ...prev, stepThree: data }));
  }

  const handleApi = async () => {
    try {

      if (!formData.stepOne || !formData.stepTwo || !formData.stepThree || !user?._id) {
        alert("Missing form data or user info.");
        return;
      }


      const vehicle: Vehicle = {
        ...formData.stepOne,
        owner_id: user,
        admin_approve: 'pending',
        image_urls: Array.isArray(formData.stepTwo.image_urls)
          ? formData.stepTwo.image_urls
          : [],
      };

      const Location = { ...formData.stepThree }
      await postVehicle(vehicle, Location);
      toast.success("Vehicle uploaded successfully.");
      setStep(1);
      navigate('/userProfile/vehicles')
      setFormData({});

    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
      console.error('Error while submitting vehicle:', error);
    }

  };


  return (
    <div className="min-h-screen bg-black text-white font-sans p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-3xl space-y-10">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Add New Vehicle</h1>
          <p className="text-gray-400">Complete the steps below to list your vehicle</p>
        </div>

        {/* Stepper */}
        <div className="relative flex items-center justify-between px-4">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full -z-10"></div>
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-white rounded-full -z-10 transition-all duration-500 ease-out"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>

          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${step >= s
                  ? 'bg-white border-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-110'
                  : 'bg-black border-white/20 text-gray-500'
                  }`}
              >
                {step > s ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  s
                )}
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${step >= s ? 'text-white' : 'text-gray-500'}`}>
                {s === 1 ? 'Details' : s === 2 ? 'Photos' : 'Location'}
              </span>
            </div>
          ))}
        </div>

        {/* Content Card */}
        <motion.div
          layout
          className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Glow Effect */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

          <AnimatePresence mode='wait'>
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StepOne
                  onSubmit={handleStepOneSubmit}
                  defaultValues={formData.stepOne}
                />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StepTwo
                  onSubmit={handleStepTwoSubmit}
                  defaultValues={formData.stepTwo}
                />
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StepThree
                  onSubmit={handleStepThreeSubmit}
                  defaultValues={formData.stepThree}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/10">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={step === 1}
              className={`text-gray-400 hover:text-white hover:bg-white/10 ${step === 1 ? 'invisible' : ''}`}
            >
              Back
            </Button>

            {step < 3 ? (
              <Button
                onClick={nextStep}
                className="bg-white text-black hover:bg-gray-200 font-bold px-8 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all duration-300"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleApi}
                className="bg-white text-black hover:bg-gray-200 font-bold px-8 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all duration-300"
              >
                Submit Listing
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

