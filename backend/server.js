const express = require('express');
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
app.use(cors());
app.use(bodyParser.json());

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
            id INT AUTO_INCREMENT PRIMARY KEY,
            message VARCHAR(255) NOT NULL,
            type VARCHAR(255) NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        (err, result) => {
            if (err) throw err;
            console.log("Messages table created/exists");
        }
    );
});

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"], 
        allowedHeaders: ["my-custom-header"], 
        credentials: true 
    }
});


io.on('connection', (socket) => {
    const userId = uuidv4();
    socket.emit('userId', userId);

    socket.on('message', (message) => {
        console.log('Message received:', message);

        const query = 'INSERT INTO messages (message) VALUES (?)';
        db.query(query, [message], (err, result) => {
            if (err) throw err;
        });
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.use(express.json());

app.post('/messageback', (req, res) => {
    const { username, email, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? OR email = ?';

    db.query(query, [username, email], (err, result) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).send('Server error');
        } else if (result.length > 0) {
            const conflict = result[0].username === username ? 'Username' : 'Email';
            res.status(409).send(`${conflict} already taken`);
        } else {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    console.error('Error:', err);
                    res.status(500).send('Server error');
                    return;
                }

                const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
                db.query(insertQuery, [username, email, hash], (err, result) => {
                    if (err) {
                        console.error('Error:', err);
                        res.status(500).send('Server error');
                    } else {
                        res.status(200).send('User registered successfully');
                    }
                });
            });
        }
    });
});

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


server.listen(3000, () => {
    console.log('Server is running on port 3000');
});