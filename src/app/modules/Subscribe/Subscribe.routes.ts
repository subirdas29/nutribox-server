import express from 'express';
import { SubscribeController } from './Subscribe.controller';

const router = express.Router();

router.post('/',SubscribeController.createSubscribeController);

export const SubscribeRoutes = router;