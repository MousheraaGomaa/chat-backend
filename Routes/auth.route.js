import  express from 'express';
import { registerValidator, loginValidator } from '../Validators/auth.validator.js';
import { register, login, confirmEmail }  from '../Controllers/auth.controller.js';
const authRouter = express.Router();


authRouter.post('/register', registerValidator, register );
authRouter.post('/login', loginValidator, login);
authRouter.get('/confirm-email:token', confirmEmail);
authRouter.post('/resend-verification')

export default authRouter
