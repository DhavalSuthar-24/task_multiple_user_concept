import User from "../models/user.model.js";


export const updateUser = async (req, res, next) => {
    const { userId } = req.params;
    const { email, username, password } = req.body;

    try {
  
        const user = await User.findById(userId);

        if (!user) {
            next(errorHandler(404, "User not found"));
            return;
        }


        const existingUser = await User.findOne({ email, username });
        if (existingUser && existingUser._id.toString() !== userId) {
            next(errorHandler(400, "An account with this email and username already exists"));
            return;
        }

        if (email) user.email = email;
        if (username) user.username = username;
        if (password) {
            const hashedPassword = await bcryptjs.hash(password, 12);
            user.password = hashedPassword;
        }

        const updatedUser = await user.save();

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        next(error);
    }
};