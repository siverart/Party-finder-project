import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Navbar from './pages/Navbar'


function App() {
  return (
    <div>
        <Navbar />
      
      <Routes>
        <Route path="/" element={<Navigate to="/login"/>}/>

        <Route path="/register" element={<Register />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/profile" element={<Profile />}/>

      </Routes>
    </div>
  )
    
}

export default App
