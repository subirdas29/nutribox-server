import express from 'express';
import { OrderController } from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';




const router = express.Router();

router.post('/',
    auth(USER_ROLES.customer), 
 OrderController.orderMealController);


 router.get("/verify", OrderController.verifyPayment);

router.get('/:orderId', auth(USER_ROLES.customer,USER_ROLES.mealprovider), OrderController.oneOrderDetailsController);
router.patch('/orderdetails/:orderId',auth(USER_ROLES.customer,USER_ROLES.mealprovider), OrderController.updateOrderController);

router.get('/myorder/alldata',auth(USER_ROLES.customer), OrderController.getMyOrder);
router.get('/allorder/mealprovider',auth(USER_ROLES.mealprovider), OrderController.getAllOrder);



export const OrderRoutes = router;

