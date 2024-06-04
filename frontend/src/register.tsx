import React, { useState } from 'react';
import './index.css';

// Define the RegisterForm component
const RegisterForm: React.FC = () => {
    // Define state variables for username, email, and password
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Event handler for username input change
    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    // Event handler for email input change
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    // Event handler for password input change
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    // Event handler for form submission
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Send a POST request to the server with user registration data
        fetch('http://localhost:3000/messageback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password, dbPassword: 'Pool1234az' })
        })
        .then(response => response.text())
        .then(data => {
            // Handle the response from the server
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

    // Render the RegisterForm component
    return (
        <div className='register'>
            <form onSubmit={handleSubmit}>
                {/* Username input */}
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" value={username} onChange={handleUsernameChange} />

                {/* Password input */}
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={password} onChange={handlePasswordChange} />

                {/* Email input */}
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" value={email} onChange={handleEmailChange} />

                {/* Submit button */}
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterForm;