import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiMapPin, FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { productService } from '../api';
import { useCart } from './CartContext';
import { toast } from 'react-hot-toast';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

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

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`Added ${product.name} to cart!`);
  };

  // Filter products based on search term and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || product.type === filterType;
    const matchesLocation = filterLocation === 'all' || product.location === filterLocation;
    
    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Marketplace</h1>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Product Type Filter */}
          <div className="flex items-center space-x-2">
            <FiFilter className="h-5 w-5 text-gray-400" />
            <select
              className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-300"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="flex items-center space-x-2">
            <FiMapPin className="h-5 w-5 text-gray-400" />
            <select
              className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-300"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location === 'all' ? 'All Locations' : location}
                </option>
              ))}
            </select>
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
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                  src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error';
                    }}
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    ${product.price_per_unit}/{product.unit}
                  </div>
                  {product.organic && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Organic
                    </div>
                  )}
                  <button
                    className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                    onClick={() => toast.success(`Added ${product.name} to favorites!`)}
                  >
                    <FiHeart className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{product.name}</h3>
                    <div className="flex items-center">
                      <FiStar className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">{product.rating || 4.5}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {product.quantity} {product.unit} available
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{product.location}</span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
                  >
                    <FiShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
