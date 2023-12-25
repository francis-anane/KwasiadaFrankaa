const crypto = require('crypto');
const fs = require('fs');

// Generate a secure random key
const generateRandomKey = () => crypto.randomBytes(32).toString('hex');

// Get the path to the .env file
const envFilePath = '.env';

// Read the existing .env file
const existingEnvFile = fs.existsSync(envFilePath) ? fs.readFileSync(envFilePath, 'utf-8') : '';

// Generate a new key
const newKey = generateRandomKey();

// Add or update JWT_SECRET_KEY in the .env file
const updatedEnvFile = existingEnvFile.replace(
  /^JWT_SECRET_KEY=.*$/m,
  `JWT_SECRET_KEY=${newKey}`,
);

// Write the updated .env file
fs.writeFileSync(envFilePath, updatedEnvFile);

console.log(`New JWT_SECRET_KEY generated and saved in .env file: ${newKey}`);
