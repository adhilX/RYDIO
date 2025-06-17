
import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Car, Eye, EyeOff, Shield } from "lucide-react"
import { loginadmin } from "@/services/admin/authService"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { addToken } from "@/store/slice/admin/AdminTokenSlice"
import { useNavigate } from "react-router"

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
})

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
   const dispatch = useDispatch()
   const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Logo and Brand */}
        <motion.div
          className="text-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Car className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">RYDIO</h1>
        </motion.div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <motion.div
              className="flex items-center justify-center mb-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Shield className="w-5 h-5 text-blue-400 mr-2" />
              <CardTitle className="text-xl text-white">Admin Login</CardTitle>
            </motion.div>
            <CardDescription className="text-slate-400 text-center">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>

          <Formik
            initialValues={{ email: "", password: "", rememberMe: false }}
            validationSchema={LoginSchema}
            onSubmit={async(values, { setSubmitting }) => {
                try {
                  const response=  await loginadmin(values)
                    console.log("Login attempt:", values)
                dispatch(addToken(response.accessToken))
                    toast.success('login success')
                navigate('/dashboard',{replace:true})
                } catch(error) {
                    const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred";
                   toast.error(`Login failed: ${errorMessage}`);
                }
                setSubmitting(false)
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <CardContent className="space-y-4">
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <Label htmlFor="email" className="text-slate-200">
                      Email Address
                    </Label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="admin@rydio.com"
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                    />
                    <AnimatePresence>
                      {errors.email && touched.email && (
                        <motion.div
                          className="text-red-500 text-sm"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <ErrorMessage name="email" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <Label htmlFor="password" className="text-slate-200">
                      Password
                    </Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-slate-200"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <AnimatePresence>
                      {errors.password && touched.password && (
                        <motion.div
                          className="text-red-500 text-sm"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <ErrorMessage name="password" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div
                    className="flex items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    
                  
                  </motion.div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                      disabled={isSubmitting}
                    >
                      Sign In to Dashboard
                    </Button>
                  </motion.div>

                  <div className="text-center">
                    <Button variant="link" className="text-slate-400 hover:text-slate-200 text-sm" type="button">
                      Forgot your password?
                    </Button>
                  </div>
                </CardFooter>
              </Form>
            )}
          </Formik>
        </Card>

        {/* Footer */}
        <motion.div
          className="text-center mt-8 text-slate-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <p>© 2024 RYDIO. All rights reserved.</p>
          <p className="mt-1">Secure admin access • Protected by encryption</p>
        </motion.div>
      </motion.div>
    </div>
  )
}