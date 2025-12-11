import User from "../models/user.model.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

export const getUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

