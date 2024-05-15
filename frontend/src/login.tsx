import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // login logic here...
    
        // If login is successful, redirect to the message page:
        navigate('/message');
      };
   
      return (
        <div className='formparent'>
          <h1>FEIDIPPIDES</h1>
          <form className="loginform" onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" />
    
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" />
    
            <button type="submit">Login</button>
            <a href="">Create an account</a>
            </form>
          <h2>CHERETE NIKOMEN</h2>
        </div>
      );
    };

  export default LoginPage;