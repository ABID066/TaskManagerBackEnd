const nodemailer = require("nodemailer");

const SendEmailUtility = async (email, OTPCode) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "mdabid1152@gmail.com",
            pass: 'glil tckm omuw bvyy'
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
        from: 'Task Manager <mdabid1152@gmail.com>',
        to: email,
        subject: "Task Manager OTP Verification",
        html: mailHTML
    };

    return await transporter.sendMail(mailOptions);

};

module.exports = SendEmailUtility;
