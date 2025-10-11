// controllers/Order.controller.js
// import mongoose from 'mongoose';

// Original createOrder, getAllOrders, deleteOrder functions assumed here
// Since original content is not provided, I will create basic placeholders

// export const createOrder = async (req, res) => {
//   // Placeholder for original createOrder logic
//   res.status(501).json({ success: false, message: 'Not implemented' });
// };

// export const getAllOrders = async (req, res) => {
//   // Placeholder for original getAllOrders logic
//   res.status(501).json({ success: false, message: 'Not implemented' });
// };

// export const deleteOrder = async (req, res) => {
//   // Placeholder for original deleteOrder logic
//   res.status(501).json({ success: false, message: 'Not implemented' });
// };

// export const getOrderTracking = async (req, res) => {
//   const { orderId } = req.params;

//   try {
//     const order = await Order.findById(orderId).populate('items.product').populate('user').populate('farmer');

//     if (!order) {
//       return res.status(404).json({ success: false, message: 'Order not found' });
//     }

//     // Return relevant tracking info
//     const trackingInfo = {
//       orderId: order._id,
//       status: order.status,
//       deliveryDate: order.deliveryDate,
//       deliveryAddress: order.deliveryAddress,
//       items: order.items.map(item => ({
//         productName: item.product.name,
//         quantity: item.quantity,
//         priceAtPurchase: item.priceAtPurchase
//       })),
//       farmer: order.farmer ? { id: order.farmer._id, name: order.farmer.name } : null,
//       user: order.user ? { id: order.user._id, name: order.user.name } : null,
//       paymentStatus: order.paymentStatus
//     };

//     res.status(200).json({ success: true, trackingInfo });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// };

// New function to update order location
// export const updateOrderLocation = async (req, res) => {
//   const { orderId } = req.params;
//   const { location } = req.body;

//   if (!location) {
//     return res.status(400).json({ success: false, message: 'Location is required' });
//   }

//   try {
//     const updatedOrder = await Order.findByIdAndUpdate(
//       orderId,
//       { location: location },
//       { new: true }
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({ success: false, message: 'Order not found' });
//     }

//     res.status(200).json({ success: true, message: 'Order location updated', order: updatedOrder });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// };

