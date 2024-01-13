// ./controllers/AuthController.js
import passport from 'passport';
import AuthModel from '../models/AuthModel.js';
import redisModel from '../utils/redis.js';

class AuthController {
  // Store logged-in players (consider using a centralized session store for scalability)
  static loggedInPlayers = [];

  /**
   * Handles player login using Passport.js local strategy.
   * Generates and attaches a JWT token upon successful authentication.
   */
  static loginHandler(req, res, next) {
    // Passport.js authentication middleware
    passport.authenticate('local', (err, player, info) => {
      try {
        if (err) {
          console.error('Error during authentication:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        // Check if authentication was unsuccessful
        if (!player) {
          return res.status(401).json({ error: info.message });
        }

        // Store player in-memory (Will use redis for this later)
        AuthController.loggedInPlayers.push(player);

        // Generate JWT token
        const token = AuthModel.generateToken(player);

        // Include additional player details in the response
        // const playerDetails = { playerId: player.id, name: player.name, email: player.email };

        // Attach token and player details to response
        res.json({ success: true, token, player});
      } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    })(req, res, next);
  }

  /**
   * Handles player logout. Clears the player session.
   */
  static logoutHandler(req, res) {
    try {
      // Logout the player by clearing the session
      req.logout();

      res.json({ success: true, message: 'Logout successful' });
    } catch (error) {
      console.error('Error during logout:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * Middleware to check if the player is authenticated.
   * If authenticated, passes the request to the next middleware.
   * Otherwise, returns an unauthorized error.
   */
  static isAuthenticated(req, res, next) {
    try {
      // Check if the player is authenticated
      if (req.isAuthenticated()) {
        return next();
      }

      // Player is not authenticated, return an unauthorized error
      return res.status(401).json({ error: 'Unauthorized' });
    } catch (error) {
      console.error('Error during authentication check:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default AuthController;
