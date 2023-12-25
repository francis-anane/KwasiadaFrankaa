// game_objects.js

document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const gameObjectsContainer = document.createElement('div');
    gameObjectsContainer.classList.add('game-objects-container');
  
    // Create three cells in the gameObjectsContainer
    for (let i = 0; i < 3; i++) {
      const cell = document.createElement('div');
      cell.classList.add('game-objects-cell');
      gameObjectsContainer.appendChild(cell);
    }
  
    // Append the gameObjectsContainer beneath the game board
    gameBoard.parentNode.insertBefore(gameObjectsContainer, gameBoard.nextSibling);
  });
  