import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom';
import '../button.css';

const Room = () => {
    // 🕵️‍♂️ ดึง roomId จาก URL ออกมาโชว์เพื่อความชัวร์ว่าส่งมาถูกอันไหม
    const { roomId } = useParams(); 
    const navigate = useNavigate();


    const [ room, setRoom ] = useState(null)
    const [ isProfileModalOpen, setIsProfileModalOpen ] = useState(false)
    const [ selectedProfile, setSelectedProfile ] = useState(null)
    const [ isUpdateRoomModalOpen, setIsUpdateRoomModalOpen ] = useState(false)

    const myUserId = localStorage.getItem('myUserId');
    const isHost = room?.host?._id === myUserId

    useEffect (() => {
        const token = localStorage.getItem('token')
        if (!token) {
            alert("กรุณาเข้าสู่ระบบก่อนใช้งาน");
            navigate('/login');

        }   
        const fetchAndCheckStatus = async () => {
            console.log(`⏱️ [${new Date().toLocaleTimeString()}] กำลังยิงเช็กสถานะห้อง...`)

            try {
                const response = await axios.get(`http://localhost:5000/api/party/get-single-room/${roomId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
    
                if (response.data.success) {
                    
                    const currentRoom = response.data.data;
                    console.log("📦 ข้อมูลดิบจาก Express:", response.data.data)
                    const stillInRoom = currentRoom.members?.some(m => m._id === myUserId);
                    const isHostNow = currentRoom.host?._id === myUserId;
    
                    if (!stillInRoom && !isHostNow) {
                        alert("คุณถูกเชิญออกจากห้องปาร์ตี้ หรือห้องนี้ได้ปิดตัวลงแล้ว");
                        clearInterval(checkStatus);
                        navigate('/lobby'); //
                    } else {
                        setRoom(currentRoom); // 🌟 ยิงมาปุ๊บ ข้อมูลห้องก็อัปเดตลงหน้าจอทันที!
                    }
                } 
            } catch (error) {
                console.error("Error polling room status", error);

                if (error.response && error.response.status === 401) {
                    alert("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
                    localStorage.removeItem('token');    
                    localStorage.removeItem('username');
                    localStorage.removeItem('myUserId'); 
                    navigate('/login');
                }
            }
        };
        // 🎯 2. "ลั่นไกครั้งแรกทันที" (วินาทีที่ 0 ที่เพิ่งเข้ามาหน้าห้อง)
        // ยูสเซอร์จะได้ไม่ต้องนั่งรอ 3 วินาทีแรก
        fetchAndCheckStatus();

        // 🎯 3. ส่งหน้าที่ต่อให้ setInterval ยิงซ้ำให้ทุกๆ 3 วินาทีหลังจากนั้น
        const checkStatus = setInterval(fetchAndCheckStatus, 3000);
        
        // ตรงนี้จะทำงานก็ต่อเมื่อ user ออกจากหน้านี้แล้วหน้านี้กำลังจะปิดตัวลง
        return () => {
            clearInterval(checkStatus); // สั่งหยุด loop 3 วิ
            
            const autoLeaveRoom = async() => {
                try {
                    await axios.post(`http://localhost:5000/api/party/leave-room/${roomId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    console.log("🧹 ระบบทำความสะอาด: สั่งอัปเดตใน DB เรียบร้อยหลังย้ายหน้าหนี")
                } catch (err) {
                    console.error("ไม่สามารถเคลียร์ห้องออโต้ได้", err);
                }
            };
            
            if (roomId) {
                autoLeaveRoom();
            }
        }
    }, [roomId]);

   
    const handleGetOtherProfile = async(findedId) => {
        const token = localStorage.getItem('token');
        const config = {
            headers : {
                Authorization : `Bearer ${token}`
            }
        }
        try {
            const response = await axios.get(`http://localhost:5000/api/party/get-other-profile/${findedId}`, config);
            
            const { data } = response.data
            setSelectedProfile(data)
            isProfileModalOpen(true)

        } catch (error) {
            console.error("Get Profile Error", error)
        }
    }

    const handleCompleteRoom = async() => {
        const token = localStorage.getItem('token');
        const config = {
            headers : {
                Authorization : `Bearer ${token}`
            }
        }
        
        try {
            const response = await axios.put(`http://localhost:5000/api/party/complete-room/${roomId}`, config);
            
            const { message } = response.data
            alert(message)
            navigate('/lobby')

        } catch (error) {
            console.error("Get Profile Error", error)
        }
    }
    const handleUpdateRoom = async(e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = {
            headers : {
                Authorization : `Bearer ${token}`
            }
        }
        const body = {
            roomName: room.roomName,
            description: room.description,
            gameName: room.gameName,
            rank: room.rank,
            server: room.server,
            languages: room.languages,
            hasMic: room.hasMic,
            maxPlayer: room.maxPlayer,
            rating: room.rating,
            playTime: {
                start : room.playTime?.start,
                end: room.playTime?.end
            }

        }
        try {
            const response = await axios.patch(`http://localhost:5000/api/party/update-room/${roomId}`, body, config)
            const { message } = response.data
            alert(message)
        } catch (error) {
            console.error("Update Room Error", error)
        }
    }
    const handleKickPlayer = async( playerId, playerName) => {
        const confirmKick = window.confirm(`คุณแน่ใจใช่ไหมว่าจะเตะคุณ [ ${playerName} ] ออกจากปาร์ตี้ ?`)
        if (confirmKick) {
            const token = localStorage.getItem('token');
            const config = {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            }
    
            try {
                const response = await axios.post(`http://localhost:5000/api/party/kick-room/${roomId}/${playerId}`, config)
                if (response.data.success) {
                    alert(response.data.message)
                }
            } catch (error) {
                console.error("Kick Player Error", error)
            }
        }
        
    }

    const handleLeaveRoom = async() => {
        const confirmLeave = window.confirm(`คุณต้องการที่จะออกจากห้องใช่หรือไม่?`)
        if (confirmLeave) {
            const token = localStorage.getItem('token');
            const config = {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            }
            try{
                const response = await axios.post(`http://localhost:5000/api/party/leave-room/${roomId}`, config)
                if (response.data.success) {
                    alert(response.data.message)
                    navigate('/lobby')
                }
            } catch (error) {
                console.error("Leave Room Error", error)
            } 

        }
    }   

    const handleChangeHost = async(playerName, playerId) => {
        const confirmChangeHost = window.confirm(`คุณแน่ใจหรือไม่ว่าจะให้คุณ [ ${playerName} ] เป็นหัวหน้าห้อง?`);
        if ( confirmChangeHost ){
            const token = localStorage.getItem('token');
            const config = {
                headers : {
                Authorization : `Bearer ${token}`
                }
            }
            try {
                const response = await axios.post(`http://localhost:5000/api/party/change-host/${roomId}/${playerId}`, config);
                if (response.data.success) {
                    alert(response.data.message)
                    setRoom(response.data.data)
                }
            } catch (error) {
                console.error("Change Host Error", error)
            }
        }
    }
    const handleCloseProfileModal = async () => {
        setIsProfileModalOpen(false)
        setSelectedProfile(null)
    }
    const handleCloseUpdateModal = async () => {
        setIsUpdateRoomModalOpen(false)
    }  
    
    return (
        
        <div style={containerStyle}>
            <div style={memberSectionStyle}>
                {/* เริ่มต้น room.map เอารายชื่อคนในห้องออกมา */}
            {room?.members?.map((member) => {
                const isThisMemberHost = member._id === room?.host?._id;

                const memberContainerStyle = {
                    display: 'flex',
                    flexDirection : 'column',
                    width: '150px',
                    height: '300px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundImage: isThisMemberHost ?
                     `linear-gradient(170deg, rgba(250, 60, 35, 0.32) 0%, rgba(113, 244, 248, 0.4) 100%), 
                    url('/images/background-profile-card.jpg')` 
                    : 
                    `linear-gradient(170deg, rgba(243, 147, 140, 0.23) 0%, rgba(126, 208, 255, 0.61) 150%), 
                    url('/images/background-profile-card.jpg')` ,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: '24px',
                    boxShadow: '0 10px 40px rgba(20, 28, 56, 0.49)',
                    padding: '30px 20px',
                    gap:'20px'
                };
                return(
                    // กล่องใส่สมาชิกแต่ละคน
                <div style={memberContainerStyle} key={member._id} onClick={() => handleGetOtherProfile(member._id)}>
                    {/* กล่องใส่รูปโปรไฟล์ */}
                    <div style={avatarWrapperStyle}>
                        <img
                            src={member.profileImage}
                            alt={member.displayName}
                            style={avatarStyle}
                            />
                    </div>

                    <span style={{ fontWeight: isThisMemberHost ? 'bold' : 'normal', color:'rgb(88, 88, 88)'}}>
                        {member.displayName}
                    </span>

                    {isThisMemberHost && (<span> 👑 </span>)}

                    {isHost && member._id !== myUserId && (
                        <>
                        <button className="kickButton" onClick={() => handleKickPlayer( member._id, member.displayName )}>
                            ❌ เชิญออก
                        </button>
                        <button className="kickButton" onClick={() => handleChangeHost(member.displayName, member._id)}>
                            👑 ตั้งเป็นหัวห้อง
                        </button>
                        </>
                    
                    )}
                </div>
                )
            })}
            </div>
            {/* จบ map */}
            
            
            <div style={buttonSectionStyle} >
                {isHost && (
                    <>
                    <button className='findRoomButton' onClick={() => handleCompleteRoom}>
                        👏🏻 กดเพื่อจบห้อง
                    </button>
                    <button className='findRoomButton' onClick={() => handleUpdateRoom}>
                        📑 แก้ไขข้อมูลห้อง
                    </button>
                    </>
                    
                )}
                <button  className='findRoomButton' onClick={() => handleLeaveRoom}>
                    🚪 ออกจากห้อง 
                </button>

                

            </div>


            { isProfileModalOpen &&(
                <div onClick={handleCloseProfileModal} style={modalOverlayStyle}>
                    <div onClick={(e) => e.stopPropagation()} style={modalCardStyle}>
                        <div style={avatarWrapperStyle}>
                            <img 
                                src="selectedProfile.profileImage"
                                alt="profile"
                                style={avatarStyle}
                            />
                        </div>
                        <h2 style={displayNameTextStyle}>{selectedProfile.displayName}</h2>
                        <span style={ratingStyle}>⭐ เรตติ้งของคุณ: {selectedProfile.rating || 0}/100</span>
                        <h3> คำอธิบายเพิ่มเติม </h3>
                        <p>{selectedProfile.description}</p>
                        <h3> แท๊ก </h3>
                        {selectedProfile?.tags?.length > 0 && (
                            selectedProfile.tags.map((tag, index) => (
                                <div key={index}>
                                    <span>#{tag}</span>
                                </div>
                            )) 
                        )}
                        <h3> รายการติดต่อ </h3>
                        {selectedProfile?.contacts?.length > 0 && (
                            selectedProfile.contacts.map((contact) => (
                                <div key={contact._id}>
                                    <span style={{ fontWeight: 'bold', color: '#4A6B64' }}>{contact.platform}:</span>
                                    <span style={{ marginLeft: '5px', flex: 1 }}>{contact.value}</span>
                                                                    
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
            {isUpdateRoomModalOpen && (
                <div onClick={handleCloseUpdateModal} style={modalOverlayStyle}>
                    <div onClick={(e) => e.stopPropagation()} style={modalCardStyle}>
                        
                    </div>         
                </div>
            
            )}

        {/* แท๊กปิดสุดท้าย */}
        </div>
    )
}
const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundImage: `
        linear-gradient(135deg, rgba(181, 218, 253, 0.8) 0%, rgba(243, 207, 192, 0.8) 100%), 
        url('/images/bg.avif')`,

    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    padding: '40px 50px',
    fontFamily: "'Kanit', sans-serif",
    gap: '30px'
};
const memberSectionStyle = {
    display: 'flex', 
    flexDirection: 'row',
    gap: '50px',
    
};
const avatarWrapperStyle ={ 
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // วงแหวนกระจกฝ้าล้อมรอบรูปโปรไฟล์
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '15px',
    border: '3px solid white',
    boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
};
const avatarStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    objectFit: 'cover'
};
const buttonSectionStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '30px'
}
const memberCardStyle = {
    
    backgroundColor: 'rgb(212, 232, 236)',
    borderRadius: '24px',
    boxShadow: '0 10px 40px rgba(20, 28, 56, 0.49)',
    padding: '30px 20px',
    gap:'10px',
    borderLeft: '6px solid rgb(219, 121, 108)'
}

// 🔒 สไตล์กล่องลอยกลางอากาศ (Modal CSS)
const modalOverlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)', // ทำฉากหลังมืดแบบโปร่งแสงครอบหน้าจอหลัก
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999 // มั่นใจได้ว่าจะไม่มีอะไรลอยทับหน้าต่างนี้
};
const modalCardStyle = {
    backgroundImage:"linear-gradient(135deg, rgb(161, 210, 255) 0%, rgb(245, 245, 245) 50%, rgb(250, 186, 158) 100%)", 
    padding: "20px 15px", 
    borderRadius: "25px",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '10px',
    width: '800px'
};

const titleStyle ={
    color : 'rgb(42, 48, 77)',
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '13px',
    marginTop: '8px'
}
const displayNameTextStyle = {
    fontSize: '26px',
    margin: '0 0 5px 0',
    fontWeight: 'bold',
    letterSpacing: '0.5px'
};  

const ratingStyle = {
    fontSize: '14px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: '4px 12px',
    borderRadius: '20px',
    marginBottom: '15px'
};
export default Room;
