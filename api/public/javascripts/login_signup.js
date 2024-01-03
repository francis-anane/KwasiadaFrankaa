// ./public/javascript/login_signup.js
/* eslint-disable no-unused-vars */

// Initialize socket connection
import socket from './socket.js';
//import { currentPlayer } from './player_session_data.js';

// Function to perform user signup
async function signup() {
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  try {
    const response = await fetch('/api/players/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Signup successful:', data);
      return Promise.resolve(data);
    } else {
      console.error('Signup failed:', data.error);
      return Promise.reject(new Error(data.error));
    }
  } catch (error) {
    console.error('Error during signup:', error.message);
    return Promise.reject(error);
  }
}

// Function to perform user login
async function login() {
  console.log('Signup button clicked');
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      // Login successful, store player detail and token in localStorage
      localStorage.setItem('player', JSON.stringify(result.player));
      localStorage.setItem('token', result.token);
      console.log('localStorage: ', localStorage);
      // // Update properties of currentPlayer
      // currentPlayer.playerName = result.player.playerName;
      // currentPlayer.email = result.player.email;
      // currentPlayer.playerSocketId = result.player.playerSocketId;
      // currentPlayer.playerId = result.player.playerId;
      // console.log('currentPlayer:', currentPlayer);
      // Emit the 'setSocketId' event with the player's ID
      const playerId = result.player.playerId; // Adjust this line based on your data structure
      console.log(`playerId: ${playerId}`);
      socket.emit('setSocketId', playerId);
      console.log('Login successful:', result.player);
      return Promise.resolve(result);
    } else {
      // Login failed, reject the promise with the error
      return Promise.reject(new Error(result.error));
    }
  } catch (error) {
    // Reject the promise with the error
    return Promise.reject(error);
  }
}

// Add event listeners to buttons
document.getElementById('signupButton').addEventListener('click', async () => {
  try {
    const signupResult = await signup();
    // If signup was successful, you can handle it here (e.g., display a success message)
    console.log('Signup result:', signupResult);
  } catch (error) {
    // Handle signup error (e.g., display an error message)
    console.error('Signup failed:', error.message);
  }
});

document.getElementById('loginButton').addEventListener('click', async () => {
  try {
    const loginResult = await login();
    // If login was successful, redirect to the game page
    window.location.href = 'http://localhost:3000/api/game/gameBoard';
  } catch (error) {
    // Handle login error (e.g., display an error message)
    console.error('Login failed:', error.message);
  }
});