import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changePassword } from '@/services/user/UpdateProfileService';
import type { RootState } from '@/store/store';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

const ChangePasswordSchema = Yup.object().shape({
  current: Yup.string().required('Current password is required.')
   .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be less than 50 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  newPass: Yup.string()
 .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be less than 50 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character")    .required('New password is required.'),
  confirm: Yup.string()
    .oneOf([Yup.ref('newPass'), ''], 'Passwords do not match.')
    .required('Please confirm your new password.'),
});


export default function ChangePassword() {

const user = useSelector((state: RootState) => state.auth.user);
const _id = user?._id;
if(!_id)return

interface ChangePasswordValues {
  current: string;
  newPass: string;
  confirm: string;
}

interface FormikHelpers {
  setSubmitting: (isSubmitting: boolean) => void;
  resetForm: () => void;
}

const handleSubmit = async (values: ChangePasswordValues,{ setSubmitting, resetForm }: FormikHelpers) => {
  try {
    await changePassword({ ...values, _id });
    resetForm();
    toast.success?.('Password changed successfully!');
  } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(` ${errorMessage}`);
      console.error("Update Error:", error);  } finally {
    setSubmitting(false);
  }
  }

  return (
    <div className="w-full max-w-md mx-auto mt-12 p-8 bg-white dark:bg-black rounded-xl shadow-lg border border-gray-200 dark:border-white/10 font-sans">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">Change Password</h2>
      <Formik
        initialValues={{ current: '', newPass: '', confirm: '' }}
        validationSchema={ChangePasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status, touched, errors }) => (
          <Form className="space-y-6">
            <div>
              <Label htmlFor="current" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Current Password</Label>
              <Field
                as={Input}
                id="current"
                name="current"
                type="password"
                autoComplete="current-password"
                className={`w-full px-4 py-3 border ${touched.current && errors.current ? 'border-red-500' : status?.success ? 'border-green-500' : 'border-gray-300 dark:border-white/10'} rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black focus:ring-[#6DA5C0] focus:border-[#6DA5C0] transition-all duration-200`}
              />
              <ErrorMessage name="current" component="div" className="mt-1 text-sm text-red-500" />
            </div>
            <div>
              <Label htmlFor="new" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">New Password</Label>
              <Field
                as={Input}
                id="newPass"
                name="newPass"
                type="password"
                autoComplete="new-password"
                className={`w-full px-4 py-3 border ${touched.newPass && errors.newPass ? 'border-red-500' : status?.success ? 'border-green-500' : 'border-gray-300 dark:border-white/10'} rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black focus:ring-[#6DA5C0] focus:border-[#6DA5C0] transition-all duration-200`}
              />
              <ErrorMessage name="new" component="div" className="mt-1 text-sm text-red-500" />
            </div>
            <div>
              <Label htmlFor="confirm" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Confirm New Password</Label>
              <Field
                as={Input}
                id="confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                className={`w-full px-4 py-3 border ${touched.confirm && errors.confirm ? 'border-red-500' : status?.success ? 'border-green-500' : 'border-gray-300 dark:border-white/10'} rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black focus:ring-[#6DA5C0] focus:border-[#6DA5C0] transition-all duration-200`}
              />
              <ErrorMessage name="confirm" component="div" className="mt-1 text-sm text-red-500" />
            </div>
            <Button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold bg-[#6DA5C0] text-white hover:bg-[#5b8ca3] transition-all duration-200 shadow-sm mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Changing...' : 'Change Password'}
            </Button>
            {status?.success && <p className="text-green-600 text-center mt-2">Password changed successfully!</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
}
