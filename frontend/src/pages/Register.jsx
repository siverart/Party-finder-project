import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', { username, password, email })
            alert("สมัครสมาชิกสำเร็จ");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
        }
    };

    return (
        <div style={registerPageContainerStyle}>
            <form onSubmit={handleRegister} style={registerFormBoxStyle}>
                
                {/* โลโก้หรือไอคอนน่ารักๆ ด้านบนฟอร์ม */}
                <div style={logoIconContainerStyle}>🎮</div>
                
                <h2 style={registerHeaderStyle}>สร้างบัญชีผู้ใช้ใหม่</h2>
                <p style={registerSubHeaderStyle}>ค้นหาปาร์ตี้เกมที่ใช่ในสไตล์ของคุณ</p>

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
                        <label style={labelStyle}>อีเมล (Email)</label>
                        <input 
                            type="email" 
                            placeholder="example@email.com" 
                            onChange={(e) => setEmail(e.target.value)} 
                            style={inputFieldStyle}
                            required
                        />
                    </div>

                    <div style={inputWrapperStyle}>
                        <label style={labelStyle}>รหัสผ่าน (Password)</label>
                        <input 
                            type="password" 
                            placeholder="ตั้งรหัสผ่านอย่างน้อย 6 ตัวอักษร..." 
                            onChange={(e) => setPassword(e.target.value)} 
                            style={inputFieldStyle}
                            required
                        />
                    </div>
                </div>

                {/* ปุ่มสมัครสมาชิก (ดักจับธีมไล่เฉดสีพีชจากหน้าหลักของคุณโอ๊ต) */}
                <button type="submit" style={submitBtnStyle}>
                    สมัครสมาชิก
                </button>

                {/* ลิงก์สำหรับสลับไปหน้า Login */}
                <div style={footerLinkContainerStyle}>
                    มีบัญชีอยู่แล้วใช่ไหม? 
                    <span onClick={() => navigate('/login')} style={loginLinkActionStyle}> เข้าสู่ระบบได้ที่นี่</span>
                </div>
            </form>
        </div>
    );
}

// ================= 🎨 CSS STYLES OBJECTS =================

// ฉากหลังหน้าเว็บทั้งหมด 
const registerPageContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundImage: "linear-gradient(135deg, #cee5ff 0%, #fcfcfc 50%, #ffd6b6 100%)", // โทนเดียวกับหลังจอ Lobby/Modal
    fontFamily: "'Kanit', sans-serif",
    padding: '20px',
    boxSizing: 'border-box'
};

// ตัวกล่องคลุมฟอร์มทั้งหมด
const registerFormBoxStyle = {
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

const registerHeaderStyle = {
    textAlign: 'center', 
    margin: '0 0 6px 0', 
    color: '#29414b', // สีน้ำเงินเข้มตัวเด่นของคุณโอ๊ต
    fontSize: '24px',
    fontWeight: '700'
};

const registerSubHeaderStyle = {
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
    marginBottom: '30px'
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

// ช่องกรอกข้อมูลสุดคลีน
const inputFieldStyle = {
    width: '100%',
    padding: '12px 16px',
    boxSizing: 'border-box',
    border: '1px solid #e7d7d1', // สีกรอบส้มอิฐอ่อนๆ จากปุ่มหลัก
    borderRadius: '14px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    fontSize: '14px',
    fontFamily: "'Kanit', sans-serif",
    color: '#2d3748',
    outline: 'none',
    transition: 'all 0.25s ease'
};

// ปุ่มกดสมัครสมาชิก ย้อมด้วยส้มพีชไล่เฉดสะดุดตา
const submitBtnStyle = {
    padding: '14px', 
    cursor: 'pointer',
    backgroundImage: 'linear-gradient(rgb(231, 163, 146) 0%, rgb(207, 119, 119) 100%)', // ดึงมาจาก joinRoomButton ในคลังแสงของคุณโอ๊ต
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

// ตัวหนังสือคลิกขยับเปลี่ยนหน้า
const loginLinkActionStyle = {
    color: '#cf7777', // สีส้มอมชมพูสวยๆ
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
    transition: 'color 0.2s'
};

export default Register;