import express from "express";
import { signup, login, getProfile, uploadProfileImage, updateProfile } from "./controller/userController.mjs";
import { createPost, getPosts, getUserPosts, toggleLike, addComment } from "./controller/postControler.mjs";
import { authenticate, authorization } from "./auth/Authentication.mjs";
import { upload } from "./config/multer.mjs";

const router = express.Router();

router.get("/api", (req, res) => {
    res.send("Hello World!");
});

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authenticate, getProfile);
router.put("/update-profile-Image", authenticate, upload.single("profileImage"), uploadProfileImage);
router.put("/update-profile", authenticate, updateProfile);
router.post("/posts", authenticate, upload.single("media"), createPost);
router.get("/posts", authenticate, getPosts);
router.get("/posts/user/:userId", authenticate, authorization, getUserPosts);
router.put("/posts/:postId/like", authenticate, toggleLike);
router.post("/posts/:postId/comments", authenticate, addComment);
export default router;
