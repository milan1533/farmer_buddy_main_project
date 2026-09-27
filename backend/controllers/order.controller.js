// controllers/order.controller.js
// ✅ MongoDB/Mongoose removed → Supabase PostgreSQL
import supabase from '../config/supabase.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body;
    const userId = req.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }

    let totalAmount = 0;
    const orderItems = [];
    let farmerId = null;

    // Validate items and calculate total
    for (const item of items) {
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', item.product)
        .single();

      if (error || !product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      }

      orderItems.push({
        product: product.id,
        productName: product.name,
        quantity: item.quantity,
        priceAtPurchase: product.price,
        unit: product.unit
      });

      totalAmount += product.price * item.quantity;
      if (product.farm_id) farmerId = product.farm_id;
    }

    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        farmer_id: farmerId,
        items: orderItems,
        total_amount: totalAmount,
        delivery_address: deliveryAddress || {},
        payment_status: 'pending',
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: { ...newOrder, _id: newOrder.id }
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ success: false, message: "Failed to create order", error: error.message });
  }
};

// Get orders for the logged-in user
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.id;
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      orders: orders.map(o => ({ ...o, _id: o.id }))
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders", error: error.message });
  }
};

// Get all orders (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        users:user_id (name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      orders: orders.map(o => ({ ...o, _id: o.id }))
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch all orders", error: error.message });
  }
};

// Update order status (Admin/Farmer)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error || !order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order: { ...order, _id: order.id }
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ success: false, message: "Failed to update order status", error: error.message });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        users:user_id (name, email)
      `)
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      data: { ...order, _id: order.id }
    });
  } catch (error) {
    console.error("Get Order By ID Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch order", error: error.message });
  }
};
