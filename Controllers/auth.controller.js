import { matchedData } from "express-validator";
import jwt from 'jsonwebtoken';
import User from '../Models/user.model.js';
import { verifyEmailTemplate } from "../Utils/htmlTemplates.js";
import sendEmailMessage from '../Services/sendEmail.js'

const register = async (req, res) => {

    try {
        const { name, email, password } = matchedData(req);
        const user = new User({ name, email, password });
        user.save().then((createdUser) => {

            const token = jwt.sign(
                {
                    id: createdUser._id
                },
                process.env.VERIFYEMAILSECRET,
                {
                    expiresIn: process.env.VERIFYEMAILEXPIRESIN
                });
            const verifyEmailLink = `${req.protocol}://${req.get('host')}/auth/confirmEmail/${token}`;
            const htmlTemplate = verifyEmailTemplate(verifyEmailLink);
            sendEmailMessage(createdUser.email, 'Verify Email Address', htmlTemplate)
                .then((info) => {
                    res.status(200).json({ message: 'Email sent successfully! Please check your inbox to verify your email.' })
                }).catch((err) => {
                    res.status(500).json({
                        message: 'The registration failed because the email was not valid. Please try again .',
                        error: err.message
                    });
                    // createdUser.remove()
                })

        }).catch(() => {
            res.status(500).json({ message: 'Registration failed,please try again later' })
        })

    } catch (err) {
        const message = err.message || 'Something went wrong';
        res.status(500).json({ message });
    }

}

export {
    register
}
