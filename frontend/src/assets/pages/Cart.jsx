import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from './CartContext';
import { orderService } from '../api';
import { toast } from 'react-hot-toast';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => {
    return total + (item.quantity * item.priceAtPurchase);
  }, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    // Validate address
    const { street, city, state, zip } = deliveryAddress;
    if (!street || !city || !state || !zip) {
      toast.error('Please fill in all address fields');
      return;
    }

    setIsLoading(true);

    try {
      // Create order object
      const orderData = {
        items: cart.map(item => ({
          product: item.product,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase
        })),
        totalAmount: totalPrice,
        deliveryAddress,
        paymentMethod: 'Credit Card', // Simplified for demo
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      };

      // Submit order
      const response = await orderService.createOrder(orderData);
      
      // Clear cart and redirect to order confirmation
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/order', { state: { orderId: response.orderId } });
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
            <FiShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <button
              onClick={() => navigate('/marketplace')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center mx-auto gap-2 transition-all duration-300"
            >
              Continue Shopping
              <FiArrowRight className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Cart Items ({cart.length})</h2>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {cart.map((item) => (
                    <li key={item.product} className="p-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400 text-xl">{item.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-800 dark:text-white">{item.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ${item.priceAtPurchase.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-medium text-gray-800 dark:text-white">
                          ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-300"
                          aria-label="Remove item"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                    <span className="text-gray-800 dark:text-white font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                    <span className="text-gray-800 dark:text-white font-medium">$0.00</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
                    <span className="text-lg font-semibold text-gray-800 dark:text-white">Total</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <form onSubmit={handleCheckout}>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Delivery Address</h3>
                  <div className="space-y-3 mb-6">
                    <div>
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                      <input
                        type="text"
                        id="street"
                        name="street"
                        value={deliveryAddress.street}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={deliveryAddress.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={deliveryAddress.state}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label htmlFor="zip" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP Code</label>
                        <input
                          type="text"
                          id="zip"
                          name="zip"
                          value={deliveryAddress.zip}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Processing...' : 'Place Order'}
                    {!isLoading && <FiArrowRight className="h-5 w-5" />}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;