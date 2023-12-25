/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
// ./app.js
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan'; // eslint-disable-line import/no-extraneous-dependencies
import http from 'http';
import { Server } from 'socket.io';
import passport from 'passport';
import { fileURLToPath } from 'url';
import { dirname } from 'path'; // Connect to the database
import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js';
import playerRouter from './routes/player.js';
import ChatModel from './models/ChatModel.js';
import GameModel from './models/GameModel.js';
import AuthModel from './models/AuthModel.js';
import redisModel from './utils/redis.js';
import './utils/db.js';

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server);

const startServer = async () => {
  try {
    await redisModel.openConnection(); // Connect to Redis
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

process.on('SIGINT', () => {
  // Close the Redis connection gracefully before exiting
  redisModel.closeConnection();
  process.exit();
});

// Initialize Passport authentication for app by this call
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

  // Handle new chat messages
  socket.on('sendMessage', (data) => {
    try {
      const { player, message } = data;
      chatModel.sendMessage(player, message);
    } catch (error) {
      console.error('Error processing sendMessage:', error);
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
    const currentPlayerSocketId = socket.id;
    const {
      srcRow, srcCol, destRow, destCol,
    } = data;

    gameModel.makeMoveHandler(srcRow, srcCol, destRow, destCol, currentPlayerSocketId);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    gameModel.removePlayer(socket.id);
    const gameState = gameModel.getGameState();
    io.emit('gameState', gameState);
  });
});

startServer();
export default app; // Export the Express app instance
