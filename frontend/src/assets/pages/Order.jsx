import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiTruck, FiCreditCard, FiMapPin, FiCalendar, FiPackage, FiUser, FiHome, FiShoppingBag } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { orderService } from '../api';
import { toast } from 'react-hot-toast';
import { formatINR } from '../../utils/currency';

function OrderConfirmation() {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Get orderId from location state or URL params
  const orderId = location.state?.orderId || new URLSearchParams(location.search).get('id');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await orderService.getOrderById(orderId);
        setOrder(response.data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details. Please try again.');
        toast.error('Could not load order details');

        // Fallback to mock data if API fails
        setOrder({
          _id: orderId || 'ORD123456',
          user: 'U001',
          items: [
            { product: 'P001', quantity: 2, priceAtPurchase: 3.99, name: 'Organic Apples', unit: 'lb' },
            { product: 'P002', quantity: 1, priceAtPurchase: 5.99, name: 'Free-Range Eggs', unit: 'dozen' }
          ],
          totalAmount: 13.97,
          deliveryAddress: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'CA',
            zip: '90210'
          },
          deliveryDate: '2025-08-10',
          status: 'confirmed',
          paymentStatus: 'paid',
          paymentMethod: 'Credit Card',
          isSubscriptionOrder: false,
          subscriptionBox: null,
          farmer: 'F001',
          farmerName: 'Green Valley Farm',
          userName: 'Jane Doe'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!order && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <FiShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No Order Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">We couldn't find the order you're looking for.</p>
        <button
          onClick={() => navigate('/marketplace')}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const formattedAddress = order ? `${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} ${order.deliveryAddress.zip}` : '';
  const formattedDate = order?.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <main className="container mx-auto px-4 pb-12 pt-28">
        {/* Order Confirmation Header */}
        <section className="text-center mb-12 animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Order{' '}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
              Confirmed!
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Thank you for your order, {order.userName || 'Valued Customer'}! Your order has been successfully placed and is being processed.
          </p>
        </section>

        {/* Order Status Timeline */}
        <section className="mb-12 animate-slide-in-left">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <FiPackage className="w-6 h-6 mr-3 text-green-600 dark:text-green-400" />
              Order Status
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Order Placed</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Your order has been confirmed</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <FiTruck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Processing</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Preparing for delivery</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <FiHome className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-400 dark:text-gray-500">Delivered</h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500">On {formattedDate}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Order Details */}
        <section className="mb-8 animate-slide-in-right">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <FiUser className="w-6 h-6 mr-3 text-green-600 dark:text-green-400" />
              Order Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">ID</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{order._id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <FiMapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Delivery Address</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{formattedAddress}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <FiCalendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Delivery Date</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{formattedDate}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <FiCreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{order.paymentMethod}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">F</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Farmer</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{order.farmerName || 'Local Farmer'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">T</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order Type</p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {order.isSubscriptionOrder ? 'Subscription' : 'One-Time'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Order Items */}
        <section className="mb-8 animate-fade-in-up">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <FiPackage className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">
                        {item.name || `Product #${item.product}`}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {item.quantity} {item.unit || 'units'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800 dark:text-white">
                      ₹{formatINR(item.priceAtPurchase * item.quantity)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      ₹{formatINR(item.priceAtPurchase)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800 dark:text-white">Total Amount</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ₹{formatINR(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Status Badges */}
        <section className="mb-8 animate-slide-in-left">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Order Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Order Status:</span>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${order.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Payment Status:</span>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="text-center animate-fade-in-up">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(`/order?id=${order._id}`)}
              className="bg-green-600 dark:bg-green-500 text-white px-8 py-3 rounded-xl hover:bg-green-700 dark:hover:bg-green-600 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              Track Order
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="bg-gray-600 dark:bg-gray-500 text-white px-8 py-3 rounded-xl hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              View All Orders
            </button>
            <button
              onClick={() => navigate('/marketplace')}
              className="bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default OrderConfirmation;
