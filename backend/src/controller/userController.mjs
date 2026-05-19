import { userModel } from "../models/userModel.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { secret_key } from "../../config.mjs";

const signup = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await userModel.create({ name, email, password: hashedPassword, phone });
        res.status(201).json(user);
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0]
            return res.status(400).json({
                message: `${field} already exists`
            })
        } else if (error.message.includes("validation")) {
            return res.status(400).json({ message: "Invalid data" });
        } else {
            return res.status(500).json({ message: error.message });
        }
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ id: user._id }, secret_key, { expiresIn: "1h" });
        res.setHeader('Authorization', `Bearer ${token}`);
        res.status(200).json({message: "Login successful"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { signup, login };
