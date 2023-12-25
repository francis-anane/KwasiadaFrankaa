import passport from 'passport';
import AuthModel from '../models/AuthModel.js';
import redisModel from '../utils/redis.js';

class AuthController {
  static loggedInPlayers = [];
  /**
   * Handles player login using Passport.js local strategy.
   * Generates and attaches a JWT token upon successful authentication.
   */
  static loginHandler(req, res, next) {
    passport.authenticate('local', (err, player, info) => {
      if (err) {
        // Log the error for debugging purposes
        console.error('Error during authentication:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (!player) {
        return res.status(401).json({ error: info.message });
      }

      //redisModel.storePlayer(player.id, player);
      AuthController.loggedInPlayers.push(player);
      // Generate JWT token
      const token = AuthModel.generateToken(player);

      // Attach token to response
      res.json({ success: true, token, player: player });
      // Immediately invoke the returned function with req, res, and next arguments
    })(req, res, next);
  }

  /**
   * Handles player logout. Clears the player session.
   */
  static logoutHandler(req, res) {
    try {
      req.logout();
      res.json({ success: true, message: 'Logout successful' });
    } catch (error) {
      // Handle potential errors during logout
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
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

export default AuthController;
