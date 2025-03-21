import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config({});
// Initialize Cloudinary with your Cloudinary credentials

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadMedia = async (file) =>{

    try {
        
        
        const uploadResponse = await cloudinary.uploader.upload(file,{
            resource_type: "auto",
          

        });
        return uploadResponse;
    } catch (error) {
        console.error('Error uploading media to Cloudinary:', error.message);
        return null;
    }
} 

const deleteMedia = async (publicID) =>{
    try {
        await cloudinary.uploader.destroy(publicID);
        return true;
    } catch (error) {
        console.error('Error deleting media from Cloudinary:', error.message);
        return false;
    }
}
const deletevideo = async (publicID) =>{
    try {
        await cloudinary.uploader.destroy(publicID,{
            resource_type: "video"
        });
        return true;
    } catch (error) {
        console.error('Error deleting media from Cloudinary:', error.message);
        return false;
    }
}

export { uploadMedia, deleteMedia, deletevideo };