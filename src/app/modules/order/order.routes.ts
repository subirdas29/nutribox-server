import express from 'express';
import { OrderController } from './order.controller';




const router = express.Router();

router.post('/',
    // auth(USER_ROLES.customer), 
 OrderController.orderMealController);

// router.get("/verify", OrderController.verifyPayment);

// router.get('/', OrderController.getAllOrderController);

// router.get('/:orderId', OrderController.oneOrderDetailsController);


// router.delete('/:orderId',OrderController.deleteOrder)

// router.get('/revenue', OrderController.ordersRevenueController);

export const OrderRoutes = router;

