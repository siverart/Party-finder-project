import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../button.css';

function Lobby(){
    const [ allRoom, setAllRoom ] = useState([])
    const [ singleRoom, setSingleRoom ] = useState({})
    const [ roomFromFind, setRoomFromFind ] = useState([])
    const [ selectedProfile, setSelectedProfile ] = useState({})
    const [ isFindRoomModalOpen, setIsFindRoomModalOpen ] = useState(false)
    const [ isProfileModalOpen, setIsProfileModalOpen ] = useState(false)
    const [ isCreateRoomModalOpen, setIsCreateRoomModalOpen ] = useState(false)
    //สำหรับรับ input สร้างห้อง กับ หาห้อง
    const [ roomName, setRoomName ] = useState("")
    const [ description,  setDescription ] = useState("")
    const [ gameName, setGameName ] = useState("")
    const [ rank, setRank ] = useState(0)
    const [ server, setServer ] = useState("")
    const [ hasMic, setHasMic ] = useState(false)
    const [ minRating, setMinRating ] = useState(0)
    const [ maxPlayer, setMaxPlayer ] = useState(0)
    const [ playTimeStart, setPlayTimeStart ] = useState("")
    const [ playTimeEnd, setPlayTimeEnd ] = useState("")
    const [ languages, setLanguages] = useState([])

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token) {
            alert("กรุณาเข้าสู่ระบบก่อนใช้งาน");
            navigate('/login');
        } else {
            getAllRoom()
        }
    }, [])

    const getAllRoom = async() => {
        try {
            const response = await axios.get('http://localhost:5000/api/party/get-all-room')
            const { data } = response.data
            setAllRoom(data)
        } catch (error) {
            console.error('Error fetching room data', error)

            if (error.response && error.response.status === 401) {
                alert("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
                localStorage.removeItem('token');    // ล้างตัวหมดอายุทิ้งซะ
                localStorage.removeItem('username'); // ล้างยูสเซอร์เนมด้วย
                navigate('/login');
            }
        }
    }


    const handleGetSingleRoom = async(roomId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:5000/api/party/get-single-room/${roomId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            const { message, data } = response.data
            alert(message)
            setSingleRoom(data)

        } catch (error) {
            console.error('Error fetching room data', error)
        }
    }
    const handleCreateRoom = async (e) => {
        e.preventDefault()
        if ( !roomName || !gameName || !maxPlayer || !playTimeStart) return ;
        
       
        //body
        const body = {
            roomName,
            description,
            gameName,
            rank,
            server,
            hasMic,
            languages,
            minRating,
            maxPlayer,
            playTime : {
                start: playTimeStart,
                end: playTimeEnd
            }
        }
        // token
        const token = localStorage.getItem('token')
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const response = await axios.post('http://localhost:5000/api/party/create-room', body, config)
             
                const { data, message } = response.data
                alert(message)
                setRoomName("")
                setDescription("")
                setGameName("")
                setRank(0)
                setServer("")
                setHasMic(false)
                setLanguages([])
                setMinRating(0)
                setMaxPlayer(0)
                setPlayTimeStart("")
                setPlayTimeEnd("")
                setIsCreateRoomModalOpen(false)

                navigate(`/room/${data._id}`)

        } catch (error) {
            console.error("Create Room Error", error)
        }
    }
    const handleFindRoom = async(e) => {
        e.preventDefault();
        if ( !gameName || !playTimeStart ) return;
        //body
        const body = {
            gameName,
            rank,
            server,
            hasMic,
            languages,
            playTimeStart
        }
        //token
        const token = localStorage.getItem('token')
        const config = {
            headers : {
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const response = await axios.post('http://localhost:5000/api/party/find-room', body, config)
            const { count, data } = response.data
            alert(`พบห้องจำนวน ${count} ห้อง`)
            setRoomFromFind(data)
            setGameName("")
            setRank(0)
            setServer("")
            setHasMic(false)
            setLanguages([])
            setPlayTimeStart("")


        } catch (error) {
            console.error("Find Room Error", error)
        }
    }
    const handleGetOtherProfile = async (findedId) => {
        
        //token
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

        } catch (error) {
            console.error("Get Profile Error", error)
        }
    }
    const handleJoinRoom = async (roomId) => {
        //token
        const token = localStorage.getItem('token');
        const config = {
            headers : {
                Authorization : `Bearer ${token}`
            }
        }
        try {
            const response = await axios.post(`http://localhost:5000/api/party/join-room/${roomId}`, config);
            const { data } = response.data
            navigate(`room/${data._id}`)

        } catch (error) {
            console.error("Join Room Error", error)
        }
    }
    const handleCloseFindRoomModal = async () => {
        setIsFindRoomModalOpen(false);
        setGameName("")
        setRank(0)
        setServer("")
        setHasMic(false)
        setLanguages([])
        setPlayTimeStart("")
    }
    return (
        <div style={containerStyle}>
            
            {/* 👑 โรงงาน .map() เริ่มทำงานตรงนี้ */}
            {allRoom.map((room) => {
                // 🤔 แอบคำนวณรูปภาพพื้นหลังก่อนส่งออก JSX (ลอจิกที่เราคุยกันเมื่อกี้)
                const currentBg = gameBackgrounds[room.gameName] || defaultBackground;
                
                // ปั้นสไตล์แยกเฉพาะของการ์ดใบนี้
                const finalCardStyle = {
                    ...roomCardStyle,
                    backgroundImage: `linear-gradient(rgba(53, 145, 238, 0.46), rgba(223, 190, 163, 0.47)), url(${currentBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: '#fff'
                };
    
                // 🎯 สั่ง Return พ่นแท็ก JSX ออกไปสู้สายตาประชาชน
                return (
                    
                    <div key={room._id} style={finalCardStyle}>
                        <p>📝 ชื่อห้อง: {room.roomName}</p>
                        <p>🎮 เกม: {room.gameName}</p>
                        <p>👥 สมาชิก: {room.members?.length}/{room.maxPlayer}</p>
                        
                        {/* ปุ่มกดที่จะพาเราเปลี่ยนหน้าไปยังห้องนั้น ๆ พร้อมแนบ ID ไปด้วย */}
                        <button onClick={() => navigate(`/room/${room._id}`)}>
                            เข้าร่วมปาร์ตี้
                        </button>
                    </div>
                );
            })}
            {/* 👑 สิ้นสุดโรงงาน .map() */}
            <div style={{padding:"30px 20px"}}>
                <button onClick={() => setIsFindRoomModalOpen(true)} className="findRoomButton">
                    หาห้อง
                </button>
            </div>
            
            {isFindRoomModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={{backgroundColor:"white", padding: "15px 15px", borderRadius: "18px"}}>
                        <h3>กรอกข้อมูลเพื่อหาห้อง</h3>
                        <div>
                            <label htmlFor="game-select"> 🕹️ เลือกเกม : </label>
                                <select
                                    value={gameName}
                                >
                                    <option value="">-- กรุณาเลือกเกม --</option>
                                    <option value="LOL">League of Legends</option>
                                    <option value="POE2">Path of Exile 2</option>
                                    <option value="Varolant">Varolant</option>
                                </select>
                            <label></label>
                        </div>
                        <div>
                            <button onClick={handleFindRoom}>ค้นหา</button>
                            <button onClick={handleCloseFindRoomModal}>ยกเลิก</button>
                        </div>
                    </div>
                    
                </div>


            )}

        </div>
        
    );
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
    gap: '10px'
};
const roomCardStyle = {
    display: 'flex',
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center',
    width:'100%',
    maxWidth: '800px',
    backgroundColor: 'rgb(212, 232, 236)',
    borderRadius: '24px',
    boxShadow: '0 10px 40px rgba(20, 28, 56, 0.49)',
    padding: '30px 20px',
    gap:'10px',
    borderLeft: '6px solid rgb(219, 121, 108)'
}
const testModernButton = {

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

// 🖼️ สมุดจับคู่รูปภาพพื้นหลังเกม (คีย์ฝั่งซ้ายต้องตรงกับชื่อเกมใน DB เป๊ะ ๆ นะครับ)
const gameBackgrounds = {
    "LOL": "/images/lol-pic-lobby.jpg", 
    "POE2": "/images/poe2-pic-lobby.jpg",
    "Valorant": "/images/varolant-pic-lobby.jpg"
};

// 💡 ทำรูปภาพ Default สำรองไว้ด้วย เผื่อกรณีหาชื่อเกมไม่เจอ หรือพิมพ์ชื่อเกมใหม่เข้ามา
const defaultBackground = "/images/default-lobby.jpg";

export default Lobby;   