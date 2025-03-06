import express from 'express';
import { OrderController } from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';




const router = express.Router();

router.post('/',
    auth(USER_ROLES.customer), 
 OrderController.orderMealController);

// router.get("/verify", OrderController.verifyPayment);

// router.get('/', OrderController.getAllOrderController);

router.get('/:orderId', OrderController.oneOrderDetailsController);
router.patch('/orderdetails/:orderId',auth(USER_ROLES.customer), OrderController.updateOrderController);

router.get('/myorder/alldata',auth(USER_ROLES.customer), OrderController.getMyOrder);


// router.delete('/:orderId',OrderController.deleteOrder)

// router.get('/revenue', OrderController.ordersRevenueController);

export const OrderRoutes = router;

