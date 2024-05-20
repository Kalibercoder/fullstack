const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

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
});

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
                    res.status(200).send('Login successful');
                }
            });
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});