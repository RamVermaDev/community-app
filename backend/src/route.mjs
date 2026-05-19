import express from "express";
import { signup, login } from "./controller/userController.mjs";

const router = express.Router();

router.get("/api", (req, res) => {
    res.send("Hello World!");
});

router.post("/signup", signup);
router.post("/login", login);

export default router;