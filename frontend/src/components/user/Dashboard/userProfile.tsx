import React, { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageCropper } from "@/components/modal/ImageCroper";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { uploadToCloudinary } from "@/lib/utils/cloudinaryUpload";
import { updateProfile } from "@/services/user/UpdateProfileService";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userProfileSchema, type UserProfileFormData } from "@/Types/User/validation/UpdateProfileSchema";
import { addUser } from "@/store/slice/user/UserSlice";
import { UploadIdProofModal } from "./modal/IdProof";
const IMG_URL = import.meta.env.VITE_IMAGE_URL
export default function UserProfile() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch()

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

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
  }, [user, reset]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpdateUser = async (userData: UserProfileFormData) => {
    try {
      if (!user) {
        toast.error("User data not available");
        return;
      }
      let imageUrl: string = user.profile_image || "";
      if (croppedImage) {
        imageUrl = await uploadToCloudinary(croppedImage);
      }
      const updatedData = { ...userData, email: user.email };
      const { newUser } = await updateProfile(imageUrl, updatedData);
      toast.success("Profile updated successfully!");
      dispatch(addUser(newUser))
      setIsEditing(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Update failed: ${errorMessage}`);
      console.error("Update Error:", error);
    }
  };

  // Handle loading state
  if (!user) {
    return <div className="text-center p-8">Loading user data...</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 py-8 md:py-12 font-sans">
      {/* Left: User Details Card */}
      <div className="w-full md:w-[340px] bg-white dark:bg-black rounded-xl shadow-lg border border-gray-200 dark:border-white/10 p-6 md:p-8 flex flex-col items-center mb-8 md:mb-0">
        <div className="relative group cursor-pointer mb-6" onClick={isEditing ? triggerFileInput : undefined}>
          <Avatar className="w-32 h-32 border-4 border-white dark:border-black shadow-lg group-hover:opacity-90 transition-opacity">
            <AvatarImage src={croppedImage ? URL.createObjectURL(croppedImage) :IMG_URL + user.profile_image || ""} />
            <AvatarFallback className="bg-gray-100 text-gray-600 text-6xl font-medium">
              {user.name?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white font-medium">Change Photo</span>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          ref={fileInputRef}
          title="Upload profile image"
        />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
          {user.name || "Not set"}
          {user.is_verified_user && (
            <svg
              fill="#000000"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="icon flat-line"
            >
              <path
                d="M21.37,12c0,1-.86,1.79-1.14,2.67s-.1,2.08-.65,2.83-1.73.94-2.5,1.49-1.28,1.62-2.18,1.92S13,20.65,12,20.65s-2,.55-2.9.27S7.67,19.55,6.92,19,5,18.28,4.42,17.51s-.35-1.92-.65-2.83S2.63,13,2.63,12s.86-1.8,1.14-2.68.1-2.08.65-2.83S6.15,5.56,6.92,5,8.2,3.39,9.1,3.09s1.93.27,2.9.27,2-.55,2.9-.27S16.33,4.46,17.08,5s1.94.72,2.5,1.49.35,1.92.65,2.83S21.37,11,21.37,12Z"
                fill="#61d0ff"
                strokeWidth={0.696}
              />
              <polyline
                points="8 12 11 15 16 10"
                fill="none"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={0.696}
              />
              <path
                d="M21.37,12c0,1-.86,1.79-1.14,2.67s-.1,2.08-.65,2.83-1.73.94-2.5,1.49-1.28,1.62-2.18,1.92S13,20.65,12,20.65s-2,.55-2.9.27S7.67,19.55,6.92,19,5,18.28,4.42,17.51s-.35-1.92-.65-2.83S2.63,13,2.63,12s.86-1.8,1.14-2.68.1-2.08.65-2.83S6.15,5.56,6.92,5,8.2,3.39,9.1,3.09s1.93.27,2.9.27,2-.55,2.9-.27S16.33,4.46,17.08,5s1.94.72,2.5,1.49.35,1.92.65,2.83S21.37,11,21.37,12Z"
                fill="none"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={0.696}
              />
            </svg>
          )}

        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{user.email || "Not set"}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{user.phone || "Add your phone number"}</p>
        {user.idproof_id ? (
          user.idproof_id.status !== 'approved' ? (
            <div className="mb-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 flex items-center">
              <span className="font-semibold">ID Proof Status:</span>
              <span className="capitalize">{user.idproof_id.status}</span>
            </div>
          ) : null
        ) : (
          <Button
            className="w-full bg-[#6DA5C0] hover:bg-[#5b8ca3] text-white font-semibold py-2 rounded-md transition-all duration-200 shadow-sm mb-2"
            onClick={() => SetOpen(true)}
          >
            Submit ID Proof
          </Button>
        )}
        <Button
          className="w-full bg-black dark:bg-white text-white dark:text-black border border-black dark:border-white hover:bg-[#6DA5C0] hover:text-white dark:hover:bg-[#6DA5C0] dark:hover:text-white font-semibold py-2 rounded-md transition-all duration-200 shadow-sm"
          type="button"
          onClick={() => setIsEditing(true)}
          disabled={isEditing}
        >
          Edit Profile
        </Button>
        <ImageCropper
          imageSrc={imageSrc}
          onCropComplete={setCroppedImage}
          open={showCropper}
          onOpenChange={setShowCropper}
        />
        <UploadIdProofModal open={open} onClose={() => SetOpen(false)} />
      </div>

      {/* Right: Editable Form or Info Blocks */}
      <div className="flex-1 bg-white dark:bg-black rounded-xl shadow-lg border border-gray-200 dark:border-white/10 p-6 md:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Profile Details</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account details</p>
        </div>
        <form onSubmit={handleSubmit(handleUpdateUser)} className="space-y-8">
          {/* Name Field */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Name</Label>
            {isEditing ? (
              <div>
                <input
                  {...register("name")}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-md text-gray-900 dark:text-white bg-white dark:bg-black focus:ring-[#6DA5C0] focus:border-[#6DA5C0] transition-all duration-200"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>
            ) : (
              <p className="text-gray-900 dark:text-white font-medium">{user.name || "Not set"}</p>
            )}
          </div>
          {/* Email Field (read-only) */}
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Email</Label>
            <p className="text-gray-900 dark:text-white font-medium">{user.email || "Not set"}</p>
            <span className="text-xs text-yellow-600 mt-1 block">Email cannot be changed</span>
          </div>
          {/* Phone Field */}
          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Phone</Label>
            {isEditing ? (
              <div>
                <input
                  {...register("phone")}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-md text-gray-900 dark:text-white bg-white dark:bg-black focus:ring-[#6DA5C0] focus:border-[#6DA5C0] transition-all duration-200"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
              </div>
            ) : (
              <p className="text-gray-900 dark:text-white font-medium">{user.phone || "Add your phone number"}</p>
            )}
          </div>
          {/* Save/Cancel Buttons */}
          {isEditing && (
            <div className="flex gap-4 pt-2">
              <Button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-28 bg-gray-300 hover:bg-red-400 text-black py-2 rounded-md transition-all duration-200 shadow-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-28 bg-[#6DA5C0] hover:bg-[#5b8ca3] text-white py-2 rounded-md transition-all duration-200 shadow-sm"
              >
                {isSubmitting ? "Please Wait..." : "Save Profile"}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}