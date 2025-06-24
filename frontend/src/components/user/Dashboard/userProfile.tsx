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
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userProfileSchema, type UserProfileFormData } from "@/Types/User/validation/UpdateProfileSchema";

export default function UserProfile() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const formValues = useWatch({ control });
  useEffect(() => {
    console.log("Form values:", formValues);
  }, [formValues]);

  useEffect(() => {
    if (user) {
      console.log("Resetting form with:", user.name, user.phone);
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
      let imageUrl: string = user.profileImage || "";
      if (croppedImage) {
        imageUrl = await uploadToCloudinary(croppedImage);
        console.log(imageUrl)
      }
      const updatedData = { ...userData, email: user.email };
      await updateProfile(imageUrl, updatedData);
      toast.success("Profile updated successfully!");
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
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
        <p className="text-sm text-gray-500">Manage your account details</p>
      </div>

      <div className="flex justify-center mb-8">
        <div
          className="relative group cursor-pointer"
          onClick={isEditing ? triggerFileInput : undefined}
        >
          <Avatar className="w-32 h-32 border-4 border-white shadow-lg group-hover:opacity-90 transition-opacity">
            <AvatarImage src={croppedImage ? URL.createObjectURL(croppedImage) : user.profileImage || ""} />
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
      </div>

      <ImageCropper
        imageSrc={imageSrc}
        onCropComplete={setCroppedImage}
        open={showCropper}
        onOpenChange={setShowCropper}
      />

      <form onSubmit={handleSubmit(handleUpdateUser)}>
        <div className="space-y-6">
          {/* Name Field */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 block">
              Name
            </Label>
            {isEditing ? (
              <div>
                <input
                  {...register("name")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-gray-900 focus:border-gray-900"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>
            ) : (
              <p className="text-gray-900 font-medium">{user.name || "Not set"}</p>
            )}
          </div>

          {/* Email Field (read-only) */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1 block">Email</Label>
            <p className="text-gray-900 font-medium">{user.email || "Not set"}</p>
            <span className="text-xs text-yellow-600 mt-1 block">Email cannot be changed</span>
          </div>

          {/* Phone Field */}
          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1 block">
              Phone
            </Label>
            {isEditing ? (
              <div>
                <input
                  {...register("phone")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-gray-900 focus:border-gray-900"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
              </div>
            ) : (
              <p className="text-gray-900 font-medium">{user.phone || "Add your phone number"}</p>
            )}
          </div>

          <div className="pt-4 flex justify-center">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-28 bg-gray-300 hover:bg-red-400 text-black py-2 mx-3 rounded-md transition-colors shadow-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-28 bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-md transition-colors shadow-sm"
                >
                  {isSubmitting ? "Please Wait..." : "Save Profile"}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-md transition-colors shadow-sm"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}