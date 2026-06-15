import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom';

const Room = () => {
    // 🕵️‍♂️ ดึง roomId จาก URL ออกมาโชว์เพื่อความชัวร์ว่าส่งมาถูกอันไหม
    const { roomId } = useParams(); 
    const navigate = useNavigate();


    const [ room, setRoom ] = useState({})
    const [ isProfileModalOpen, setIsProfileModalOpen ] = useState(false)
    const [ selectedProfile, setSelectedProfile ] = useState({})


    useEffect (() => {
        const token = localStorage.getItem('token')
        const myUserId = localStorage.getItem('myUserId')
        if (!token) {
            alert("กรุณาเข้าสู่ระบบก่อนใช้งาน");
            navigate('/login');

        }   
        const fetchAndCheckStatus = async () => {
            try {
                const response = await axios.get(`/api/party/get-single-room/${roomId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
    
                if (response.data.success) {
                    const currentRoom = response.data.data;
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
        return () => clearInterval(checkStatus); // สั่งหยุด loop 3 วิ
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
        
    }
    return (<div> 
        <p>หน้าห้อง</p>
        </div>)
}
        

export default Room;
