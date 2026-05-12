const nodemailer = require('nodemailer');


// ฟังชั่นนี้จะทำการรับ mail, token, username มาเพื่อส่งเมลเพื่อ actication account เท่านั้น
const sendActivationEmail = async (userEmail, token, username) => {
    // สร้างตัวส่ง
    const tranporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    // สร้างลิงค์แนบโทเค่น
    const activationUrl = `http://localhost:3000/activate/${token}`

    //สร้าง body เมล
    const mailOption = {
        from: '"GAME FINDER" <noreply@gmail.com>',
        to: userEmail,
        subject: 'อีเมลเพื่อ activate accout',
        html: `
        <h1> สวัสดีครับคุณ ${username}!</h1>
        <p>ยินดีต้อนรับสู่สังคมเกมเมอร์ของเรา กรุณากดลิงค์ด้านล่างเพื่อยืนยันตัวตน:</p>
        <a href="${activationUrl}" style="background: blue; color: white; padding: 10px;">ยืนยันตัวตนที่นี่</a>
        `
    };

    // ส่งเมล
    return await tranporter.sendMail(mailOption);
}

module.exports = sendActivationEmail;