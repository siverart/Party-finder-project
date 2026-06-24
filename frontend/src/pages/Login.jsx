import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login(){
    const [ username , setUsername ] = useState("")
    const [ password , setPassword ] = useState("")
    const navigate = useNavigate()  

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // ถ้ามี token อยู่ในเครื่องแล้ว ไม่ต้องให้กรอกซ้ำ ดีดไปหน้า profile ทันที
            navigate('/lobby'); 
        }
    }, [navigate])

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password })
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('username', response.data.username)
            localStorage.setItem('myUserId', response.data.id)
            alert("เข้าสู่ระบบสำเร็จ");
            navigate('/lobby'); 

        } catch (err) {
            alert(err.response?.data?.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        navigate('/reset-password') // ส่งไปอีกหน้าที่จะมี form email ให้กรอก
    };

    return (
        <div style={loginPageContainerStyle}>
            <form onSubmit={handleLogin} style={loginFormBoxStyle}>
                
                {/* ไอคอน */}
                <div style={logoIconContainerStyle}>🔐</div>
                
                <h2 style={loginHeaderStyle}>เข้าสู่ระบบ</h2>
                <p style={loginSubHeaderStyle}>เข้าสู่ระบบเพื่อเป็นส่วนหนึ่งของสังคมเกมที่สนุกสนาน</p>

                {/* ส่วนของกลุ่มช่องกรอกข้อมูล (Inputs) */}
                <div style={inputGroupContainerStyle}>
                    <div style={inputWrapperStyle}>
                        <label style={labelStyle}>ชื่อผู้ใช้งาน (Username)</label>
                        <input 
                            type="text"
                            placeholder="กรอกชื่อผู้ใช้งาน..." 
                            onChange={(e) => setUsername(e.target.value)} 
                            style={inputFieldStyle}
                            required
                        />
                    </div>

                    <div style={inputWrapperStyle}>
                        <label style={labelStyle}>รหัสผ่าน (Password)</label>
                        <input 
                            type="password" 
                            placeholder="กรอกรหัสผ่านของคุณ..." 
                            onChange={(e) => setPassword(e.target.value)} 
                            style={inputFieldStyle}
                            required
                        />
                    </div>
                </div>

                {/* ปุ่มลืมรหัสผ่าน */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                    <span 
                        onClick={handleResetPassword} 
                        style={forgotPasswordLinkStyle}
                        onMouseOver={(e) => e.target.style.color = '#cf7777'} 
                        onMouseOut={(e) => e.target.style.color = '#718096'}
                    >
                        ลืมรหัสผ่าน?
                    </span>
                </div>

                {/* ปุ่มเข้าสู่ระบบ */}
                <button type="submit" style={submitBtnStyle}>
                    เข้าสู่ระบบ
                </button>

                {/* ลิงก์สำหรับสลับไปหน้า Register */}
                <div style={footerLinkContainerStyle}>
                    ยังไม่มีบัญชีผู้ใช้ใช่ไหม? 
                    <span onClick={() => navigate('/register')} style={registerLinkActionStyle}> สมัครสมาชิกได้ที่นี่</span>
                </div>
            </form>
        </div>
    );
}

// ================= 🎨 CSS STYLES OBJECTS =================

// ฉากหลังหน้าเว็บทั้งหมด
const loginPageContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundImage: "linear-gradient(135deg, #cee5ff 0%, #fcfcfc 50%, #ffd6b6 100%)", // สีเดียวกับ Register และหลังจอ Lobby
    fontFamily: "'Kanit', sans-serif",
    padding: '20px',
    boxSizing: 'border-box'
};

// ตัวกล่องฟอร์ม
const loginFormBoxStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '420px', 
    padding: '40px 30px',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(16px)', 
    border: '1px solid rgba(255, 255, 255, 0.7)',
    borderRadius: '24px', 
    boxShadow: '0 15px 35px rgba(41, 65, 75, 0.08)', 
    boxSizing: 'border-box'
};

const logoIconContainerStyle = {
    fontSize: '36px',
    textAlign: 'center',
    marginBottom: '10px'
};

const loginHeaderStyle = {
    textAlign: 'center', 
    margin: '0 0 6px 0', 
    color: '#29414b',
    fontSize: '24px',
    fontWeight: '700'
};

const loginSubHeaderStyle = {
    textAlign: 'center',
    margin: '0 0 30px 0',
    color: '#718096',
    fontSize: '14px',
    fontWeight: '400'
};

const inputGroupContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    marginBottom: '10px' // ลดเหลือ 10px เพื่อเว้นที่ให้ปุ่มลืมรหัสผ่านพอดีๆ
};

const inputWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
};

const labelStyle = {
    fontSize: '13px',
    fontWeight: '600',
    color: '#4a5568',
    paddingLeft: '4px'
};

// ช่องกรอกข้อมูล
const inputFieldStyle = {
    width: '100%',
    padding: '12px 16px',
    boxSizing: 'border-box',
    border: '1px solid #e7d7d1', 
    borderRadius: '14px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    fontSize: '14px',
    fontFamily: "'Kanit', sans-serif",
    color: '#2d3748',
    outline: 'none',
    transition: 'all 0.25s ease'
};

// ตัวหนังสือปุ่มลืมรหัสผ่าน
const forgotPasswordLinkStyle = {
    fontFamily: "'Kanit', sans-serif",
    fontSize: '13px',
    color: '#718096',
    cursor: 'pointer',
    textDecoration: 'underline',
    transition: 'color 0.2s ease',
    fontWeight: '500'
};

// ปุ่มกดเข้าสู่ระบบ
const submitBtnStyle = {
    width: '100%',
    padding: '14px', 
    cursor: 'pointer',
    backgroundImage: 'linear-gradient(rgb(231, 163, 146) 0%, rgb(207, 119, 119) 100%)', // สี joinRoomButton ประจำตัวเดฟโอ๊ต
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: '600',
    fontFamily: "'Kanit', sans-serif",
    boxShadow: '0 4px 12px rgba(207, 119, 119, 0.25)',
    transition: 'transform 0.15s ease, opacity 0.2s',
    outline: 'none'
};

const footerLinkContainerStyle = {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '13px',
    color: '#718096'
};

// ตัวหนังสือคลิกขยับสลับหน้าไป Register
const registerLinkActionStyle = {
    color: '#cf7777', 
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
    transition: 'color 0.2s'
};

export default Login;