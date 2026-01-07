import axios from 'axios';
import React, { useState } from 'react';
import { formatINR } from '../../utils/currency';

const FarmerDashboard = () => {
  const [activeSection, setActiveSection] = useState('products');
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@farmerbuddy.com',
    address: '123 Farm Rd',
    city: 'Bhavnagar',
    zipCode: '364001',
    phone: '9876543210'
  });

  const [products, setProducts] = useState([
    {
      id: 'P001',
      farmer_id: 'F001',
      name: 'Organic Apples',
      description: 'Crisp, juicy apples grown organically in sunny orchards.',
      price_per_unit: 3.99,
      quantity: 50,
      unit: 'lb',
      image: 'https://via.placeholder.com/150?text=Apples',
      created_at: '2025-08-01'
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price_per_unit: '',
    quantity: '',
    unit: 'lb'
  });

  const [orders, setOrders] = useState([
    {
      _id: 'ORD123456',
      user: 'U001',
      items: [{ product: 'P001', quantity: 2, priceAtPurchase: 3.99 }],
      totalAmount: 7.98,
      deliveryAddress: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'CA',
        zip: '90210'
      },
      deliveryDate: '2025-08-10',
      status: 'pending',
      paymentStatus: 'paid',
      paymentMethod: 'Credit Card',
      isSubscriptionOrder: false,
      subscriptionBox: null,
      farmer: 'F001'
    }
  ]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    alert('Profile updated successfully');
  };

  const handleProductAdd = async(e) => {
    e.preventDefault();

   
    if (!newProduct.name || !newProduct.description || !newProduct.price_per_unit || !newProduct.quantity) {
      alert('All fields are required for adding a product.');
      return;
    }

    const product = {
      id: `P00${products.length + 1}`,
      farmer_id: 'F001',
      ...newProduct,
      price_per_unit: parseFloat(newProduct.price_per_unit),
      quantity: parseInt(newProduct.quantity),
      created_at: new Date().toISOString().split('T')[0]
    };

 

    try {
      alert("hello from frontend")
      const result=await axios.post('http://localhost:5000/product/add',{ product});
      if (result.status !== 200 && result.status !== 201) {
        alert('Failed to add product. Please try again.');
        return;
      }
    } catch (error) {
      alert('Error adding product: ' + (error.response?.data?.message || error.message));
      return;
    }

    setProducts([...products, product]);
    setNewProduct({ name: '', description: '', price_per_unit: '', quantity: '', unit: 'lb' });
    alert('Product added successfully');
  };

  const handleProductUpdate = (productId, updatedProduct) => {
    setProducts(products.map(p => p.id === productId ? { ...p, ...updatedProduct } : p));
    alert(`Product ${productId} updated`);
  };

  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    alert(`Order ${orderId} status updated to ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      <header className="bg-green-700 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
                          <h1 className="text-2xl font-bold tracking-tight">Farmer Buddy</h1>
          <nav>
            <ul className="flex gap-6 text-sm md:text-base">
              <li><a href="/" className="hover:text-green-200">Home</a></li>
              <li><a href="/marketplace" className="hover:text-green-200">Marketplace</a></li>
              <li><a href="/subscribe" className="hover:text-green-200">Subscribe</a></li>
              <li><a href="/login" className="hover:text-green-200">Log Out</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-white shadow-lg p-4 hidden md:block">
          <nav>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveSection('products')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${activeSection === 'products' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Manage Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('orders')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${activeSection === 'orders' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  View Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('profile')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${activeSection === 'profile' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Edit Profile
                </button>
              </li>
              <li>
                <a
                  href="/smart-crop-planning"
                  className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                >
                  <span>Smart Crop Planning</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">New</span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {activeSection === 'products' && (
            <>
              <h2 className="text-2xl font-bold mb-4">Manage Your Harvest</h2>
              <form onSubmit={handleProductAdd} className="grid md:grid-cols-2 gap-4 mb-6">
                <input type="text" placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required className="p-2 border rounded" />
                <input type="text" placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} required className="p-2 border rounded" />
                <input type="number" step="0.01" placeholder="Price" value={newProduct.price_per_unit} onChange={e => setNewProduct({ ...newProduct, price_per_unit: e.target.value })} required className="p-2 border rounded" />
                <input type="number" placeholder="Quantity" value={newProduct.quantity} onChange={e => setNewProduct({ ...newProduct, quantity: e.target.value })} required className="p-2 border rounded" />
                <select value={newProduct.unit} onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })} className="p-2 border rounded">
                  <option value="lb">lb</option>
                  <option value="dozen">dozen</option>
                  <option value="pint">pint</option>
                </select>
                <button type="submit" className="bg-green-600 text-white rounded p-2 col-span-2 hover:bg-green-700">Add Product</button>
              </form>

              <div className="grid md:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-white p-4 rounded-lg shadow">
                    <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded mb-2" />
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-sm">{product.description}</p>
                    <p>₹{formatINR(product.price_per_unit)} / {product.unit}</p>
                    <p className="text-sm text-gray-500">Qty: {product.quantity} {product.unit}</p>
                    <button onClick={() => handleProductUpdate(product.id, { quantity: product.quantity + 10 })} className="mt-2 w-full bg-green-600 text-white py-1 rounded hover:bg-green-700">+10 Quantity</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSection === 'orders' && (
            <>
              <h2 className="text-2xl font-bold mb-4">Order Requests</h2>
              <table className="w-full text-left bg-white shadow-md rounded-lg">
                <thead>
                  <tr className="bg-green-100">
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id} className="border-b">
                      <td className="p-3">{order._id}</td>
                      <td className="p-3">{order.items.map(i => `${i.quantity} x ${i.product}`).join(', ')}</td>
                      <td className="p-3">₹{formatINR(order.totalAmount)}</td>
                      <td className="p-3">{order.status}</td>
                      <td className="p-3">
                        <select value={order.status} onChange={e => handleOrderStatusChange(order._id, e.target.value)} className="p-1 border rounded">
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {activeSection === 'profile' && (
            <>
              <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-xl">
                <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="p-3 border w-full rounded" placeholder="Name" />
                <input type="email" value={profile.email} disabled className="p-3 border w-full rounded bg-gray-100" />
                <input type="text" value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })} className="p-3 border w-full rounded" placeholder="Address" />
                <input type="text" value={profile.city} onChange={e => setProfile({ ...profile, city: e.target.value })} className="p-3 border w-full rounded" placeholder="City" />
                <input type="text" value={profile.zipCode} onChange={e => setProfile({ ...profile, zipCode: e.target.value })} className="p-3 border w-full rounded" placeholder="Zip" />
                <input type="tel" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="p-3 border w-full rounded" placeholder="Phone" />
                <button type="submit" className="bg-green-600 text-white py-3 px-4 rounded hover:bg-green-700 w-full">Update Profile</button>
              </form>
            </>
          )}
        </main>
      </div>

      <footer className="bg-green-700 text-white py-6 text-center">
                    <p className="text-sm">&copy; 2025 Farmer Buddy. All rights reserved.</p>
        <p className="text-sm mt-2">
          <a href="/contact" className="hover:text-green-200">Contact Us</a> | 
          <a href="/terms" className="hover:text-green-200 ml-2">Terms</a> | 
          <a href="/privacy" className="hover:text-green-200 ml-2">Privacy</a>
        </p>
      </footer>
    </div>
  );
};

export default FarmerDashboard;
