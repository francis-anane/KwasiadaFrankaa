// ./routes/auth.js

import express from 'express';
import AuthController from '../controllers/AuthController.js';

const authRouter = express.Router();

authRouter.post('/login', AuthController.loginHandler);
//  Player authentication routes

// Route for user logout
authRouter.post('/logout', AuthController.logoutHandler);
// Example of a protected route that requires authentication
authRouter.get('/protected', AuthController.isAuthenticated, (req, res) => {
  res.json({ message: 'This is a protected route.' });
});

export default authRouter;
