
/* 
Content directions
    1. Module imports
    2. Jwt token
    3. Mysql connection and querys
    4. socket.io
    5. Routes handlers
    6. Login
    7. Message post
    8. Profile img
    9. Server listening
*/

// 1. module imports
const express = require('express');
const multer = require('multer');
const upload = multer( {dest: 'uploads/'});
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());


// 2. jwt token 
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// 3. Mysql connection and querys
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Pool1234az',
    database: 'messageback',
    insecureAuth : true
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');

    
    db.query(
        `CREATE TABLE IF NOT EXISTS messages (
            messageId VARCHAR(255),
            id char(36),
            message VARCHAR(255) NOT NULL,
            username char(36),
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        (err, result) => {
            if (err) throw err;
            console.log("Messages table created/exists");
        }
    );

    db.query(
        `CREATE TABLE IF NOT EXISTS profile_images (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            username VARCHAR(255), 
            img LONGBLOB
        )`,
        (err, result) => {
            if (err) throw err;
            console.log("Profile Images table created/exists");
        }
    );
});


// 4. Socket.io
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"], 
        allowedHeaders: ["my-custom-header"], 
        credentials: true 
    }
});


// cors

app.use(cors({ origin: 'http://localhost:5173' }));

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('message', (message) => {
        console.log('Message received:', message);
        const query = 'INSERT INTO messages (message, messageId, id, username) VALUES (?, ?, ?, ?)';
        db.query(query, [message, socket.id, null, null], (err, result) => {
            if (err) throw err;
        });
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Routes handlers

app.post('/messageback', (req, res) => {
    const { username, email, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? OR email = ?';

    db.query(query, [username, email], (err, result) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).send('Server error');
        } else if (result.length > 0) {
            const conflict = result[0].username === username ? 'Username' : 'Email';
            res.status(409).send(`${conflict} already exists`);
        } else {
            // Insert the new user into the database...
        }
    });
});

// 6. Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';

    db.query(query, [username], (err, result) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).send('Server error');
        } else if (result.length === 0) {
            res.status(401).send('Invalid username or password');
        } else {
            bcrypt.compare(password, result[0].password, (err, isMatch) => {
                if (err) {
                    console.error('Error:', err);
                    res.status(500).send('Server error');
                } else if (!isMatch) {
                    res.status(401).send('Invalid username or password');
                } else {
                   // res.status(200).send('Login successful');
                    const user = { name: username };
                    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
                    res.json({ accessToken: accessToken });
                }
            });
        }
    });
});

// 7. Message post
app.post('/send-message', (req, res) => {
    const message = req.body.message;
    const userId = req.body.userId;

    // Insert the message into the messages table
    db.query(
        "INSERT INTO messages (text, userId) VALUES (?, ?)",
        [message, userId],
        (err, result) => {
            if (err) {
                console.error('Error:', err);
                res.status(500).send('Server error');
            } else {
                res.status(200).send('Message sent');
            }
        }
    );
});


// 8. Profile img 

app.get('/profile/:username', (req, res) => {
    db.query(
        "SELECT img FROM profile_images WHERE username = ?",
        [req.params.username],
        (err, result) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            } else {
                if (result.length > 0) {
                    // Convert the image data to a base64 string
                    const img = Buffer.from(result[0].img).toString('base64');

                    res.send(img);
                } else {
                    res.sendStatus(404);
                }
            }
        }
    );
});

// 9. server listening
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});