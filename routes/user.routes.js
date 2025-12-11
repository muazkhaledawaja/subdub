import { Router } from "express";
import { getAllUsers ,getUserById } from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get('/',authorize,getAllUsers);
userRouter.get('/:id',authorize,getUserById);

export default userRouter;