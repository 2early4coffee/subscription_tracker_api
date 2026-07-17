import { Router } from 'express';
import {
    signUp,
    signIn,
    signOut,
    refreshToken,
    forgotPassword,
    resetPassword,
} from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
    signUpSchema,
    signInSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    refreshTokenSchema,
} from '../utils/validation.js';

const authRouter = Router();

authRouter.post('/sign-up', validate(signUpSchema), signUp);
authRouter.post('/sign-in', validate(signInSchema), signIn);
authRouter.post('/sign-out', signOut);
authRouter.post('/refresh-token', validate(refreshTokenSchema), refreshToken);
authRouter.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
authRouter.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword);

export default authRouter;