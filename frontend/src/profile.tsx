import React, { useState } from 'react';

const Profile: React.FC = () => {
    const [profileImg, setProfileImg] = useState<string | null>(null);
    const [name, setName] = useState<string>('');

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImg(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    return (
        <div>
            <h1>Profile Page</h1>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {profileImg && <img src={profileImg} alt="Profile" />}
            <input type="text" value={name} onChange={handleNameChange} placeholder="Namechanger" />
        </div>
    );
};

export default Profile;