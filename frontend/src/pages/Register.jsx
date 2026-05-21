import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Register(){
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ email , setEmail ] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', { username, password, email })
            alert("สมัครสมาชิกสำเร็จ");
            navigate('/login');
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgrounColor: '#f5f5f5'
        }}
    >
        <form 
            onSubmit={handleRegister}
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '300px',
                gap:'15px',
                padding: '30px',
                backgroundColor: '#D3D3D3',
                border: '1px solidrgb(255, 255, 255)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(77, 53, 53, 0.1)'
            }}
        
        
        >
            <h2 style={{ textAlign: 'center', margin: '0 0 10px 0', color: '#333'}}>Register</h2>


            <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

            <button type="submit" style={{ 
                padding: '10px', 
                cursor: 'pointer',
                backgroundColor: '#7A9D96',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold'
                }}
                >
                สมัครสมาชิก
                </button>
        </form>
    
        </div>
        
);
}
export default Register;