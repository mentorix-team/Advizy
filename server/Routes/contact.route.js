import express from 'express';
import { submitContactForm } from '../controllers/contact.controller.js';

const router = express.Router();

// Public route - anyone can submit a contact form
router.post('/create', submitContactForm);

export default router;
