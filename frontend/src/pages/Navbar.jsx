import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        alert("ออกจากระบบสำเร็จ");
        navigate('/login');
    }

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '15px 30px',
            background: 'rgb(114, 145, 143)',
            color: '#fff',
            alignItems: 'center'
        }}>
            <h2 style={{ fontFamily: " 'Kanit' , sans-serif ",color: '#1a1a1a'}}>Game-Finder-App</h2>

            <div style={{ fontFamily: " 'Kanit' , sans-serif ",color: '#1a1a1a' ,display: 'flex', gap: '20px', alignItems: 'center'}}>
                {/*ตรวจสอบ token เพื่อเช็คการ login*/}
                {token ? (
                    <>
                        <span>สวัสดี, { username || 'ผู้ใช้งาน' } 👋</span>
                        <Link to="/profile" style= {{ color : '#1a1a1a', textDecoration: 'none' }}>Profile</Link>

                        <button
                            onClick={handleLogout}
                            style={{ fontFamily: " 'Kanit' , sans-serif ",background: 'rgb(149, 73, 73)',fontWeight : 'bold', color: 'rgb(26, 26, 26)', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                            >
                            Logout
                            </button>
                    </>
                
                ) : (
                    //กรณียังไม่ล็อกอิน
                    <>
                        <Link to="/login" style= {{ 
                            fontFamily: " 'Kanit' , sans-serif ",
                            color: '#1a1a1a',
                            textDecoration:'none'
                            }}>Login</Link>
                        <Link to="/register" style={{ 
                            fontFamily: " 'Kanit' , sans-serif ",
                            color: '#1a1a1a',
                            textDecoration:'none'
                            }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;