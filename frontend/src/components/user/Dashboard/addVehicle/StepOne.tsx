import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import type { StepOneFormData } from '@/Types/User/addVehicle/TaddVehicle';
import React from 'react';




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
          description: '',
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vehicle Name</label>
              <Field
                name="name"
                as={Input}
                placeholder="e.g. Tesla Model 3"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all font-medium"
              />
              <ErrorMessage name="name" component="div" className="text-xs text-red-400 font-medium" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Brand</label>
              <Field
                name="brand"
                as={Input}
                placeholder="e.g. Tesla"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all font-medium"
              />
              <ErrorMessage name="brand" component="div" className="text-xs text-red-400 font-medium" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Registration Number</label>
              <Field
                name="registration_number"
                as={Input}
                placeholder="e.g. KL-01-AB-1234"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all font-medium"
              />
              <ErrorMessage name="registration_number" component="div" className="text-xs text-red-400 font-medium" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fuel Type</label>
              <Field
                name="fuel_type"
                as="select"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all font-medium appearance-none"
              >
                <option value="petrol" className="bg-black text-white">Petrol</option>
                <option value="diesel" className="bg-black text-white">Diesel</option>
                <option value="electric" className="bg-black text-white">Electric</option>
              </Field>
              <ErrorMessage name="fuel_type" component="div" className="text-xs text-red-400 font-medium" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Seats</label>
              <Field
                name="seats"
                as="select"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all font-medium appearance-none"
              >
                {[2, 4, 5, 7].map((seat) => (
                  <option key={seat} value={seat} className="bg-black text-white">{seat} Seater</option>
                ))}
              </Field>
              <ErrorMessage name="seats" component="div" className="text-xs text-red-400 font-medium" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Car Type</label>
              <Field
                name="car_type"
                as="select"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all font-medium appearance-none"
              >
                {['sedan', 'hatchback', 'xuv', 'suv', 'sports'].map((type) => (
                  <option key={type} value={type} className="bg-black text-white">{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </Field>
              <ErrorMessage name="car_type" component="div" className="text-xs text-red-400 font-medium" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Price Per Day (₹)</label>
              <Field
                name="price_per_day"
                type="number"
                as={Input}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all font-medium"
              />
              <ErrorMessage name="price_per_day" component="div" className="text-xs text-red-400 font-medium" />
            </div>

            <div className="flex items-center space-x-3 pt-8 h-full">
              <Field
                type="checkbox"
                name="automatic"
                id="automatic"
                className="w-5 h-5 rounded border-white/20 bg-white/10 text-white focus:ring-white/25 focus:ring-offset-0 accent-white"
              />
              <label htmlFor="automatic" className="text-sm font-medium text-white cursor-pointer select-none">
                Automatic Transmission
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</label>
            <Field
              name="description"
              as="textarea"
              rows={4}
              placeholder="Tell us more about your vehicle..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all font-medium resize-none"
            />
            <ErrorMessage name="description" component="div" className="text-xs text-red-400 font-medium" />
          </div>

          <button type="submit" className="hidden" aria-label="Submit Step One"></button>
        </Form>
      )}
    </Formik>
  );
};

export default React.memo(StepOne);
