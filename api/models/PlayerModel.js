// ./models/PlayerModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const saltRounds = 10;

class PlayerModel {
  // Define the player schema
  static playerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      // Adding email validation using a regular expression
      match: /^\S+@\S+\.\S+$/,
    },
    passwordHash: { type: String, required: true },
    gameBoard: { type: [[String, String, String], [String, String, String],
      [String, String, String]], required: true,  default: [['', '', ''], ['', '', ''], ['', '', '']] },
    playerSymbol: { type: String, enum: ['red', 'blue'], required: false },
    opponentSymbol: { type: String, enum: ['red', 'blue'], required: false },
    isYourTurn: {type: Boolean, enum: [true, false], required: false},
    hasWon: {type: Boolean, enum: [true, false], required: false},
    moveCount: {type: Number, required: false, default: 0},
    socketId: { type: String, required: false },
    opponentSocketId: { type: String, required: false },
  });

  // Create the Player model
  static Model = mongoose.model('Player', PlayerModel.playerSchema);

  // Static method to hash a password
  static async hashPassword(password) {
    const passwordHash = await bcrypt.hash(password, saltRounds);
    return passwordHash;
  }

  // Static method to verify a password
  static async verifyPassword(plainPassword, passwordHash) {
    const isMatch = await bcrypt.compare(plainPassword, passwordHash);
    return isMatch;
  }
}

export default PlayerModel;
