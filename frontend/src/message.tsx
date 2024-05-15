import React, { useState, KeyboardEvent } from 'react';

const ChatRoom: React.FC = () => {
    const [text, setText] = useState("");
    const [messages, setMessages] = useState<string[]>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };

    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setMessages(prevMessages => [...prevMessages, text]);
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