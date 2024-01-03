// ./models/GameModel.js
import PlayerModel from './PlayerModel.js';

class GameModel {
  constructor(io) {
    this.io = io;
    this.players = [];
    this.gameBoard = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];

    this.nextPlayer = null // The player to make move
    this.winner = null; // The winner of the game
    
  }

  // Initialize the game board
  initializeGameBoard() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.gameBoard[i][j] = ''; // Initialize with empty values
      }
    }
  }

  setPlayerColor() {
    const symbolColors = ['red', 'blue'];
  
    // Choose a random index from the symbolColors array
    const randomIndex = Math.floor(Math.random() * symbolColors.length);
  
    // Assign the chosen color to the 'player' variable
    const playerColor = symbolColors[randomIndex];
  
    // Assign the other color to the 'opponent' variable
    const opponentColor = symbolColors.find((name, index) => index !== randomIndex);
  
    return { playerColor, opponentColor };
  }
  
  

  // Add a player to the game
  // addPlayer(playerId, socketId) {
  //   let playerData;

  //   // Fetch player data by ID
  //   return PlayerModel.Model.findById(playerId)
  //     .then((foundPlayer) => {
  //       if (!foundPlayer) {
  //         throw new Error('Error fetching player data');
  //       }

  //       playerData = foundPlayer;
  //       const symbolColor = this.players.length === 0 ? 'red' : 'blue';
  //       this.players.push({ ...playerData, symbolColor, socketId });

  //       return { success: true, player: { ...playerData, symbolColor } };
  //     })
  //     .catch((error) => {
  //       console.error('Error adding player to the game:', error.message);
  //       throw new Error('Internal Server Error');
  //     });
  // }

  // Method to simulate computer opponent game play
  singlePlayerGame(player) {
    try {
      // Horizontal Moves From Top To Bottom Check
      for (let row = 0; row < 3; row++) {
        // Horizontal Row Defends Move
        if (player.gameBoard[row][0] === player.playerSymbol && player.gameBoard[row][1] === player.playerSymbol) {
          player.gameBoard[row][2] = player.opponentSymbol;
          return player;
        } else if (player.gameBoard[row][0] === player.playerSymbol && player.gameBoard[row][2] === player.playerSymbol) {
          player.gameBoard[row][1] = player.opponentSymbol;
          return player;
        } else if (player.gameBoard[row][1] === player.playerSymbol && player.gameBoard[row][2] === player.playerSymbol) {
          player.gameBoard[row][0] = player.opponentSymbol;
          return player;
        }
        // Horizontal Row Offends Move Check
        if (player.gameBoard[row][0] === '' && player.gameBoard[row][1] === player.opponentSymbol && player.gameBoard[row][2] === player.opponentSymbol) {
          player.gameBoard[row][0] = player.opponentSymbol;
          return player;
        } else if (player.gameBoard[row][0] === player.opponentSymbol && player.gameBoard[row][2] === '' && player.gameBoard[row][1] === player.opponentSymbol) {
          player.gameBoard[row][2] = player.opponentSymbol;
          return player;
        } else if (player.gameBoard[row][1] === player.opponentSymbol && player.gameBoard[row][2] === player.opponentSymbol && player.gameBoard[row][0] === '') {
          player.gameBoard[row][0] = player.opponentSymbol;
          return player;
        }
      }

      // Vertical Moves From Left To Right Check
      for (let col = 0; col < 3; col++) {
        // Vertical Column Defends Move
        if (player.gameBoard[0][col] === player.playerSymbol && player.gameBoard[1][col] === player.playerSymbol) {
          player.gameBoard[2][col] = player.playerSymbol;
          return player;
        } else if (player.gameBoard[0][col] === player.playerSymbol && player.gameBoard[2][col] === player.playerSymbol) {
          player.gameBoard[1][col] = player.playerSymbol;
          return player;
        } else if (player.gameBoard[1][col] === player.playerSymbol && player.gameBoard[2][col] === player.opponentSymbol) {
          player.gameBoard[0][col] = player.playerSymbol;
          return player;
        }
        // Vertical Column Offends Move Check
        if (player.gameBoard[0][col] === '' && player.gameBoard[1][col] === player.playerSymbol && player.gameBoard[2][col] === player.playerSymbol) {
          player.gameBoard[0][col] = player.playerSymbol;
          return player;
        } else if (player.gameBoard[0][col] === player.playerSymbol && player.gameBoard[2][col] === '' && player.gameBoard[1][col] === player.playerSymbol) {
          player.gameBoard[2][col] = player.playerSymbol;
          return player;
        } else if (player.gameBoard[1][col] === player.playerSymbol && player.gameBoard[2][col] === player.playerSymbol && player.gameBoard[0][col] === '') {
          player.gameBoard[0][col] = player.playerSymbol;
          return player;
        }
      }

      // Diagonal Moves From Left To Right Check (Left Diagonal)
      // Left Diagonal Defends Move
      if (player.gameBoard[0][0] === player.opponentSymbol && player.gameBoard[1][1] === player.opponentSymbol) {
        player.gameBoard[2][2] = player.playerSymbol;
        return player;
      } else if (player.gameBoard[0][0] === player.opponentSymbol && player.gameBoard[2][2] === player.opponentSymbol) {
        player.gameBoard[1][1] = player.playerSymbol;
        return player;
      } else if (player.gameBoard[1][1] === player.opponentSymbol && player.gameBoard[2][2] === player.opponentSymbol) {
        player.gameBoard[0][0] = player.playerSymbol;
        return player;
      }
      // Left Diagonal Offends Move Check
      if (player.gameBoard[0][0] === '' && player.gameBoard[1][1] === player.playerSymbol && player.gameBoard[2][2] === player.playerSymbol) {
        player.gameBoard[0][0] = player.playerSymbol;
        return player;
      } else if (player.gameBoard[0][0] === player.playerSymbol && player.gameBoard[2][2] === '' && player.gameBoard[1][1] === player.playerSymbol) {
        player.gameBoard[2][2] = player.playerSymbol;
        return player;
      } else if (player.gameBoard[1][1] === player.playerSymbol && player.gameBoard[2][2] === player.playerSymbol && player.gameBoard[0][0] === '') {
        player.gameBoard[0][0] = player.playerSymbol;
        return player;
      }

      // Diagonal Moves From Right To Left Check (Right Diagonal)
      // Right Diagonal Defends Move
      if (player.gameBoard[0][2] === player.opponentSymbol && player.gameBoard[1][1] === player.opponentSymbol) {
        player.gameBoard[2][0] = player.playerSymbol;
        return player;
      } else if (player.gameBoard[0][2] === player.opponentSymbol && player.gameBoard[2][0] === player.opponentSymbol) {
        player.gameBoard[1][1] = player.playerSymbol;
        return player;
      } else if (player.gameBoard[1][1] === player.opponentSymbol && player.gameBoard[2][0] === player.opponentSymbol) {
        player.gameBoard[0][2] = player.playerSymbol;
        return player;
      }
      // Right Diagonal Offends Move Check
      if (player.gameBoard[0][2] === '' && player.gameBoard[1][1] === player.playerSymbol && player.gameBoard[2][0] === player.playerSymbol) {
        player.gameBoard[0][2] = player.playerSymbol;
        return player;
      } else if (player.gameBoard[0][2] === player.playerSymbol && player.gameBoard[2][0] === '' && player.gameBoard[1][1] === player.playerSymbol) {
        player.gameBoard[2][0] = player.playerSymbol;
        return player;
      } else if (player.gameBoard[1][1] === player.playerSymbol && player.gameBoard[2][0] === '' && player.gameBoard[0][2] === player.playerSymbol) {
        player.gameBoard[2][0] = player.playerSymbol;
        return player;
      }

      // Set the colors that represents symbol for player and opponent for a new game
      const {playerColor, opponentColor} = this.setPlayerColor();
      console.log('playerColor', playerColor);
      console.log('opponentColor', opponentColor);
      player.playerSymbol = playerColor;
      player.opponentSymbol = opponentColor;

      console.log('player', player);
      if(playerColor === 'red') {
        player.gameBoard[1][1] = 'red';
      }
      else{
        player.isYourTurn = true;
      }
      return player;
    } catch (error) {
      console.error(error.message);
    }
  }

    // Check for a winner on the game board
