import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Profile(){
    const [ displayName, setDisplayName ] = useState("");
    const [ newDisplayName, setNewDisplayName ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ newDescription, setNewDescription ] = useState("");
    const [ contacts , setContacts ] = useState([]);
    const [ newPlatform, setNewPlatform ] = useState("");
    const [ newContactValue, setNewContactValue ] = useState("");
    const [ newIsShare, setNewIsShare ] = useState(false);
    const [ tags , setTags ] = useState([]);
    const [ newTag, setNewTag ] = useState("");
    const [ rating, setRating ] = useState("");
    const [ oldPassword, setOldPassword ] = useState("");
    const [ newPassword, setNewPassword ] = useState("");
    const [ isContactModalOpen, setIsContactModalOpen ] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("กรุณาเข้าสู่ระบบก่อนใช้งาน");
            navigate('/login');
        } else {
            getProfile()
        }
    }, [])

    const getProfile = async() => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.get('http://localhost:5000/api/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const { user } = response.data
            const ratingScore = user.rating
            setDisplayName(user.displayName)
            setDescription(user.description)
            setContacts(user.contacts)
            setTags(user.tags)
            setRating(ratingScore.score)
        } catch (error) {
            console.error('Error fetching profile data', error);

            if (error.response && error.response.status === 401) {
                alert("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
                localStorage.removeItem('token');    
                localStorage.removeItem('username'); 
                navigate('/login');
            }
        }
    }

    const handleUpdateDisplayName = async (e) => {
        e.preventDefault();
        if (!newDisplayName) return;
        const token = localStorage.getItem('token')

        try {
            const response = await axios.patch('http://localhost:5000/api/profile/update-displayName-description', {
                displayName: newDisplayName
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const { message, user } = response.data
            alert(message)
            setDisplayName(user.displayName);
            setNewDisplayName("");
        } catch (error) {
            console.error("Change display name unsuccessful", error)
        }
    }

    const handleUpdateDescription = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.patch('http://localhost:5000/api/profile/update-displayName-description', {
                description: newDescription
            }, {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            });
            const { message , user } = response.data
            alert(message)
            setDescription(user.description);
            setNewDescription("");
        } catch (error) {
            console.error("Change description unsuccessful", error)
        }
    }

    const handleAddContact = async (e) => {
        e.preventDefault();
        if ( !newContactValue || !newPlatform ) return;
        const token = localStorage.getItem('token')
        try {
            const response = await axios.post('http://localhost:5000/api/profile/add-contacts', {
                platform : newPlatform,
                value : newContactValue,
                isShare : newIsShare
            }, {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            });
            const { message, contacts } = response.data
            alert(message)
            setContacts(contacts)
            setNewContactValue("")
            setNewPlatform("")
            setNewIsShare(false)
            setIsContactModalOpen(false)
            
        } catch (error) {
            console.error("Add contact unsuccessful", error)
        }
    } 

    const handleDeleteContact = async (contactId) => {
        if (!contactId) return; 
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(`http://localhost:5000/api/profile/delete-contacts/${contactId}`,
                {
                    headers : {
                        Authorization : `Bearer ${token}`
                    }
                }
            );
            const { message, contacts } = response.data
            setContacts(contacts);
            alert(message)
        } catch (error) {
            console.error("delete contact unsuccessful", error);
        }
    } 

    const handleAddTag = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token')

        try {
            const response = await axios.post('http://localhost:5000/api/profile/add-tag', {
                tag : newTag
            }, {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            });
            const { message, tags } = response.data
            alert(message)
            setTags(tags)
            setNewTag("")
        } catch (error) {
            console.error("Add tag unsuccessful", error)
        }
    }

    const handleDeleteTag = async (deletedTag) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete('http://localhost:5000/api/profile/delete-tag', {
                data : { tagIndex : deletedTag },
                headers: { Authorization: `Bearer ${token}` }
            });
            const { message, tags } = response.data
            alert(message)
            setTags(tags)
            setNewTag("")
        } catch (error) {
            console.error("Delete tag unsuccessful", error)
        }
    }

    const handleResetPasswordInProfile = async (e) => {
        e.preventDefault();
        if ( !oldPassword || !newPassword ) return;

        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('http://localhost:5000/api/profile/resetpassword-in-profile', {
                oldPassword : oldPassword,
                newPassword : newPassword 
            }, {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            });
            alert(response.data.message)
            setNewPassword("")
            setOldPassword("")
        } catch (error) {
            console.error("Reset password unsuccessful", error)
        }
    }

    return (
        <div style={containerStyle}>
            {/* 💳 กล่องบัตรโปรไฟล์ใบใหญ่ตรงกลาง */}
            <div style={profileCardStyle}>
                
                {/* 1. ส่วนหัวการ์ด */}
                <div style={headerSectionStyle}>
                    <div style={avatarWrapperStyle}>
                        <img 
                            src="https://api.dicebear.com/7.x/bottts/svg?seed=Oat" 
                            alt="profile" 
                            style={avatarStyle} 
                        />
                    </div>
                    
                    <h2 style={displayNameTextStyle}>{displayName || "ยังไม่ได้ตั้งชื่อ"}</h2>
                    <span style={ratingBadgeStyle}>⭐ เรตติ้งของคุณ: {rating || 0}/100</span>

                    <form onSubmit={handleUpdateDisplayName} style={inlineFormStyle}>
                        <input 
                            placeholder="เปลี่ยนชื่อ..." 
                            value={newDisplayName}
                            onChange={(e) => setNewDisplayName(e.target.value)}
                            style={inputStyle}
                        />
                        <button type="submit" style={buttonStyle}>บันทึกชื่อ</button>
                    </form>
                </div>

                {/* 2. ส่วนเนื้อหาข้อมูลด้านล่าง */}
                <div style={contentSectionStyle}>
                    
                    {/* 📝 คำแนะนำตัว */}
                    <div style={infoBoxStyle}>
                        <h3 style={sectionTitleStyle}>📝 ข้อมูลแนะนำตัว</h3>
                        <p style={descriptionTextStyle}>{description || "ยังไม่มีคำแนะนำตัวในขณะนี้..."}</p>
                        <div style={inlineFormStyle}>
                            <input 
                                placeholder="ปรับปรุงคำแนะนำตัวของคุณ..." 
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                style={inputStyle}
                            />
                            <button onClick={handleUpdateDescription} style={buttonStyle}>อัปเดต</button>
                        </div>
                    </div>

                    {/* 🏷️ แท็กความสามารถ */}
                    <div style={infoBoxStyle}>
                        <h3 style={sectionTitleStyle}>🏷️ คลังเทคนิค / แท็กความสามารถ</h3>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                            {tags.length > 0 ? (
                                tags.map((tag, index) => (
                                    <div key={index} style={tagChipStyle}>
                                        <span>#{tag}</span>
                                        <button 
                                            onClick={() => handleDeleteTag(index)} 
                                            style={deleteTagButtonStyle}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#718096', fontSize: '14px', margin: 0 }}>ยังไม่มีแท็กความสามารถ</p>
                            )}
                        </div>

                        <form onSubmit={handleAddTag} style={inlineFormStyle}>
                            <input 
                                placeholder="เพิ่มแท็กใหม่ (เช่น เล่นจริงจัง, เน้นชิล...)" 
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                style={inputStyle}
                            />
                            <button type="submit" style={buttonStyle}>เพิ่มแท็ก</button>
                        </form>
                    </div>

                    {/* 📞 ช่องทางติดต่อ */}
                    <div style={infoBoxStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <h3 style={sectionTitleStyle}>📞 ช่องทางการติดต่อ</h3>
                            <button onClick={() => setIsContactModalOpen(true)} style={addContactTriggerButtonStyle}>
                                ✏️ จัดการช่องทาง
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {contacts.length > 0 ? (
                                contacts.map((item) => (
                                    <div key={item._id || item.contactid} style={contactItemStyle}>
                                        <span style={contactPlatformBadgeStyle}>{item.platform}:</span>
                                        <span style={{ marginLeft: '5px', flex: 1, color: '#2d3748', fontSize: '14px' }}>{item.value}</span>
                                        <button 
                                            onClick={() => handleDeleteContact(item._id || item.contactid)} 
                                            style={deleteContactButtonStyle}
                                        >
                                            ลบ
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#718096', fontSize: '14px', margin: 0 }}>ยังไม่มีการเพิ่มช่องทางติดต่อ</p>
                            )}
                        </div>
                    </div>

                    {/* 🔒 เปลี่ยนรหัสผ่าน */}
                    <div style={infoBoxStyle}>
                        <h3 style={sectionTitleStyle}>🔒 เปลี่ยนรหัสผ่าน</h3>
                        <form onSubmit={handleResetPasswordInProfile} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input 
                                type="password"
                                placeholder="รหัสผ่านเดิม" 
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                style={inputStyle}
                            />
                            <input 
                                type="password"
                                placeholder="รหัสผ่านใหม่" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={inputStyle}
                            />
                            <button type="submit" style={{ ...buttonStyle, width: '100%', backgroundImage: 'none', backgroundColor: '#29414b' }}>เปลี่ยนรหัสผ่าน</button>
                        </form>
                    </div>

                </div>
            </div>

            {/* 📦 หน้าต่าง Pop-up (Modal) สำหรับเพิ่มคอนแทค */}
            {isContactModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalBoxStyle}>
                        <h3 style={{ ...sectionTitleStyle, textAlign: 'center', marginBottom: '15px' }}>➕ เพิ่มช่องทางติดต่อใหม่</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label style={labelStyle}>เลือกแพลตฟอร์ม</label>
                            <select 
                                value={newPlatform} 
                                onChange={(e) => setNewPlatform(e.target.value)}
                                style={selectStyle}
                            >
                                <option value="">-- กรุณาเลือก --</option>
                                <option value="Facebook">Facebook</option>
                                <option value="Instagram">Instagram</option>
                                <option value="Line">Line</option>
                                <option value="Valorant">Valorant</option>
                                <option value="LOL">LOL</option>
                                <option value="Discord">Discord</option>
                            </select>

                            <label style={labelStyle}>ไอดี หรือ ลิงก์ติดต่อ</label>
                            <input 
                                placeholder="เช่น Facebook Link, Discord name..." 
                                value={newContactValue}
                                onChange={(e) => setNewContactValue(e.target.value)}
                                style={inputStyle}
                            />

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '5px 0' }}>
                                <input 
                                    type="checkbox" 
                                    id="isShareCheck"
                                    checked={newIsShare}
                                    onChange={(e) => setNewIsShare(e.target.checked)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <label htmlFor="isShareCheck" style={{ fontSize: '13px', cursor: 'pointer', color: '#4a5568', fontWeight: '500' }}>อนุญาตให้ผู้ใช้ทั่วไปเห็นช่องทางนี้</label>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'space-between'  }}>
                                <button onClick={handleAddContact} style={buttonStyle}>บันทึกข้อมูล</button>
                                <button onClick={() => setIsContactModalOpen(false)} style={cancelButtonStyle}>ยกเลิก</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ================= 🎨 CSS STYLES OBJECTS =================

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundImage: "linear-gradient(135deg, #cee5ff 0%, #fcfcfc 50%, #ffd6b6 100%)", // คุมโทนเดียวกับเบื้องหลัง Register/Login
    padding: '40px 20px',
    fontFamily: "'Kanit', sans-serif",
    boxSizing: 'border-box'
};

const profileCardStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '520px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '24px',
    boxShadow: '0 15px 35px rgba(41, 65, 75, 0.06)',
    overflow: 'hidden'
};

const headerSectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '35px 25px',
    background: 'linear-gradient(135deg, rgba(231, 163, 146, 0.2) 0%, rgba(41, 65, 75, 0.05) 100%)', // ไล่มิติเฉดส้มพีชบางเบาให้ชื่อเด่น
    borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
    textAlign: 'center'
};

const avatarWrapperStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '15px',
    border: '3px solid rgba(255, 255, 255, 0.8)',
    boxShadow: '0 4px 15px rgba(41, 65, 75, 0.06)'
};

const avatarStyle = {
    width: '85px',
    height: '85px',
    borderRadius: '50%',
    objectFit: 'cover'
};

const displayNameTextStyle = {
    fontSize: '24px',
    margin: '0 0 6px 0',
    fontWeight: '700',
    color: '#29414b'
};

const ratingBadgeStyle = {
    fontSize: '13px',
    fontWeight: '600',
    backgroundColor: '#fff4df',
    color: '#b7791f',
    padding: '4px 12px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '1px solid #fbe3b5'
};

const contentSectionStyle = {
    padding: '25px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    boxSizing: 'border-box'
};

const infoBoxStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.7)',
    padding: '20px',
    borderRadius: '20px',
    boxShadow: '0 8px 20px rgba(41, 65, 75, 0.02)'
};

const sectionTitleStyle = {
    fontSize: '15px',
    color: '#29414b',
    margin: '0 0 12px 0',
    fontWeight: '700'
};

const descriptionTextStyle = {
    fontSize: '14px',
    color: '#4a5568',
    lineHeight: '1.6',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: '12px 16px',
    borderRadius: '12px',
    margin: '0 0 12px 0',
    border: '1px solid #edf2f7'
};

