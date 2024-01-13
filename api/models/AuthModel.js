// ./models/AuthModel.js

// Import necessary modules
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import PlayerModel from './PlayerModel.js';

class AuthModel {
  // Initialize authentication strategies and serialization
  static initialize() {
    // Serialize player to store in session
    passport.serializeUser((user, done) => {
      // Store user id in the session
      done(null, user.id);
    });

    // Deserialize player from session
    passport.deserializeUser(async (id, done) => {
      try {
        // Retrieve player by id from the database
        const player = await PlayerModel.Model.findById(id);
        done(null, player);
      } catch (err) {
        done(err);
      }
    });

    // Configure local strategy for login
    passport.use(
      new LocalStrategy(
        { usernameField: 'email', passwordField: 'password' },
        async (email, password, done) => {
          try {
            // Find player by email
            const player = await PlayerModel.Model.findOne({ email });

            // Check if player exists and password is valid
            if (!player || !bcrypt.compareSync(password, player.passwordHash)) {
              return done(null, false, { message: 'Invalid email or password' });
            }

            // Authentication successful
            return done(null, player);
          } catch (err) {
            return done(err);
          }
        },
      ),
    );
  }

  // Generate JWT token for authenticated user
  static generateToken(user) {
    // Get JWT secret key from environment variables
    const secretKey = process.env.JWT_SECRET_KEY;

    // Define token payload and options
    const payload = { userId: user.id, email: user.email };
    const options = { expiresIn: '1h' };

    // Sign and return the JWT token
    return jwt.sign(payload, secretKey, options);
  }
}

// Export the AuthModel class
export default AuthModel;
