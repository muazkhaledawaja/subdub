import mongoose from "mongoose"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 3
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";


export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser) {
            const error = new Error('User with this email already exists');
            error.status = 409;
            throw error;
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save the new user
        const newUsers = await User.create([{
            name,
            email,
            password: hashedPassword
        }], { session });

        const token = jwt.sign(
            { userId: newUsers[0]._id, email: newUsers[0].email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Respond with success 
        res.status(201).json({
            message: 'User registered successfully',
            userId: newUsers[0]._id,
            token
        });
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }

}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('Invalid email or password');
            error.status = 401;
            throw error;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error('Invalid email or password');
            error.status = 401;
            throw error;
        }
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );
        res.status(200).json({
            message: 'User signed in successfully',
            userId: user._id,
            token
        });
    } catch (error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {
    try {
        // Since JWT is stateless, sign-out can be handled on the client side by deleting the token.
        res.status(200).json({ message: 'User signed out successfully' });
    } catch (error) {
        next(error);
    }

}

