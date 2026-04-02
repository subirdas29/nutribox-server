import express from 'express';
import { ContactController } from './Contact.controller';
const router = express.Router();

router.post('/',ContactController.createContactController);

export const ContactRoutes = router;