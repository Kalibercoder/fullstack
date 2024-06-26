
// This is the Profile component. 
// It displays the username and a file input field to upload a profile image.
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
    const [aboutMe] = useState('');
    const [username, setUsername] = useState("");
    const [profileImg, setProfileImg] = useState("");

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/profile', { aboutMe });
            setUsername(response.data.username);
            setProfileImg(response.data.profileImg);
        } catch (error) {
            console.error(error);
        }
    }
    
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append('image', file);
            formData.append('username', username);
    
            try {
                const response = await axios.post('http://localhost:3000/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
    
                setProfileImg(response.data.imageUrl);
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <div>
            <h1>{username}'s Profile Page!</h1>
            <a href="/message"><h2>Messageboard</h2></a>
            <form className='profile-form' onSubmit={handleFormSubmit}>
                <div className='img-upload-container'>
                    <input className='img-input' type="file" accept="image/*" onChange={handleImageUpload} />
                </div>
                <div className='about-box'>
                    {profileImg && <img src={profileImg} alt="Profile" />}
                </div>
                <input type="text" placeholder="Write something about yourself!" />
            </form>
        </div>
    );
};

export default Profile;