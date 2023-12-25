// ./routes/index.js

import express from 'express';
import path from 'path';

const indexRouter = express.Router();

// Function to send a file safely
function sendFileSafe(res, fileName) {
  const filePath = path.join(path.dirname(new URL(import.meta.url).pathname), '../public', fileName);
  console.log('Sending file:', filePath);

  // Send the file with proper error handling
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err.message);
      res.status(500).send('Internal Server Error');
    }
  });
}

// Define a route for the root URL
indexRouter.get('/', (req, res) => {
  // Render the index.html file from the public directory
  sendFileSafe(res, 'index.html');
});

// Define a route for the /gameBoard URL
indexRouter.get('/gameBoard', (req, res) => {
  // Render the game.html file from the public directory
  sendFileSafe(res, 'game.html');
});

// // single player game
// indexRouter.post('/api/startSinglePlayerGame', (req, res) => {
//   try {
//     // Extract current player information from the request body
//     const currentPlayer = req.body.currentPlayer;

//     // Trigger the single-player gameplay logic here using your GameModel
//     gameModel.singlePlayerGamePlay(currentPlayer.gameBoard, );

//     // Send the necessary information for the UI to create the game board and objects
//     const gameSetupData = {
//       gameBoard: gameModel.getGameState().gameBoard,
//       currentPlayer: gameModel.getCurrentPlayer(),
//     };

//     res.json({ success: true, gameSetupData });
//   } catch (error) {
//     console.error('Error starting single-player game:', error.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


export default indexRouter;
