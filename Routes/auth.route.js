import express from 'express';
import {
    registerValidator,
    loginValidator, forgetPasswordValidator,
    resetPasswordByTokenValidator,
    resetPasswordByCodeValidator,
    confirmEmailByCodeValidator
}
    from '../Validators/auth.validator.js';
import {
    register, login,
    verifyEmailByToken, resendVerificationEmail,
    verifyEmailByCode, forgetPassword,
    resetPasswordByToken,
    resetPasswordByCode,
} from '../Controllers/auth.controller.js';
const authRouter = express.Router();


authRouter.post('/register', registerValidator, register);
authRouter.post('/login', loginValidator, login);
authRouter.get('/confirm-email/:token', verifyEmailByToken);
authRouter.post('/confirm-email', confirmEmailByCodeValidator, verifyEmailByCode);
authRouter.post('/resend-verification', resendVerificationEmail)
authRouter.post('/forget-password', forgetPasswordValidator, forgetPassword);
authRouter.post('/reset-password/:token', resetPasswordByTokenValidator, resetPasswordByToken);
authRouter.post('/reset-password', resetPasswordByCodeValidator, resetPasswordByCode);

export default authRouter
