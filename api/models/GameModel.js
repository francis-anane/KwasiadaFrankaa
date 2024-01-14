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
    return this.gameBoard;
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
          player.gameBoard[2][col] = player.opponentSymbol;
          return player;
        } else if (player.gameBoard[0][col] === player.playerSymbol && player.gameBoard[2][col] === player.playerSymbol) {
          player.gameBoard[1][col] = player.opponentSymbol;
          return player;
        } else if (player.gameBoard[1][col] === player.playerSymbol && player.gameBoard[2][col] === player.playerSymbol) {
          player.gameBoard[0][col] = player.opponentSymbol;
          return player;
        }
        // Vertical Column Offends Move Check
        if (player.gameBoard[0][col] === '' && player.gameBoard[1][col] === player.opponentSymbol && player.gameBoard[2][col] === player.opponentSymbol) {
          player.gameBoard[0][col] = player.opponentSymbol;
          return player;
        } else if (player.gameBoard[0][col] === player.opponentSymbol && player.gameBoard[2][col] === '' && player.gameBoard[1][col] === player.opponentSymbol) {
          player.gameBoard[2][col] = player.opponentSymbol;
          return player;
        } else if (player.gameBoard[1][col] === player.opponentSymbol && player.gameBoard[2][col] === player.opponentSymbol && player.gameBoard[0][col] === '') {
          player.gameBoard[0][col] = player.opponentSymbol;
          return player;
        }
      }

      // Diagonal Moves From Left To Right Check (Left Diagonal)
      // Left Diagonal Defends Move
      if (player.gameBoard[0][0] === player.playerSymbol && player.gameBoard[1][1] === player.playerSymbol) {
        player.gameBoard[2][2] = player.opponentSymbol;
        return player;
      } else if (player.gameBoard[0][0] === player.playerSymbol && player.gameBoard[2][2] === player.playerSymbol) {
        player.gameBoard[1][1] = player.opponentSymbol;
        return player;
      } else if (player.gameBoard[1][1] === player.playerSymbol && player.gameBoard[2][2] === player.playerSymbol) {
        player.gameBoard[0][0] = player.opponentSymbol;
        return player;
      }
      // Left Diagonal Offends Move Check
      if (player.gameBoard[0][0] === '' && player.gameBoard[1][1] === player.opponentSymbol && player.gameBoard[2][2] === player.opponentSymbol) {
        player.gameBoard[0][0] = player.opponentSymbol;
        return player;
      } else if (player.gameBoard[0][0] === player.opponentSymbol && player.gameBoard[2][2] === '' && player.gameBoard[1][1] === player.opponentSymbol) {
        player.gameBoard[2][2] = player.opponentSymbol;
        return player;
      } else if (player.gameBoard[1][1] === player.opponentSymbol && player.gameBoard[2][2] === player.opponentSymbol && player.gameBoard[0][0] === '') {
        player.gameBoard[0][0] = player.opponentSymbol;
        return player;
      }

      // Diagonal Moves From Right To Left Check (Right Diagonal)
      // Right Diagonal Defends Move
      if (player.gameBoard[0][2] === player.playerSymbol && player.gameBoard[1][1] === player.playerSymbol) {
        player.gameBoard[2][0] = player.opponentSymbol;
        return player;
      } else if (player.gameBoard[0][2] === player.playerSymbol && player.gameBoard[2][0] === player.playerSymbol) {
        player.gameBoard[1][1] = player.opponentSymbol;
        return player;
      } else if (player.gameBoard[1][1] === player.playerSymbol && player.gameBoard[2][0] === player.playerSymbol) {
        player.gameBoard[0][2] = player.opponentSymbol;
        return player;
      }
      // Right Diagonal Offends Move Check
      if (player.gameBoard[0][2] === '' && player.gameBoard[1][1] === player.opponentSymbol && player.gameBoard[2][0] === player.opponentSymbol) {
        player.gameBoard[0][2] = player.opponentSymbol;
        return player;
      } else if (player.gameBoard[0][2] === player.opponentSymbol && player.gameBoard[2][0] === '' && player.gameBoard[1][1] === player.opponentSymbol) {
        player.gameBoard[2][0] = player.opponentSymbol;
        return player;
      } else if (player.gameBoard[1][1] === player.opponentSymbol && player.gameBoard[2][0] === '' && player.gameBoard[0][2] === player.opponentSymbol) {
        player.gameBoard[2][0] = player.opponentSymbol;
        return player;
      }

      // Set the colors that represents symbol for player and opponent for a new game
      const { playerColor, opponentColor } = this.setPlayerColor();
      console.log('playerColor', playerColor);
      console.log('opponentColor', opponentColor);
      player.playerSymbol = playerColor;
      player.opponentSymbol = opponentColor;

      console.log('player', player);
      if (playerColor === 'red') {
        player.gameBoard[1][1] = 'red';
      }
      else {
        player.isYourTurn = true;
      }
      return player;
    } catch (error) {
      console.error(error.message);
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
    const leftDiagonal = player.gameBoard[0][0] + player.gameBoard[1][1] + player.gameBoard[2][2];
    const rightDiagonal = player.gameBoard[0][2] + player.gameBoard[1][1] + player.gameBoard[2][0];

    if (leftDiagonal === player.playerSymbol || rightDiagonal === player.playerSymbol) {
      player.hasWon = true;
      return player;
    }
    if (leftDiagonal === player.opponentSymbol || rightDiagonal === player.opponentSymbol) {
      player.hasWon = false;
      return player;
    }
  }

  // Multiplayer game play logic
  multiplayerGame(srcRow, srcCol, destRow, destCol, player) {
    if (player.gameBoard[destRow][destCol] === '') {
      player.isYourTurn = !player.isYourTurn;
      player.gameBoard[destRow][destCol] = player.playerSymbol;
      player.moveCount += 1;
      player.gameBoard[srcRow][srcCol] = '';
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

      // If no winner is found, return null
      return null;
    } catch (error) {
      console.error("Error in setWinner function:", error);
      // Handle the error or rethrow it if needed
      throw error;
    }
  }


}

export default GameModel;
