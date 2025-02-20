const {createTransport} = require("nodemailer");

const SendEmailUtility = async (EmailTo, OTPCode) => {
    let transporter = createTransport({
        host: 'mail.teamrabbil.com',
        port: 25,
        secure: false,
        auth: {
            user: "info@teamrabbil.com",
            pass: '~sR4[bhaC[Qs'
        },
        tls: {
            rejectUnauthorized: false
        },
    });

    let mailHTML = `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2 style="color: #333;">Task Manager OTP Verification</h2>
            <p>Hello,</p>
            <p>Use the following OTP to verify your email address:</p>
            <p style="font-size: 22px; font-weight: bold; color: #d32f2f; background: #f8d7da; padding: 10px; display: inline-block; border-radius: 5px;">
                ${OTPCode}
            </p>
            <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
            <p>If you did not request this, please ignore this email.</p>
            <p style="margin-top: 20px; font-size: 12px; color: #777;">© 2025 Task Manager. All Rights Reserved.</p>
        </div>
    `;

    let mailOptions = {
        from: 'Task Manager <info@teamrabbil.com>',
        to: EmailTo,
        subject: "Task Manager OTP Verification",
        html: mailHTML
    };

    return await transporter.sendMail(mailOptions);
};

module.exports = SendEmailUtility;
