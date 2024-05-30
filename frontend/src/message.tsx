import React, { useState, KeyboardEvent, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');



const ChatRoom: React.FC = () => {
    const [text, setText] = useState("");
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        socket.on('message', (message: string) => {
            console.log('Received message:', message);
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

    function sendMessage(message: string) {
        fetch('/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
        }) 
    }
    sendMessage('Hello, world!');
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