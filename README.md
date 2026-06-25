# 🎮 PartyFinder - Web Application สำหรับค้นหาปาร์ตี้เล่นเกม

[ คำอธิบายสั้นๆ ] 
PartyFinder เป็นเว็บแอปพลิเคชัน Full-stack ที่สร้างขึ้นมาเพื่อแก้ปัญหาของผู้เล่นเกมที่ต้องการหาเพื่อนหรือตี้ (Party) ในการเล่นเกมร่วมกัน โดยเน้นการออกแบบ UI/UX ที่สะอาดตา และใช้งานง่าย

## ✨ ฟีเจอร์เด่นของระบบ (Features)
- **Lobby & Room System**: แสดงรายการห้องปาร์ตี้แบบเรียลไทม์ พร้อมระบบกรองข้อมูล (Filter) ค้นหาตามคุณสมบัติต่างๆ เช่น ชื่อเกม, เวลาเล่น, ระดับแรงค์ เป็นต้น
- **User Authentication**: ระบบสมัครสมาชิก (Register) และเข้าสู่ระบบ (Login) ที่ปลอดภัยด้วย JWT (JSON Web Token)
- **Profile Customization**: หน้าปรับแต่งโปรไฟล์ส่วนตัว สามารถเพิ่มคำแนะนำตัว, แท็กที่บอกตัวตนของคุณ และจัดการช่องทางติดต่อสื่อสาร (Discord, Line ฯลฯ) ได้อย่างอิสระ
- **Rating System**: ระบบคะแนนความประพฤติ เพื่อเสริมสร้างสังคมเกมที่ดี  


## 🛠️ เทคโนโลยีที่เลือกใช้ (Tech Stack)
- **Frontend**: React.js, HTML5, CSS3 (Modern Flexbox Design)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Tools & Libraries**: Axios, React Router, Git, Cursor Editor

## ⚙️ วิธีการติดตั้งเพื่อรันโปรเจกต์บนเครื่องของคุณ (Installation & Setup)

### หลังบ้าน (Backend)
เปิด Terminal เข้าไปที่โฟลเดอร์หลังบ้าน:
   ```bash
   cd backend
   npm install <install package>
   npm run dev <start server>
   ```
### หน้าบ้าน (Frontend)
เปิด Terminal เข้าไปที่โฟลเดอร์หน้าบ้าน:
   ```bash
   cd frontend
   npm install <install package>
   npm run dev <start server>
   ```