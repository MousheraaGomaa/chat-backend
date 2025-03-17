import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.CHAT_APP_EMAIL,
        pass: process.env.CHAT_APP_PASSWORD
    }
});

async function sendEmailMessage(userEmail, subject, htmlTemplate) {
    try {
        const options = {
            from: `'Aura 🌌 '<${process.env.CHAT_APP_EMAIL}>`,
            to: userEmail,
            subject: subject,
            html: htmlTemplate
        }
        const info = await transport.sendMail(options);
        return info;
    } catch (err) {
        throw new Error(err.message)
    }
}




export default sendEmailMessage;