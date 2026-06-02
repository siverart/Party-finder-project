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

}


export default Lobby;