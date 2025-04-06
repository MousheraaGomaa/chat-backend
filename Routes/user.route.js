import express from 'express'
import { auth } from '../MiddleWares/auth.middleware.js';
import { multerUploadAvatar } from '../Services/multer.js';
import { getAllUsers, updateProfile } from '../Controllers/user.controller.js';
import { updateProfileValidator } from '../Validators/user.validator.js';

const userRouter = express.Router();

userRouter.get('/', auth, getAllUsers );
userRouter.patch('/', auth, updateProfileValidator, multerUploadAvatar, updateProfile )


export default userRouter;