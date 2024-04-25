import User from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js";
import  jwt  from "jsonwebtoken";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;


    if (!username || !email || !password || email === "" || password === "" || username === "") {
        next(errorHandler(400, "All fields are required"));
        return;
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;

    if (!passwordRegex.test(password)) {
        next(errorHandler(400, "Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, one special character, and be at least 8 characters long"));
        return;
    }

    try {

        const existingUser = await User.findOne({ email, username });

        if (existingUser) {
            next(errorHandler(400, "An account with this email and username already exists"));
            return;
        }

      
        const userWithSamePassword = await User.findOne({ email });
        if (userWithSamePassword && bcryptjs.compareSync(password, userWithSamePassword.password)) {
            next(errorHandler(400, "An account with this email and password already exists"));
            return;
        }

        // Create a new user
        const hashedPassword = await bcryptjs.hash(password, 12);
        const newUser = new User({ username, email, password: hashedPassword });
        const user = await newUser.save();

        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        next(error);
    }
};



export const signin = async (req, res, next) => {
    const { email, username, password } = req.body;

    if ((!email && !username) || !password || (email === "" && username === "") || password === "") {
        next(errorHandler(400, "All fields are required"));
        return;
    }

    try {
        let validUsers;
        if (email) {
            validUsers = await User.find({ email });
        } else {
            validUsers = await User.find({ username });
        }

        if (!validUsers || validUsers.length === 0) {
            next(errorHandler(404, "User not found"));
            return;
        }

        let validUser;
        for (const user of validUsers) {
            const isMatch = await bcryptjs.compareSync(password, user.password);
            if (isMatch) {
                validUser = user;
                break;
            }
        }

        if (!validUser) {
            next(errorHandler(401, "Invalid password"));
            return;
        }

        const token = jwt.sign({ _id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET || 'leo7');
        const { password: pass, ...rest } = validUser._doc;

        res.status(200).cookie('access_token', token, {
            httpOnly: true
        }).json(rest);
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        // Clear the access token cookie by setting its value to an empty string and setting its expiry to a past date
        res.clearCookie('access_token').status(200).json({ message: "Logout successful" });
    } catch (error) {
        next(error);
    }
};