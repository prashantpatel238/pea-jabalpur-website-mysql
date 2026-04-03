import { Router } from 'express';
import emailRouter from './email.js';
import authRouter from './auth.js';
import membersRouter from './members.js';
import directoryRouter from './directory.js';
import profileRouter from './profile.js';
import adminRouter from './admin.js';

const router = Router();

export default () => {
    router.use('/email', emailRouter);
    router.use('/auth', authRouter);
    router.use('/members', membersRouter);
    router.use('/directory', directoryRouter);
    router.use('/profile', profileRouter);
    router.use('/admin', adminRouter);

    return router;
};