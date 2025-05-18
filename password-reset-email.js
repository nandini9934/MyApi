const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Send a password reset email with a reset link.
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} name - Recipient name
 * @param {string} resetToken - The password reset token
 */
function sendEmail(to, subject, name, resetToken) {
    // Placeholder frontend link for password reset
    const resetLink = `https://your-frontend.com/reset-password?token=${resetToken}`;
    const message = `
Hi ${name},

We received a request to reset your password.
Please click the link below to reset your password:

${resetLink}

If you did not request this, please ignore this email.
`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent successfully:', info.response);
        }
    });
}

module.exports = sendEmail;