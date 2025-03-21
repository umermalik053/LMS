import express from 'express';
import { uploadMedia } from '../utils/cloudinary.js';
import { storage } from '../utils/multar.js';

const router = express.Router();

router.route("/uploadMedia").post(storage.single("file"),async(req, res, next)=>{
    try {
        const result = await uploadMedia(req.file.path);
        res.status(200).json({
            status: 200,
            message: "File uploaded successfully",
            data: result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Failed to upload file",
        });
    }
  
});

export default router;