setWinner(player) {
  try {
    console.log('player', player);
    // Check for horizontal wins
    for (let row = 0; row < 3; row++) {
      const rowValues = player.gameBoard[row].join('');
      if (rowValues === player.playerSymbol.repeat(3)) {
        player.hasWon = true;
        return player;
      }
      if (rowValues === player.opponentSymbol.repeat(3)) {
        player.hasWon = false;
        return player;
      }
    }

    // Check for vertical wins
    for (let col = 0; col < 3; col++) {
      const colValues = player.gameBoard.map((row) => row[col]).join('');
      if (colValues === player.playerSymbol.repeat(3)) {
        player.hasWon = true;
        return player;
      }
      if (colValues === player.opponentSymbol.repeat(3)) {
        player.hasWon = false;
        return player;
      }
    }

    // Check for diagonal wins
    const leftDiagonal = this.gameBoard[0][0] + this.gameBoard[1][1] + this.gameBoard[2][2];
    const rightDiagonal = this.gameBoard[0][2] + this.gameBoard[1][1] + this.gameBoard[2][0];

    if (leftDiagonal === player.playerSymbol || rightDiagonal === player.playerSymbol) {
      player.hasWon = true;
      return player;
    }
    if (leftDiagonal === player.opponentSymbol || rightDiagonal === player.opponentSymbol) {
      player.hasWon = false;
      return player;
    }

    // If no winner is found, return null
    return null;
  } catch (error) {
    console.error("Error in setWinner function:", error);
    // Handle the error or rethrow it if needed
    throw error;
  }
}

    // Multiplayer game play logic
    multiplayerGame(player){

    }





  // Switch the turn to the next player
  switchTurn() {
    this.currentPlayerIndex = 1 - this.currentPlayerIndex;
  }

  // Move an object from source to destination on the game board
  moveObject(srcRow, srcCol, destRow, destCol) {
    this.gameBoard[destRow][destCol] = this.gameBoard[srcRow][srcCol];
    this.gameBoard[srcRow][srcCol] = '';
  }

  // Get the current player
  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  // Remove a player based on socket ID
  removePlayer(playerId) {
    this.players = this.players.filter((player) => player.socketId !== playerId);
  }



  // Get the current state of the game
  getGameState() {
    return { gameBoard: this.gameBoard, players: this.players };
  }

  // // Handle player joining the game
  // joinGameHandler(playerData, socketId) {
  //   let playerId;

  //   // Find the player by ID and set their socketId
  //   PlayerModel.Model.findById(playerId)
  //     .then((player) => {
  //       if (player) {
  //         player.socketId = socketId;
  //       }

  //       return this.addPlayer(playerData, socketId);
  //     })
  //     .then((success) => {
  //       if (success) {
  //         this.io.emit('gameState', this.getGameState());
  //       } else {
  //         this.io.to(socketId).emit('error', 'Game is full');
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error adding player to the game:', error.message);
  //       this.io.to(socketId).emit('error', 'Internal Server Error');
  //     });
  // }

  // Check if a position is valid on the game board
  isValidPosition(row, col) {
    return row >= 0 && row < 3 && col >= 0 && col < 3;
  }


  // Handle player making a move
  makeMoveHandler(srcRow, srcCol, destRow, destCol, socketId) {
    try {
      const currentPlayer = this.players.find((player) => player.socketId === socketId);

      if (!currentPlayer) {
        console.error('Player not found:', socketId);
        this.io.to(socketId).emit('error', 'Player not found');
        return;
      }

      // Check if the move is valid
      if (
        this.isValidPosition(srcRow, srcCol) &&
        this.isValidPosition(destRow, destCol) &&
        this.players.length === 2 &&
        currentPlayer === this.getCurrentPlayer()
      ) {
        // Make the move
        this.moveObject(srcRow, srcCol, destRow, destCol);
        this.switchTurn();

        // Check for a winner
        const winner = this.checkWinner();

        // Update game state
        this.io.emit('gameState', this.getGameState());

        // Handle game over
        if (winner) {
          this.io.emit('gameOver', { winner });
        }
      } else {
        this.io.to(socketId).emit('error', 'Invalid move or insufficient players');
      }
    } catch (error) {
      console.error('Error processing move:', error.message);
      this.io.to(socketId).emit('error', 'Internal Server Error');
    }
  }
}

export default GameModel;
