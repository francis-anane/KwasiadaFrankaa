/* eslint-disable no-unused-vars */
// Function to perform user signup
async function signup() {
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerName: name,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Signup successful:', data);
    } else {
      console.error('Signup failed:', data.error);
    }
  } catch (error) {
    console.error('Error during signup:', error.message);
  }
}

// Function to perform user login
async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      // Login successful, store player data in session storage
      //sessionStorage.setItem('player', JSON.stringify(data));
      //console.log('Session Storage:', sessionStorage);
      localStorage.setItem('player', JSON.stringify(data));
      console.log('Local Storage:', localStorage);
      console.log('Login successful:', data);
      window.location.href = 'http://localhost:3000/api/gameBoard'; // Redirect to game page after login successful
    } else {
      // Login failed, handle errors
      console.error('Login failed:', data.error);
    }
  } catch (error) {
    console.error('Error during login:', error.message);
  }
}
