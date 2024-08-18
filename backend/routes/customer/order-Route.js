import express from "express";
import {
    getOrder, 
    getOrderById, 
    createOrder, 
    updateOrder, 
    deleteOrder
} from "../../controller/customer/order.js"

const router = express.Router();

router.get('/order', getOrder);
router.get('/order/:id', getOrderById);
router.post('/order', createOrder);
router.patch('/order/:id', updateOrder);
router.delete('/order/:id', deleteOrder);


export default router