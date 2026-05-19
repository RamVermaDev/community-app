import express from "express";
import { signup, login, getProfile } from "./controller/userController.mjs";
import { authenticate } from "./auth/Authentication.mjs";


const router = express.Router();

router.get("/api", (req, res) => {
    res.send("Hello World!");
});

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authenticate, getProfile);

export default router;