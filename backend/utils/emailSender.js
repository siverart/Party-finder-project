const nodemailer = require('nodemailer');


// ฟังชั่นนี้จะทำการรับ mail, token, username มาเพื่อส่งเมลเพื่อ actication account เท่านั้น
const sendActivationEmail = async (userEmail, token, username) => {
    // สร้างตัวส่ง
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    // สร้างลิงค์แนบโทเค่น
    const activationUrl = `http://localhost:5000/auth/activate/${token}`

    //สร้าง body เมล
    const mailOption = {
        from: '"GAME FINDER" <noreply@gmail.com>',
        to: userEmail,
        subject: 'อีเมลเพื่อ activate accout',
        html: `
            <div style="font-family: sans-serif; line-height: 1.6;">
                <h2>สวัสดีครับคุณ ${username}!</h2>
                <p>ขอบคุณที่สมัครสมาชิกกับเรา โปรดคลิกปุ่มด้านล่างเพื่อยืนยันตัวตน:</p>
                <a href="${activationUrl}" 
                   style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                   ยืนยันตัวตนที่นี่
                </a>
                <p>ลิงก์นี้จะหมดอายุภายใน 24 ชั่วโมงครับ</p>
            </div>
        `
    };

    // ส่งเมล
    return await transporter.sendMail(mailOption);
}

module.exports = sendActivationEmail;