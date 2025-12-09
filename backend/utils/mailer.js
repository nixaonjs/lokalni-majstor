const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT),
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    },
    secure: false,
});

async function sendTestMail(to, subject, html) {
    const info = await transporter.sendMail({ from: 'dev@example.com', to, subject, html });
    console.log('Mailtrap message ID:', info.messageId);
    return info;
}


module.exports = { transporter, sendTestMail };
module.exports = transporter;