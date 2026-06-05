import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom';

const RoomDetail = () => {
    // 🕵️‍♂️ ดึง roomId จาก URL ออกมาโชว์เพื่อความชัวร์ว่าส่งมาถูกอันไหม
    const { roomId } = useParams(); 
    const navigate = useNavigate();

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', color: '#fff', backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
            <div style={{ border: '2px dashed #00ffcc', padding: '20px', borderRadius: '8px', maxWidth: '500px', margin: '40px auto', textAlign: 'center' }}>
                <h1 style={{ color: '#00ffcc' }}>🎮 หน้า ROOM (กำลังพัฒนา)</h1>
                <p style={{ fontSize: '18px' }}>ตอนนี้คุณย้ายฝั่งมาจากหน้า Lobby สำเร็จแล้ว!</p>
                
                {/* 🎯 ไฮไลท์สำคัญ: เอาไว้ตรวจว่าไอดีห้องที่ส่งมาตรงกับใน MongoDB ไหม */}
                <div style={{ backgroundColor: '#333', padding: '10px', borderRadius: '4px', margin: '20px 0', wordBreak: 'break-all' }}>
                    <strong>Room ID ที่ได้รับคือ:</strong> <span style={{ color: '#ffcc00' }}>{roomId}</span>
                </div>

                <button 
                    onClick={() => navigate('/lobby')} 
                    style={{ padding: '10px 20px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    ⬅️ กลับไปหน้า Lobby
                </button>
            </div>
        </div>
    );
};

export default RoomDetail;
