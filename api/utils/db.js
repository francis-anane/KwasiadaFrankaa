// db.js

import mongoose from 'mongoose';

import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export default db;
