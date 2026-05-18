const User = require("../models/User")
const bcrypt = require('bcrypt')



const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้"})

        return res.status(200).json({ user });
    } catch (err) {
        return res.status(500).json({ message : `เกิดข้อผิดพลาด ${err.message}`})
    }
}


const updateDisplayNameAndDescription = async (req, res) => {
    try {
        const { description, displayName } = req.body

        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้"});

        if (displayName !== undefined && displayName.trim().length > 0) user.displayName = displayName.trim()
        if (description !== undefined) user.description = description.trim();

        await user.save();
        return res.status(200).json({
            message: "อัพเดทข้อมูลสำเร็จ",
            user: { 
                displayName: user.displayName,
                description: user.description
            }
        });
    } catch (err) {
        res.status(500).json( {message: `สมัครสมาชิกไม่สำเร็จ เกิดข้อผิดพลาด: ${err.message}, stack: ${err.stack}` })
    }
};


const addContact = async (req, res) => {
    try {
        const { platform, value, isShare = false } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้"});

        if (value == undefined) return res.status(400).json({ message : "กรุณากรอกรายละเอียดช่องทางติดต่อด้วย"})

        
        user.contacts.push({ 
            "platform" : platform,
            "value" : value,
            "isShare": isShare
        })
        await user.save();
        return res.status(200).json({ 
            message : "เพิ่มช่องทางการติดต่อเสร็จสิ้น",
            contacts : user.contacts
        })

    } catch (err) {
        return res.status(500).json({ message : `เกิดข้อผิดพลาด ${err.message}`})
    }
    
}
const deleteContact = async (req, res) => {
    try {
        const { contactId } = req.params ;
        const updatedUser = await User.findByIdAndUpdate(req.user.id, {
            $pull: { contacts: { _id: contactId } }
        }, { new: true });

        return res.status(200).json({ 
            message : "ลบช่องทางติดต่อสำเร็จ",
            contacts : updatedUser.contacts
        })
    } catch (err) {
        return res.status(500).json({ message : `เกิดข้อผิดพลาด ${err.message}` })
    }
}

const addTag = async (req, res) => {
    try {
        
        const { tag } = req.body;
        //ตรวจสอบว่าเเป็นสตริงไหม แล้วห้ามว่างเปล่า
        if (tag == undefined || typeof tag !== 'string') {
            return res.status(400).json({ message: "รูปแบบแท็กไม่ถูกต้อง ต้องเป็นข้อความเท่านั้น" });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้"});

        user.tags.push(tag)
        await user.save();

        return res.status(200).json({ 
            message : "บันทึก tag เรียบร้อย",
            tags : user.tags
        })
        
    } catch (err) {
        return res.status(500).json({ message : `เกิดข้อผิดพลาด ${err.message}` })
    }
}

const deleteTag = async (req, res) => {
    try { 
            const { tag } = req.body;
            if (!tag) {
                return res.status(400).json({ message: "กรุณาระบุชื่อแท็กที่ต้องการลบ" });
            }

            const updatedUser = await User.findByIdAndUpdate(req.user.id, {
                $pull: { tags: tag }
            }, { new: true })

            return res.status(200).json({ 
                message : `ลบ tag ${tag} ออกเรียบร้อย`,
                tags : updatedUser.tags
            })
    } catch (err) {
        return res.status(500).json({ message : `เกิดข้อผิดพลาด ${err.message}` })
    }
}

const resetPasswordInProfile = async (req, res) => {
    try {
        
        const { oldPassword, newPassword } = req.body;
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: "กรุณากรอกรหัสผ่านใหม่ และต้องมีความยาวอย่างน้อย 6 ตัวอักษร" });
        }

    
        const user = await User.findById(req.user.id);
        if(!user) return res.status(404).json({ message: "ไม่พบผู้ใช้"})
        
        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password)

        if(!isPasswordCorrect) return res.status(400).json({ message : "รหัสผ่านเดิมไม่ถูกต้อง"})

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save();
        return res.status(200).json({ message : "เปลี่ยนรหัสผ่านเสร็จสิ้น"})
    } catch (err) {
        return res.status(500).json({ message : `เกิดข้อผิดพลาด ${err.message}`})
    }
}
module.exports = {getProfile , updateDisplayNameAndDescription, addContact, deleteContact, addTag, deleteTag, resetPasswordInProfile }