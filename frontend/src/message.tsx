import React, { useState, KeyboardEvent, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Connect to the socket.io server

type Message = {
    text: string;
    userId: string;
};

const ChatRoom: React.FC = () => {
    const [userId, setUserId] = useState(null); // State to store the user ID
    const [text, setText] = useState(""); // State to store the input text
    const [messages, setMessages] = useState<Message[]>([]); // State to store the messages

    useEffect(() => {
        socket.on('userId', (userId) => {
            setUserId(userId); // Set the user ID received from the server
        });
    }, []);

    useEffect(() => {
        socket.on('message', (message: string) => {
            console.log('Received message:', message);
            setMessages(prevMessages => [...prevMessages, { text: message, userId: 'other'}]); // Add the received message to the messages state
        }); 
        return () => {
            socket.off('message'); // Unsubscribe from the 'message' event when the component is unmounted
        };
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value); // Update the input text state when the input value changes
    };

    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            sendMessage(text); // Call the sendMessage function when the Enter key is pressed
            socket.emit('message', text); // Emit the message to the server
            setText(''); // Clear the input text
            event.preventDefault(); // Prevent the default form submission behavior
        } 
    };

    function sendMessage(message: string) {
        fetch('/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, userId }), // Send the message and user ID to the server
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
        }) 
    }

    return (
        <div className='messageparent'>
            <div className='messageboard'>
                <ul>
                    {messages.map((message, index) => <li key={index} className={message.userId === userId ? 'sent' : 'received'}>{message.text}</li>)}
                    {/* Render the messages as list items */}
                </ul>
            </div>
            <input className='chatinput' type="text" value={text} onChange={handleInputChange} onKeyPress={handleKeyPress} />
            {/* Render the input field */}
        </div>
    );
};

const MessagePage: React.FC = () => {
    return (
        <div >
            <h1>FEIDIPPIDES</h1>
            <ChatRoom /> {/* Render the ChatRoom component */}
            <h2>CHERETE NIKOMEN</h2>
        </div>
    );
};

export default MessagePage;