import { matchedData } from "express-validator";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../Models/user.model.js';
import { verifyEmailTemplate, resetPasswordTemplate } from "../Utils/htmlTemplates.js";
import sendEmailMessage from '../Services/sendEmail.js'
//test Done
const register = async (req, res) => {

    try {
        const { name, email, password } = matchedData(req);
        const confirmcode = generateCode();
        const expireDate = new Date(Date.now() + 5 * 60000);
        const user = new User({ name, email, password, confirmationCode: confirmcode, confirmExpire: expireDate });
        user.save()
            .then((createdUser) => {
                const token = jwt.sign({ id: createdUser._id }, process.env.TOKEN_SECRETKEY, { expiresIn: process.env.EXPIRESIN });
                const verifyEmailLink = `${req.protocol}://${req.get('host')}/auth/confirm-email/${token}`;
                const htmlTemplate = verifyEmailTemplate(verifyEmailLink, createdUser.name, confirmcode);
                sendEmail(res, createdUser, 'Verify Email Address', htmlTemplate);

            }).catch((err) => {
                res.status(503).json({
                    status: "Failed",
                    message: 'Registration failed,please try again later',
                })
            })

    } catch (err) {
        res.status(500).json({ status: "Failed", message: 'Something went wrong' });
    }

}
//test Done
const login = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ status: "Failed", message: 'In-valid Email' })
        }
        else {
            if (!user.confirmed) {
                res.status(400).json({ status: "Failed", message: 'Please confirm your email first,try again later' });
            }
            else {
                const match = bcrypt.compare(password, user.password);
                if (!match) {
                    res.status(400).json({ status: "Failed", message: 'In-valid Email or Password' });
                }
                else {
                    let expiresIn = '24h'
                    if (rememberMe) {
                        expiresIn = '7d'
                    }
                    const token = jwt.sign({ id: user._id, email: user.email }, process.env.TOKEN_SECRETKEY, { expiresIn });
                    res.status(201).json({ status: "Success", message: 'Login Success', data: token });

                }
            }
        }

    } catch (err) {
        res.status(500).json({ status: "Failed", message: 'Something Went Wrong' })
    }

}

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ status: "Failed", message: 'User not found' });

        let resetcode = generateCode();
        let expireDate = new Date(Date.now() + 5 * 60000);
        await User.findByIdAndUpdate(user._id, { resetPasswordCode: resetcode, resetExpire: expireDate });
        const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRETKEY, { expiresIn: process.env.EXPIRESIN });
        const resetPasswordLink = `${req.protocol}://${req.get('host')}/auth/reset-password/${token}`;
        const htmlTemplate = resetPasswordTemplate(resetPasswordLink, user.name, resetcode);
        sendEmail(res, user, 'Reset Your Password', htmlTemplate);

    } catch (err) {
        res.status(500).json({ status: "Failed", message: 'Something went wrong' })
    }
}
//test Done
const verifyEmailByToken = async (req, res) => {

    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.TOKEN_SECRETKEY)
        if (!decoded) {
            res.status(400).json({ status: "Failed", message: 'Invalid Token' });
        }
        else {
            const user = await User.findById(decoded.id);
            if (!user) {
                res.status(404).json({ status: "Failed", message: 'Invalid User ID' });
            }
            else {
                if (user.confirmed) {
                    res.status(400).json({ status: "Failed", message: 'Your Email Already Confirmed, Please Login.' })
                }
                else {
                    await User.findByIdAndUpdate(user._id, { confirmed: true, confirmationCode: '', confirmExpire: null });
                    res.status(200).json({ status: "Success", message: 'Email Confirmed Successfully!!,Please Log In' })
                }
            }
        }
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            res.status(400).json({ status: "Failed", message: 'Your token has expired, please request a new confirmation email' })
        }
        else {
            res.status(500).json({ status: "Failed", message: 'Something went wrong' });
        }
    }
}
//test  Done
const verifyEmailByCode = async (req, res) => {
    try {
        const { code, email } = req.body;
        if (!email)
            return res.status(400).json({ status: "Failed", message: 'Email is reqiured' });

        if (!code || code.length != 8)
            return res.status(400).json({ status: "Failed", message: 'The code must be eight digits long' })

        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).json({ status: "Failed", message: 'In-valid Email' });

        if (user.confirmationCode !== code)
            return res.status(400).json({ status: "Failed", message: 'In-valid Code' });

        if (Date.now() > user.confirmExpire)
            return res.status(400).json({ status: "Failed", message: 'Code is no longer valid' });

        await User.findByIdAndUpdate(user._id, { confirmed: true, confirmationCode: '', confirmExpire: null });
        res.status(200).json({ status: "Success", message: 'Your email has been confirmed successfully, please log in' })

    } catch (err) {
        res.status(500).json({ status: "Failed", message: 'Something went wrong' });
    }
}
//test Done
const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ status: "Failed", message: 'In-Valid User Email' });
        }
        else {
            if (user.confirmed) {
                res.status(400).json({ status: "Failed", message: 'Email already confirmed,Please Login' })
            }
            else {
                let confirmcode = generateCode();
                let expireDate = new Date(Date.now() + 5 * 60000);
                await User.findByIdAndUpdate(user._id, { confirmationCode: confirmcode, confirmExpire: expireDate });
                const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRETKEY, { expiresIn: process.env.EXPIRESIN });
                const verifyEmailLink = `${req.protocol}://${req.get('host')}/auth/confirm-email/${token}`;
                const htmlTemplate = verifyEmailTemplate(verifyEmailLink, user.name, confirmcode);
                sendEmail(res, user, 'Verify Email Address', htmlTemplate)
            }
        }
    } catch (err) {
        // res.status(500).json({ status:"Failed", message: 'Something went wrong' });
        res.status(500).json({ status: "Failed", message: 'Something went wrong', errors: err.message });
    }

}
const resetPasswordByToken = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const decode = jwt.verify(token, process.env.TOKEN_SECRETKEY);
        if (!decode)
            return res.json({ status: 'Failed', message: 'In-valid Token' });
        const user = await User.findByIdAndUpdate(decode.id, { password, resetPasswordCode: '', resetExpire: null });
        if (!user)
            return res.status(404).json({ status: 'Failed', message: 'User Not Found' });

        res.status(200).json({ status: 'Success', message: 'Password Updated Successfully!!' })

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            res.status(400).json({ status: "Failed", message: 'Your token has expired, please request a new confirmation email' })
        }
        else {
            res.status(500).json({ status: "Failed", message: 'Something went wrong' });
        }
    }
}

