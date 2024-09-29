import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Contexts/authContext';
import { useNavigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import { Chessboard } from 'react-chessboard';
import styles from './home.module.css'


const Game = () => {
    const [boardState, setBoardState] = useState('start');
    const { token } = useAuth();
    const [gameId, setGameId] = useState(null);
    const [isWhite, setIsWhite] = useState(false);
    const [socket, setSocket] = useState(null);
    const [orientation, setOrientation] = useState('black');

    
    useEffect(() => {
        const newSocket = io("http://localhost:4000", {
            auth: {
                token,
            },
        });

        setSocket(newSocket);

        newSocket.on('gameStarted', ({ gameId, white, black, wId, bId }) => {
            setGameId(gameId);

            const playerId = newSocket.id;
            setIsWhite(wId === playerId);
            setOrientation(wId === playerId ? 'white' : 'black');   

            console.log(`Game started: ${white} (White) vs ${black} (Black)`);
        });

        newSocket.on('moveMade', ({ fen }) => {
            setBoardState(fen);
        });

        newSocket.on('invalidMove', (message) => {
            console.error(message);
        });

        newSocket.on('gameOver', ({ result }) => {
            console.log(`Game over: ${result}`);
        });

        newSocket.emit('findGame');
        return () => {
            newSocket.disconnect();
        };
    }, [token]);


    function handleChange(source,current){
        const move = { from: source, to: current, promotion: 'q' };
        if (socket) {
            socket.emit('makeMove', { gameId, move });
        }
    }

    return(
        <div className={styles.container}>
           <div className={styles.chessboard}>
            <Chessboard boardOrientation={orientation} id="BasicBoard" position={boardState} onPieceDrop={handleChange} />
           </div>
        </div>
    )
};

export default Game;
