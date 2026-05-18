const User = require("../models/User")

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
module.exports = { updateDisplayNameAndDescription, addContact, deleteContact }