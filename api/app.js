/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan'; // eslint-disable-line import/no-extraneous-dependencies
import http from 'http';
import { Server } from 'socket.io';
import passport from 'passport';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js';
import playerRouter from './routes/player.js';
import ChatModel from './models/ChatModel.js';
import GameModel from './models/GameModel.js';
import AuthModel from './models/AuthModel.js';
import redisModel from './utils/redis.js';
import PlayerModel from './models/PlayerModel.js';
import './utils/db.js';

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server);

// Function to start the server
const startServer = async () => {
  try {
    // Connect to Redis
    await redisModel.openConnection();
    console.log('After Redis connection');
    
    if (redisModel.isAlive()) {
      console.log('Redis is alive');
    } else {
      console.log('Redis is not alive');
    }

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error during server initialization:', error);
  }
};

// Gracefully close the Redis connection on SIGINT
process.on('SIGINT', () => {
  redisModel.closeConnection();
  process.exit();
});

// Initialize Passport authentication for the app
app.use(passport.initialize());
AuthModel.initialize(); // setup passport for local strategy authentication

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set static path
app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Routes
app.use('/api', indexRouter);
app.use('/api', authRouter);
app.use('/api', playerRouter);

// Listen on socket connections
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  const chatModel = new ChatModel(io);
  const gameModel = new GameModel(io);

  // Associate socket ID with player
  socket.on('setSocketId', (playerId) => {
    // Find player by ID and set their socketId
    PlayerModel.Model.findById(playerId)
      .then((player) => {
        if (player) {
          player.socketId = socket.id;
          console.log(`Player ${playerId} connected with socket ID: ${socket.id}`);
        } else {
          console.error(`Player not found for ID: ${playerId}`);
        }
      })
      .catch((error) => {
        console.error('Error setting socket ID:', error);
      });
  });

  // Handle single player move
  socket.on('singlePlayerMove', (data) => {
    console.log('data', data)
    const player = gameModel.singlePlayerGame(data);
    console.log('player', player);
    const gameWinner = gameModel.setWinner(player);
    if (gameWinner) {
      io.emit('gameWinner', gameWinner);
    }
    else {
      io.emit('singlePlayerMove', player);
    }
  });

  // Emitting 'inviteOpponent' event
  socket.on('inviteOpponent', (data) => {
    const { opponentId } = data.opponentId;

    // Emit the invitation to the specified opponent
    io.to(opponentId).emit('invitation', {
      senderId: socket.id,
    });
  });

  // Handle new chat messages
  socket.on('message', (data) => {
    try {
      console.log('data:', data);
      const { player, message } = data;
      chatModel.sendMessage(player, message);
    } catch (error) {
      console.error('Error processing message:', error);
      socket.emit('error', { message: 'An error occurred while processing the message.' });
    }
  });

  // Handle retrieving chat history
  socket.on('getChatHistory', () => {
    const chatHistory = chatModel.getChatHistory();
    socket.emit('chatHistory', chatHistory);
  });

  // Game play sockets
  // Handle player joining
  socket.on('joinGame', (player) => {
    gameModel.joinGameHandler(player, socket.id);
  });

  // Handle player moves
  socket.on('makeMove', (data) => {
    console.log(data)
    const currentPlayerSocketId = socket.id;
    console.log('currentPlayerSocketId:', currentPlayerSocketId);
    const { srcRow, srcCol, destRow, destCol } = data;

    gameModel.makeMoveHandler(srcRow, srcCol, destRow, destCol, currentPlayerSocketId);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    //gameModel.removePlayer(socket.id);
    //const gameState = gameModel.getGameState();
    //io.emit('gameState', gameState);
  });
});

startServer();
export default app; // Export the Express app instance

