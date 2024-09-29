import express from 'express';
import bcrypt from 'bcrypt';
import pg from 'pg';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';


const port = 3000;
const app = express();
const saltRounds = 10;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Authentication",
    password: "12345",
    port: 5432
});

db.connect().then(() => {
    console.log('Connected to the database');
}).catch((err) => {
    console.error('Connection error', err.stack);
});

app.use(cors());
app.use(bodyParser.json());


app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        const result = await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [username, hash]);

        res.status(201).send("User Registered Successfully");
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await db.query('SELECT * FROM users WHERE email=$1', [username]);

        if (result.rows.length === 0) {
            return res.status(404).send("User not found");
        }

        const hash = result.rows[0].password;
        const isMatch = await bcrypt.compare(password, hash);
 
        if (!isMatch) {
            return res.status(401).send("Invalid password");
        }

        const token = jwt.sign({ username: result.rows[0].email }, 'your_secret_token', { expiresIn: '24h' });
        res.json({ token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`This server is running on http://localhost:${port}`);
});
