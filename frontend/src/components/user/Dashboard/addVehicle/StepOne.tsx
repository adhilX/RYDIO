import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import type { StepOneFormData } from '@/Types/User/addVehicle/TaddVehicle';




interface StepOneProps {
  onSubmit: (data: StepOneFormData) => void;
  defaultValues?: StepOneFormData;
}

const StepOne = ({ onSubmit, defaultValues }: StepOneProps) => {
  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    brand: Yup.string().required('Required'),
    registration_number: Yup.string().required('Required'),
    fuel_type: Yup.string().required('Required'),
    seats: Yup.number().required('Required'),
    car_type: Yup.string().required('Required'),
    automatic: Yup.boolean(),
    price_per_day: Yup.number().required('Required').min(1),
    description: Yup.string().required()
  });

  return (
    <Formik
      initialValues={
        defaultValues || {
          name: '',
          brand: '',
          registration_number: '',
          fuel_type: 'petrol',
          seats: 4,
          description:'',
          car_type: 'sedan',
          automatic: false,
          price_per_day: 0,
        }
      }
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Form className="space-y-6 font-sans">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Vehicle Name</label>
            <Field name="name" as={Input} placeholder="Enter vehicle name" className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black focus:ring-[#6DA5C0] focus:border-[#6DA5C0] transition-all duration-200" />
            <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Brand</label>
            <Field name="brand" as={Input} placeholder="Enter brand" className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black focus:ring-[#6DA5C0] focus:border-[#6DA5C0] transition-all duration-200" />
            <ErrorMessage name="brand" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Registration Number</label>
            <Field name="registration_number" as={Input} placeholder="Enter registration number" className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black focus:ring-[#6DA5C0] focus:border-[#6DA5C0] transition-all duration-200" />
            <ErrorMessage name="registration_number" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Fuel Type</label>
            <Field name="fuel_type" as="select" className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black focus:ring-[#6DA5C0] focus:border-[#6DA5C0] transition-all duration-200">
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
            </Field>
            <ErrorMessage name="fuel_type" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Seats</label>
            <Field name="seats" as="select" className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black focus:ring-[#6DA5C0] focus:border-[#6DA5C0] transition-all duration-200">
              {[2, 4, 5, 7].map((seat) => (
                <option key={seat} value={seat}>{seat}</option>
              ))}
            </Field>
            <ErrorMessage name="seats" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Car Type</label>
            <Field name="car_type" as="select" className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black focus:ring-[#6DA5C0] focus:border-[#6DA5C0] transition-all duration-200">
              {['sedan', 'hatchback', 'xuv', 'suv', 'sports'].map((type) => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </Field>
            <ErrorMessage name="car_type" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          <div className="flex items-center space-x-2 mb-6">
            <Field type="checkbox" name="automatic" className="accent-[#6DA5C0] w-5 h-5 rounded focus:ring-[#6DA5C0]" />
            <label className="text-gray-700 dark:text-gray-200">Automatic Transmission</label>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Price Per Day</label>
            <Field name="price_per_day" type="number" as={Input} placeholder="Enter price per day" className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black focus:ring-[#6DA5C0] focus:border-[#6DA5C0] transition-all duration-200" />
            <ErrorMessage name="price_per_day" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Description</label>
            <Field name="description" type="text" as={Input} placeholder="Enter description for this vehicle" className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black focus:ring-[#6DA5C0] focus:border-[#6DA5C0] transition-all duration-200" />
            <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          <button type="submit" className="hidden" aria-label="Submit Step One"></button>
        </Form>
      )}
    </Formik>
  );
};

export default StepOne;
