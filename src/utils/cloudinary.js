import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

 cloudinary.config({ 
        cloud_name: 'dsfhimpvu', 
        api_key: '858336866116848', 
        api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
    });


export const uploadOnCloudinary = async function (localFilePath) {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });

    // Delete file from local storage
    fs.unlinkSync(localFilePath);

    console.log("Cloudinary Upload URL:", response.url);

    return response;
  } catch (error) {
    // Clean up local file even if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    console.error("Cloudinary upload error:", error);
    return null;
  }
};



