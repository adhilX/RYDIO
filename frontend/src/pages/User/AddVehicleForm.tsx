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
      owner_id: user,
      admin_approve: 'pending',
      image_urls: Array.isArray(formData.stepTwo.image_urls)
        ? formData.stepTwo.image_urls
        : [],
    };

    const Location = {...formData.stepThree}
    await postVehicle(vehicle,Location);
    toast.success("Vehicle uploaded successfully.");
    setStep(1);
    navigate('/userProfile/vehicles')
    setFormData({});

  };


  return (
    <div className="w-full max-w-4xl mx-auto px-2 py-6 font-sans bg-gradient-to-br from-white via-[#f8fafc] to-[#eaf6fa] dark:from-black dark:via-[#181f23] dark:to-[#1a232a] min-h-[70vh] rounded-xl shadow-xl">
      {/* Stepper/Level Indicator */}
      <div className="flex items-center justify-between mb-4 md:mb-6 px-2 md:px-4">
        {[1, 2, 3].map((s, idx, arr) => (
          <div key={s} className="flex flex-1 flex-col items-center relative">
            <div className="flex items-center w-full justify-center">
              <div className={`flex items-center justify-center w-11 h-11 md:w-14 md:h-14 rounded-full border-2 text-lg font-bold z-10 mx-auto
                ${step === s ? 'bg-[#6DA5C0] border-[#6DA5C0] text-white shadow-lg scale-110' : step > s ? 'bg-[#eaf6fa] border-[#6DA5C0] text-[#6DA5C0]' : 'bg-gray-100 dark:bg-black/30 border-gray-300 dark:border-white/10 text-gray-400 dark:text-gray-500'}
                transition-all duration-300`}
              >
                {s}
              </div>
              {/* Progress line (except after last step) */}
              {idx < arr.length - 1 && (
                <div className="flex-1 flex items-center">
                  <div className={`h-2 w-full rounded-full ${step > s ? 'bg-[#6DA5C0]' : 'bg-gray-300 dark:bg-white/10'} transition-all duration-300`}></div>
                </div>
              )}
            </div>
            {/* Step label */}
            <span className={`mt-2 text-xs md:text-sm font-medium tracking-wide text-center block
              ${step === s ? 'text-[#6DA5C0]' : step > s ? 'text-[#6DA5C0]' : 'text-gray-400 dark:text-gray-500'}
            `}>
              {s === 1 ? 'Vehicle' : s === 2 ? 'Images' : 'Location'}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white dark:bg-black rounded-xl shadow-xl border border-gray-200 dark:border-white/10 p-0 md:p-0 transition-all duration-300 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Left: Image upload/preview for Step 2, else info */}
          <div className="md:col-span-5 flex flex-col gap-4 bg-gradient-to-b from-[#eaf6fa] via-white to-[#f8fafc] dark:from-[#1a232a] dark:via-black dark:to-[#181f23] p-4 md:p-6 min-h-[320px] justify-center border-r border-gray-100 dark:border-white/10">
            <AnimatePresence mode='wait'>
              {step === 2 ? (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4, type: 'spring' }}
                >
                  <StepTwo
                    onSubmit={handleStepTwoSubmit}
                    defaultValues={formData.stepTwo}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, type: 'spring' }}
                  className="hidden md:flex flex-col items-center justify-center h-full w-full"
                >
                  <span className="text-2xl font-bold text-[#6DA5C0] mb-2">{step === 1 ? 'Vehicle Details' : 'Location Details'}</span>
                  <span className="text-gray-400 text-base">Fill out the form to add your vehicle</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Right: Form for Step 1 and 3 */}
          <div className="md:col-span-7 flex flex-col gap-4 p-4 md:p-8">
            <AnimatePresence mode='wait'>
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4, type: 'spring' }}
                >
                  <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white">Vehicle Details</h2>
                  <StepOne
                    onSubmit={handleStepOneSubmit}
                    defaultValues={formData.stepOne}
                  />
                </motion.div>
              )}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4, type: 'spring' }}
                >
                  <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white">Location Details</h2>
                  <StepThree
                    onSubmit={handleStepThreeSubmit}
                    defaultValues={formData.stepThree}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            {/* Navigation Buttons */}
            <div className="mt-6 flex flex-col md:flex-row justify-between gap-2">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  variant="secondary"
                  onClick={prevStep}
                  disabled={step === 1}
                  className="w-full md:w-40 py-3 rounded-lg font-semibold border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-black/30 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-200"
                >
                  Back
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} className="flex-1">
                {step < 3 ? (
                  <Button
                    onClick={nextStep}
                    className="w-full md:w-40 py-3 rounded-lg font-semibold bg-[#6DA5C0] text-white hover:bg-[#5b8ca3] transition-all duration-200 shadow-sm"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleApi}
                    className="w-full md:w-40 py-3 rounded-lg font-semibold bg-[#6DA5C0] text-white hover:bg-[#5b8ca3] transition-all duration-200 shadow-sm"
                  >
                    Submit
                  </Button>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

