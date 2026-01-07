import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatINR } from '../../utils/currency';

const OrderTracking = () => {
  const { orderId } = useParams();
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrackingInfo = async () => {
      try {
        const response = await fetch(`/api/orders/tracking/${orderId}`);
        const data = await response.json();
        if (data.success) {
          setTrackingInfo(data.trackingInfo);
        } else {
          setError(data.message || 'Failed to fetch tracking info');
        }
      } catch (err) {
        setError('Error fetching tracking info');
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingInfo();
  }, [orderId]);

  if (loading) return <div>Loading order tracking information...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Order Tracking</h1>
      <p><strong>Order ID:</strong> {trackingInfo.orderId}</p>
      <p><strong>Status:</strong> {trackingInfo.status}</p>
      <p><strong>Delivery Date:</strong> {trackingInfo.deliveryDate ? new Date(trackingInfo.deliveryDate).toLocaleDateString() : 'N/A'}</p>
      <p><strong>Delivery Address:</strong> {trackingInfo.deliveryAddress ? `${trackingInfo.deliveryAddress.address}, ${trackingInfo.deliveryAddress.city}, ${trackingInfo.deliveryAddress.zipCode}` : 'N/A'}</p>
      <p><strong>Payment Status:</strong> {trackingInfo.paymentStatus}</p>
      <h2>Items</h2>
      <ul>
        {trackingInfo.items.map((item, index) => (
          <li key={index}>
            {item.productName} - Quantity: {item.quantity} - Price at Purchase: ₹{formatINR(item.priceAtPurchase)}
          </li>
        ))}
      </ul>
      {trackingInfo.farmer && (
        <>
          <h2>Farmer Info</h2>
          <p>Name: {trackingInfo.farmer.name}</p>
        </>
      )}
      {trackingInfo.user && (
        <>
          <h2>User Info</h2>
          <p>Name: {trackingInfo.user.name}</p>
        </>
      )}
    </div>
  );
};

export default OrderTracking;
