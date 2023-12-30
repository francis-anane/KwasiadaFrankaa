document.addEventListener('DOMContentLoaded', () => {
    const playAloneButton = document.getElementById('play-alone');

    playAloneButton.addEventListener('click', () => {
      // Call a function to start single-player gameplay
      startSinglePlayerGame();
    });
  });

  async function startSinglePlayerGame() {
    try {
      // Fetch the current player information or any necessary data from the server
      //const response = await fetch('/api/currentPlayer'); // Replace with your actual endpoint
      //const currentPlayer = await response.json();
      console.log('startSinglePlayerGame called');
      // Communicate with the server to start single-player gameplay
      console.log('Local Storage:', localStorage);
      const currentPlayer = JSON.parse(localStorage.getItem('player'));
      console.log('Current player:', currentPlayer); // Log the current player for debugging purposes
      
      if (!currentPlayer) {
        console.error('No current player found.');
        return;
      }
    //   const startGameResponse = await fetch('/api/startSinglePlayerGame', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ currentPlayer }),
    //   });

    //   const startGameResult = await startGameResponse.json();

    //   if (startGameResult.success) {
    //     console.log('Single-player game started successfully.');
    //     // Additional logic or UI updates as needed
    //   } else {
    //     console.error('Failed to start single-player game:', startGameResult.error);
    //     // Handle errors or provide user feedback
    //   }
    } catch (error) {
      console.error('Error starting single-player game:', error.message);
      // Handle errors or provide user feedback
    }
  }