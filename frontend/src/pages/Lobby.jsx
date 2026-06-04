import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Lobby(){
    const [ allRoom, setAllRoom ] = useState([])
    const [ singleRoom, setSingleRoom ] = useState({})
    const [ roomFromFind, setRoomFromFind ] = useState([])
    const [ selectedProfile, setSelectedProfile ] = useState({})
    const [ isMatchRoomModalOpen, setIsMatchRoomModalOpen ] = useState(false)
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
    return (
        <div>
            
        </div>
    )
}


export default Lobby;