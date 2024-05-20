import React, { useState } from 'react';
import './index.css';


const RegisterForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        fetch('http://localhost:3000/messageback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password, dbPassword: 'Pool1234az' })
        })
        .then(response => response.text())
        .then(data => {
            if (data === 'User registered successfully') {
                window.alert('Success: User registered successfully');
                window.location.href = '/'; 
            } else {
                window.alert(`Error: ${data}`);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    return (
        <div className='register'>
        <form onSubmit={handleSubmit}>
            
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" value={username} onChange={handleUsernameChange} />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={password} onChange={handlePasswordChange} />
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" value={email} onChange={handleEmailChange} />
            <button type="submit">Register</button>
        </form>
        </div>
    );
};

export default RegisterForm;