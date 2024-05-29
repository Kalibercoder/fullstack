import React, { useState, KeyboardEvent, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const ChatRoom: React.FC = () => {
    const [text, setText] = useState("");
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        socket.on('message', (message: string) => {
            setMessages(prevMessages => [...prevMessages, message]);
        }); 
        return () => {
            socket.off('message');  
    };
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };

    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            socket.emit('message', text);
            setText("");
            event.preventDefault(); 
        } 
    };

    return (
        <div className='messageparent'>
            
        <div className='messageboard'>
            <ul>
                {messages.map((message, index) => <li key={index}>{message}</li>)}
            </ul>
            <input className='chatinput' type="text" value={text} onChange={handleInputChange} onKeyPress={handleKeyPress} />
        </div>
            
        </div>
    );
};

const MessagePage: React.FC = () => {
    return (
        <div >
            <h1>FEIDIPPIDES</h1>
            <ChatRoom />
            <h2>CHERETE NIKOMEN</h2>
        </div>
    );
};

export default MessagePage;