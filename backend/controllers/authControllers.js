const User = require("../models/User");
const crypto = require('crypto')
const activationMailSender = require("../utils/emailSender")
const bcrypt = require('bcrypt')



const register = async (req, res) => {
    try{
        // ดึงข้อมูล
        const { username, password, email } = req.body;

        // เช็คว่าซ้ำไหม
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message : "มีผู้ใช้ชื่อนี้แล้ว"})

        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(400).json({message: "อีเมลนี้มีผู้ใช้ไปแล้ว"})

        // password hash
        const hashedPassword = await bcrypt.hash(password, 10);
        // create token
        const token = crypto.randomBytes(20).toString('hex')
        const tokenExpireAt = Date.now() + 24 * 60 * 60 * 1000

        const newUser = new User(
            { 
                username, 
                password: hashedPassword, 
                email, 
                activationToken: token,
                activationExpires: tokenExpireAt
            }
        );

        await newUser.save();

        await activationMailSender(email, token, username)

        res.status(201).json({ message: "สมัครสมาชิกสำเร็จ กรุณาตรวจสอบอีเมลของท่านภายใน 24 ชั่วโมง"})
    } catch (err) {
        res.status(500).json( {message: `สมัครสมาชิกไม่สำเร็จ เกิดข้อผิดพลาด: ${err}` })
    }
}

const resendActivationEmail = async (req, res) => {
    try{
        const { email } = req.body;
        
        // fetch data from database
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "ไม่พบอีเมลผู้ใช้"})
        if (user.isActive) return res.status(400).json({ message: "ไอดีของผู้ใช้เปิดใช้งานเรียบร้อยแล้วครับ"})

        const token = crypto.randomBytes(20).toString('hex')
        const tokenExpireAt = Date.now() + 24 * 60 * 60 * 1000
        user.activationToken = token;
        user.activationExpires = tokenExpireAt;

        await user.save();


        await activationMailSender(user.email, user.activationToken, user.username)

        res.status(200).json({ message: 'ทำการส่งลิงค์อีกรอบแล้ว'})
    
    } catch (err) {
        res.status(500).json({ message: "เกิดข้อผิดพลาดบางประการ"})
    }
}

const activation = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne(
            { 
                activationToken: token ,
                activationExpires: { $gt: Date.now() }
            }
        )
        
        if (!user) return res.status(400).json( { message: "ลิงค์ของคุณไม่ถูกต้อง หรือ หมดอายุแล้ว" } )

        user.isActive = true
        user.activationToken = undefined
        user.activationExpires = undefined
        await user.save()

        return res.status(200).json( { message: "ไอดีของคุณถูกเปิดใช้งานแล้ว ยินดีต้อนรับเข้าสู่สังคมเกมเมอร์"} )
    } catch (err) {
        return res.status(500).json( { message : "เกิดข้อผิดพลาดขึ้นบางประการ" } )
    }
};

module.exports = { register, resendActivationEmail, login, activation}