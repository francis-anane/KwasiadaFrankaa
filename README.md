# Kwasiada Frankaa

Welcome to the Kwasiada Frankaa, This web-based application allows users to play Kwasiada Frankaa, a strategic 3x3 board game, against each other in real-time. Kwasiada Frankaa is a game that is notable among the people of Ghana.

## Project Overview

The goal of this project is to bring the Kwasiada Frankaa game into the digital realm, enabling players to invite opponents from across the globe to play and chat in real-time.

## Features

### API Endpoints

### index
**GET /api/**
### index
**GET /api/game/gameBoard**

### Auth
**GET /api/auth/login**
### Auth
**GET /api/auth/logout**

#### Players

- **GET /api/players/onlinePlayers/**
  - Retrieve a list of online players.
- **GET /api/players/{player_id}**
  - Retrieve a player.

- **POST /api/players/register**
  - Create a new player.

- **PUT /api/players/{player_id}**
  - Update player information.

- **DELETE /api/players/{player_id}**
  - Delete a player.







### Socket Events

- **setSocketId**
  - Associates a player's socket ID with their player ID.

- **singlePlayerMove**
  - Handles a move in a single-player game.

- **inviteOpponent**
  - Sends an invitation to another player to join a game.

- **message**
  - Sends and receives chat messages.

- **getChatHistory**
  - Retrieves chat history.

- **joinGame**
  - Handles a player joining a multiplayer game.

- **makeMove**
  - Handles a player making a move in a multiplayer game.

## Technologies Used

- Backend: Node.js, Express.js, Socket.io, Passport.js, bcrypt.js
- Database: MongoDB
- Caching: Redis
- Frontend (Android): Kotlin, Android Studio
- Frontend (Browser): HTML, CSS, JavaScript

## Getting Started

1. Clone the repository.
2. Navigate to the game api directory `cd api`
3. Install dependencies: `npm install`.
4. Start the server: `npm run start-server`.
5. Access the app through the specified port.

## Acknowledgments

- Inspired by my love for the Kwasiada Frankaa game.

## License

This project is licensed under the [MIT License](LICENSE).

