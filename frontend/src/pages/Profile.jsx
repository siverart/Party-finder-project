import { useState, useEffect } from 'react'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'

function Profile(){
    const [ displayName, setDisplayName ] = useState("");
    const [ newDisplayName, setNewDisplayName ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ newDescription, setNewDescription ] = useState("");
    const [ contacts , setContacts ] = useState([]);
    const [ newPlatform, setNewPlatform ] = useState("");
    const [ newContactValue, setNewContactValue ] = useState("");
    const [ newIsShare, setNewIsShare ] = useState("");
    const [ tags , setTags ] = useState([]);
    const [ newTag, setNewTag ] = useState("");
    const [ rating, setRating ] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("กรุณาเข้าสู่ระบบก่อนใช้งาน");
            Navigate('/login');
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
        e.prevendefault();
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
                header : {
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
        e.prevendefault();
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
        e.prevendefault();
        const token = localStorage.getItem('token')

        try {
            const response = await axios.post('http://localhost:5000/api/profile/add-tag',
                {
                    tag : newTag
                
                },
                {
                    header : {
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
                    tag : deletedTag
                },
                {
                    header : {
                        Authorization : `Bearer ${token}`
                    }
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
        e.prevendefault();
    }
    
}
export default Profile;