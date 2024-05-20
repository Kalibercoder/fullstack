import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        fetch('http://localhost:3000/login', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.text())
        .then(data => {
            if (data === 'Login successful') {
                navigate('/message'); 
            } else {
                window.alert(`Error: ${data}`);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    return (
        <div className='formparent'>
            <h1>FEIDIPPIDES</h1>
            <form className="loginform" onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" value={username} onChange={e => setUsername(e.target.value)} />

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />

                <button type="submit">Login</button>
                <a href="http://localhost:5173/register">Create an account</a>
            </form>
            <h2>CHERETE NIKOMEN</h2>
        </div>
    );
};

export default LoginPage;