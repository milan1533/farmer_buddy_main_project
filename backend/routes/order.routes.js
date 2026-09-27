import express from "express";
import {
    createOrder,
    getAllOrders,
    getMyOrders,
    getOrderById,
    updateOrderStatus
} from '../controllers/order.controller.js'; // corrected import path case
import isAuthenticated from "../middleware/isAutheticated.js";

const orderRouter = express.Router();

orderRouter.post("/", isAuthenticated, createOrder);
orderRouter.get("/", isAuthenticated, getAllOrders); // For Admin usually, or we can add separate admin route
orderRouter.get("/myorders", isAuthenticated, getMyOrders);
orderRouter.get("/:orderId", isAuthenticated, getOrderById);
orderRouter.put("/:orderId/status", isAuthenticated, updateOrderStatus);

export default orderRouter;
