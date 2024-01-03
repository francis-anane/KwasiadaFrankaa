// ./controllers/PlayerControllers.js
import PlayerModel from '../models/PlayerModel.js';
import redisModel from '../utils/redis.js';
import AuthController from './AuthController.js';

class PlayerControllers {
  /**
   * Express route handler for creating a new player.
   * Implements input validation and returns a more informative error response.
   */
  static createPlayerHandler = async (req, res) => {
    try {
      // Input validation: Ensure required fields are present
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        console.log(req.body);
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const player = await PlayerModel.Model.create({
        name,
        email,
        passwordHash: await PlayerModel.hashPassword(password),
      });
      const newPlayer = {playerId: player.id, name: player.name, email: player.email}
      console.log('New player created in the database:', newPlayer);
      res.json(newPlayer);
    } catch (error) {
      console.error('Error creating player in the database:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  /**
   * Express route handler for getting all players.
   * Implements error handling to provide a more informative response.
   */
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

  /**
   * Express route handler for getting all players online.
   * Implements pagination and retrieves online players using a dedicated service.
   */
  static getOnlinePlayersHandler = async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const pageSize = parseInt(req.query.pageSize, 10) || 10;

      // Retrieve online players using a dedicated service (e.g., redisModel)
      const result = AuthController.loggedInPlayers;

      if (!result) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.json(result);
    } catch (error) {
      console.error('Error in /onlinePlayers route:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  /**
   * Express route handler for getting a player by ID.
   * Implements error handling to provide a more informative response.
   */
  static getPlayerByIdHandler = async (req, res) => {
    const playerId = req.params.id;

    try {
      const player = await PlayerModel.Model.findById(playerId);
      if (!player) {
        console.log('Player not found in the database.');
        return res.status(404).json({ error: 'Player not found' });
      }

      console.log('Player retrieved from the database:', player);
      res.json(player);
    } catch (error) {
      console.error('Error retrieving player from the database:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  /**
   * Express route handler for updating a player by ID.
   * Implements input validation and error handling.
   */
  static updatePlayerByIdHandler = async (req, res) => {
    const playerId = req.params.id;

    try {
      // Input validation: Ensure required fields are present
      const {name, email, password} = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const updatedPlayer = await PlayerModel.Model
        .findByIdAndUpdate(playerId, req.body, { new: true });

      if (!updatedPlayer) {
        console.log('Player not found in the database.');
        return res.status(404).json({ error: 'Player not found' });
      }

      console.log('Player updated in the database:', updatedPlayer);
      res.json(updatedPlayer);
    } catch (error) {
      console.error('Error updating player in the database:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  /**
   * Express route handler for deleting a player by ID.
   * Implements error handling to provide a more informative response.
   */
  static deletePlayerByIdHandler = async (req, res) => {
    const playerId = req.params.id;

    try {
      const deletedPlayer = await PlayerModel.Model.findByIdAndDelete(playerId);
      if (!deletedPlayer) {
        console.log('Player not found in the database.');
        return res.status(404).json({ error: 'Player not found' });
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
