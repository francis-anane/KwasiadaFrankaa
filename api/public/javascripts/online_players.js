// Fetch players and display in the list
async function fetchOnlinePlayers() {
  try {
    const response = await fetch('/api/onlinePlayers');
    const players = await response.json();
    console.log('players:', players)
    const playerList = document.getElementById('players-list');
    playerList.innerHTML = ''; // Clear previous players

    players.forEach((player) => {
      const playerItem = document.createElement('li');
      playerItem.className = 'player-item';
      playerItem.textContent = player.playerName;

      // Add a click event listener to set opponentSocketId
      playerItem.addEventListener('click', () => {
        //setOpponentSocketId(player.socketId);
        console.log(`Opponent selected: ${player.playerName}`);
      });

      playerList.appendChild(playerItem);
    });
  } catch (error) {
    console.error('Error fetching players:', error.message);
  }
}

// Call the fetchOnlinePlayers function when the page loads
document.addEventListener('DOMContentLoaded', fetchOnlinePlayers);
