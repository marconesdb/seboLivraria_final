import { Router } from 'express';
import { createIntent, handleWebhook } from '../controllers/stripeController';
import { authenticate } from '../middlewares/auth';
const router = Router();
router.post('/webhook',        handleWebhook);
router.post('/create-intent',  authenticate, createIntent);
export default router;