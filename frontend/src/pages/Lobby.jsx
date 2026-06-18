import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
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
    const [ hasMic, setHasMic ] = useState("")
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
                localStorage.removeItem('username');
                localStorage.removeItem('myUserId'); // ล้างยูสเซอร์เนมด้วย
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
        
        const isoDateTimeStart = playTimeStart ? new Date(playTimeStart).toISOString() : null ;
        const isoDateTimeEnd = playTimeEnd ? new Date(playTimeEnd).toISOString() : null ;
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
                start: isoDateTimeStart,
                end: isoDateTimeEnd
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
                setHasMic("")
                setLanguages([])
                setMinRating(0)
                setMaxPlayer(0)
                setPlayTimeStart("")
                setPlayTimeEnd("")
                setIsCreateRoomModalOpen(false)

                navigate(`/room/${data._id}`)

        } catch (error) {
            console.error("Create Room Error", error.message)
        }
    }
    const handleFindRoom = async(e) => {
        e.preventDefault();
        if ( !gameName || !playTimeStart ) return;

        const isoDateTime = playTimeStart ? new Date(playTimeStart).toISOString() : null;
        //body
        const body = {
            gameName,
            rank,
            server,
            hasMic,
            languages,
            playTimeStart : isoDateTime 
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
            setHasMic("")
            setLanguages([])
            setPlayTimeStart("")
            setIsFindRoomModalOpen(false)


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
        setHasMic("")
        setLanguages([])
        setPlayTimeStart("")
    }
    const handleCloseCreateRoomModal = async () => {
        setIsCreateRoomModalOpen(false);
        setRoomName("")
        setDescription("")
        setGameName("")
        setRank(0)
        setServer("")
        setHasMic("")
        setLanguages([])
        setMinRating(0)
        setMaxPlayer(0)
        setPlayTimeStart("")
        setPlayTimeEnd("")
    }
    const handleLanguageChange = (langCode) => {
        if (languages.includes(langCode)) {
            setLanguages(languages.filter(item => item !== langCode))
        } else {
            setLanguages([...languages, langCode])
        }
    }


    {/* ส่วนแสดงผล */}
    return (
        <div style={containerStyle}>
            
            {/* เริ่ม .map() allRoom */}
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
    
                // return ของ .map()
                return (
                    
                    <div key={room._id} style={finalCardStyle}>
                        <p style={{marginLeft: '10px'}}>📝 ชื่อห้อง: {room.roomName}</p>
                        <p style={{marginLeft: '10px'}}>🎲 เกม: {room.gameName}</p>
                        <p style={{marginLeft: '10px'}}>👨‍👩‍👧‍👦 สมาชิก: {room.members?.length}/{room.maxPlayer}</p>
                        
                        {/* ปุ่มกดที่จะพาเราเปลี่ยนหน้าไปยังห้องนั้น ๆ พร้อมแนบ ID ไปด้วย */}
                        <button className="joinRoomButton" onClick={() => navigate(`/room/${room._id}`)}>
                            เข้าร่วมปาร์ตี้
                        </button>
                    </div>
                );
            })}
            {/* จบส่วน .map() allRoom */}

            {/* ส่วนปุ่มหาห้อง */}
            <div style={{display: 'flex', padding:"30px 20px", gap: "50px" }}>
                <button onClick={() => setIsFindRoomModalOpen(true)} className="findRoomButton">
                    หาห้อง
                </button>
                
                <button onClick={() => setIsCreateRoomModalOpen(true)} className="findRoomButton">
                    สร้างห้อง
                </button>
            </div>

            {/* ======================================================== */}
            {/* 🌌 โซนที่ 2: โซน Modal */}
            {/* ======================================================== */}
            {/*  modal สำหรับหาห้อง */}
            {isFindRoomModalOpen && (
                <div onClick={handleCloseFindRoomModal} style={modalOverlayStyle}>
                    <div onClick={(e) => e.stopPropagation()} style={modalCardStyle}>
                        <p style={titleStyle}>กรอกข้อมูลเพื่อหาห้อง</p>
                        <div className="findRoomEachFormStyle">
                            {/* กรอกชื่อเกม */}
                            <label htmlFor="game-select"> 🕹️ เลือกเกม : </label>
                                <select
                                    id="game-select"
                                    value={gameName}
                                    onChange={(e) => setGameName(e.target.value)}
                                    className="selectModalStyle"
                                >
                                    <option value="">-- กรุณาเลือกเกม --</option>
                                    <option value="LOL">League of Legends</option>
                                    <option value="POE2">Path of Exile 2</option>
                                    <option value="Valorant">Valorant</option>
                                </select>
                        </div>

                        {/* เงื่อนไขว่าเกมไหนมีแรงค์จึงจะให้กรอกแรงค์ */}
                        {(gameName === "LOL" || gameName === "Valorant") && (
                            <div className="findRoomEachFormStyle">
                                <label htmlFor="rank-select"> 🏆 เลือกแรงค์ : </label>
                                <select
                                    id="rank-select"
                                    value={String(rank)}
                                    onChange={(e) => setRank(Number(e.target.value))}
                                    className="selectModalStyle"
                                >
                                    <option value="0">-- เลือกแรงค์ --</option>
                                    {GAME_RANKS[gameName]?.map((r) =>(
                                        <option key={r.id} value={r.id}>
                                            {r.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        

                        <div className="findRoomEachFormStyle">
                            {/* server */}
                            <label htmlFor="server-select"> 🌍 เลือกเซิร์ฟเวอร์ :</label>
                                <select
                                id="server-select"
                                value={server}
                                onChange={(e) => setServer(e.target.value)}
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

                        <div className="findRoomEachFormStyle">
                            {/* hasMic */}
                            <label htmlFor="hasMic-input"> 🎙️ มีไมค์ : </label>
                            <select
                                id="hasMic-input"
                                value={String(hasMic)}
                                onChange={(e) => setHasMic(e.target.value === "true")}
                                className="selectModalStyle"
                            >
                                <option value="">-- กรุณาเลือก --</option>
                                <option value="true"> มีไมค์ </option>
                                <option value="false"> ไม่มีไมค์ </option>    
                            </select>
                        </div>    
                            
                        <div className="findRoomEachFormStyle">
                            
                            {/* languages */}
                            <label> 🗣️ ภาษา : </label>
                                <div style={{ display: 'flex', gap: '15px', marginTop: '5px'}}>

                                    {/* ภาษาไทย */}
                                    <label style={{ cursor: 'pointer' }}>
                                        <input 
                                            type="checkbox"
                                            checked={languages.includes("TH")}
                                            onChange={() => handleLanguageChange("TH")}
                                        /> TH (ภาษาไทย)
                                    </label> 
                                    {/* ภาษาอังกฤษ */}
                                    <label style={{ cursor: 'pointer' }}>
                                        <input 
                                            type="checkbox"
                                            checked={languages.includes("EN")}
                                            onChange={() => handleLanguageChange("EN")}
                                        /> EN (English)
                                    </label>    
                                </div>          
                               
                        </div>

                        <div className="findRoomEachFormStyle">
                            {/* playTimeStart */}
                            <label htmlFor="playtime-input"> 🕘 เวลาเริ่มเล่น : </label>
                            
                            <input
                                id="playtime-input"
                                type="datetime-local"
                                value={playTimeStart}
                                onChange={(e) => setPlayTimeStart(e.target.value)}
                                className="calenderStyle"
                                />
                            
                        </div>    
                        

                        <div className="findRoomButtonBlockStyle">
                            <button className="findRoomModalButton" onClick={handleFindRoom}>ค้นหา</button>
                            <button className="findRoomModalButton" onClick={handleCloseFindRoomModal}>ยกเลิก</button>
                        </div>
                    </div>
                </div>
            )}

            {/* modal สำหรับสร้างห้อง */} 
            {/*roomName,description,gameName,rank,server,hasMic,language,minRating,maxPlayer,playTime */}
            {isCreateRoomModalOpen && (
                <div onClick={handleCloseCreateRoomModal} style={modalOverlayStyle}>
                    <div onClick={(e) => e.stopPropagation()} style={modalCardStyle}>
                        <p style={titleStyle}>กรอกข้อมูลเพื่อสร้างห้อง</p>
                            <div className="findRoomEachFormStyle">
                                <label htmlFor='roomName-input'> 📝 ชื่อห้อง :</label>
                                    <input
                                        type='text'
                                        value={roomName}
                                        onChange={(e) => setRoomName(e.target.value)}
                                        placeholder='...กรุณากรอกชื่อ เช่น ขอคนแบกแอลยาวๆ...'
                                        className="selectModalStyle"
                                    ></input>
                            </div>
                            <div className="findRoomEachFormStyle">
                                <label htmlFor='description-input'> 📑 รายละเอียด :</label>
                                    <input
                                        type='text'
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder='...กรุณากรอกรายละเอียด เช่น ขอคนไม่โยนนะครับ...'
                                        className="selectModalStyle"
                                    ></input>
                            </div>
                            <div className="findRoomEachFormStyle">
                            {/* กรอกชื่อเกม */}
                            <label htmlFor="game-select"> 🕹️ เลือกเกม : </label>
                                <select
                                    id="game-select"
                                    value={gameName}
                                    onChange={(e) => setGameName(e.target.value)}
                                    className="selectModalStyle"
                                >
                                    <option value="">-- กรุณาเลือกเกม --</option>
                                    <option value="LOL">League of Legends</option>
                                    <option value="POE2">Path of Exile 2</option>
                                    <option value="Valorant">Valorant</option>
                                </select>
                            </div>

                            {/* เงื่อนไขว่าเกมไหนมีแรงค์จึงจะให้กรอกแรงค์ */}
                            {(gameName === "LOL" || gameName === "Valorant") && (
                                <div className="findRoomEachFormStyle">
                                    <label htmlFor="rank-select"> 🏆 เลือกแรงค์ : </label>
                                    <select
                                         id="rank-select"
                                        value={String(rank)}
                                        onChange={(e) => setRank(Number(e.target.value))}
                                        className="selectModalStyle"
                                    >
                                        <option value="0">-- เลือกแรงค์ --</option>
                                        {GAME_RANKS[gameName]?.map((r) =>(
                                            <option key={r.id} value={r.id}>
                                                {r.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="findRoomEachFormStyle">
                                {/* server */}
                                <label htmlFor="server-select"> 🌍 เลือกเซิร์ฟเวอร์ :</label>
                                    <select
                                    id="server-select"
                                    value={server}
                                    onChange={(e) => setServer(e.target.value)}
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

                            <div className="findRoomEachFormStyle">
                                {/* hasMic */}
                                <label htmlFor="hasMic-input"> 🎙️ มีไมค์ : </label>
                                <select
                                    id="hasMic-input"
                                    value={String(hasMic)}
                                    onChange={(e) => setHasMic(e.target.value === "true")}
                                    className="selectModalStyle"
                                >
                                    <option value="">-- กรุณาเลือก --</option>
                                    <option value="true"> มีไมค์ </option>
                                    <option value="false"> ไม่มีไมค์ </option>    
                                </select>
                            </div>    
                            
                            <div className="findRoomEachFormStyle">
                                {/* languages */}
                                <label> 🗣️ ภาษา : </label>
                                    <div style={{ display: 'flex', gap: '15px', marginTop: '5px'}}>

                                        {/* ภาษาไทย */}
                                        <label style={{ cursor: 'pointer' }}>
                                            <input 
                                                type="checkbox"
                                                checked={languages.includes("TH")}
                                                onChange={() => handleLanguageChange("TH")}
                                            /> TH (ภาษาไทย)
                                        </label> 
                                        {/* ภาษาอังกฤษ */}
                                        <label style={{ cursor: 'pointer' }}>
                                            <input 
                                                type="checkbox"
                                                checked={languages.includes("EN")}
                                                onChange={() => handleLanguageChange("EN")}
                                            /> EN (English)
                                        </label>    
                                    </div>         
                            </div>

                            <div className="findRoomEachFormStyle">
                                <label htmlFor="maxplayer-input"> 👨‍👩‍👧‍👦 จำนวนสมาชิกสูงสุด : </label>
                                <input
                                    id="maxplayer-input"
                                    type="number"
                                    min="2"
                                    max="10"
                                    value={maxPlayer === 0 ? "" : maxPlayer}
                                    onChange={(e) => setMaxPlayer(Number(e.target.value))}
                                    placeholder="กรุณาระบุจำนวนคน เช่น 5"
                                    className="selectModalStyle"
                                />
                            </div>

                            <div className="findRoomEachFormStyle">
                                <label htmlFor="minrating-input"> 🙂 ระบุคะแนน rating ขั้นต่ำ : </label>
                                <input
                                    id="minrating-input"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={minRating === 0 ? "" : minRating}
                                    onChange={(e) => setMinRating(Number(e.target.value))}
                                    placeholder="กรุณาระบุคะแนนความประพฤติขั้นต่ำ 0-100 คะแนน"
                                    className="selectModalStyle"
                                />
                            </div>

                            <div className="findRoomEachFormStyle">
                                {/* playTimeStart */}
                                <label htmlFor="playtimestart-input"> 🕘 เวลาเริ่มเล่น : </label>
                            
                                <input
                                    id="playtimestart-input"
                                    type="datetime-local"
                                    value={playTimeStart}
                                    onChange={(e) => setPlayTimeStart(e.target.value)}
                                    className="calenderStyle"
                                    />
                            
                            </div>                   
                            <div className="findRoomEachFormStyle">
                                {/* playTimeEnd */}
                                <label htmlFor="playtimeend-input"> 🕛 เวลาเลิกล่น : </label>
                            
                                <input
                                    id="playtimeend-input"
                                    type="datetime-local"
                                    value={playTimeEnd}
                                    onChange={(e) => setPlayTimeEnd(e.target.value)}
                                    className="calenderStyle"
                                    />
                            
                            </div>




                            <div className="findRoomButtonBlockStyle">
                                <button className="findRoomModalButton" onClick={(e) => {console.log("ปุ่มสร้างห้องโดนกด");handleCreateRoom(e);}}>สร้างห้อง</button>
                                <button className="findRoomModalButton" onClick={handleCloseCreateRoomModal}>ยกเลิก</button>

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


// 🖼️ สมุดจับคู่รูปภาพพื้นหลังเกม (คีย์ฝั่งซ้ายต้องตรงกับชื่อเกมใน DB เป๊ะ ๆ)
const gameBackgrounds = {
    "LOL": "/images/lol-pic-lobby.jpg", 
    "POE2": "/images/poe2-pic-lobby.jpg",
    "Valorant": "/images/valorant-pic-lobby.jpg"
};

// 💡 ทำรูปภาพ Default สำรองไว้ด้วย เผื่อกรณีหาชื่อเกมไม่เจอ หรือพิมพ์ชื่อเกมใหม่เข้ามา
const defaultBackground = "/images/default-lobby.jpg";

export default Lobby;   