const resetPasswordByCode = async(req, res) => {

    try {
        const { email, password, code } = req.body;
        const user = await User.findOneAndUpdate(
            { email, resetPasswordCode: code, resetExpire: { $lt: Date.now() } },
            { password, resetPasswordCode: '', resetExpire: null },
            { new: true, runValidators: true }
        );
        if (!user)
            return res.status(400).json({ status: 'Failed', message: 'Update failed. Please request anthor code and reset password' });
        res.status(200).json({ status: 'Failed', message:'The password has been updated successfully. Please  log in.' });
    } catch (err) {
        res.status(500).json({ status: "Failed", message: 'Something went wrong' });
    }

}
const sendEmail = (res, user, subject, template) => {
    sendEmailMessage(user.email, subject, template)
        .then((info) => {
            res.status(200).json({
                status: "Success",
                message: 'Email sent successfully! Please check your inbox.'
            })
        }).catch((err) => {
            res.status(404).json({
                status: "Failed",
                message: 'Email failed to be sent ,may be wrong email.Please try again.',
            });
        });
}
const generateCode = () => {
    return Math.floor(Math.random() * 90000000 + 10000000).toString();
}


export {
    login,
    register,
    verifyEmailByCode,
    verifyEmailByToken,
    resendVerificationEmail,
    forgetPassword,
    resetPasswordByCode,
    resetPasswordByToken
}
