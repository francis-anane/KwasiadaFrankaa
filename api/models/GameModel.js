// ./models/Game.js
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

    this.currentPlayerIndex = 0; // Index of the current player in the players array
  }
  // Initialize the game board
  initializeGameBoard() {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          this.gameBoardArray[i][j] = ''; // Initialize with empty values
        }
      }
    }
  

  // Add a player to the game
  async addPlayer(playerId, socketId) {
    try {
      // Fetch player data by ID
      const playerData = await PlayerModel.Model.findById(playerId);

      if (!playerData) {
        throw new Error('Error fetching player data');
      }

      const symbolColor = this.players.length === 0 ? 'red' : 'blue';
      this.players.push({ ...playerData, symbolColor, socketId });

      return { success: true, player: { ...playerData, symbolColor } };
    } catch (error) {
      console.error('Error adding player to the game:', error.message);
      throw new Error('Internal Server Error');
    }
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

  // Check for a winner on the game board
  checkWinner() {
    const playerOne = 'redredred'; // represents win of player with red symbol
    const playerTwo = 'blueblueblue'; // represents win of player with blue symbol

    // Check for horizontal wins
    for (let row = 0; row < 3; row++) {
      const rowValues = this.gameBoard[row].join('');
      if (rowValues === playerOne) {
        return { winner: this.players.find((player) => player.symbolColor === 'red'), type: 'horizontal', row };
      } if (rowValues === playerTwo) {
        return { winner: this.players.find((player) => player.symbolColor  === 'blue'), type: 'horizontal', row };
      }
    }

    // Check for vertical wins
    for (let col = 0; col < 3; col++) {
      const colValues = this.gameBoard.map((row) => row[col]).join('');
      if (colValues === playerOne) {
        return { winner: this.players.find((player) => player.symbolColor === 'red'), type: 'vertical', col };
      } if (colValues === playerTwo) {
        return { winner: this.players.find((player) => player.symbolColor === 'blue'), type: 'vertical', col };
      }
    }

    // Check for diagonal wins
    const leftDiagonal = this.gameBoard[0][0] + this.gameBoard[1][1] + this.gameBoard[2][2];
    const rightDiagonal = this.gameBoard[0][2] + this.gameBoard[1][1] + this.gameBoard[2][0];

    if (leftDiagonal === playerOne || rightDiagonal === playerOne) {
      return { winner: this.players.find((player) => player.symbolColor === 'red'), type: 'diagonal' };
    } if (leftDiagonal === playerTwo || rightDiagonal === playerTwo) {
      return { winner: this.players.find((player) => player.symbolColor === 'blue'), type: 'diagonal' };
    }

    return null;
  }

  // Get the current state of the game
  getGameState() {
    return { gameBoard: this.gameBoard, players: this.players };
  }

  // Handle player joining the game
  joinGameHandler(playerData, socketId) {
    this.addPlayer(playerData, socketId)
      .then((success) => {
        if (success) {
          this.io.emit('gameState', this.getGameState());
        } else {
          this.io.to(socketId).emit('error', 'Game is full');
        }
      })
      .catch((error) => {
        console.error('Error adding player to the game:', error.message);
        this.io.to(socketId).emit('error', 'Internal Server Error');
      });
  }

  // Check if a position is valid on the game board
  isValidPosition(row, col) {
    return row >= 0 && row < 3 && col >= 0 && col < 3;
  }

  // Method to simulate computer opponent game play
  singlePlayerGamePlay(gameBoard, playerOneSymbol, playerTwoSymbol) {
    // Horizontal Moves From Top To Bottom Check
    for (let row = 0; row < 3; row++) {
      // Horizontal Row Check
      if (gameBoard[row][0] === playerOneSymbol && gameBoard[row][1] === playerOneSymbol) {
        gameBoard[row][2] = playerTwoSymbol;
      } else if (gameBoard[row][0] === playerOneSymbol && gameBoard[row][2] === playerOneSymbol) {
        gameBoard[row][1] = playerTwoSymbol;
      } else if (gameBoard[row][1] === playerOneSymbol && gameBoard[row][2] === playerOneSymbol) {
        gameBoard[row][0] = playerTwoSymbol;
      }
    }

    // Vertical Moves From Left To Right Check
    for (let col = 0; col < 3; col++) {
      // Vertical Column Check
      if (gameBoard[0][col] === playerOneSymbol && gameBoard[1][col] === playerOneSymbol) {
        gameBoard[2][col] = playerTwoSymbol;
      } else if (gameBoard[0][col] === playerOneSymbol && gameBoard[2][col] === playerOneSymbol) {
        gameBoard[1][col] = playerTwoSymbol;
      } else if (gameBoard[1][col] === playerOneSymbol && gameBoard[2][col] === playerOneSymbol) {
        gameBoard[0][col] = playerTwoSymbol;
      }
    }

    // Diagonal Moves From Left To Right Check (Left Diagonal)
    if (gameBoard[0][0] === playerOneSymbol && gameBoard[1][1] === playerOneSymbol) {
      gameBoard[2][2] = playerTwoSymbol;
    } else if (gameBoard[0][0] === playerOneSymbol && gameBoard[2][2] === playerOneSymbol) {
      gameBoard[1][1] = playerTwoSymbol;
    } else if (gameBoard[1][1] === playerOneSymbol && gameBoard[2][2] === playerOneSymbol) {
      gameBoard[0][0] = playerTwoSymbol;
    }

    // Diagonal Moves From Left To Right Check (Right Diagonal)
    if (gameBoard[0][2] === playerOneSymbol && gameBoard[1][1] === playerOneSymbol) {
      gameBoard[2][0] = playerTwoSymbol;
    } else if (gameBoard[0][2] === playerOneSymbol && gameBoard[2][0] === playerOneSymbol) {
      gameBoard[1][1] = playerTwoSymbol;
    } else if (gameBoard[1][1] === playerOneSymbol && gameBoard[2][0] === playerOneSymbol) {
      gameBoard[0][2] = playerTwoSymbol;
    }
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
        this.isValidPosition(srcRow, srcCol)
        && this.isValidPosition(destRow, destCol)
        && this.players.length === 2
        && currentPlayer === this.getCurrentPlayer()
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