const inlineFormStyle = {
    display: 'flex',
    gap: '8px',
    width: '100%'
};

const inputStyle = {
    fontFamily: "'Kanit', sans-serif",
    flex: 1,
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid #e7d7d1',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: '#2d3748',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s'
};

const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
};

const buttonStyle = {
    fontFamily: "'Kanit', sans-serif",
    padding: '10px 18px',
    backgroundImage: 'linear-gradient(rgb(231, 163, 146) 0%, rgb(207, 119, 119) 100%)', // สีส้มพีชไล่เฉดของเดฟโอ๊ต
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    boxShadow: '0 4px 12px rgba(207, 119, 119, 0.15)',
    transition: 'opacity 0.2s'
};

const cancelButtonStyle = {
    fontFamily: "'Kanit', sans-serif",
    padding: '10px 18px',
    backgroundColor: '#fff',
    color: '#718096',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
};

const addContactTriggerButtonStyle = {
    fontFamily: "'Kanit', sans-serif",
    background: 'none',
    border: 'none',
    color: '#cf7777',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    textDecoration: 'underline'
};

const tagChipStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#fdeee9',
    color: '#e49486',
    padding: '5px 12px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    border: '1px solid #fcdbd0'
};

const deleteTagButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#cf7777',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '15px',
    padding: '0 0 0 2px',
    lineHeight: 1
};

const contactItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #edf2f7',
    boxSizing: 'border-box'
};

const contactPlatformBadgeStyle = {
    fontSize: '12px',
    fontWeight: '700',
    color: '#29414b',
    paddingRight: '4px'
};

const deleteContactButtonStyle = {
    fontFamily: "'Kanit', sans-serif",
    backgroundColor: 'transparent',
    color: '#e53e3e',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600'
};

const labelStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#718096',
    display: 'block',
    marginBottom: '6px',
    paddingLeft: '2px'
};

// 🔒 สไตล์กล่องลอยเพิ่มคอนแทค (Modal CSS)
const modalOverlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(20, 24, 41, 0.4)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    padding: '20px'
};

const modalBoxStyle = {
    width: '100%',
    maxWidth: '400px',
    backgroundImage: "linear-gradient(135deg, #cee5ff 0%, #fcfcfc 50%, #ffd6b6 100%)", // แบคกราวด์กล่องเล็กใช้ไล่เฉดเข้าคู่กัน
    padding: '30px',
    borderRadius: '24px',
    boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)',
    fontFamily: "'Kanit', sans-serif",
    boxSizing: 'border-box'
};

export default Profile;