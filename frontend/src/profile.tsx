
// This is the Profile component. 
// It displays the username and a file input field to upload a profile image.
import React, { useState } from 'react';
import axios from 'axios';

function Profile() {
    const [aboutMe, setAboutMe] = useState('');
    const [username, setUsername] = useState("");
    const [profileImg, setProfileImg] = useState("");

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

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Add your logic here to handle the image upload
    }

    return (
        <div>
            <h1>Profile Page</h1>
            <a href="/message"><h2>Messageboard</h2></a>
            <form className='profile-form' onSubmit={handleFormSubmit}>
                <h2>{username}</h2> {/* Display the username */}
                <div className='img-upload-container'>
                    <input className='img-input' type="file" accept="image/*" onChange={handleImageUpload} />
                    {profileImg && <img src={profileImg} alt="Profile" />}
                </div>
                <input type="text" placeholder="Write something about yourself!" />
                <div className='about-box'>
                    
                </div>
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default Profile;