
/* 
Content directions
    1. Module imports
    2. Jwt token
    3. Mysql connection and querys
    4. socket.io
    5. Routes handlers // Register
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
const cookieParser = require('cookie-parser');
const fs = require('fs').promises

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser()); // httpOnly secure SameSite 


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
    password: 'Pool1234az',  // <--- Change this to your MySQL password
    database: 'messageback', // <--- Change this to your MySQL database name
    insecureAuth : true
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');

    db.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId CHAR(36) UNIQUE,
        username VARCHAR(255), 
        email VARCHAR(255), 
        password VARCHAR(255)
    )`,
    (err, result) => {
        if (err) throw err;
        console.log("Users table created/exists");

        db.query(
            `CREATE TABLE IF NOT EXISTS messages (
                messageId VARCHAR(255),
                userId CHAR(36),
                message VARCHAR(255) NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(userId)
            )`,
            (err, result) => {
                if (err) throw err;
                console.log("Messages table created/exists");
            }
        );
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



// Routes handlers

// 5. Register
app.post('/messageback', (req, res) => {
    const { username, email, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? OR email = ?';

    bcrypt.hash(password, 10, (err, hashedPassword) => {
    db.query(query, [username, email], (err, result) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).send('Server error');
        } else if (result.length > 0) {
            const conflict = result[0].username === username ? 'Username' : 'Email';
            res.status(409).send(`${conflict} already exists`);
        } else {
            const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            db.query(insertQuery, [username, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error:', err);
                    res.status(500).send('Server error');
                } else {
                    res.status(201).send('User registered successfully');
                }
            });
        }
    });
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

io.on('connection', (socket) => {
    console.log('User connected');

    // Listen for a new event 'set-username'
    socket.on('set-username', (username) => {
        // Associate the username with the socket
        socket.username = username;
    
        const query = 'SELECT userId FROM users WHERE username = ?';
        db.query(query, [username], (err, result) => {
            if (err) throw err;

            // If a user with this username exists, set socket.userId
            if (result.length > 0) {
                socket.userId = result[0].userId;

                // Emit a new event 'username-set'
                socket.emit('username-set');
            }
        });
    });

    socket.on('message', (message) => {
        console.log('Message received:', message);
        const query = 'INSERT INTO messages (message, messageId, userId) VALUES (?, ?, ?)';
        db.query(query, [message, socket.id, socket.userId], (err, result) => {
            if (err) throw err;
        });
        io.emit('message', {username: socket.username, message: message});
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


// 8. Profile img 
// Not working

app.post('/upload', upload.single('image'), async (req, res) => {
    const imageFile = req.file; // this is the uploaded file
    const username = req.body.username;

    try {
        // Read the file into a Buffer
        const imageBuffer = await fs.readFile(imageFile.path);

        // Insert the Buffer into the database
        db.query(
            "INSERT INTO profile_images (username, img) VALUES (?, ?)",
            [username, imageBuffer],
            (err, result) => {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                } else {
                    res.json({ imageUrl: '/profile/' + username });
                }
            }
        );
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.get('/profile/:username', (req, res) => {
    const username = req.params.username;

    db.query(
        "SELECT img FROM profile_images WHERE username = ?",
        [username],
        (err, result) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            } else {
                if (result.length > 0) {
                    
                    res.setHeader('Content-Type', 'image/jpeg'); 
                
                    res.send(result[0].img);
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