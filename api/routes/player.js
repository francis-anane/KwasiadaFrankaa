// ./routes/player.js
import express from 'express';
import PlayerController from '../controllers/PlayerController.js';

const playerRouter = express.Router();

// Player routes
// creates a new player on the game
playerRouter.post('/players/register', PlayerController.createPlayerHandler);
playerRouter.get('/players/all', PlayerController.getAllPlayersHandler); // get all players data
playerRouter.get('/players/onlinePlayers', PlayerController.getOnlinePlayersHandler);

// Chaining routes with similar endpoints.
// The first route will be used for the GET method, the second for
// the PUT and the third for the DELETE.
// The :id is a placeholder for the id of the player.
playerRouter.route('/players/:id')
  .get(PlayerController.getPlayerByIdHandler)
  .put(PlayerController.updatePlayerByIdHandler)
  .delete(PlayerController.deletePlayerByIdHandler);

export default playerRouter;
