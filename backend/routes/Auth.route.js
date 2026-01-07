import express from 'express';
import { login, logout, register, updateProfile } from '../controller/Auth.controller.js';

const AuthRouter = express.Router();

AuthRouter.post('/signup', register);
AuthRouter.post('/login', login);
AuthRouter.post('/logout', logout);
AuthRouter.put('/update-profile', updateProfile);

export default AuthRouter;

