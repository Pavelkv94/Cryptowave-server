
const nodeMailer = require("nodemailer");

class MailService {

    constructor() {
        this.transporter = nodeMailer.createTransport({
            service: 'gmail',
            host: process.env.SMTP_HOST,
            port:process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,

            }
        })
    }
    async sendActivationMAil(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Account activation at ' + process.env.API_URL,
            text: "",
            html: `
            <div style="background-color: #fff; border-radius: 8px; padding: 20px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #333;">Account Activation</h1>
            <p style="color: #666;">Welcome to our platform! To start using your account, please activate it by clicking the link below:</p>
            <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Activate Now</a>
            <p style="color: #666; margin-top: 20px;">If you didn't request this activation, you can ignore this email.</p>
            <p style="color: #666;">Thank you,<br> The Team</p>
        </div>
            
            `
        })

    }
}

module.exports = new MailService();