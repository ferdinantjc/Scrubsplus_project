import express from 'express';
import {
  subscribe,
  getAllSubscribers,
  exportSubscribers
} from '../controllers/newsletterController.js';

const router = express.Router();

router.post('/subscribe', subscribe);             // Subscribe to newsletter
router.get('/', getAllSubscribers);               // (Optional) Get all subscribers
router.get('/export', exportSubscribers);         // Export CSV of all subscribers

export default router;
