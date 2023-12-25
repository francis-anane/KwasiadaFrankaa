/* eslint-disable import/extensions */
// ./controllers/PlayerControllers.js
import PlayerModel from '../models/PlayerModel.js';
import redisModel from '../utils/redis.js';
import AuthController from './AuthController.js';

class PlayerControllers {
  // Express route handler for creating a new player
  static createPlayerHandler = async (req, res) => {
    try {
      const newPlayer = await PlayerModel.Model.create({
        playerName: req.body.playerName,
        email: req.body.email,
        passwordHash: await PlayerModel.hashPassword(req.body.password),
        symbol: req.body.symbol,
      });
      console.log('New player created in the database:', newPlayer);
      res.json(newPlayer);
    } catch (error) {
      console.error('Error creating player in the database:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Express route handler for getting all players
  static getAllPlayersHandler = async (req, res) => {
    try {
      const players = await PlayerModel.Model.find();
      console.log('All players retrieved from the database:', players);
      res.json(players);
    } catch (error) {
      console.error('Error retrieving players from the database:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Express route handler for getting all players online
  static getOnlinePlayersHandler = async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const pageSize = parseInt(req.query.pageSize, 10) || 10;

      //const result = await redisModel.getLoggedInPlayers(page, pageSize);
      const result = AuthController.loggedInPlayers;

      if (!result) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.json(result);
    } catch (error) {
      console.error('Error in /onlinePlayers route:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    return null;
  };

  // Express route handler for getting a player by ID
  static getPlayerByIdHandler = async (req, res) => {
    const playerId = req.params.id;

    try {
      const player = await PlayerModel.Model.findById(playerId);
      if (!player) {
        console.log('Player not found in the database.');
        res.status(404).json({ error: 'Player not found' });
        return;
      }
      console.log('Player retrieved from the database:', player);
      res.json(player);
    } catch (error) {
      console.error('Error retrieving player from the database:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Express route handler for updating a player by ID
  static updatePlayerByIdHandler = async (req, res) => {
    const playerId = req.params.id;

    try {
      const updatedPlayer = await PlayerModel.Model
        .findByIdAndUpdate(playerId, req.body, { new: true });
      if (!updatedPlayer) {
        console.log('Player not found in the database.');
        res.status(404).json({ error: 'Player not found' });
        return;
      }
      console.log('Player updated in the database:', updatedPlayer);
      res.json(updatedPlayer);
    } catch (error) {
      console.error('Error updating player in the database:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Express route handler for deleting a player by ID
  static deletePlayerByIdHandler = async (req, res) => {
    const playerId = req.params.id;

    try {
      const deletedPlayer = await PlayerModel.Model.findByIdAndDelete(playerId);
      if (!deletedPlayer) {
        console.log('Player not found in the database.');
        res.status(404).json({ error: 'Player not found' });
        return;
      }
      console.log('Player deleted from the database:', deletedPlayer);
      res.json(deletedPlayer);
    } catch (error) {
      console.error('Error deleting player from the database:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}
export default PlayerControllers;
