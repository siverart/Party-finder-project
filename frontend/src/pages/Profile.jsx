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
    const [ rating, setRating ] = useState(0);
    const [ oldPassword, setOldPassword ] = useState("");
    const [ newPassword, setNewPassword ] = useState("");
    const [ isContactModalOpen, setIsContactModalOpen ] = useState(false);
    const [ isTagModalOpen, setIsTagModalOpen ] = useState(false);
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
            setDisplayName(user.displayName)
            setDescription(user.description)
            setContacts(user.contacts)
            setTags(user.tags)
            setRating(user.rating)
        } catch (error) {
            console.error('Error fetching profile data', error)
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
        const token = localStorage.getItem('token');
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
            setNewIsShare("")
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
            )
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
        setIsTagModalOpen(false)
        } catch (error) {
            console.error("Add tag unsuccessful", error)
        }
    }
    const handleDeleteTag = async (deletedTag) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete('http://localhost:5000/api/profile/delete-tag', 
                {
                    data : {tag : deletedTag},
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
        
    ) 
    
}
export default Profile;