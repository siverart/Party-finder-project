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

    console.log("=== เช็ค State ปัจจุบัน ===");
    console.log("displayName:", displayName);
    console.log("description:", description);
    console.log("contacts:", contacts);
    console.log("tags:", tags);
    console.log("rating:", rating)

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
                localStorage.removeItem('token');    // ล้างตัวหมดอายุทิ้งซะ
                localStorage.removeItem('username'); // ล้างยูสเซอร์เนมด้วย
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
            const response = await axios.post('http://localhost:5000/api/profile/add-tag',
                {
                    tag : newTag
                
                },
                {
                    headers : {
                        Authorization : `Bearer ${token}`
                    }
                }
        );
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
            const response = await axios.delete('http://localhost:5000/api/profile/delete-tag', 
                {
                    data : { tagIndex : deletedTag },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
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
            const response = await axios.post('http://localhost:5000/api/profile/resetpassword-in-profile', 
                {
                   oldPassword : oldPassword,
                   newPassword : newPassword 
                },
                {
                    headers : {
                        Authorization : `Bearer ${token}`
                    }
                }
            );
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
                
                {/* 1. ส่วนหัวการ์ด (ด้านบนที่เป็นพื้นที่รูปภาพและชื่อ) */}
                <div style={headerSectionStyle}>
                    {/* วงกลมสแตนด์บายสำหรับรูปภาพโปรไฟล์ในอนาคต */}
                    <div style={avatarWrapperStyle}>
                        <img 
                            src="https://api.dicebear.com/7.x/bottts/svg?seed=Oat" // ใช้รูปหุ่นยนต์น่ารักๆ สแตนด์บายไว้ก่อนครับ
                            alt="profile" 
                            style={avatarStyle} 
                        />
                    </div>
                    
                    {/* ชื่อแสดงผล และระบบแก้ไขชื่อ */}
                    <h2 style={displayNameTextStyle}>{displayName || "ยังไม่ได้ตั้งชื่อ"}</h2>
                    <span style={ratingStyle}>⭐ เรตติ้งของคุณ: {rating || 0}/100</span>

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

                {/* 2. ส่วนข้อมูลด้านล่าง (ตัดขอบโค้งมนนุ่มนวลตามเรฟเฟอเรนซ์) */}
                <div style={contentSectionStyle}>
                    
                    {/* 📝 ก้อนคำอธิบายตัวเอง (Description) */}
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

                    {/* 🏷️ ก้อนแท็กความสามารถ (Tags) */}
                    <div style={infoBoxStyle}>
                        <h3 style={sectionTitleStyle}>🏷️ คลังเทคนิค / แท็กความสามารถ</h3>
                        
                        {/* สายพานพ่นแท็กออกมาทีละตัว */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                            {tags.length > 0 ? (
                                tags.map((tag, index) => (
                                    <div key={index} style={tagChipStyle}>
                                        <span>#{tag}</span>
                                        {/* ปุ่มกากบาทเล็กๆ กดเพื่อลบแท็กนั้นๆ */}
                                        <button 
                                            onClick={() => handleDeleteTag(index)} 
                                            style={deleteTagButtonStyle}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#888', fontSize: '14px' }}>ยังไม่มีแท็กความสามารถ</p>
                            )}
                        </div>

                        <form onSubmit={handleAddTag} style={inlineFormStyle}>
                            <input 
                                placeholder="เพิ่มแท็กใหม่ (เช่น เล่นจริงจัง, เน้นชิล, ไม่โยนแน่นอน, คนหล่อ...)" 
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                style={inputStyle}
                            />
                            <button type="submit" style={buttonStyle}>เพิ่มแท็ก</button>
                        </form>
                    </div>

                    {/* 📞 ก้อนช่องทางติดต่อ (Contacts) */}
                    <div style={infoBoxStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <h3 style={sectionTitleStyle}>📞 ช่องทางการติดต่อ</h3>
                            {/* ปุ่มเปิดหน้าต่าง Pop-up สไตล์มินิมอล */}
                            <button onClick={() => setIsContactModalOpen(true)} style={addContactTriggerButtonStyle}>
                                ✏️ จัดการช่องทาง
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {contacts.length > 0 ? (
                                contacts.map((item) => (
                                    <div key={item._id || item.contactid} style={contactItemStyle}>
                                        <span style={{ fontWeight: 'bold', color: '#4A6B64' }}>{item.platform}:</span>
                                        <span style={{ marginLeft: '5px', flex: 1 }}>{item.value}</span>
                                        <button 
                                            onClick={() => handleDeleteContact(item._id || item.contactid)} 
                                            style={deleteContactButtonStyle}
                                        >
                                            ลบ
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#888', fontSize: '14px' }}>ยังไม่มีการเพิ่มช่องทางติดต่อ</p>
                            )}
                        </div>
                    </div>

                    {/* 🔒 ก้อนเปลี่ยนรหัสผ่าน ปลอดภัยไว้ก่อน */}
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
                            <button type="submit" style={{ ...buttonStyle, width: '100%' }}>เปลี่ยนรหัสผ่าน</button>
                        </form>
                    </div>

                </div>
            </div>

            {/* 📦 หน้าต่าง Pop-up (Modal) สไตล์ลอยตัว สำหรับเพิ่มคอนแทค */}
            {isContactModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalBoxStyle}>
                        <h3 style={{ ...sectionTitleStyle, textAlign: 'center', marginBottom: '15px' }}>➕ เพิ่มช่องทางติดต่อใหม่</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#555' }}>เลือกแพลตฟอร์ม</label>
                            <select 
                                value={newPlatform} 
                                onChange={(e) => setNewPlatform(e.target.value)}
                                style={selectStyle}
                            >
                                <option value="">-- กรุณาเลือก --</option>
                                <option value="Facebook">Facebook</option>
                                <option value="Instagram">Instagram</option>
                                <option value="Line">Line</option>
                                <option value="Varolant">Varolant</option>
                                <option value="LOL">LOL</option>
                                <option value="Discord">Discord</option>
            
                            </select>

                            <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#555' }}>ไอดี หรือ ลิงก์ติดต่อ</label>
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
                                />
                                <label htmlFor="isShareCheck" style={{ fontSize: '14px', cursor: 'pointer' }}>อนุญาตให้ผู้ใช้ทั่วไปเห็นช่องทางนี้</label>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button onClick={handleAddContact} style={{ ...buttonStyle, flex: 1 }}>บันทึกข้อมูล</button>
                                <button onClick={() => setIsContactModalOpen(false)} style={cancelButtonStyle}>ยกเลิก</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
    
}

// คัดสรรโทนสีสบายตาอ้างอิงจากหน้า Login และ Navbar ที่คุณส่งมาครับ
const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: 'rgb(240, 227, 221)', // ใช้สีพื้นหลังครีมละมุนแบบเดียวกับหน้า Login เป๊ะๆ
    padding: '40px 20px',
    fontFamily: "'Kanit', sans-serif"
};

const profileCardStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '550px',
    backgroundColor: 'rgb(200, 208, 225)', // สีเทาฟ้าละมุนคุมโทนฟอร์มล็อกอิน
    borderRadius: '24px', // มนๆ ลึกๆ ดูแพงแบบโมเดิร์นแอป
    boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.25)', // เงาดร็อปนุ่มนวลมีมิติ
    overflow: 'hidden' // บังคับให้ลูกที่อยู่ข้างในไม่ล้นทะลุขอบโค้งการ์ด
};

const headerSectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px 20px',
    background: 'linear-gradient(135deg, #7A9D96 0%, #4A6B64 100%)', // เล่นมิติไล่เฉดสีเขียวสบายตาของหน้า Login และ Navbar
    color: 'white',
    textAlign: 'center'
};

const avatarWrapperStyle = {
    width: '110px',
    height: '110px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // วงแหวนกระจกฝ้าล้อมรอบรูปโปรไฟล์
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '15px',
    border: '3px solid white',
    boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
};

const avatarStyle = {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    objectFit: 'cover'
};

const displayNameTextStyle = {
    fontSize: '26px',
    margin: '0 0 5px 0',
    fontWeight: 'bold',
    letterSpacing: '0.5px'
};

const ratingStyle = {
    fontSize: '14px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: '4px 12px',
    borderRadius: '20px',
    marginBottom: '15px'
};

const contentSectionStyle = {
    padding: '25px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    backgroundColor: 'rgb(235, 238, 245)', // สีพื้นกล่องข้อมูลด้านล่างให้ตัดกับส่วนหัว
    borderRadius: '24px 24px 0 0', // เทคนิคขอบโค้งเว้ากลืนเข้าหากันสไตล์แอปชั้นนำ
    boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.05)' // เงาหลืบด้านในเพิ่มมิติลึกตัวอาคาร
};

const infoBoxStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
};

const sectionTitleStyle = {
    fontSize: '16px',
    color: '#333',
    margin: '0 0 12px 0',
    fontWeight: 'bold'
};

const descriptionTextStyle = {
    fontSize: '15px',
    color: '#555',
    lineHeight: '1.6',
    backgroundColor: '#f9f9f9',
    padding: '12px',
    borderRadius: '8px',
    margin: '0 0 12px 0'
};

const inlineFormStyle = {
    display: 'flex',
    gap: '8px',
    width: '100%'
};

const inputStyle = {
    fontFamily: "'Kanit', sans-serif",
    flex: 1,
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    backgroundColor: '#f5f5f5',
    color: '#333',
    fontSize: '14px',
    outline: 'none',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
    transition: 'all 0.2s'
};

const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
};

