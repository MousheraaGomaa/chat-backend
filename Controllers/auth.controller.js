import { matchedData } from "express-validator";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../Models/user.model.js';
import { verifyEmailTemplate, resetPasswordTemplate } from "../Utils/htmlTemplates.js";
import sendEmailMessage from '../Services/sendEmail.js'

const register = async (req, res) => {

    try {
        const { name, email, password } = matchedData(req);
        const user = new User({ name, email, password });
        user.save().then((createdUser) => {
            sendVerificationEmail(req, res, createdUser._id, createdUser.email)
        }).catch(() => {
            res.status(503).json({ message: 'Registration failed,please try again later' })
        })

    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }

}
const login = (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'In-valid Email' })
        }
        else {
            const match = bcrypt.compare(password, user.password);
            if (!match) {
                res.status(400).json({ message: 'In-valid Email or Password' });
            }
            else {
                if (!user.confirmed) {
                    res.status(400).josn({ message: 'Please confirm your email,try again later' });
                }
                else {
                    const token = jwt.sign({ id: user._id, email: user.email }, process.env.TOKEN_SECRETKEY, { expiresIn: '24h' });
                    res.status(200).json({ message: 'Login Success', data: token });
                }
            }
        }

    } catch (err) {
        res.status(500).json({ message: 'Something Went Wrong' })
    }

}
const forgetPassword = async (red, res) => {
    try {
        const { email } = req.body
        if (!email) {
            res.status(400).json({ message: 'Email is required' });
        }
        else {
            const user = await User.findOne({ email });
            if (!user) {
                res.status(404).json({ message: 'User not found' });
            }
            else {
                const resetPasswordLink = `${req.protocol}://${req.get('host')}/auth/reset-password/${token}`;
                const htmlTemplate = resetPasswordTemplate(resetPasswordLink, 'Reset Password');
                sendEmail(req, res, user, 'Reset Your Password', htmlTemplate);
            }
        }
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}
const confirmEmail = async (req, res) => {

    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.TOKEN_SECRETKEY)
        if (!decoded) {
            res.status(400).json({ message: 'Invalid Token' });
        }
        else {
            const user = await User.findById(decoded.id);
            if (!user) {
                res.status(404).json({ message: 'Invalid User ID' });
            }
            else {
                user.confirmed = true;
                user = await user.save();
                res.status(200).json({ message: 'Email Confirmed Successfully!!,Please Log In' })
            }
        }
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}
const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne(email);
        if (!user) {
            res.status(404).json({ message: 'In-Valid User Email' });
        }
        else {
            if (user.confirmed) {
                res.status(409).json({ message: 'Email already confirmed,Please Login' })
            }
            else {
                const verifyEmailLink = `${req.protocol}://${req.get('host')}/auth/confirm-email/${token}`;
                const htmlTemplate = verifyEmailTemplate(verifyEmailLink);
                sendEmail(res, user, 'Verify Email Address', htmlTemplate)
            }
        }
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }

}
// const sendVerificationEmail = (req, res, id, email) => {
//     const token = jwt.sign(
//         {
//             id
//         },
//         process.env.TOKEN_SECRETKEY,
//         {
//             expiresIn: process.env.EXPIRESIN
//         });
//     const verifyEmailLink = `${req.protocol}://${req.get('host')}/auth/confirm-email/${token}`;
//     // const resendLink = `${req.protocol}://${req.get('host')}/api/v1/auth/resend-verification/${id}`;
//     const htmlTemplate = verifyEmailTemplate(verifyEmailLink);
//     sendEmailMessage(email, 'Verify Email Address', htmlTemplate)
//         .then((info) => {
//             res.status(200).json({ message: 'Email sent successfully! Please check your inbox to verify your email.' })
//         }).catch((err) => {
//             res.status(409).json({
//                 message: 'Failed to send verification email. Please try again.',
//                 error: err.message
//             });
//         });
// }
const sendEmail = (res, user, subject, template) => {
    const token = jwt.sign(
        {
            id: user._id
        },
        process.env.TOKEN_SECRETKEY,
        {
            expiresIn: process.env.EXPIRESIN
        });
    sendEmailMessage(user.email, subject, template)
        .then((info) => {
            res.status(200).json({ message: 'Email sent successfully! Please check your inbox.' })
        }).catch((err) => {
            res.status(409).json({
                message: 'Failed to send email. Please try again.',
            });
        });
}

export {
    login,
    register,
    confirmEmail,
    resendVerificationEmail
}
