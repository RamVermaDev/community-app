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
        const token = jwt.sign({ id: user._id }, secret_key, { expiresIn: "100h" });
        res.setHeader('Authorization', `Bearer ${token}`);
        res.status(200).json({ message: "Login successful", userName: user.name, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message, status: 'dificult' });
    }
}

const uploadProfileImage = async (req, res) => {
    try {
        const updateData = {};

        if (req.file) {
            updateData.profilePicture = req.file.path.replace(/\\/g, "/");
        }

        const user = await userModel.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true }
        ).select("-password");

        res.status(200).json({
            message: "Profile image updated successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

const updateProfile = async (req, res) => {
    try {
        const {
            name,
            phone,
            gender,
            maritalStatus,
            dob,
            occupation,
            bio,
            address
        } = req.body;

        const updateData = {};

        if (name !== undefined) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;
        if (gender !== undefined) updateData.gender = gender;
        if (maritalStatus !== undefined) updateData.maritalStatus = maritalStatus;
        if (dob !== undefined) updateData.dob = dob || null;
        if (occupation !== undefined) updateData.occupation = occupation;
        if (bio !== undefined) updateData.bio = bio;

        if (address !== undefined) {
            updateData.address = {
                street: address.street || null,
                city: address.city || null,
                state: address.state || null,
                zip: address.zip || null,
                country: address.country || null,
            };
        }

        const user = await userModel.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        res.status(200).json({
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                message: `${field} already exists`
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
};

export { signup, login, getProfile, uploadProfileImage, updateProfile };
