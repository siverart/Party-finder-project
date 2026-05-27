const User = require("../models/User")
const Party = require("../models/Party")


const getAllRoom = async (req, res) => {
    try {
        const allRoom = await Party.find( { roomStatus: 'waiting', 'full' } )
        .populate('host', 'displayName rating')
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
    const { roomId } = req.params;
    if (!roomId) return res.status(400).json({success: false, message : "กรุณาระบุไอดีห้องที่ต้องการลบด้วย"});
    try {
        const room = await Party.finById(roomId)
        if (!room) return res.status(404).json({success: false, message: "ไม่พบห้อง"})
        if (room.host.toString() !== req.user.id) return res.status(403).json({success: false, message : "คุณไม่มีสิทธิ์ลบห้องนี้"})
        
        await Party.findByIdAndDelete(roomId)

        res.status(200).json({
            success: true,
            message: "ลบห้องสำเร็จ",
            deletedRoomId: roomId
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการลบห้อง" });
    }
}


const findRoom = async (req, res) => {
    try {
        const { gameName, rank, server, hasMic, language, playTimeStart } = req.body;
        const user = await User.findById(req.user.id)

        let queryConditions = {};

        if (gameName) { 
            queryConditions.gameName = gameName;
        }

        if (rank) {
            queryConditions.rankRequirement = {
                $gte: rank - 2,
                $lte: rank - 1
            }
        }

        if (server) {
            queryConditions.server = server;
        }

        if (hasMic !== undefined) {
            queryConditions.hasMic = hasMic
        }

        if (language) {
            queryConditions.language = { $in: [language] };
        }

        if (playTimeStart) {
            queryConditions['playTime.end'] = { $gte : new Date(playTimeStart)};
        }

        queryConditions.roomStatus = 'waiting';

        const matchedRoom = await Party.find(queryConditions.populate('host', 'displayName rating'.populate('members', 'displayName')));
        if (!matchedRoom) return res.status(404).json({ success: false, message: "ไม่พบห้องที่ตรงตามเงื่อนไข"})

        res.status(200).json({ success: true, count: matchedRoom.length, data: matchedRoom});
    } catch (error) {
        res.status(500).json({ message: "ระบบ Matchmaking ขัดข้อง" });
    }
}
 
const getOtherProfile = async (req, res) => {
    try{
        const { targetUserId } = req.params;
        const targetUser = await User.findById(targetUserId).select('displayName description tags contacts rating');;
        if (!targetUser) return res.status(404).json({ success: false, message: "ไม่พบผู้ใช้ที่ต้องการ"});

        const targetUserObj = targetUser.toObject();

        if ( targetUserId !== req.user.id ) {

            targetUserObj.contacts = targetUserObj.contacts.map(contact => {
                if (contact.isShare === false) {
                    return {
                        ...contact,
                        value: "private"
                    };
                }
                return contact;
            });
        }
        
        res.status(200).json({
            success: true,
            data: userObj
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการดึงโปรไฟล์" });
    }
};

module.exports = { getAllRoom, getSingleRoom, createRoom, deleteRoom, findRoom, getOtherProfile}