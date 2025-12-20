import React, { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageCropper } from "@/components/modal/ImageCroper";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { uploadToCloudinary } from "@/lib/utils/cloudinaryUpload";
import { updateProfile } from "@/services/user/UpdateProfileService";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userProfileSchema, type UserProfileFormData } from "@/Types/User/validation/UpdateProfileSchema";
import { UploadIdProofModal } from "./modal/IdProof";
import { getUser } from "@/services/user/authService";
import type { Iuser } from "@/Types/User/Iuser";
import { IdCard, CheckCircle, XCircle, ShieldAlert, ChevronRight } from "lucide-react";
const IMG_URL = import.meta.env.VITE_IMAGE_URL
export default function UserProfile() {
  const { user } = useSelector((state: RootState) => state.auth)
  const [isEditing, setIsEditing] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userDate, setUserData] = useState<Iuser>({ name: '', phone: '', email: '', role: 'user', _id: '', profile_image: '', is_verified_user: false })

  const [open, SetOpen] = useState(false)
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  // Refresh user data function
  const refreshUser = async () => {
    if (!user?._id) return;

    try {
      const foundUser = await getUser(user._id);
      reset({
        name: foundUser.name || '',
        phone: foundUser.phone || ''
      });
      setUserData(prev => ({
        ...prev,
        name: foundUser.name || '',
        phone: foundUser.phone || '',
        email: foundUser.email || '',
        role: foundUser.role || 'user',
        _id: foundUser._id || '',
        profile_image: foundUser.profile_image || '',
        is_verified_user: foundUser.is_verified_user || false,
        idproof_id: foundUser.idproof_id || prev.idproof_id
      }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load user data');
    }
  };

  useEffect(() => {
    refreshUser();
  }, [user?._id, user?.is_verified_user, user?.idproof_id, reset]);

  if (!user) return null

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // Reset input so same file can be selected again
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpdateUser = async (userData: UserProfileFormData) => {
    try {
      if (!userData) {
        toast.error("User data not available");
        return;
      }
      let imageUrl: string = userDate.profile_image || "";
      if (croppedImage) {
        imageUrl = await uploadToCloudinary(croppedImage);
      }
      const updatedData = { ...userData, email: userDate.email };
      await updateProfile(imageUrl, updatedData);
      await refreshUser();
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Update failed: ${errorMessage}`);
      console.error("Update Error:", error);
    }
  };

  // Handle loading state
  if (!userDate) {
    return <div className="text-center p-8">Loading user data...</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 font-sans">
      {/* Left: User Identity Card */}
      <div className="w-full lg:w-[380px] shrink-0">
        <div className="bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 p-8 flex flex-col items-center relative overflow-hidden group">
          {/* Decorative glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />

          <div className="relative mb-6">
            <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-br from-white/20 to-transparent border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <Avatar className="w-full h-full rounded-full border-4 border-black/50 shadow-inner">
                <AvatarImage src={croppedImage ? URL.createObjectURL(croppedImage) : IMG_URL + userDate.profile_image || ""} className="object-cover" />
                <AvatarFallback className="bg-black text-white/50 text-5xl font-light">
                  {userDate.name?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            </div>

            {isEditing && (
              <button
                onClick={triggerFileInput}
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer backdrop-blur-sm"
              >
                <div className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm shadow-[0_0_15px_rgba(255,255,255,0.5)] transform scale-90 group-hover:scale-100 transition-transform">
                  Upload Photo
                </div>
              </button>
            )}


          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            ref={fileInputRef}
          />

          <h2 className="text-3xl font-bold text-white mb-2 text-center tracking-tight flex items-center justify-center gap-2">
            {userDate.name || "Anonymous"}
            {userDate.is_verified_user && (
              <div title="Verified User" className="mt-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.5 12.5C22.5 10.92 21.625 9.55 20.352 8.9C20.506 8.465 20.59 7.995 20.59 7.5C20.59 5.29 18.88 3.502 16.772 3.502C16.302 3.502 15.852 3.586 15.436 3.752C14.818 2.415 13.51 1.5 12 1.5C10.49 1.5 9.184 2.417 8.563 3.75C8.15 3.585 7.697 3.5 7.227 3.5C5.117 3.5 3.409 5.29 3.409 7.5C3.409 7.995 3.492 8.465 3.647 8.9C2.375 9.55 1.5 10.92 1.5 12.5C1.5 14.078 2.375 15.448 3.647 16.098C3.493 16.533 3.409 17.003 3.409 17.5C3.409 19.71 5.119 21.5 7.227 21.5C7.697 21.5 8.147 21.414 8.563 21.25C9.183 22.583 10.489 23.5 12 23.5C13.512 23.5 14.818 22.583 15.437 21.25C15.851 21.415 16.303 21.5 16.772 21.5C18.882 21.5 20.59 19.71 20.59 17.5C20.59 17.005 20.507 16.535 20.353 16.1C21.625 15.45 22.5 14.08 22.5 12.5Z" fill="#1877F2" />
                  <path d="M10 16.5L6 12.5L7.41 11.09L10 13.67L16.59 7.09L18 8.5L10 16.5Z" fill="white" />
                </svg>
              </div>
            )}
          </h2>
          <p className="text-gray-400 mb-6 text-center text-sm tracking-wide uppercase font-medium">
            {userDate.email}
          </p>

          <div className="w-full space-y-3">


            {userDate.idproof_id ? (
              <div className={`group relative overflow-hidden rounded-2xl border bg-white/5 p-4 transition-all duration-300 ${userDate.idproof_id.status === 'approved' ? 'border-green-500/30 hover:bg-green-500/5' :
                userDate.idproof_id.status === 'rejected' ? 'border-red-500/30 hover:bg-red-500/5' :
                  'border-yellow-500/30 hover:bg-yellow-500/5'
                }`}>
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 shadow-inner ${userDate.idproof_id.status === 'approved' ? 'text-green-400' :
                    userDate.idproof_id.status === 'rejected' ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>
                    <IdCard className="h-6 w-6" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Identity Verification</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-base font-bold capitalize tracking-tight ${userDate.idproof_id.status === 'approved' ? 'text-white' :
                        userDate.idproof_id.status === 'rejected' ? 'text-red-200' :
                          'text-yellow-200'
                        }`}>
                        {userDate.idproof_id.status === 'approved' ? 'Verified Account' :
                          userDate.idproof_id.status === 'rejected' ? 'Verification Failed' :
                            'Verification Pending'
                        }
                      </span>
                      {userDate.idproof_id.status === 'approved' && <CheckCircle className="h-4 w-4 text-green-400" />}
                      {userDate.idproof_id.status === 'rejected' && <XCircle className="h-4 w-4 text-red-400" />}
                      {userDate.idproof_id.status === 'pending' && <ShieldAlert className="h-4 w-4 text-yellow-400 animate-pulse" />}
                    </div>
                  </div>
                </div>

                {userDate.idproof_id.status === 'rejected' && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-200">
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    <p>{userDate.idproof_id.reason || "Please re-upload clearer documents."}</p>
                    <button
                      onClick={() => SetOpen(true)}
                      className="ml-auto font-bold text-white underline hover:text-red-200"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => SetOpen(true)}
                className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-r from-white/10 to-transparent p-4 text-left transition-all duration-300 hover:border-white/40 hover:from-white/20"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-transform duration-300 group-hover:scale-110">
                    <IdCard className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-400 group-hover:text-gray-300">Identity Status</span>
                    <span className="text-base font-bold text-white group-hover:text-white">Verify Your Account</span>
                  </div>
                </div>
                <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-opacity group-hover:bg-white group-hover:text-black">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </button>
            )}

            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 h-12 rounded-xl font-bold mt-4"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Right: Edit Layout */}
      <div className="flex-1">
        <div className="bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 p-8 md:p-10 h-full relative">
          <div className="mb-10 border-b border-white/10 pb-6">
            <h2 className="text-3xl font-bold text-white mb-2">Account Details</h2>
            <p className="text-gray-400 font-light">Update your personal information and contact details.</p>
          </div>

          <form onSubmit={handleSubmit(handleUpdateUser)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-gray-300 text-sm font-medium ml-1">Full Name</Label>
                {isEditing ? (
                  <div className="relative">
                    <input
                      {...register("name")}
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-5 text-white focus:border-white focus:bg-white/10 transition-all outline-none"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-2 ml-1">{errors.name.message}</p>}
                  </div>
                ) : (
                  <div className="h-14 flex items-center px-5 rounded-xl bg-white/5 border border-white/5 text-gray-300 cursor-not-allowed">
                    {userDate.name || "Not set"}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-gray-300 text-sm font-medium ml-1">Phone Number</Label>
                {isEditing ? (
                  <div className="relative">
                    <input
                      {...register("phone")}
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-5 text-white focus:border-white focus:bg-white/10 transition-all outline-none"
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-2 ml-1">{errors.phone.message}</p>}
                  </div>
                ) : (
                  <div className="h-14 flex items-center px-5 rounded-xl bg-white/5 border border-white/5 text-gray-300 cursor-not-allowed">
                    {userDate.phone || "Not Set"}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-gray-300 text-sm font-medium ml-1">Email Address</Label>
              <div className="h-14 flex items-center px-5 rounded-xl bg-white/5 border border-white/5 text-gray-400 cursor-not-allowed opacity-70">
                {userDate.email}
                <span className="ml-auto text-xs text-white/30 border border-white/10 px-2 py-1 rounded">Read Only</span>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-4 pt-8 border-t border-white/10 mt-8">
                <Button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    // optionally reset form here
                    refreshUser();
                  }}
                  className="h-12 px-8 rounded-xl bg-transparent border border-white/20 text-white hover:bg-white/10 transition-all"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 px-8 rounded-xl bg-white text-black hover:bg-gray-200 font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      Saving...
                    </span>
                  ) : "Save Changes"}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>

      <ImageCropper
        imageSrc={imageSrc}
        onCropComplete={setCroppedImage}
        open={showCropper}
        onOpenChange={setShowCropper}
      />
      <UploadIdProofModal open={open} onClose={() => SetOpen(false)} onSuccess={refreshUser} />
    </div>
  );
}