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
    const [ roomFromFind, setRoomFromFind ] = useState(null)
    const [ selectedProfile, setSelectedProfile ] = useState({})
    const [ isFindRoomModalOpen, setIsFindRoomModalOpen ] = useState(false)
    const [ isRoomFromFindModalOpen, setIsRoomFromFindModalOpen] = useState(false)
    const [ isRoomDetailModalOpen, setIsRoomDetailModalOpen ] = useState(false)
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
            if (response.data.success) {
                const { data } = response.data
                setSingleRoom(data)
                setIsRoomDetailModalOpen(true)
            }
            

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
            if (count > 0) {
                setRoomFromFind(data)
            }
            alert(`พบห้องจำนวน ${count} ห้อง`)
            setGameName("")
            setRank(0)
            setServer("")
            setHasMic("")
            setLanguages([])
            setPlayTimeStart("")
            setIsFindRoomModalOpen(false)
            setIsRoomFromFindModalOpen(true)


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
            setIsProfileModalOpen(true)

        } catch (error) {
            console.error("Get Profile Error", error)
        }
    }
    const handleJoinRoom = async (roomId) => {
        
        try {
            //token
            const token = localStorage.getItem('token');
            const config = {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            }

            const response = await axios.post(`http://localhost:5000/api/party/join-room/${roomId}`, {}, config) 
            if (response.data.success) {
                navigate(`/room/${response.data?.data?._id}`)
            }
            
            
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
    const handleCloseRoomFromFindModal = async() => {
        setIsRoomFromFindModalOpen(false)
        setRoomFromFind(null)
    }
    const handleCloseProfileModal = async () => {
        setIsProfileModalOpen(false)
        setSelectedProfile({})
    }
    
    // กดเอาภาษาเข้าออกจาก room.lannguages [ "TH", "EN" ]
    const handleLanguageChange = (langCode) => {
        if (languages.includes(langCode)) {
            setLanguages(languages.filter(item => item !== langCode))
        } else {
            setLanguages([...languages, langCode])
        }
    }

    //ฟังชั่นแปลงรูปแบบเวลา
    const formatGameTime = (isoString) => {
        if (!isoString) return "";

        const date = new Date(isoString);

        return date.toLocaleString('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };


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
                        <button className="joinRoomButton" onClick={() => handleJoinRoom(room._id)}>
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
            {/* 🎯 modal แสดงห้องที่หาเจอ (เวอร์ชันซ่อมปีกกาเรียบร้อย) */}
            { isRoomFromFindModalOpen && (
                <div onClick={handleCloseRoomFromFindModal} style={roomFromFindmodalOverlayStyle}>
                    <div onClick={(e) => e.stopPropagation()} style={roomFromFindModalCardStyle}>
                        {roomFromFind?.map((room) => {
                        const currentBg = gameBackgrounds[room.gameName] || defaultBackground;
    
                        // ปั้นสไตล์แยกเฉพาะของการ์ดใบนี้
                        const finalCardStyle = {
                            ...roomCardStyle,
                            backgroundImage: `linear-gradient(rgba(53, 145, 238, 0.46), rgba(223, 190, 163, 0.47)), url(${currentBg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            color: '#fff'
                        };
        
                        return (
                            <div key={room._id} style={finalCardStyle} onClick={() => handleGetSingleRoom(room._id)}>
                                <p style={{marginLeft: '10px'}}>📝 ชื่อห้อง: {room.roomName}</p>
                                <p style={{marginLeft: '10px'}}>🎲 เกม: {room.gameName}</p>
                                <p style={{marginLeft: '10px'}}>👨‍👩‍👧‍👦 สมาชิก: {room.members?.length}/{room.maxPlayer}</p>
            
                                {/* ปุ่มกดที่จะพาเราเปลี่ยนหน้าไปยังห้องนั้น ๆ พร้อมแนบ ID ไปด้วย */}
                                <button className="joinRoomButton" onClick={() => handleJoinRoom(room._id)}>
                                    เข้าร่วมปาร์ตี้
                                </button>
                            </div>
                        );
                        })}

                    </div>
                </div>
                
            )}

            {/* modal แสดงผลรายละเอียดห้อง */}
            { isRoomDetailModalOpen && singleRoom && (
                <div onClick={() => setIsRoomDetailModalOpen(false)} style={roomDetailOverlayStyle}>
                    <div onClick={(e) => e.stopPropagation()} style={roomDetailCardStyle}>
                        
                        {/* ปุ่มกากบาทปิดหน้าต่าง */}
                        <button onClick={() => setIsRoomDetailModalOpen(false)} style={closeDetailBtnStyle}>✕</button>
                        
                        {/* ชื่อห้องปาร์ตี้ */}
                        <p style={roomDetailTitleStyle}>{singleRoom.roomName}</p>

                        {/* คำอธิบายปาร์ตี้เพิ่มเติม */}
                        <div style={roomDescBlockStyle}>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#718096', display: 'block', marginBottom: '4px' }}>📝 รายละเอียดปาร์ตี้</span>
                            <p style={{ fontSize: '14px', color: '#4a5568', margin: 0, lineHeight: '1.5', wordBreak: 'break-word' }}>
                                {singleRoom.description || "โฮสต์ไม่ได้ระบุรายละเอียดเพิ่มเติมไว้"}
                            </p>
                        </div>

                        {/* ตารางข้อมูลห้องแบบ Grid แบ่ง 2 ฝั่ง */}
                        <div style={roomInfoGridStyle}>
                            <div style={roomInfoItemStyle}>🎮 เกม: <strong>{singleRoom.gameName}</strong></div>
                            <div style={roomInfoItemStyle}>⚔️ โหมด: <strong>{singleRoom.gameMode}</strong></div>
                            <div style={roomInfoItemStyle}>🌐 เซิร์ฟเวอร์: <strong>{singleRoom.server}</strong></div>
                            <div style={roomInfoItemStyle}>🗣️ ภาษา: <strong>{singleRoom.languages?.join(', ')}</strong></div>
                            <div style={roomInfoItemStyle}>
                                🎙️ ไมค์: <strong>{singleRoom.hasMic ? "ต้องการไมค์" : "ไม่ต้องมีไมค์"}</strong>
                            </div>
                            <div style={roomInfoItemStyle}>
                                ⭐ เรตติ้งขั้นต่ำ: <strong>{singleRoom.minRating} คะแนน</strong>
                            </div>
                        </div>

                        {/* rank */}
                        <div style={roomInfoGridStyle}>
                            {(singleRoom.gameName === "LOL" || singleRoom.gameName === "Valorant") && (
                                <p style={roomInfoItemStyle}> rank : {
                                GAME_RANKS[singleRoom?.gameName]
                                ?.find(rank => rank.id === singleRoom?.rankRequirement)
                                ?.name
                                }
                                </p>
                            )}
                            {/* เวลาเล่น (17.00 - 23.00 น.) เป็นเวลาไทย */}
                            <p style={roomInfoItemStyle}>⏱️ เวลารวมตี้: {formatGameTime(singleRoom.playTime?.start)} - {formatGameTime(singleRoom.playTime?.end)} น.</p>
                            
                         </div>

                        

                        {/* บล็อกแสดงรายชื่อเมมเบอร์ในตี้ */}
                        <div style={membersSectionStyle}>
                            <h3 style={membersSectionTitleStyle}>👨‍👩‍👧‍👦 สมาชิกในปาร์ตี้ ({singleRoom.members?.length} / {singleRoom.maxPlayer})</h3>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {singleRoom.members?.map((member) => {
                                    
                                    const isHost = member._id === singleRoom.host?._id;

                                    // Dynamic Style สำหรับแยกหัวห้องจากสมาชิก
                                    const finalMemberCardStyle = {
                                        ...memberItemStyle,
                                        border: isHost ? '2px solid #e49486' : '1px solid #edf2f7',
                                        backgroundColor: isHost ? '#fffaf9' : '#ffffff',
                                        cursor: 'pointer'
                                    };

                                    return (
                                        <div 
                                            key={member._id} 
                                            style={finalMemberCardStyle}
                                            onClick={() => handleGetOtherProfile(member._id)}
                                        >
                                            <span style={{ fontWeight: isHost ? '700' : '500', color: '#2c3e50', fontSize: '14px' }}>
                                                {isHost && "👑 "} {member.displayName}
                                            </span>
                                            {isHost && <span style={{ fontSize: '11px', backgroundColor: '#fdeee9', color: '#e49486', padding: '2px 8px', borderRadius: '8px', fontWeight: '600' }}>HOST</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ปุ่มกดเข้าร่วมตี้ด้านล่างสุด */}
                        <button 
                            className="joinRoomButton" 
                            style={{ width: '100%', padding: '14px', borderRadius: '16px', fontSize: '16px', fontWeight: '600' }}
                            onClick={() => handleJoinRoom(singleRoom._id)}
                        >
                            เข้าร่วมปาร์ตี้
                        </button>
                    </div> 
                </div>
            )}
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
    alignItems: 'center',
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

//roomDetail Modal Style modal 2
// 🔒 ฉากหลังมืดแบบโปร่งแสงและเบลอ เพื่อโฟกัสตัว Modal Details
const roomDetailOverlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(20, 24, 41, 0.5)', // โทนเข้มโปร่งแสงคุมโทนเว็บ
    backdropFilter: 'blur(10px)', // สั่งเบลอฉากหลังแบบนุ่มนวล
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9998,
    padding: '20px'
};

// 🎴 ตัวการ์ดรายละเอียดห้อง (ดึงโทนไล่เฉดสีฟ้า-พีชจากสไตล์หลักของคุณโอ๊ตมาใช้)
const roomDetailCardStyle = {
    position: 'relative',
    backgroundImage: "linear-gradient(135deg, rgb(190, 225, 255) 0%, rgb(250, 250, 250) 50%, rgb(255, 206, 184) 100%)", 
    padding: "30px", 
    borderRadius: "28px",
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '550px', // กว้างกว่าโปรไฟล์นิดนึงเพื่อให้แสดงตารางและรายชื่อเมมเบอร์สวยๆ
    maxHeight: '85vh',
    overflowY: 'auto',
    boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
    fontFamily: "'Kanit', sans-serif",
    boxSizing: 'border-box'
};

// ปุ่ม ✕ ปิดหน้าต่างมุมขวาบน
const closeDetailBtnStyle = {
    position: 'absolute',
    top: '20px',
    right: '25px',
    background: 'none',
    border: 'none',
    fontSize: '22px',
    color: '#718096',
    cursor: 'pointer',
    transition: 'color 0.2s',
};

// หัวข้อชื่อห้องปาร์ตี้
const roomDetailTitleStyle = {
    fontSize: '22px',
    fontWeight: '700',
    color: '#29414b', // สีน้ำเงินเข้มตัวหลักของคุณโอ๊ต
    margin: '0 0 15px 0',
    paddingRight: '30px', // เว้นพื้นที่ไม่ให้ชนปุ่มกากบาท
    lineHeight: '1.4'
};

// บล็อกครอบข้อมูลทั่วไป (เช่น เกม โหมด ไมค์ เวลา)
const roomInfoGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr', // แบ่งเป็น 2 คอลัมน์ซ้ายขวาเท่ากัน
    gap: '12px',
    marginBottom: '20px'
};

// ไอเท็มย่อยข้างใน Grid ข้อมูล
const roomInfoItemStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    padding: '12px 15px',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    color: '#4a5568',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxSizing: 'border-box'
};

// บล็อกครอบโซนรายชื่อสมาชิก (Members Section)
const membersSectionStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: '20px',
    borderRadius: '20px',
    border: '1px solid rgba(231, 215, 209, 0.5)',
    marginBottom: '25px',
    boxSizing: 'border-box'
};

const membersSectionTitleStyle = {
    fontSize: '15px',
    fontWeight: '600',
    color: '#29414b',
    margin: '0 0 12px 0'
};

// รายการกล่องชื่อสมาชิกแต่ละคน (ที่เราจะเอาไป map และเช็กมงกุฎ)
const memberItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '12px',
    marginBottom: '8px',
    fontFamily: "'Kanit', sans-serif",
    boxSizing: 'border-box',
    transition: 'all 0.2s ease'
};

// กล่องข้อความรายละเอียด/คำอธิบายห้องเพิ่มเติม (Description)
const roomDescBlockStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: '14px 18px',
    borderRadius: '16px',
    border: '1px solid rgba(231, 215, 209, 0.4)',
    marginBottom: '25px',
    boxSizing: 'border-box'
};
//End RoomDetail Modal Style

//getOtherProfileModal modal 3(บนสุด)
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
//end getOtherProfileModal

//roomFromFindModal modal 1(ล่างสุด)
const roomFromFindmodalOverlayStyle ={
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)', // ทำฉากหลังมืดแบบโปร่งแสงครอบหน้าจอหลัก
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9997, // มั่นใจได้ว่าจะไม่มีอะไรลอยทับหน้าต่างนี้

    padding: '40px 30px',
    overflowY: 'auto'
};

const roomFromFindModalCardStyle = {
    backgroundImage:"linear-gradient(135deg, rgb(161, 210, 255) 0%, rgb(245, 245, 245) 50%, rgb(250, 186, 158) 100%)", 
    padding: "20px 15px", 
    borderRadius: "25px",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '15px',
    width: '100%',
    maxWidth: '1000px',
    boxShadow: '0 20px 60px rgba(16, 26, 61, 0.53)',
    maxHeight: '800px',
    height: '100%',
    overflowY: 'auto'
    
}
export default Lobby;   