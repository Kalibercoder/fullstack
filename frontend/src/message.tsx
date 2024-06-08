import React, { useState, KeyboardEvent, useEffect } from 'react';
import io from 'socket.io-client';
const socket = io('http://localhost:3000'); // Connect to the socket.io server

type Message = {
    text: string;
    userId: string;
    username: string;
};

const ChatRoom: React.FC = () => {
    const username = localStorage.getItem('username'); // Get the username from localStorage
    const [userId, setUserId] = useState(null); // State to store the user ID
    const [text, setText] = useState(""); // State to store the input text
    const [messages, setMessages] = useState<Message[]>([]); // State to store the messages

    useEffect(() => {
        
            // Emit the 'set-username' event with the username from the global state
        socket.emit('set-username', username);
        socket.on('userId', (userId) => {
            setUserId(userId); // Set the user ID received from the server
        });
    }, []);

    useEffect(() => {
        socket.on('message', (messageObject) => {
            console.log('Received message:', messageObject.message);
            setMessages(prevMessages => [...prevMessages, { text: messageObject.message, username: messageObject.username, userId: 'other'}]); // Add the received message to the messages state
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
                {messages.map((message, index) => (
                 <p key={index}>
                    <strong>{message.userId === userId ? 'You' : message.username}: </strong> {message.text}
                 </p>
                ))}
                </ul>
            </div>
            <input className='chatinput' type="text" value={text} onChange={handleInputChange} onKeyPress={handleKeyPress} />
            {/* Render the input field */}
        </div>
    );
};

const MessagePage: React.FC = () => {
    return (
        <div>
            <h1>FEIDIPPIDES</h1>
            <a href="/profile"><h2>Profile Page</h2></a>
            <ChatRoom /> {/* Render the ChatRoom component */}
        </div>
    );
};

export default MessagePage;