import { useState, FormEvent, } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

interface IResponseData {
    accessToken?: string;
    [key: string]: any;
}

interface IError {
    message: string;
}

const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        fetch('http://localhost:3000/login', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Invalid username or password');
            }
            return response.json();
        })
        .then((data: IResponseData) => {
            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                if (localStorage.getItem('accessToken')) {
                    navigate('/message'); 
                } else {
                    throw new Error('Failed to store access token');
                }
            } else {
                throw new Error('Invalid username or password');
            }
        })
        .catch((error: IError) => {
            alert(error.message);
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