// ./models/AuthModel.js

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
      done(null, user.id);
    });

    // Deserialize player from session
    passport.deserializeUser(async (id, done) => {
      try {
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
    const secretKey = process.env.JWT_SECRET_KEY;
    const payload = { userId: user.id, email: user.email };
    const options = { expiresIn: '1h' };

    return jwt.sign(payload, secretKey, options);
  }


}

export default AuthModel;
