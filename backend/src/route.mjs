import express from "express";
import { signup, login, getProfile, uploadProfileImage, updateProfile } from "./controller/userController.mjs";
import { authenticate, authorization } from "./auth/Authentication.mjs";
import { upload } from "./config/multer.mjs";

const router = express.Router();

router.get("/api", (req, res) => {
    res.send("Hello World!");
});

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authenticate, authorization, getProfile);
router.put("/update-profile-Image", authenticate, authorization, upload.single("profileImage"), uploadProfileImage);
router.put("/update-profile", authenticate, authorization, updateProfile);
export default router;