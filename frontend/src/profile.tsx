
// This is the Profile component. 
// It displays the username and a file input field to upload a profile image.
import React, { useState } from 'react';

const Profile = ({ username }: { username: string }) => { 
    const [profileImg, setProfileImg] = useState<string | null>(null);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
    
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                setProfileImg(reader.result as string);
    
                
                const formData = new FormData();
                
                formData.append('profileImg', file);
    
                
                const response = await fetch('http://your-backend-url/profile/upload', {
                    method: 'POST',
                    body: formData,
                });
    
                if (!response.ok) {
                    
                    console.error('Upload failed');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <h1>Profile Page</h1>
            <h2>{username}</h2> {/* Display the username */}
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {profileImg && <img src={profileImg} alt="Profile" />}
            <input type="text" placeholder="Write something about yourself!" />
        </div>
    );
};

export default Profile;