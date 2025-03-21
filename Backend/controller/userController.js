import { userModel } from "../model/userModel.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import {uploadMedia,deleteMedia} from "../utils/cloudinary.js";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(404).json({
        status: 404,
        message: "All fields are required",
      });
    }
    //check if email already exists
    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(409).json({
        status: 409,
        message: "Email already exists",
      });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //create user
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      status: 201,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    console.error(error);
     return res.status(500).json({
      status: 500,
      message: "Failed to register user",
   
    });
  }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email ||!password) {
          return res.status(404).json({
            status: 404,
            message: "Email and password are required",
          });
        }
        //check if email exists
        const user = await userModel.findOne({ email });
        if (!user) {
          return res.status(404).json({
            status: 404,
            message: "User not found",
          });
        }
        //compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({
            status: 401,
            message: "Invalid credentials",
          });
        }
        //generate JWT
        generateToken(res , user , "welcome back");
        
    } catch (error) {
        console.error(error);
     return res.status(500).json({
      status: 500,
      message: "Failed to login user",
   
    });
    }
}

const logout = async (req, res) => {
  try {
      return res.status(200).cookie("token", "",{maxAge: 0}).json({
        message: "User logged out",
        success: true,
        status: 200,
      })
    
  } catch (error) {
    console.error(error);
     return res.status(500).json({
      status: 500,
      message: "Failed to Logout",
   
    });
    
  }
}

const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await userModel.findById(userId).select("-password").populate({
      path: "enrolledCourses",
      populate: {
        path: "creator", // Yeh `enrolledCourses` ke andar `creator` ko populate karega
        select: "name photoURL", // Sirf required fields select karo
      },
    });;

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "User profile fetched successfully",
      data: user,
    });
   
  } catch (error) {
    console.error(error);
     return res.status(500).json({
      status: 500,
      message: "Failed to fetch user profile",
   
    });
  }
}

const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name } = req.body;
    const profilePhoto = req.file;

    // Validate user existence
    const updatedUser = await userModel.findById(userId);
    if (!updatedUser) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    // Destroy old picture if exists
    if (updatedUser.photoURL) {
      const publicID = updatedUser.photoURL.split("/").pop().split(".")[0];
      await deleteMedia(publicID); // Ensure this function works as expected
    }

    // Upload new picture
    let photoURL = updatedUser.photoURL;
    if (profilePhoto && profilePhoto.path) {
      const uploadedFile = await uploadMedia(profilePhoto.path);
      photoURL = uploadedFile.secure_url;
    }

    // Update user data
    const updatedData = { name, photoURL };
    const update = await userModel
      .findByIdAndUpdate(userId, updatedData, { new: true })
      .select("-password");

    return res.status(200).json({
      status: 200,
      message: "User profile updated successfully",
      data: update,
    });
  } catch (error) {
    console.error("Error details:", error);
    return res.status(500).json({
      status: 500,
      message: "Failed to update user profile",
    });
  }
};


export { login,register, updateProfile,logout,getUserProfile}
