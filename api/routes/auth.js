// ./routes/auth.js

import express from 'express';
import AuthController from '../controllers/AuthController.js';

const authRouter = express.Router();

authRouter.post('/auth/login', AuthController.loginHandler);
//  Player authentication routes

// Route for user logout
authRouter.get('/auth/logout', AuthController.logoutHandler);

export default authRouter;
