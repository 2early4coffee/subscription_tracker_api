import { Router } from 'express';
import {
    signUp,
    signIn,
    signOut,
    refreshToken,
    forgotPassword,
    resetPassword,
} from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn);
authRouter.post('/sign-out', signOut);
authRouter.post('/refresh-token', refreshToken);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password/:token', resetPassword);

export default authRouter;