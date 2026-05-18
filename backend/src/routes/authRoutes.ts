import { Router } from 'express';
import { register, login, getMe, getUsers, updateProfile } from '../controllers/authController';
import { protect, restrictTo } from '../middlewares/auth';
import { validateRegister, validateLogin, validateProfileUpdate } from '../middlewares/validation';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);
router.get('/users', protect, restrictTo('admin'), getUsers);
router.patch('/profile', protect, validateProfileUpdate, updateProfile);
router.put('/profile', protect, validateProfileUpdate, updateProfile);

export default router;
