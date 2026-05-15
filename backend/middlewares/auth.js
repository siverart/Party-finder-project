const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ','');

        if(!token) {
            return res.status(401).json({ message : "ไม่มีโทเค็น, การเข้าถึงถูกกปฏิเสธ"});
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);

        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ message: `โทเค็นไม่ถูกต้อง หรือ หมดอายุแล้ว ${err}`,
        errStack: `${err.Stack}` });

    }
}

module.exports = auth;