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
        <Form className="space-y-4">
          <div>
            <label>Vehicle Name</label>
            <Field name="name" as={Input} placeholder="Enter vehicle name" />
            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <label>Brand</label>
            <Field name="brand" as={Input} placeholder="Enter brand" />
            <ErrorMessage name="brand" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <label>Registration Number</label>
            <Field name="registration_number" as={Input} placeholder="Enter registration number" />
            <ErrorMessage name="registration_number" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <label>Fuel Type</label>
            <Field name="fuel_type" as="select" className="w-full border rounded px-2 py-1">
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
            </Field>
            <ErrorMessage name="fuel_type" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <label>Seats</label>
            <Field name="seats" as="select" className="w-full border rounded px-2 py-1">
              {[2, 4, 5, 7].map((seat) => (
                <option key={seat} value={seat}>{seat}</option>
              ))}
            </Field>
            <ErrorMessage name="seats" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <label>Car Type</label>
            <Field name="car_type" as="select" className="w-full border rounded px-2 py-1">
              {['sedan', 'hateback', 'xuv', 'suv', 'sports'].map((type) => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </Field>
            <ErrorMessage name="car_type" component="div" className="text-red-500 text-sm" />
          </div>

          <div className="flex items-center space-x-2">
            <Field type="checkbox" name="automatic" />
            <label>Automatic Transmission</label>
          </div>

          <div>
            <label>Price Per Day</label>
            <Field name="price_per_day" type="number" as={Input} placeholder="Enter price per day" />
            <ErrorMessage name="price_per_day" component="div" className="text-red-500 text-sm" />
          </div>
          <div>
            <label>description</label>
            <Field name="description" type="text" as={Input} placeholder="Enter description for this vehicle" />
            <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
          </div>

          <button type="submit" className="hidden" aria-label="Submit Step One"></button>
        </Form>
      )}
    </Formik>
  );
};

export default StepOne;
