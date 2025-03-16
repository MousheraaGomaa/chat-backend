import  express from 'express';
import { registerValidator } from '../Validators/auth.validator.js';
import { register }  from '../Controllers/auth.controller.js';
const authRouter = express.Router();


authRouter.post('/register', registerValidator, register );



export default authRouter
