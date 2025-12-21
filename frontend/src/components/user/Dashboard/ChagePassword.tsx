import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changePassword } from '@/services/user/UpdateProfileService';
import type { RootState } from '@/store/store';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Shield, KeyRound } from 'lucide-react';

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
    .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character")
    .required('New password is required.'),
  confirm: Yup.string()
    .oneOf([Yup.ref('newPass'), ''], 'Passwords do not match.')
    .required('Please confirm your new password.'),
});


export default function ChangePassword() {

  const user = useSelector((state: RootState) => state.auth.user);
  const _id = user?._id;
  if (!_id) return null

  interface ChangePasswordValues {
    current: string;
    newPass: string;
    confirm: string;
  }

  interface FormikHelpers {
    setSubmitting: (isSubmitting: boolean) => void;
    resetForm: () => void;
  }

  const handleSubmit = async (values: ChangePasswordValues, { setSubmitting, resetForm }: FormikHelpers) => {
    try {
      await changePassword({ ...values, _id });
      resetForm();
      toast.success('Password changed successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(` ${errorMessage}`);
      console.error("Update Error:", error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row gap-8 font-sans">
      {/* Decorative Side Panel */}
      <div className="w-full lg:w-[320px] shrink-0">
        <div className="bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <KeyRound className="w-10 h-10 text-white/80" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Secure Your Account</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Regularly updating your password helps protect your personal information and booking history.
          </p>

          <div className="mt-8 space-y-3 w-full">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-left">
              <Shield className="w-5 h-5 text-green-400 shrink-0" />
              <span className="text-xs text-gray-300">Use special characters</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-left">
              <Shield className="w-5 h-5 text-green-400 shrink-0" />
              <span className="text-xs text-gray-300">Minimum 8 characters</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1">
        <div className="bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 p-8 md:p-10 relative">
          <div className="mb-8 border-b border-white/10 pb-6">
            <h2 className="text-3xl font-bold text-white mb-2">Change Password</h2>
            <p className="text-gray-400 font-light">Create a new strong password for your account.</p>
          </div>

          <Formik
            initialValues={{ current: '', newPass: '', confirm: '' }}
            validationSchema={ChangePasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors }) => (
              <Form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current" className="text-gray-300 text-sm font-medium ml-1">Current Password</Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="current"
                      name="current"
                      type="password"
                      placeholder="Enter current password"
                      className={`w-full h-14 bg-white/5 border ${touched.current && errors.current ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-white focus:bg-white/10'} rounded-xl px-5 text-white transition-all outline-none placeholder:text-gray-600`}
                    />
                    <ErrorMessage name="current" component="p" className="text-red-400 text-xs mt-2 ml-1" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="newPass" className="text-gray-300 text-sm font-medium ml-1">New Password</Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        id="newPass"
                        name="newPass"
                        type="password"
                        placeholder="Enter new password"
                        className={`w-full h-14 bg-white/5 border ${touched.newPass && errors.newPass ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-white focus:bg-white/10'} rounded-xl px-5 text-white transition-all outline-none placeholder:text-gray-600`}
                      />
                      <ErrorMessage name="newPass" component="p" className="text-red-400 text-xs mt-2 ml-1" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm" className="text-gray-300 text-sm font-medium ml-1">Confirm Password</Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        id="confirm"
                        name="confirm"
                        type="password"
                        placeholder="Confirm new password"
                        className={`w-full h-14 bg-white/5 border ${touched.confirm && errors.confirm ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-white focus:bg-white/10'} rounded-xl px-5 text-white transition-all outline-none placeholder:text-gray-600`}
                      />
                      <ErrorMessage name="confirm" component="p" className="text-red-400 text-xs mt-2 ml-1" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 mt-8 flex justify-end">
                  <Button
                    type="submit"
                    className="h-12 px-8 rounded-xl bg-white text-black hover:bg-gray-200 font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        Updating...
                      </span>
                    ) : 'Update Password'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
