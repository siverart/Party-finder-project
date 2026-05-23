import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login(){
    const [ username , setUsername ] = useState("")
    const [ password , setPassword ] = useState("")
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password })
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('username', response.data.username)
            alert("เข้าสู่ระบบสำเร็จ");
            navigate('/profile');//โยนเข้าหน้านี้ไปก่อน ในอนาคตจะโยนไปหน้เา lobbyแทน

        } catch (err) {
            alert( err.response.data.message );
        }
    };
    const handleResetPassword = async (e) => {
        e.preventDefault();
        navigate('/reset-password')//ส่งไปอีกหน้าที่จะมี form email ให้กรอก
        
    };
    return (<div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'rgb(240, 227, 221)'
    }}
>
    <form 
        onSubmit={handleLogin}
        style={{
            display: 'flex',
            flexDirection: 'column',
            width: '300px',
            gap:'15px',
            padding: '30px',
            backgroundColor: 'rgb(200, 208, 225)',
            border: '1px solidrgb(255, 255, 255)',
            borderRadius: '8px',
            boxShadow: '0px 10px 13px rgba(0, 0, 0, 0.4)',

        }}
    
    
    >
        <h2 style={{ fontFamily: " 'Kanit' , sans-serif ",textAlign: 'center', margin: '0 0 10px 0', color: 'rgb(55, 55, 55)'}}>Login</h2>


        <input 
            placeholder="Username" 
            onChange={(e) => setUsername(e.target.value)} 
            style={{
                fontFamily: " 'Kanit' , sans-serif ",
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '16px',
                backgroundColor: 'rgb(229,229,229)',
                color: '#333',
                outline: 'none', // ปิดเส้นขอบสีดำหนาๆ ตอนกดคลิกพิมพ์
                boxShadow : '0 2px 4px rgba(0, 0, 0, 0.12)'
                
            }}
            />
        <input 
            type="password" 
            placeholder="Password" 
            onChange={(e) => setPassword(e.target.value)} 
            style={{
                fontFamily: " 'Kanit' , sans-serif ",
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '16px',
                backgroundColor: 'rgb(229, 229, 229)',
                color: '#333',
                outline: 'none',
                boxShadow : '0 2px 4px rgba(0, 0, 0, 0.12)'
            }}
            />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span 
                onClick={handleResetPassword} // ผูกฟังก์ชัน navigate ที่คุณเขียนไว้
                style={{ 
                    fontFamily: " 'Kanit' , sans-serif ",
                    fontSize: '14px', 
                    color: '#4A6B64', 
                    cursor: 'pointer',
                    textDecoration: 'underline' // ขีดเส้นใต้ให้รู้ว่าเป็นลิงก์กดได้
                }}
                onMouseOver={(e) => e.target.style.color = '#2C3E3B'} // เอฟเฟกต์เวลาเอาเมาส์มาชี้
                onMouseOut={(e) => e.target.style.color = '#4A6B64'}
            >
                ลืมรหัสผ่าน?
            </span>
        </div>

        <button type="submit" style={{ 
            fontFamily: " 'Kanit' , sans-serif ",
            padding: '10px', 
            cursor: 'pointer',
            backgroundColor: '#7A9D96',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            boxShadow : '0 2px 4px rgba(0, 0, 0, 0.12)'
            }}
            >
            เข้าสู่ระบบ
            </button>
    </form>
    </div>
);
}
export default Login;