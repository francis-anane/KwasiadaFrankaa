document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('game-board');
  let sourceCell = null; // To store the source cell index
  const socket = io(); // Initialize socket.io-client

   // Handle cell click event
   function handleCellClick(event) {
    const cellIndex = event.target.getAttribute('data-index');
    const row = Math.floor(cellIndex / 3);
    const col = cellIndex % 3;

    if (sourceCell === null) {
      // First click, set as the source
      sourceCell = { row, col };
      console.log('Source cell:', row, col);
    } else {
      // Second click, set as the destination if different from source
      if (sourceCell.row !== row || sourceCell.col !== col) {
        const destCell = { row, col };
        console.log('Destination cell:', row, col);

        // Send the move to the server
        socket.emit('makeMove', {
          srcRow: sourceCell.row,
          srcCol: sourceCell.col,
          destRow: destCell.row,
          destCol: destCell.col,
        });

        // Reset the source cell for the next move
        sourceCell = null;
      } else {
        // Same cell clicked again, do nothing (remains as the source)
      }
    }
  }

  // Initialize the game board
  function initializeBoard() {
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('data-index', i);
      cell.addEventListener('click', handleCellClick);
      board.appendChild(cell);
    }
  }
  // Start the game
  initializeBoard();
});
