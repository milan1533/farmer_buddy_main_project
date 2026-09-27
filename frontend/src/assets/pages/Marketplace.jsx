import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiMapPin, FiShoppingCart, FiShoppingBag, FiHeart, FiStar, FiTrash2, FiEdit2, FiPlus, FiX, FiArrowRight } from 'react-icons/fi';
import { productService, orderService } from '../api';
import { useCart } from './CartContext';
import { useRequireAuth } from '../../utils/authGuard';
import { toast } from 'react-hot-toast';
import { formatINR } from '../../utils/currency';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const { requireAuth } = useRequireAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdminUser = user?.role === 'Admin' || user?.role === 'admin';
  const inAdmin = location.pathname.startsWith('/admin');
  const isAdmin = isAdminUser && inAdmin;

  // Admin add product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price_per_unit: '',
    quantity: '',
    unit: 'kg',
    category: 'vegetables',
    location: '',
    productImage: null,
    productImages: []
  });

  // Product detail preview
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Sample locations for filter
  const locations = ['all', 'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Mumbai', 'Delhi', 'Pune'];

  // Sample product types for filter
  const productTypes = ['all', 'vegetables', 'fruits', 'dairy', 'grains', 'herbs', 'organic'];

  // Sample products data
  const sampleProducts = [
    {
      _id: 'P001',
      name: 'Organic Apples',
      description: 'Crisp, juicy apples grown organically in sunny orchards. Rich in vitamins and antioxidants.',
      price_per_unit: 3.99,
      quantity: 50,
      unit: 'lb',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=800&h=600&fit=crop'
      ],
      location: 'Ahmedabad',
      type: 'fruits',
      organic: true,
      rating: 4.5
    },
    {
      _id: 'P002',
      name: 'Fresh Carrots',
      description: 'Sweet and crunchy carrots, perfect for salads and cooking. High in beta-carotene.',
      price_per_unit: 2.49,
      quantity: 30,
      unit: 'lb',
      image: 'https://images.unsplash.com/photo-1447175008436-170170e8a4d7?w=400&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1447175008436-170170e8a4d7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop'
      ],
      location: 'Surat',
      type: 'vegetables',
      organic: false,
      rating: 4.2
    },
    {
      _id: 'P003',
      name: 'Organic Milk',
      description: 'Fresh organic milk from grass-fed cows. Rich in calcium and protein.',
      price_per_unit: 4.99,
      quantity: 20,
      unit: 'gallon',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
      location: 'Vadodara',
      type: 'dairy',
      organic: true,
      rating: 4.7
    },
    {
      _id: 'P004',
      name: 'Fresh Tomatoes',
      description: 'Ripe, red tomatoes perfect for salads, sauces, and cooking. Rich in lycopene.',
      price_per_unit: 1.99,
      quantity: 40,
      unit: 'lb',
      image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1506808544309-7705fa27c0e1?w=800&h=600&fit=crop'
      ],
      location: 'Rajkot',
      type: 'vegetables',
      organic: false,
      rating: 4.3
    },
    {
      _id: 'P005',
      name: 'Organic Bananas',
      description: 'Sweet, ripe bananas rich in potassium and natural sugars. Perfect for smoothies.',
      price_per_unit: 2.99,
      quantity: 35,
      unit: 'lb',
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
      location: 'Bhavnagar',
      type: 'fruits',
      organic: true,
      rating: 4.6
    },
    {
      _id: 'P006',
      name: 'Fresh Eggs',
      description: 'Farm-fresh eggs from free-range chickens. High in protein and essential nutrients.',
      price_per_unit: 5.99,
      quantity: 25,
      unit: 'dozen',
      image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop',
      location: 'Mumbai',
      type: 'dairy',
      organic: false,
      rating: 4.4
    },
    {
      _id: 'P007',
      name: 'Organic Quinoa',
      description: 'Premium organic quinoa rich in protein and fiber. Perfect for healthy meals.',
      price_per_unit: 8.99,
      quantity: 15,
      unit: 'lb',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
      location: 'Delhi',
      type: 'grains',
      organic: true,
      rating: 4.8
    },
    {
      _id: 'P008',
      name: 'Fresh Basil',
      description: 'Aromatic fresh basil leaves perfect for Italian dishes and pesto.',
      price_per_unit: 3.49,
      quantity: 20,
      unit: 'bunch',
      image: 'https://images.unsplash.com/photo-1618377382884-c6c0d4c4c0c0?w=400&h=300&fit=crop',
      location: 'Pune',
      type: 'herbs',
      organic: true,
      rating: 4.1
    },
    {
      _id: 'P009',
      name: 'Organic Strawberries',
      description: 'Sweet, juicy strawberries rich in vitamin C and antioxidants.',
      price_per_unit: 6.99,
      quantity: 18,
      unit: 'lb',
      image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop',
      location: 'Ahmedabad',
      type: 'fruits',
      organic: true,
      rating: 4.9
    },
    {
      _id: 'P010',
      name: 'Fresh Spinach',
      description: 'Nutrient-rich spinach leaves perfect for salads and smoothies.',
      price_per_unit: 2.99,
      quantity: 25,
      unit: 'lb',
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop',
      location: 'Surat',
      type: 'vegetables',
      organic: false,
      rating: 4.0
    },
    {
      _id: 'P011',
      name: 'Organic Honey',
      description: 'Pure, natural honey from local beehives. Rich in antioxidants and natural sweetness.',
      price_per_unit: 12.99,
      quantity: 12,
      unit: 'lb',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop',
      location: 'Vadodara',
      type: 'organic',
      organic: true,
      rating: 4.7
    },
    {
      _id: 'P012',
      name: 'Fresh Potatoes',
      description: 'Fresh, locally grown potatoes perfect for various cooking methods.',
      price_per_unit: 1.49,
      quantity: 45,
      unit: 'lb',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
      location: 'Rajkot',
      type: 'vegetables',
      organic: false,
      rating: 4.2
    }
  ];

  // Fetch all products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await productService.getAllProducts();
      const productsData = response.data || sampleProducts;
      console.log(productsData)

      // Fix for rendering error: transform rating object to average number if needed
      const transformedProducts = productsData.map(product => {
        if (product.rating && typeof product.rating === 'object') {
          return { ...product, rating: product.rating.average || 0 };
        }
        return product;
      });

      setProducts(transformedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
      // Fallback to sample data if API fails
      setProducts(sampleProducts);
    } finally {
      setIsLoading(false);
    }
  };

  // Admin: add product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(newProduct).forEach(([k, v]) => {
        if (k === 'productImages') return;
        if (v !== null && v !== undefined && v !== '') fd.append(k, v);
      });
      if (newProduct.productImages?.length) {
        newProduct.productImages.forEach((file) => {
          fd.append('images', file);
        });
      }
      // backward compatibility: keep productImage if single set
      if (!newProduct.productImage && newProduct.productImages?.[0]) {
        fd.append('productImage', newProduct.productImages[0]);
      }
      const res = await productService.addProduct(fd);
      if (res?.success) {
        toast.success('Product added');
        setNewProduct({ name: '', description: '', price_per_unit: '', quantity: '', unit: 'kg', category: 'vegetables', location: '', productImage: null, productImages: [] });
        fetchProducts();
      } else {
        toast.error(res?.message || 'Failed to add');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to add');
    }
  };

  // Admin: delete product
  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await productService.deleteProduct(id);
      if (res?.success) {
        toast.success('Deleted');
        setProducts((prev) => prev.filter(p => p._id !== id));
      } else {
        toast.error(res?.message || 'Delete failed');
      }
    } catch (err) {
      toast.error(err?.message || 'Delete failed');
    }
  };

  // Admin: quick edit price/quantity
  const handleQuickEdit = async (p) => {
    const price = prompt('Update price per unit', p.price_per_unit);
    if (price === null) return;
    const quantity = prompt('Update available quantity', p.quantity);
    if (quantity === null) return;
    try {
      const res = await productService.updateProduct(p._id, { price_per_unit: Number(price), quantity: Number(quantity) });
      if (res?.success) {
        toast.success('Updated');
        fetchProducts();
      } else {
        toast.error(res?.message || 'Update failed');
      }
    } catch (err) {
      toast.error(err?.message || 'Update failed');
    }
  };

  const handleAddToCart = (product) => {
    const authAction = requireAuth(() => {
      addToCart(product);
      toast.success(`Added ${product.name} to cart!`);
    });
    authAction();
  };

  // Filter products based on search term and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || product.type === filterType;
    const matchesLocation = filterLocation === 'all' || product.location === filterLocation;

    return matchesSearch && matchesType && matchesLocation;
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

    setIsCheckoutLoading(true);

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
      setIsCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300 relative">
      {/* Cart Toggle Button - Fixed Position */}
      <button
        onClick={() => setIsCartOpen(!isCartOpen)}
        className="fixed bottom-8 right-8 z-40 bg-green-600 hover:bg-green-700 text-white p-6 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 hover:scale-110 border-4 border-white dark:border-gray-800"
      >
        <FiShoppingCart className="h-8 w-8" />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-lg rounded-full w-10 h-10 flex items-center justify-center font-bold border-2 border-white dark:border-gray-800">
            {cart.length}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex items-center justify-between p-6 border-b-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center gap-3">
              <FiShoppingCart className="h-8 w-8 text-green-600 dark:text-green-400" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Cart</h2>
              {cart.length > 0 && (
                <span className="bg-green-600 text-white text-lg rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-3 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <FiX className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <FiShoppingCart className="mx-auto h-24 w-24 text-gray-400 mb-6" />
                <p className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">Your cart is empty</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Add products to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-gray-200 dark:border-gray-600">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{item.name}</h3>
                      <p className="text-base text-gray-600 dark:text-gray-400 font-semibold">
                        ₹{formatINR(item.priceAtPurchase)} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        ₹{formatINR(item.priceAtPurchase * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product)}
                        className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer with Checkout */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                  <span className="text-gray-800 dark:text-white font-medium">₹{formatINR(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                  <span className="text-gray-800 dark:text-white font-medium">₹0.00</span>
                </div>
                <div className="flex justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-lg font-semibold text-gray-800 dark:text-white">Total</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">₹{formatINR(totalPrice)}</span>
                </div>
              </div>

              <form onSubmit={handleCheckout} className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-2xl">📍</span>
                  Delivery Address
                </h3>
                <input
                  type="text"
                  name="street"
                  placeholder="🏠 Street Address"
                  value={deliveryAddress.street}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-700 focus:border-green-500 transition-all"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="🏙️ City"
                  value={deliveryAddress.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-700 focus:border-green-500 transition-all"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="state"
                    placeholder="🗺️ State"
                    value={deliveryAddress.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-700 focus:border-green-500 transition-all"
                  />
                  <input
                    type="text"
                    name="zip"
                    placeholder="📮 ZIP Code"
                    value={deliveryAddress.zip}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-700 focus:border-green-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isCheckoutLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isCheckoutLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>✅ Place Order</span>
                      <FiArrowRight className="h-6 w-6" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Overlay when cart is open */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <div className="container mx-auto px-4 pb-8 pt-28">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <FiShoppingBag className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">Marketplace</h1>
        </div>

        {/* Admin Add Product */}
        {isAdmin && (
          <form onSubmit={handleAddProduct} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
            <h2 className="font-semibold mb-3 flex items-center gap-2"><FiPlus /> Add Product</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input className="border rounded px-3 py-2 bg-white dark:bg-gray-700" placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required />
              <input className="border rounded px-3 py-2 bg-white dark:bg-gray-700" placeholder="Price per unit" type="number" step="0.01" value={newProduct.price_per_unit} onChange={(e) => setNewProduct({ ...newProduct, price_per_unit: e.target.value })} required />
              <input className="border rounded px-3 py-2 bg-white dark:bg-gray-700" placeholder="Quantity" type="number" value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })} required />
              <input className="border rounded px-3 py-2 bg-white dark:bg-gray-700 md:col-span-2" placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
              <div className="flex gap-2">
                <select className="border rounded px-3 py-2 bg-white dark:bg-gray-700" value={newProduct.unit} onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}>
                  {['kg', 'lb', 'piece', 'dozen', 'bunch', 'liter', 'gallon', 'box'].map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <select className="border rounded px-3 py-2 bg-white dark:bg-gray-700" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                  {['vegetables', 'fruits', 'dairy', 'meat', 'poultry', 'grains', 'herbs', 'other'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <input className="border rounded px-3 py-2 bg-white dark:bg-gray-700" placeholder="City/Location" value={newProduct.location} onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })} />
              <div className="space-y-2">
                <label className="text-sm text-gray-700 dark:text-gray-300">Photos (multiple)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setNewProduct({
                    ...newProduct,
                    productImages: Array.from(e.target.files || [])
                  })}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">Farmers/Admins can upload multiple photos.</p>
              </div>
            </div>
            <div className="mt-3">
              <button type="submit" className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white">Save</button>
            </div>
          </form>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border-2 border-green-100 dark:border-green-900/30">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-grow w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <input
                type="text"
                placeholder="🔍 Search products..."
                className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-700 focus:border-green-500 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Product Type Filter */}
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <FiFilter className="h-6 w-6 text-green-600 dark:text-green-400" />
              <select
                className="border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-4 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-700 focus:border-green-500 transition-all duration-300"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                {productTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'all' ? '🌾 All Types' : `🌾 ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <FiMapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
              <select
                className="border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-4 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-700 focus:border-green-500 transition-all duration-300"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location === 'all' ? '📍 All Locations' : `📍 ${location}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-yellow-50 dark:bg-gray-700 border-l-4 border-yellow-400 text-yellow-800 dark:text-yellow-200 p-4 mb-6 rounded">
            <p>No products found. Try a different search term or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const images = product.images && product.images.length ? product.images : (product.image ? [product.image] : []);
              return (
                <div
                  key={product._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
                  onClick={() => {
                    setSelectedProduct(product);
                    setSelectedImageIndex(0);
                  }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error';
                      }}
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      ₹{formatINR(product.price_per_unit)}/{product.unit}
                    </div>
                    {product.organic && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Organic
                      </div>
                    )}
                    <button
                      className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success(`Added ${product.name} to favorites!`);
                      }}
                    >
                      <FiHeart className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">{product.name}</h3>
                      <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                        <FiStar className="h-5 w-5 text-yellow-500 fill-current" />
                        <span className="text-base font-semibold text-gray-700 dark:text-gray-300 ml-1">{product.rating || 4.5}</span>
                      </div>
                    </div>
                    <p className="text-base text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center mb-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      <span className="text-base font-semibold text-gray-700 dark:text-gray-300">
                        📦 {product.quantity} {product.unit}
                      </span>
                      <span className="text-base font-semibold text-gray-700 dark:text-gray-300">📍 {product.location}</span>
                    </div>
                    {isAdmin && (
                      <div className="mt-3 flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); handleQuickEdit(product); }} className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 text-sm"><FiEdit2 /> Edit</button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(product._id); }} className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white flex items-center gap-1 text-sm"><FiTrash2 /> Delete</button>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-4 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-bold"
                    >
                      <FiShoppingCart className="h-6 w-6" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Detail Modal (centered) */}
      {selectedProduct && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
                <div className="space-y-1">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{selectedProduct.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">₹{formatINR(selectedProduct.price_per_unit)} / {selectedProduct.unit}</p>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <FiX className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              <div className="p-6 flex flex-col md:flex-row gap-6 items-stretch">
                {/* Left: details and buttons */}
                <div className="flex-1 space-y-4">
                  <div className="h-4 w-24 rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div className="flex gap-6">
                    <div className="h-2 w-28 rounded-full bg-gray-200 dark:bg-gray-800" />
                    <div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
                  </div>
                  <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-800" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selectedProduct.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span>📦 {selectedProduct.quantity} {selectedProduct.unit}</span>
                    <span className="mx-2">•</span>
                    <span>📍 {selectedProduct.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-md"
                    >
                      <FiShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold flex items-center gap-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      Close
                    </button>
                  </div>
                </div>

                {/* Right: image preview */}
                <div className="w-full md:w-80 lg:w-96 bg-gray-50 dark:bg-gray-800/70 rounded-2xl p-4 border border-dashed border-gray-300 dark:border-gray-700 flex flex-col gap-3">
                  <div className="aspect-square w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={(selectedProduct.images && selectedProduct.images[selectedImageIndex]) || selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/600x600?text=Image+Error';
                      }}
                    />
                  </div>
                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {selectedProduct.images.map((img, idx) => (
                        <button
                          key={img + idx}
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`h-16 w-20 rounded-lg overflow-hidden border-2 ${idx === selectedImageIndex ? 'border-green-500' : 'border-transparent'} shrink-0`}
                        >
                          <img
                            src={img}
                            alt={`${selectedProduct.name} ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150x100?text=Image';
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Marketplace;
