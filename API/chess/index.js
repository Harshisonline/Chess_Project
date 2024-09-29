import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Chess } from 'chess.js';
import jwt from 'jsonwebtoken';

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ["GET", "POST"],
    },
});

const games = {};
const waitingPlayers = [];
const SECRET_KEY = 'your_secret_token';

function authenticateToken(socket, next) {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }
    try {
        const user = jwt.verify(token, SECRET_KEY);
        socket.user = user;
        next();
    } catch (err) {
        return next(new Error('Authentication error'));
    }
}

io.use(authenticateToken);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.user.username);

    socket.on('findGame', () => {
        if (waitingPlayers.length > 0) {
            const oppPlayer = waitingPlayers.pop();
            const gameId = generateGameId();
            const newGame = new Chess();

            games[gameId] = newGame;

            socket.join(gameId);
            oppPlayer.join(gameId);

            io.to(gameId).emit('gameStarted', {
                gameId,
                white: socket.user.username,
                black: oppPlayer.user.username,
                wId: socket.id,
                bId:oppPlayer.id
            });
        } else {
            waitingPlayers.push(socket);
            socket.emit('waitingPlayers', 'Waiting for opponent...');
        }
    });

    socket.on('makeMove', ({ gameId, move }) => {
        const game = games[gameId];
        if (game) {
            const result = game.move(move);
            if (result) {
                const fen = game.fen();
                io.to(gameId).emit('moveMade', { gameId, fen });
                if (game.game_over()) {
                    io.to(gameId).emit('gameOver', { gameId, result: game.in_checkmate() });
                    delete games[gameId];
                }
            } else {
                socket.emit('invalidMove', 'Invalid move');
            }
        } else {
            socket.emit('error', 'Game not found');
        }
    });

    socket.on('disconnect', () => {
        const index = waitingPlayers.indexOf(socket);
        if (index > -1) {
            waitingPlayers.splice(index, 1);
        }
        console.log('A user disconnected:', socket.user.username);
    });
});

function generateGameId() {
    return Math.random().toString(36).substr(2, 9);
}

server.listen(4000, () => {
    console.log('Server is running on port 4000');
});
