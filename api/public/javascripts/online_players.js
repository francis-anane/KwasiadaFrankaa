// Fetch players and display in the list
async function fetchOnlinePlayers() {
  try {
    const response = await fetch('/api/onlinePlayers'); // Replace with your actual endpoint
    const players = await response.json();

    const playerList = document.getElementById('players');
    playerList.innerHTML = ''; // Clear previous players

    players.forEach((player) => {
      const playerItem = document.createElement('li');
      playerItem.className = 'player-item';
      playerItem.textContent = player.playerName;
      playerList.appendChild(playerItem);
    });
  } catch (error) {
    console.error('Error fetching players:', error.message);
  }
}

// Call the fetchPlayers function when the page loads
// document.addEventListener('DOMContentLoaded', fetchPlayers);
