import express from "express";
import { signup, login, getProfile, uploadProfileImage } from "./controller/userController.mjs";
import { authenticate } from "./auth/Authentication.mjs";
import { upload } from "./config/multer.mjs";

const router = express.Router();

router.get("/api", (req, res) => {
    res.send("Hello World!");
});

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authenticate, getProfile);
router.put("/update-profile", authenticate, upload.single("profileImage"), uploadProfileImage);

export default router;