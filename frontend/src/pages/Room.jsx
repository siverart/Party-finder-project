import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom';
import '../button.css';


const GAME_RANKS = {
    "LOL": [
        { id: 1, name: "Iron4"},
        { id: 2, name: "Iron3"},
        { id: 3, name: "Iron2"},
        { id: 4, name: "Iron1"},
        { id: 5, name: "Bronze4"},
        { id: 6, name: "Bronze3"},
        { id: 7, name: "Bronze2"},
        { id: 8, name: "Bronze1"},
        { id: 9, name: "Silver4"},
        { id: 10, name: "Silver3"},
        { id: 11, name: "Silver2"},
        { id: 12, name: "Silver1"},
        { id: 13, name: "Gold4"},
        { id: 14, name: "Gold3"},
        { id: 15, name: "Gold2"},
        { id: 16, name: "Gold1"},
        { id: 17, name: "Platinum4"},
        { id: 18, name: "Platinum3"},
        { id: 19, name: "Platinum2"},
        { id: 20, name: "Platinum1"},
        { id: 21, name: "Emerald4"},
        { id: 22, name: "Emerald3"},
        { id: 23, name: "Emerald2"},
        { id: 24, name: "Emerald1"},
        { id: 25, name: "Diamond4"},
        { id: 26, name: "Diamond3"},
        { id: 27, name: "Diamond2"},
        { id: 28, name: "Diamond1"},
        { id: 29, name: "Master4"},
        { id: 30, name: "Master3"},
        { id: 31, name: "Master2"},
        { id: 32, name: "Master1"},
        { id: 33, name: "Grandmaster4"},
        { id: 34, name: "Grandmaster3"},
        { id: 35, name: "Grandmaster2"},
        { id: 36, name: "Grandmaster1"},
        { id: 37, name: "Challenger"}
    ],
    "Valorant" : [
        { id: 1, name: "Iron1"},
        { id: 2, name: "Iron2"},
        { id: 3, name: "Iron3"},
        { id: 4, name: "Bronze1"},
        { id: 5, name: "Bronze2"},
        { id: 6, name: "Bronze3"},
        { id: 7, name: "Silver1"},
        { id: 8, name: "Silver2"},
        { id: 9, name: "Silver3"},
        { id: 10, name: "Gold1"},
        { id: 11, name: "Gold2"},
        { id: 12, name: "Gold3"},
        { id: 13, name: "Platinum1"},
        { id: 14, name: "Platinum2"},
        { id: 15, name: "Platinum3"},
        { id: 16, name: "Diamond1"},
        { id: 17, name: "Diamond2"},
        { id: 18, name: "Diamond3"},
        { id: 19, name: "Ascendant1"},
        { id: 20, name: "Ascendant2"},
        { id: 21, name: "Ascendant3"},
        { id: 22, name: "Immortal1"},
        { id: 23, name: "Immortal2"},
        { id: 24, name: "Immortal3"},
        { id: 25, name: "Radiant"}
    ]
}
const Room = () => {
    // 🕵️‍♂️ ดึง roomId จาก URL ออกมาโชว์เพื่อความชัวร์ว่าส่งมาถูกอันไหม
    const { roomId } = useParams(); 
    const navigate = useNavigate();
    


    const [ room, setRoom ] = useState(null)
    const [ isProfileModalOpen, setIsProfileModalOpen ] = useState(false)
    const [ selectedProfile, setSelectedProfile ] = useState(null)
    const [ isUpdateRoomModalOpen, setIsUpdateRoomModalOpen ] = useState(false)
    const [ editForm, setEditForm ] = useState(null);

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

                    // เด้งคนออกตอนห้องจบแล้วหรือโดนยกเลิก
                    if (currentRoom && (currentRoom.roomStatus === 'complete' || currentRoom.roomStatus === 'cancel') ) {
                        alert("ห้องนี้ได้สิ้นสุดภารกิจหรือถูกยกเลิกแล้ว ระบบจะนำคุณกลับสู่หน้าล็อบบี้");
                        clearInterval(checkStatus); // สั่งทำลายลูป 3 วิทิ้ง 
                        navigate('/lobby');
                        return; // จบการทำงานรอบนี้ทันที ไม่ต้องเซ็ต State ต่อ
                    }

                    //logic เช็คว่ายังอยู่ในห้องไหม
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
                    const token = localStorage.getItem('token');

                    fetch(`http://localhost:5000/api/party/leave-room/${roomId}`, {
                        method: 'POST', // หรือ POST ตามที่หลังบ้านเซ็ตไว้
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        keepalive: true // 🔥 สลักสลักล็อกตัวนี้ไว้! เบราว์เซอร์จะไม่กล้าตัดสายเด็ดขาดแม้ปิดเว็บไปแล้ว
                    });
                    console.log("🧹 ระบบทำความสะอาด: สั่งอัปเดตใน DB เรียบร้อยหลังย้ายหน้าหนี")
                } catch (err) {
                    console.error("ไม่สามารถเคลียร์ห้องออโต้ได้", err);
                }
            };
            

            

            if (roomId ) {
                autoLeaveRoom();
            } else {
                console.log(" ระบบเซฟตี้ทำงาน: ตรวจเจอ Path ซ้อนหรือรันเบิ้ล สกัดขาไม่ให้ยิงเตะตัวเอง!")
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
            setIsProfileModalOpen(true)
            

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
            const response = await axios.put(`http://localhost:5000/api/party/complete-room/${roomId}`, {},config);
            
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
            roomName: editForm.roomName,
            description: editForm.description,
            gameName: editForm.gameName,
            rank: editForm.rank,
            server: editForm.server,
            languages: editForm.languages,
            hasMic: editForm.hasMic,
            maxPlayer: editForm.maxPlayer,
            rating: editForm.rating,
            playTime: {
                start : editForm.playTime?.start,
                end: editForm.playTime?.end
            }

        }
        try {
            const response = await axios.patch(`http://localhost:5000/api/party/update-room/${roomId}`, body, config)
            const { message } = response.data
            alert(message)
            setIsUpdateRoomModalOpen(false)
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
                const response = await axios.post(`http://localhost:5000/api/party/kick-player/${roomId}/${playerId}`, {}, config)
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
            try{
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                    Authorization: `Bearer ${token}`
                    }
                }
                const response = await axios.post(`http://localhost:5000/api/party/leave-room/${roomId}`, {}, config);
                        
                
                if (response.data.success){
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
                const response = await axios.post(`http://localhost:5000/api/party/change-host/${roomId}/${playerId}`, {},config);
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
    const handleLanguageChange = (langCode) => {
        if (!editForm || !editForm.languages) return;

        if (editForm?.languages.includes(langCode)) {
            setEditForm({
                ...editForm,
                languages : editForm.languages.filter(item => item !== langCode)})
        } else {
            setEditForm({
                ...editForm, 
                languages : [ ...editForm.languages, langCode ]})
        }
    }
    
    

   
    const handleOpenUpdateModal = () => {
        setEditForm({ ...room });
        setIsUpdateRoomModalOpen(true);
    };
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
                    <div style={lobbyAvatarWrapperStyle}>
                        <img
                            src={member.profileImage}
                            alt={member.displayName}
                            style={lobbyAvatarStyle}
                            />
                    </div>

                    <span style={{ fontWeight: isThisMemberHost ? 'bold' : 'normal', color:'rgb(88, 88, 88)'}}>
                        {member.displayName}
                    </span>

                    {isThisMemberHost && (<span> 👑 </span>)}

                    {isHost && member._id !== myUserId && (
                        <>
                        <button 
                        className="kickButton" 
                        onClick={(e) => {
                                e.stopPropagation();
                                handleKickPlayer( member._id, member.displayName );
                            }}
                        >
                            ❌ เชิญออก
                        </button>
                        <button 
                        className="kickButton" 
                        onClick={(e) => {
                                e.stopPropagation(); 
                                handleChangeHost(member.displayName, member._id);
                            }}
                        >        
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
                    <button className='findRoomButton' onClick={handleCompleteRoom}>
                        👏🏻 กดเพื่อจบห้อง
                    </button>
                    <button className='findRoomButton' onClick={handleOpenUpdateModal}>
                        📑 แก้ไขข้อมูลห้อง
                    </button>
                    </>
                    
                )}
                <button  className='findRoomButton' onClick={handleLeaveRoom}>
                    🚪 ออกจากห้อง 
                </button>

                

            </div>


            { isProfileModalOpen && (
                <div onClick={handleCloseProfileModal} style={profileModalOverlayStyle}>
                    <div onClick={(e) => e.stopPropagation()} style={profileModalCardStyle}>
            
                        {/* ❌ ปุ่มปิดมุมขวาบนด่วนๆ ทันใจ */}
                        <button onClick={handleCloseProfileModal} style={closeModalBtnStyle}>✕</button>

                        {/* กล่องใส่รูปโปรไฟล์อัปเกรดความพรีเมียม */}
                        <div style={profileAvatarWrapperStyle}>
                            <img 
                                src={selectedProfile?.profileImage}
                                alt="profile"
                                style={profileAvatarStyle}
                            />
                        </div>

                        {/* ชื่อผู้เล่น */}
                        <h2 style={profileNameStyle}>{selectedProfile?.displayName}</h2>
            
                        {/* กล่องคะแนน Rating คูลๆ */}
                        <div style={profileRatingBadgeStyle}>
                            ⭐ เรตติ้งความประพฤติ: <strong style={{color: '#df7777'}}>{selectedProfile?.rating?.score || 0}</strong> / 100
                        </div>

                        {/* รายละเอียดคำอธิบาย */}
                        <div style={profileSectionBlockStyle}>
                            <h3 style={profileSectionTitleStyle}>📝 คำอธิบายเพิ่มเติม</h3>
                            <p style={profileDescriptionTextStyle}>
                                {selectedProfile?.description || "ผู้เล่นคนนี้ยังไม่ได้ใส่คำอธิบายเพิ่มเติม"}
                            </p>
                        </div>

                        {/* แท็กความสนใจ */}
                        <div style={profileSectionBlockStyle}>
                            <h3 style={profileSectionTitleStyle}>🏷️ แท็กความสนใจ</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '5px' }}>
                                {selectedProfile?.tags?.length > 0 ? (
                                    selectedProfile.tags.map((tag, index) => (
                                        <span key={index} style={profileTagBadgeStyle}>#{tag}</span>
                                    )) 
                                ) : (
                                    <span style={{color: '#9c9ea7', fontSize: '14px'}}>ไม่มีแท็ก</span>
                                )}
                            </div>
                        </div>

                        {/* รายการติดต่อ */}
                        <div style={profileSectionBlockStyle}>
                            <h3 style={profileSectionTitleStyle}>📱 ช่องทางการติดต่อ</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '5px' }}>
                                {selectedProfile?.contacts?.length > 0 ? (
                                    selectedProfile.contacts.map((contact) => (
                                        <div key={contact._id} style={profileContactItemStyle}>
                                            <span style={profileContactPlatformStyle}>{contact.platform}</span>
                                            <span style={profileContactValueStyle}>{contact.value}</span>
                                        </div>
                                    ))
                                ) : (
                                    <span style={{color: '#9c9ea7', fontSize: '14px'}}>ไม่มีช่องทางการติดต่อสาธารณะ</span>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            )}
            
            {isUpdateRoomModalOpen && (
                <div onClick={handleCloseUpdateModal} style={modalOverlayStyle}>
                    <div onClick={(e) => e.stopPropagation()} style={modalCardStyle}>
                        <p style={titleStyle}>กรอกข้อมูลที่ต้องการแก้ไข</p>
                        {/* แก้ชื่อห้อง */}
                        <div className="findRoomEachFormStyle">
                            <label> 📝 ชื่อห้อง :</label>
                                <input
                                    type="text"
                                    value={editForm?.roomName || ""}
                                    onChange={(e) => setEditForm({ ...editForm, roomName: e.target.value})}
                                    className="selectModalStyle"
                                ></input> 
                        </div>
                        
                        {/* แก้ description */}
                        <div className="findRoomEachFormStyle">
                            <label> 📑 รายละเอียด :</label>
                                <input
                                    type="text"
                                    value={editForm?.description || ""}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value})}
                                    className="selectModalStyle"
                                ></input>
                        </div>
                        
                        {/* แก้ชื่อเกม */}
                        <div className="findRoomEachFormStyle">
                            <label htmlFor="game-select"> 🕹️ เลือกเกม : </label>
                                <select
                                    id="game-select"
                                    value={editForm?.gameName}
                                    onChange={(e) => setEditForm({...editForm, gameName: e.target.value})}
                                    className="selectModalStyle"
                                >
                                    <option value="">-- กรุณาเลือกเกม --</option>
                                    <option value="LOL">League of Legends</option>
                                    <option value="POE2">Path of Exile 2</option>
                                    <option value="Valorant">Valorant</option>
                                </select>
                        </div>

                        {/* เงื่อนไขว่าเกมไหนมีแรงค์จึงจะให้กรอกแรงค์ */}
                        {(editForm?.gameName === "LOL" || editForm?.gameName === "Valorant") && (
                            <div className="findRoomEachFormStyle">
                                <label htmlFor="rank-select"> 🏆 เลือกแรงค์ : </label>
                                <select
                                    id="rank-select"
                                    value={String(editForm.rank)}
                                    onChange={(e) => setEditForm({...editForm, rank: Number(e.target.value)})}
                                    className="selectModalStyle"
                                >
                                    <option value="0">-- เลือกแรงค์ --</option>
                                    {GAME_RANKS[editForm?.gameName]?.map((r) =>(
                                        <option key={r.id} value={r.id}>
                                            {r.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        
                        {/* server */}
                        <div className="findRoomEachFormStyle">
                                <label htmlFor="server-select"> 🌍 เลือกเซิร์ฟเวอร์ :</label>
                                    <select
                                    id="server-select"
                                    value={editForm?.server}
                                    onChange={(e) => setEditForm({...editForm, server : e.target.value})}
                                    className="selectModalStyle"
                                    >
                                        <option value="">-- กรุณาเลือกเซิร์ฟเวอร์ --</option>
                                        <option value="SEA">Southeast Asia</option>
                                        <option value="EU">Europe</option>
                                        <option value="NA">North America</option>
                                        <option value="OCE">Oceania</option>
                                        <option value="LATAM">Latin America</option>
                                        <option value="MEA">Middle East & Africa</option>

                                    </select>
                        </div>

                        {/* hasMic */} 
                        <div className="findRoomEachFormStyle">                   
                            <label htmlFor="hasMic-input"> 🎙️ มีไมค์ : </label>
                            <select
                                id="hasMic-input"
                                value={String(editForm?.hasMic)}
                                onChange={(e) => setEditForm({...editForm, hasMic: e.target.value === "true"})}
                                className="selectModalStyle"
                            >
                                <option value="">-- กรุณาเลือก --</option>
                                <option value="true"> มีไมค์ </option>
                                <option value="false"> ไม่มีไมค์ </option>    
                            </select>
                        </div>
                        
                        {/* languages */}
                        <div className="findRoomEachFormStyle">
                            <label> 🗣️ ภาษา : </label>
                                <div style={{ display: 'flex', gap: '15px', marginTop: '5px'}}>

                                    {/* ภาษาไทย */}
                                    <label style={{ cursor: 'pointer' }}>
                                        <input 
                                            type="checkbox"
                                            checked={ editForm?.languages.includes("TH") }
                                            onChange={() => handleLanguageChange("TH")}
                                        /> TH (ภาษาไทย)
                                    </label> 
                                    {/* ภาษาอังกฤษ */}
                                    <label style={{ cursor: 'pointer' }}>
                                        <input 
                                            type="checkbox"
                                            checked={ editForm?.languages.includes("EN") }
                                            onChange={() => handleLanguageChange("EN")}
                                        /> EN (English)
                                    </label>    
                                </div>          
                               
                        </div>

                        {/* จำนวนสมาชิก */}
                        <div className="findRoomEachFormStyle">
                                <label htmlFor="maxplayer-input"> 👨‍👩‍👧‍👦 จำนวนสมาชิกสูงสุด : </label>
                                <input
                                    id="maxplayer-input"
                                    type="number"
                                    min="2"
                                    max="10"
                                    value={editForm?.maxPlayer === 0 ? "" : editForm?.maxPlayer}
                                    onChange={(e) => setEditForm({...editForm, maxPlayer : (Number(e.target.value))})}
                                    placeholder="กรุณาระบุจำนวนคน เช่น 5"
                                    className="selectModalStyle"
                                />
                        </div>

                        {/* minRating */}
                        <div className="findRoomEachFormStyle">
                                <label htmlFor="minrating-input"> 🙂 ระบุคะแนน rating ขั้นต่ำ : </label>
                                <input
                                    id="minrating-input"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={editForm?.minRating === 0 ? "" : editForm?.minRating}
                                    onChange={(e) => setEditForm({...editForm, minRating : (Number(e.target.value))})}
                                    placeholder="กรุณาระบุคะแนนความประพฤติขั้นต่ำ 0-100 คะแนน"
                                    className="selectModalStyle"
                                />
                        </div>
                        
                        {/* เวลาเล่น */}
                        <div className="findRoomEachFormStyle">
                            {/* playTimeStart */}
                            <label htmlFor="playtimestart-input"> 🕘 เวลาเริ่มเล่น : </label>
                            
                            <input
                                id="playtimestart-input"
                                type="datetime-local"
                                value={editForm?.playTime?.start}
                                onChange={(e) => setEditForm({
                                    ...editForm, 
                                    playTime: {
                                        ...editForm.playTime, 
                                            start : e.target.value 
                                        }
                                    })}
                                className="calenderStyle"
                                /> 
                        </div>               
                        <div className="findRoomEachFormStyle">
                            {/* playTimeEnd */}
                            <label htmlFor="playtimeend-input"> 🕛 เวลาเลิกล่น : </label>
                            <input
                                id="playtimeend-input"
                                type="datetime-local"
                                value={editForm?.playTime?.end}
                                onChange={(e) => setEditForm({
                                    ...editForm, playTime : {
                                        ...editForm.playTime,
                                        end: e.target.value
                                    }
                                })}
                                className="calenderStyle"
                                />
                        </div>
                        <div style={{marginTop:'15px', marginBottom:'15px', display:'flex', justifyContent:'center', gap: '150px'}}>    
                            <button className="findRoomModalButton" onClick={handleUpdateRoom}> 💾 อัพเดท </button>
                            <button className="findRoomModalButton" onClick={handleCloseUpdateModal}> ❌ ยกเลิก </button>
                        </div>
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



//ของ lobby
const lobbyAvatarWrapperStyle ={ 
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // วงแหวนกระจกฝ้าล้อมรอบรูปโปรไฟล์
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '15px',
    border: '3px solid white',
    boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
};
const lobbyAvatarStyle = {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    objectFit: 'cover'
};


const buttonSectionStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '30px'
}


// 🔒 สไตล์กล่องลอยกลางอากาศ (Modal CSS)
const modalOverlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)', // ทำฉากหลังมืดแบบโปร่งแสงครอบหน้าจอหลัก
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // มั่นใจได้ว่าจะไม่มีอะไรลอยทับหน้าต่างนี้

    padding: '40px 30px',
    overflowY: 'auto'
};
const modalCardStyle = {
    backgroundImage:"linear-gradient(135deg, rgb(161, 210, 255) 0%, rgb(245, 245, 245) 50%, rgb(250, 186, 158) 100%)", 
    padding: "20px 15px", 
    borderRadius: "25px",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '15px',
    width: '100%',
    maxWidth: '700px',
    boxShadow: '0 20px 60px rgba(16, 26, 61, 0.53)',
    maxHeight: '100%'
};

const titleStyle ={
    color : 'rgb(42, 48, 77)',
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '13px',
    marginTop: '8px'
}

// ฉากหลังดิมมืดแบบหรูหรานุ่มนวล
const profileModalOverlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(20, 24, 41, 0.45)', // เน้นโทนน้ำเงินเข้มโปร่งแสง
    backdropFilter: 'blur(8px)', // สั่งเบลอฉากหลังแบบ iOS สวยมาก
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    padding: '20px'
};

// การ์ดแสดงโปรไฟล์สไตล์สมูทพาสเทล
const profileModalCardStyle = {
    position: 'relative',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(24df, 245, 245, 0.95) 100%)',
    padding: "35px 30px", 
    borderRadius: "28px",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '450px', // กระชับให้พอดีกับแนวการ์ดโปรไฟล์
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    maxHeight: '90vh',
    overflowY: 'auto',
    fontFamily: "'Kanit', sans-serif"
};

// ปุ่มกากบาทปิดมุมขวาบน
const closeModalBtnStyle = {
    position: 'absolute',
    top: '15px',
    right: '20px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    color: '#8e9aa8',
    cursor: 'pointer',
    transition: 'color 0.2s',
};

// กรอบวงแหวนรูปโปรไฟล์
const profileAvatarWrapperStyle = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '15px',
    border: '4px solid #fff',
    boxShadow: '0 10px 20px rgba(228, 148, 134, 0.3)', // เงาสีพีชจางๆ ตามสไตล์เว็บ
    background: '#fff'
};

const profileAvatarStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover'
};

const profileNameStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2c3e50',
    margin: '0 0 8px 0'
};

// บาร์คะแนนเรตติ้งความประพฤติ
const profileRatingBadgeStyle = {
    fontSize: '13px',
    backgroundColor: '#fff',
    border: '1px solid #f9dbd5',
    color: '#5c6b73',
    padding: '6px 16px',
    borderRadius: '20px',
    marginBottom: '20px',
    fontWeight: '500',
    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
};

// บล็อกจัดหมวดหมู่ข้อมูล
const profileSectionBlockStyle = {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: '14px 18px',
    borderRadius: '16px',
    marginBottom: '12px',
    border: '1px solid rgba(231, 215, 209, 0.4)',
    boxSizing: 'border-box'
};

const profileSectionTitleStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#718096',
    margin: '0 0 6px 0',
};

const profileDescriptionTextStyle = {
    fontSize: '14px',
    color: '#4a5568',
    margin: 0,
    lineHeight: '1.5',
    wordBreak: 'break-word'
};

// ดีไซน์เม็ดแท็กสีหวานๆ
const profileTagBadgeStyle = {
    backgroundColor: '#fdeee9',
    color: '#e49486',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    border: '1px solid #fcdbd0'
};

// ไอเท็มช่องทางติดต่อสื่อสาร
const profileContactItemStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '8px 12px',
    borderRadius: '10px',
    border: '1px solid #edf2f7'
};

const profileContactPlatformStyle = {
    fontSize: '12px',
    fontWeight: '700',
    color: '#29414b', // ดึงสีเข้มจากปุ่มหลักของคุณโอ๊ตมาคุมธีม
    backgroundColor: '#e2e8f0',
    padding: '3px 8px',
    borderRadius: '6px',
    marginRight: '10px',
    minWidth: '70px',
    textAlign: 'center'
};

const profileContactValueStyle = {
    fontSize: '13px',
    color: '#4a5568',
    fontWeight: '500',
    userSelect: 'all' // ลัดให้ยูสเซอร์คลิกทีเดียวคลุมข้อความก๊อปปี้ไปแอดเพื่อนได้เลย
};
export default Room;
