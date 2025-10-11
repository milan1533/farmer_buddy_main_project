
import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiMapPin, FiShoppingCart, FiHeart, FiStar, FiEye, FiPlus, FiTrash2, FiSun, FiMoon } from 'react-icons/fi';
import { productService } from '../api';
import { toast } from 'react-hot-toast';
import { UseTheme } from '../../context/ThemeContext';

const FarmerDashboard = () => {
  const { isDarkMode, toggleTheme } = UseTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price_per_unit: 0,
    quantity: 0,
    unit: 'lb',
    location: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch user's products
  useEffect(() => {
    fetchUserProducts();
  }, []);

  const fetchUserProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getUserProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products');
      toast.error('Failed to load your products');
      console.error('Error fetching products:', err);
      // Use sample data if API fails
      setProducts([
        {
          id: 1,
          farmer_id: "F001",
          name: "Organic Apples",
          description: "Crisp, juicy apples grown organically in sunny orchards.",
          price_per_unit: 3.99,
          quantity: 50,
          unit: "lb",
          image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop",
          created_at: "2025-08-01",
          rating: 4.8,
          reviews: 24,
          location: "Green Valley Farm"
        },
        {
          id: 2,
          farmer_id: "F002",
          name: "Fresh Carrots",
          description: "Sweet, crunchy carrots harvested fresh from the field.",
          price_per_unit: 2.49,
          quantity: 100,
          unit: "lb",
          image: "https://images.unsplash.com/photo-1447175008436-170170e8a4d7?w=400&h=300&fit=crop",
          created_at: "2025-08-03",
          rating: 4.6,
          reviews: 18,
          location: "Sunny Acres"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('description', newProduct.description);
      formData.append('price_per_unit', newProduct.price_per_unit);
      formData.append('quantity', newProduct.quantity);
      formData.append('unit', newProduct.unit);
      formData.append('location', newProduct.location);
      formData.append('category', 'vegetables'); // default category
      if (imageFile) {
        formData.append('productImage', imageFile);
      }

      const response = await productService.addProduct(formData);
      toast.success('Product added successfully!');
      setProducts([...products, response.product]);
      setNewProduct({
        name: '',
        description: '',
        price_per_unit: 0,
        quantity: 0,
        unit: 'lb',
        location: ''
      });
      setImageFile(null);
      setShowAddForm(false);
    } catch (err) {
      toast.error('Failed to add product');
      console.error('Error adding product:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting a product
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setIsLoading(true);
      try {
        await productService.deleteProduct(productId);
        toast.success('Product deleted successfully!');
        setProducts(products.filter(product => product.id !== productId));
      } catch (err) {
        toast.error('Failed to delete product');
        console.error('Error deleting product:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle input change for new product form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === 'price_per_unit' || name === 'quantity' ? (value === '' ? '' : parseFloat(value)) : value
    });
  };

  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || product.unit === filterType;
    const matchesLocation = filterLocation === 'all' || product.location === filterLocation;
    
    return matchesSearch && matchesType && matchesLocation;
  }) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-all duration-300">
      <main className="container mx-auto px-4 py-12 flex-grow">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-16 animate-fade-in-up">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 leading-tight">
              Farmer's{' '}
              <span className="bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Manage your products and track your farm's success
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <FiSun className="w-6 h-6 text-yellow-500" />
              ) : (
                <FiMoon className="w-6 h-6 text-gray-600" />
              )}
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <FiPlus className="h-5 w-5" />
              {showAddForm ? 'Cancel' : 'Add Product'}
            </button>
          </div>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 mb-16 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              {/* Price */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Price per Unit</label>
                <input
                  type="number"
                  name="price_per_unit"
                  value={newProduct.price_per_unit}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              {/* Quantity */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={newProduct.quantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              {/* Unit */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Unit</label>
                <select
                  name="unit"
                  value={newProduct.unit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-300"
                >
                  <option value="lb">Pound (lb)</option>
                  <option value="kg">Kilogram (kg)</option>
                  <option value="each">Each</option>
                  <option value="dozen">Dozen</option>
                  <option value="bunch">Bunch</option>
                </select>
              </div>
              
              {/* Location */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Farm Location</label>
                <input
                  type="text"
                  name="location"
                  value={newProduct.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              {/* Image Upload */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-300"
                ></textarea>
              </div>
              
              {/* Submit Button */}
              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
                >
                  {isLoading ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search and Filter Section */}
        <section className="mb-8 animate-slide-in-left">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Bar */}
              <div className="md:col-span-2">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {/* Filter by Type */}
              <div>
                <div className="relative">
                  <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-300 appearance-none"
                  >
                    <option value="all">All Types</option>
                    <option value="lb">Pounds</option>
                    <option value="dozen">Dozen</option>
                    <option value="pint">Pint</option>
                    <option value="bunch">Bunch</option>
                  </select>
                </div>
              </div>

              {/* Filter by Location */}
              <div>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-300 appearance-none"
                  >
                    <option value="all">All Locations</option>
                    <option value="Green Valley Farm">Green Valley Farm</option>
                    <option value="Sunny Acres">Sunny Acres</option>
                    <option value="Happy Hen Farm">Happy Hen Farm</option>
                    <option value="Berry Bliss Farm">Berry Bliss Farm</option>
                    <option value="Green Leaf Farm">Green Leaf Farm</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

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
            <p>No products found. {searchTerm ? 'Try a different search term.' : 'Add your first product to get started!'}</p>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group ${
                  index === 0 ? 'animate-slide-in-left' : 
                  index === 1 ? 'animate-fade-in-up' : 'animate-slide-in-right'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Product Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error';
                    }}
                    loading="lazy"
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-300"
                      title="Delete product"
                    >
                      <FiTrash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                    <button className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
                      <FiEye className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{product.rating}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">({product.reviews})</span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <FiMapPin className="w-4 h-4" />
                      <span>{product.location}</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {product.quantity} {product.unit} available
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${product.price_per_unit}
                      <span className="text-sm text-gray-500 dark:text-gray-400">/{product.unit}</span>
                    </div>
                    <button className="flex items-center space-x-2 bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-700 dark:hover:bg-green-600 transition-all duration-300 transform hover:scale-105">
                      <FiShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* No Results Message */}
        {filteredProducts.length === 0 && (
          <section className="text-center py-12 animate-fade-in-up">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default FarmerDashboard;



