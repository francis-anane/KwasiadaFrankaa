// ./models/AuthModel.js

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import PlayerModel from './PlayerModel.js';

class AuthModel {
  // Initialize authentication strategies and serialization
  static initialize() {
    // Serialize user to store in session
    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    // Deserialize user from session
    passport.deserializeUser(async (id, done) => {
      try {
        const user = await PlayerModel.Model.findById(id);
        done(null, user);
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
            // Find user by email
            const user = await PlayerModel.Model.findOne({ email });

            // Check if user exists and password is valid
            if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
              return done(null, false, { message: 'Invalid email or password' });
            }

            // Authentication successful
            return done(null, user);
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

  static async authenticate(email, password, done) {
    try {
      const user = await PlayerModel.Model.findOne({ email });

      if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
}

export default AuthModel;
