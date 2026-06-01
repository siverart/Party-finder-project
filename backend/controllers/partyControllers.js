const User = require("../models/User")
const Party = require("../models/Party")


const getAllRoom = async (req, res) => {
    try {
        const allRoom = await Party.find( { roomStatus: { $in : ['waiting', 'full'] } } )
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
        const hostId = req.user.id;
        
        // 🎯 1. เช็คก่อนว่า โฮสต์คนนี้มีห้องที่ยังใช้งานอยู่ ('waiting' หรือ 'full') ในระบบแล้วหรือยัง
        const existingRoom = await Party.findOne({
            host: hostId,
            roomStatus: { $in: ['waiting', 'full'] }
        });

        // ถ้าเจอห้องเก่าที่ยังเปิดอยู่ ส่งสเตตัส 400 ตีกลับทันที ห้ามสร้างซ้ำ!
        if (existingRoom) {
            return res.status(400).json({
                success: false,
                message: "คุณมีห้องที่กำลังใช้งานอยู่ในระบบแล้ว ไม่สามารถสร้างห้องซ้ำได้"
            });
        }
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
                languages: language,
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

const updateRoom = async (req, res) => {

    const { roomId } = req.params
    if (!roomId) return res.status(400).json({ success: false, message: "กรุณาระบุไอดีห้องมาด้วย"})

    const hostId = req.user.id;
     
    
    try {
        const room = await Party.findById(roomId)
        if (!room) return res.status(404).json( {success: false, message: "ไม่พบห้อง"})

        if (hostId !== room.host.toString()) return res.status(403).json({ success: false, message:"คุณไม่มีสิทธิ์แก้ไขห้องนี้"})

        const { roomName, description, gameName, rank, server, hasMic, languages, maxPlayer, rating } = req.body;
        
        let updateData = {}

        if (roomName) {
            updateData.roomName = roomName
        }
        if (description) {
            updateData.description = description
        }
        if (gameName) {
            updateData.gameName = gameName
        }
        if (rank) {
            updateData.rankRequirement = rank
        }
        if (server) {
            updateData.server = server
        }
        if (hasMic !== undefined) {
            updateData.hasMic = hasMic
        }
        if (languages) {
            updateData.languages = languages
        }
        if (maxPlayer) {
            updateData.maxPlayer = maxPlayer
        }
        if (rating) {
            updateData.minRating = rating
        }

        Object.assign(room, updateData);

        const updatedRoom = await room.save();

        await updatedRoom.populate('host', 'displayName rating');
        await updatedRoom.populate('members', 'displayName');

        return res.status(200).json({
            success: true,
            message: "แก้ไขข้อมูลห้องสำเร็จแล้ว!!",
            data: updatedRoom
        });
    } catch (error) {
        console.error("Update Room Error:", error);
        res.status(500).json({
            success: false,
            message: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล",
            error: error.message // เอาไว้ดูตอนติด validation เผื่อส่งฟิลด์ไหนผิดกฎ Schema ครับ
        });

    }
}
const kickPlayer = async (req, res) => {
    const { roomId } = req.params;
    if (!roomId ) return res.status(400).json({ success: false, message: "กรุณาระบุไอดีห้องด้วย" });

    const { playerId } = req.body;
    if (!playerId ) return res.status(400).json({ success: false, message: "กรุณาระบุไอดีคนที่ต้องการไล่ออกจากห้อง" });
    

    const hostId = req.user.id;

    try {
        const room = await Party.findById(roomId)
        if (!room) return res.status(404).json({ success: false, message: "ไม่พบห้อง"})
        // เช็คสิทธิ์โฮสต์
        if (room.host.toString() !== hostId ) return res.status(403).json({ success: false, message: "คุณไม่มีสิทธิ์ไล่ใครออกจากห้องนี้" });
        // ป้องกันการเตะตัวเอง
        if (playerId === hostId) {
            return res.status(400).json({ success: false, message: "คุณไม่สามารถเตะตัวเองออกจากห้องได้ หากต้องการปิดห้องกรุณากดปุ่มยกเลิกห้องแทน" });
        }
        // 🚀 สั่งดึงไอดีออกจาก members
        const updatedRoom = await Party.findByIdAndUpdate(
            roomId,
            { $pull: { members: playerId } },
            { new: true }
        ).populate('host', 'displayName rating').populate('members', 'displayName');

        if (!updatedRoom) return res.status(404).json({ success: false, message: "อัปเดตห้องไม่สำเร็จ" });

        // 🔄 ระบบออโต้: ถ้าห้องเคยเต็มอยู่ พอมีที่ว่างให้เปิดสเตตัสกลับมาเป็น waiting
        if (updatedRoom.roomStatus === 'full' && updatedRoom.members.length < updatedRoom.maxPlayer) {
            updatedRoom.roomStatus = 'waiting';
            await updatedRoom.save();
        }

        return res.status(200).json({
            success: true,
            message: "เตะผู้เล่นออกจากห้องสำเร็จแล้ว",
            data: updatedRoom
        });

    } catch (error) {
        console.error("Kick player Error:", error);
        res.status(500).json({
            success: false,
            message: "เกิดข้อผิดพลาดในการไล่คนออกจากห้อง",
            error: error.message // เอาไว้ดูตอนติด validation เผื่อส่งฟิลด์ไหนผิดกฎ Schema ครับ
            });
        }
}

const completeRoom = async (req, res) => {
    const { roomId } = req.params;
    if (!roomId) return res.status(400).json({ success: false, message: "กรุณาระบุไอดีห้อง" });

    try {
        const room = await Party.findById(roomId);
        if (!room) return res.status(404).json({ success: false, message: "ไม่พบห้อง" });

        // มีแค่โฮสต์เท่านั้นที่มีสิทธิ์กดจบห้อง
        if (room.host.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "คุณไม่มีสิทธิ์กดจบการเล่นในห้องนี้" });
        }

        // 🎯 เปลี่ยนสเตตัสเป็น complete
        room.roomStatus = 'complete';
        await room.save();

        res.status(200).json({
            success: true,
            message: "จบการเล่นและปิดห้องปาร์ตี้สำเร็จ!",
            data: room
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการปิดห้อง" });
    }
}



const findRoom = async (req, res) => {
    try {
        const { gameName, rank, server, hasMic, language, playTimeStart } = req.body;
        const user = await User.findById(req.user.id)

        let queryConditions = {};

        if (user && user.rating) {
            // สมมติว่าต้องการเอา score (เช่น 100) มาใช้เทียบ
            const userScore = user.rating.score || 0; 
            
            queryConditions.minRating = { 
                $lte: userScore // 🎯 ตอนนี้จะเป็นตัวเลขเดี่ยว ๆ เช่น { $lte: 100 } แล้ว ไม่พังแน่นอน!
            };
        }

        if (gameName) { 
            queryConditions.gameName = gameName;
        }

        if (rank) {
            queryConditions.rankRequirement = {
                $gte: rank - 2,
                $lte: rank + 2
            }
        }

        if (server) {
            queryConditions.server = server;
        }

        if (hasMic !== undefined) {
            queryConditions.hasMic = hasMic
        }

        if (language) {
            queryConditions.languages = { $in: language };
        }

        if (playTimeStart) {
            queryConditions['playTime.end'] = { $gte : new Date(playTimeStart)};
        }

        queryConditions.roomStatus = 'waiting';

        const matchedRoom = await Party.find(queryConditions)
        .populate('host', 'displayName rating')
        .populate('members', 'displayName');

        if (!matchedRoom) return res.status(404).json({ success: false, message: "ไม่พบห้องที่ตรงตามเงื่อนไข"})

        res.status(200).json({ success: true, count: matchedRoom.length, data: matchedRoom});
    } catch (error) {
        console.error("❌ Matchmaking Error Details:", error); // 🌟 บรรทัดนี้จะช่วยชีวิตเรา! มันจะฟ้องเลยว่าบรรทัดไหนพัง
        res.status(500).json({ message: "ระบบ Matchmaking ขัดข้อง" });
    }
}
 
const getOtherProfile = async (req, res) => {
    try{
        const { findedId } = req.params;
        const targetUser = await User.findById(findedId).select('displayName description tags contacts rating');;
        if (!targetUser) return res.status(404).json({ success: false, message: "ไม่พบผู้ใช้ที่ต้องการ"});

        const targetUserObj = targetUser.toObject();

        if ( findedId !== req.user.id ) {

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
            data: targetUserObj
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการดึงโปรไฟล์" });
    }
};

const joinRoom = async (req, res) => {
    const { roomId } = req.params;
    const playerId = req.user.id;

    try {
        // 🛡️ 1. เช็คฝั่ง User ก่อนว่าตัวเองว่างไหม
        const user = await User.findById(playerId);
        if (user.currentRoom) {
            return res.status(400).json({ success: false, message: "คุณอยู่ในปาร์ตี้อื่นแล้ว กรุณาออกจากห้องเดิมก่อน" });
        }

        // 🛡️ 2. เช็คฝั่งห้องปาร์ตี้
        const room = await Party.findById(roomId);
        if (!room) return res.status(404).json({ success: false, message: "ไม่พบห้องนี้" });
        if (room.roomStatus !== 'waiting') return res.status(400).json({ success: false, message: "ห้องนี้ไม่พร้อมใช้งานหรือเต็มแล้ว" });
        if (room.members.length >= room.maxPlayer) return res.status(400).json({ success: false, message: "ห้องเต็มแล้ว" });

        // 🚀 3. อัปเดตพร้อมกันทั้ง 2 ฝั่ง
        // ฝั่งห้อง: ดันไอดีผู้เล่นเข้าอาร์เรย์ members
        room.members.push(playerId);
        
        // ถ้าคนจอยทำให้ห้องเต็มพอดี ปรับสเตตัสเป็น full อัตโนมัติ
        if (room.members.length === room.maxPlayer) {
            room.roomStatus = 'full';
        }
        await room.save();

        // ฝั่งคนเล่น: ผูกไอดีห้องเข้าที่ตัว
        user.currentRoom = roomId;
        await user.save();

        return res.status(200).json({ success: true, message: "เข้าสู่ห้องสำเร็จ", data: room });

    } catch (error) {
        res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการเข้าห้อง" });
    }
}

const leaveRoom = async (req, res) => {
    const { roomId } = req.params;
    const playerId = req.user.id;

    try {
        const room = await Party.findById(roomId);
        if (!room) return res.status(404).json({ success: false, message: "ไม่พบห้อง" });

        //ดึงสมาชิกออกจากห้องก่อนไม่ว่าจะเป็นโฮสต์หรือสมาชิก
        room.members = room.members.filter(memberId => memberId.toString() !== playerId);

        //กรณีที่โฮสต์กดออก
        if (room.host.toString() === playerId) {
            //มีสมาชิกเหลืออยู่
            if (room.members.length > 0) {
                room.host = room.members[0];
                room.roomStatus = 'waiting';
            }
            //กรณีที่ไม่มีสมาชิกเหลืออยู่
            else {
                    room.roomStatus = 'cancel';
            }
        } 
            //กรณีที่สมาชิกทั่วไปกดออก
        else {
                if (room.roomStatus === 'full') {
                    room.roomStatus = 'waiting';
            }
        }

        const updatedRoom = await room.save();

        await User.findByIdAndUpdate(playerId, { currentRoom: null });

        await updatedRoom.populate('host', 'displayName rating');
        await updatedRoom.populate('members', 'displayName');

        return res.status(200).json({
            success: true,
            message: "ออกจากห้องสำเร็จแล้ว",
            data: updatedRoom
        });
    
    } catch (error) {
        console.error("Leave Room Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "เกิดข้อผิดพลาดในการออกจากห้อง" });
    }
}
module.exports = { getAllRoom, getSingleRoom, createRoom, updateRoom, kickPlayer, completeRoom, findRoom, getOtherProfile, joinRoom, leaveRoom }