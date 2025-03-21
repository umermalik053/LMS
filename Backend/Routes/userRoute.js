import express from "express";
import { getUserProfile, login, logout, register, updateProfile } from "../controller/userController.js";
import isAuthenticated from "../middleWare/isAuthenticated.js";
import { storage } from "../utils/multar.js";

const router = express.Router();

router.route("/register").post( register )
router.route("/login").post( login )
router.route("/logout").get( logout )
router.route("/profile").get( isAuthenticated,getUserProfile )
router.route("/profileUpdate").put( isAuthenticated, storage.single("photoUrl"),updateProfile )

export default router;