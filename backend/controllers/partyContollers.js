const User = require("../models/User")
const Party = require("../models/Party")


const getAllRoom = async (req, res) => {
    try {
        const allRoom = await Party.find( { roomStatus: 'waiting', 'full' } )
        .populate('host', 'displayName rating')
        .populate('members', 'displayName')
        .sort({ createdAt: -1 });


        res.status(200).json({
            success: true,
            count: allRoom.length,
            data: allRoom
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "ไม่สามารถดึงห้องจากระบบได้"
        })
    }
}

const getSingleRoom = async (req, res) => {
    const { roomId } = req.params;
    if (!roomId) return res.status(400).json({ message: "กรุณากรอก id ห้องที่ต้องการ"});

    try {
        const wantedRoom = await Party.findById(roomId)
        .populate('host', 'displayName rating')
        .populate('members', 'displayName');

        if (!wantedRoom) return res.status(404).json({ message: "ไม่พบห้อง"});

        return res.status(200).json( {
            success: true,
            data: wantedRoom
         } )
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: "เกิดข้อผิดพลาดในการดึงข้อมูลห้อง"
        })
    }
}

const createRoom = async (req, res) => {
    try{
        const hostId = req.user.id
        const { 
                roomName, 
                description, 
                gameName,
                rank,
                server,
                hasMic,
                language,
                minRating,
                maxPlayer,
                playTime
            } = req.body;
        newRoom = new Party({
                roomName: roomName,
                description: description,
                host: hostId,
                gameName: gameName,
                rankRequirement: rank,
                server: server,
                hasMic: hasMic,
                language: language,
                minRating: minRating,
                maxPlayer: maxPlayer,
                playTime: playTime,
                members: [hostId],
                roomStatus: 'waiting'
        }); 
        const savedRoom = await newRoom.save();

        res.status(201).json({
                success: true,
                message: "สร้างห้องสำเร็จแล้ว!",
                data: savedRoom
        })

    } catch (error) {
        console.error("Create Room Error:", error);
        res.status(500).json({
            success: false,
            message: "เกิดข้อผิดพลาดในการสร้างห้อง",
            error: error.message // เอาไว้ดูตอนติด validation เผื่อส่งฟิลด์ไหนผิดกฎ Schema ครับ
        });
    }
}

const deleteRoom = async (req, res) => {

}

const findRoom = async (req, res) => {

}
 
const getOtherProfile = async (req, res) => {

}

module.exports = { getAllRoom, getSingleRoom, createRoom, deleteRoom, findRoom, getOtherProfile}