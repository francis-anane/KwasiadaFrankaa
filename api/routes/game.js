// ./routes/game.js
import express from 'express';
import GameController from '../controllers/GameController';
import gameModel from '../models/GameModel';

const gameRouter = express.Router();

// Game routes
gameRouter.post('/joinGame', GameController.joinGameHandler);
gameRouter.post('/makeMove', GameController.makeMoveHandler);
gameRouter.get('/getGameState', GameController.gameStateHandler);

// Helper functions for socket events
function handlePlayerJoin(socket, player) {
  if (gameModel.addPlayer(player, socket.id)) {
    // Send initial game state to the newly joined player
    socket.emit('gameState', gameModel.getGameState());
    // Broadcast to other players that a new player has joined
    socket.broadcast.emit('playerJoined', player);
  } else {
    // Inform the player that the game is full
    socket.emit('gameFull');
  }
}

function handlePlayerMove(socket, data, io) {
  const { row, col } = data;
  if (gameModel.makeMove(row, col, socket.id)) {
    const winner = gameModel.checkWinner();
    io.emit('gameState', gameModel.getGameState());
    if (winner) {
      io.emit('gameOver', { winner });
    }
  } else {
    // Inform the player that the move is invalid
    socket.emit('invalidMove');
  }
}

function handlePlayerDisconnect(socket, io) {
  console.log('A user disconnected');
  // Implement logic to handle player disconnection
  gameModel.removePlayer(socket.id);
  io.emit('playerDisconnected', socket.id);
}

// Set up socket.io connections
export default (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');


  });

  return gameRouter;
};
