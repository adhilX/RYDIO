import axios from 'axios';

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('cloud_name', 'dtbxcjgyg');
  formData.append('upload_preset', 'ProfilePic'); 

  try {
    const url =  import.meta.env.VITE_CLOUDINARY_URL
    const response = await axios.post(url,formData)
    return response.data.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};