const buttonStyle = {
    fontFamily: "'Kanit', sans-serif",
    padding: '10px 16px',
    backgroundColor: '#7A9D96', // สีเขียวหลักของแอปคุณ
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    transition: 'background-color 0.2s'
};

const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#954949' // สีแดงแบบเดียวกับปุ่ม Logout ของคุณ
};

const addContactTriggerButtonStyle = {
    fontFamily: "'Kanit', sans-serif",
    background: 'none',
    border: 'none',
    color: '#4A6B64',
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'underline'
};

const tagChipStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    backgroundColor: '#E5EDEA',
    color: '#4A6B64',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    border: '1px solid #D0DFDA'
};

const deleteTagButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#954949',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    padding: '0 2px'
};

const contactItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    fontSize: '14px',
    borderLeft: '4px solid #7A9D96' // ใส่ขีดสีนำสายตาด้านซ้ายเพิ่มความเท่
};

const deleteContactButtonStyle = {
    fontFamily: "'Kanit', sans-serif",
    backgroundColor: '#954949',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 10px',
    cursor: 'pointer',
    fontSize: '12px'
};

// 🔒 สไตล์กล่องลอยกลางอากาศ (Modal CSS)
const modalOverlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)', // ทำฉากหลังมืดแบบโปร่งแสงครอบหน้าจอหลัก
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999 // มั่นใจได้ว่าจะไม่มีอะไรลอยทับหน้าต่างนี้
};

const modalBoxStyle = {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '20px',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
};

export default Profile;