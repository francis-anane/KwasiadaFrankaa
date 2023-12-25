import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const saltRounds = 10;

class PlayerModel {
  // Define the player schema
  static playerSchema = new mongoose.Schema({
    playerName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    currentGameBoard: { type: [[String, String, String], [String, String, String],
      [String, String, String]], required: true,  default: [['', '', ''], ['', '', ''], ['', '', '']] },
    symbolColor: { type: String, enum: ['red', 'blue'], required: false },
    opponent: {type: String, enum: ['computer', 'person'], required: false }
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
