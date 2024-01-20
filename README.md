# Kwasiada Frankaa

Welcome to Kwasiada Frankaa! This web-based application brings the Kwasiada Frankaa game into the digital realm, allowing users to play the strategic 3x3 board game against each other in real-time. Kwasiada Frankaa is a game that is notable among the people of Ghana.

## Project Overview

The goal of this project is to provide a platform for players to invite opponents from across the globe, play Kwasiada Frankaa in real-time, and engage in chat during the game.

## Features

### API Endpoints

#### Index
- **GET /api/**
  - Root endpoint providing general information about the API.

#### Auth
- **GET /api/auth/login**
  - Endpoint for user authentication.
- **GET /api/auth/logout**
  - Endpoint to log out the user.

#### Players

- **GET /api/players/onlinePlayers/**
  - Retrieve a list of online players.
- **GET /api/players/{player_id}**
  - Retrieve player information by player ID.
- **POST /api/players/register**
  - Create a new player.
- **PUT /api/players/{player_id}**
  - Update player information by player ID.
- **DELETE /api/players/{player_id}**
  - Delete a player by player ID.

### Socket Events

- **setSocketId**
  - Description: Associates a player's socket ID with their player ID.
  - Input: `{ playerId: string }`
  - Output: Emits 'modifiedPlayer' event to the sender with the updated player information.

- **singlePlayerMove**
  - Description: Handles a move in a single-player game.
  - Input: `{ /* Input details from the game move */ }`
  - Output: Emits 'singlePlayerMove' event to all connected clients with the updated game state.

- **inviteOpponent**
  - Description: Sends an invitation to another player to join a game.
  - Input: `{ opponentId: string, inviteSenderSocketId: string }`
  - Output: Emits 'invitation' event to the specified opponent.

- **eventAccepted**
  - Description: Handles the acceptance of an invitation, creating a common room for the players.
  - Input: `{ senderId: string, gamePlayersRoom: string }`
  - Output: Joins the recipient to the specified game room and emits 'joinedGameRoom' event to both players.

- **eventRejected**
  - Description: Notifies the sender when an invitation is rejected.
  - Input: `{ senderSocketId: string }`
  - Output: Emits 'invitationRejected' event to the sender.

- **message**
  - Description: Sends and receives chat messages within the game room.
  - Input: `{ content: string, gamePlayersRoom: string }`
  - Output: Emits 'message' event to all clients in the game room.

- **getChatHistory**
  - Description: Retrieves chat history within the game room.
  - Input: None
  - Output: Emits 'chatHistory' event to the client requesting the chat history.

- **joinedGameRoom**
  - Description: Informs players when they have successfully joined a common game room.
  - Input: `{ gamePlayersRoom: string, recipientId: string, senderId: string }`
  - Output: Emits 'joinedGameRoom' event to both players in the game room.

- **makeMove**
  - Description: Handles a player making a move in a multiplayer game.
  - Input: `{ /* Input details from the game move */ }`
  - Output: Emits 'gameMove' event to all connected clients with the updated game state.

## Technologies Used

- Backend: Node.js, Express.js, Socket.io, Passport.js, bcrypt.js
- Database: MongoDB
- Caching: Redis
- Frontend (Android): Kotlin, Android Studio
- Frontend (Browser): HTML, CSS, JavaScript


## Getting Started

1. Clone the repository.
2. Navigate to the game API directory `cd api`.
3. Install dependencies: `npm install`.
4. Start the server: `npm run start-server`.
5. Access the app through the specified port.

## Acknowledgments

- Inspired by my love for the Kwasiada Frankaa game.

## License

This project is licensed under the [MIT License](LICENSE).
