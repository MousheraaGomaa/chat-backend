import nodemailer from 'nodemailer'


function sendEmailMessage(userEmail, subject, htmlContent) {
    try {
        const options = {
            from: `'Aura 🌌 '<${process.env.CHAT_APP_EMAIL}>`,
            to: userEmail,
            subject: subject,
            html: htmlContent
        }
        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.CHAT_APP_EMAIL,
                pass: process.env.CHAT_APP_PASSWORD
            }
        });
        return transport.sendMail(options);
    } catch (err) {
       return  Promise.reject(err.message)
    }
}
export default sendEmailMessage;