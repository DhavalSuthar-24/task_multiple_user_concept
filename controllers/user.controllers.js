import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import multer from "multer";

// Define storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profile_pics');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Initialize multer upload
const upload = multer({ storage: storage });

// Function to update user information
export const updateUser = async (req, res, next) => {
    const { userId } = req.params;
    const { email, username, password } = req.body;

    try {
        // Find the user by userId
        const user = await User.findById(userId);

        if (!user) {
            next(errorHandler(404, "User not found"));
            return;
        }

        // Update user fields
        if (email) user.email = email;
        if (username) user.username = username;
        if (password) {
            const hashedPassword = await bcryptjs.hash(password, 12);
            user.password = hashedPassword;
        }

        // Handle profile picture upload using Multer
        upload.single('profilepic')(req, res, async (err) => {
            if (err) {
                next(errorHandler(500, "Failed to upload profile picture"));
                return;
            }
            if (req.file) {
                // Save the file path in the user document
                user.profilepic = req.file.path;
            }

            // Save the updated user information
            const updatedUser = await user.save();

            res.status(200).json({ message: "User updated successfully", user: updatedUser });
        });
    } catch (error) {
        next(error);
    }
};

// Route for updating user information
// Assume this route is defined in your Express app

