import React from 'react'
import { Link } from 'react-router-dom'
import { UseTheme } from '../../context/ThemeContext'
import { FiSun, FiMoon, FiMenu, FiX, FiChevronDown, FiShoppingCart, FiUser, FiLogOut, FiMoreHorizontal } from 'react-icons/fi'
import { useCart } from '../pages/CartContext'
import { useState, useEffect, useRef } from 'react'

function Header() {
  const { isDarkMode, toggleTheme } = UseTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProductsOpen, setIsProductsOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { cart } = useCart()

  // Refs for dropdown menus
  const productsDropdownRef = useRef(null)
  const moreDropdownRef = useRef(null)
  const userDropdownRef = useRef(null)

  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const isLoggedIn = !!user

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (productsDropdownRef.current && !productsDropdownRef.current.contains(event.target)) {
        setIsProductsOpen(false)
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
        setIsMoreOpen(false)
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  const handleDropdownClick = (dropdownType) => {
    // Close other dropdowns
    if (dropdownType !== 'products') setIsProductsOpen(false)
    if (dropdownType !== 'more') setIsMoreOpen(false)
    if (dropdownType !== 'user') setIsUserMenuOpen(false)
    
    // Toggle the clicked dropdown
    switch (dropdownType) {
      case 'products':
        setIsProductsOpen(!isProductsOpen)
        break
      case 'more':
        setIsMoreOpen(!isMoreOpen)
        break
      case 'user':
        setIsUserMenuOpen(!isUserMenuOpen)
        break
      default:
        break
    }
  }

  const handleMenuClick = () => {
    // Close all dropdowns when clicking on any menu item
    setIsProductsOpen(false)
    setIsMoreOpen(false)
    setIsUserMenuOpen(false)
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white py-4 shadow-lg dark:shadow-gray-800/20 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2" onClick={handleMenuClick}>
          <div className="w-8 h-8 bg-green-600 dark:bg-green-500 rounded-lg flex items-center justify-center animate-bounce-slow">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                            Farmer Buddy
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex gap-6 text-sm lg:text-base items-center">
            {/* Home */}
            <li>
              <Link to="/" className="font-semibold hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 relative group" onClick={handleMenuClick}>
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 dark:bg-green-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>

            {/* About */}
            <li>
              <Link to="/about" className="hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 relative group" onClick={handleMenuClick}>
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 dark:bg-green-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>

            {/* Products with submenu */}
            <li className="relative" ref={productsDropdownRef}>
              <button 
                className="inline-flex items-center gap-1 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300"
                onClick={() => handleDropdownClick('products')}
              >
                Products <FiChevronDown className={`w-4 h-4 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className={`absolute left-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 transition-all duration-200 ${
                isProductsOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Link to="/products#vegetables" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" onClick={handleMenuClick}>Vegetables</Link>
                  <Link to="/products#fruits" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" onClick={handleMenuClick}>Fruits</Link>
                  <Link to="/products#grains" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" onClick={handleMenuClick}>Grains</Link>
                  <Link to="/products#seeds" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" onClick={handleMenuClick}>Seeds</Link>
                  <Link to="/products#fertilizers" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" onClick={handleMenuClick}>Fertilizers</Link>
                  <Link to="/products#equipment" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" onClick={handleMenuClick}>Equipment</Link>
                </div>
                <Link to="/products" className="block mt-2 text-center text-xs text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400" onClick={handleMenuClick}>View all products</Link>
              </div>
            </li>

            {/* More Options with submenu */}
            <li className="relative" ref={moreDropdownRef}>
              <button 
                className="inline-flex items-center gap-1 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300"
                onClick={() => handleDropdownClick('more')}
              >
                <FiMoreHorizontal className="w-4 h-4" />
                More <FiChevronDown className={`w-4 h-4 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className={`absolute left-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 transition-all duration-200 ${
                isMoreOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <Link to="/services" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2" onClick={handleMenuClick}>
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Services
                  </Link>
                  <Link to="/prices" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2" onClick={handleMenuClick}>
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Prices
                  </Link>
                  <Link to="/weather" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2" onClick={handleMenuClick}>
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Weather
                  </Link>
                  <Link to="/blog" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2" onClick={handleMenuClick}>
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Blog
                  </Link>
                  <Link to="/gallery" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2" onClick={handleMenuClick}>
                    <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                    Gallery
                  </Link>
                  <Link to="/contact" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2" onClick={handleMenuClick}>
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Contact
                  </Link>
                  <Link to="/smart-crop-planning" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2" onClick={handleMenuClick}>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    Smart Crop Planning
                  </Link>
                  <Link to="/ai-farming-chatbot" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2" onClick={handleMenuClick}>
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    AI Farming Chatbot
                  </Link>
                  <Link to="/ar-product-scanner" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2" onClick={handleMenuClick}>
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    AR Product Scanner
                  </Link>
                  <Link to="/community-impact-tracker" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2" onClick={handleMenuClick}>
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Community Impact Tracker
                  </Link>
                </div>
              </div>
            </li>

            {/* Marketplace */}
            <li>
              <Link to="/marketplace" className="hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 relative group" onClick={handleMenuClick}>
                Marketplace
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 dark:bg-green-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>

            {/* Cart */}
            <li>
              <Link to="/cart" className="hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 relative group flex items-center" onClick={handleMenuClick}>
                <FiShoppingCart className="mr-1" />
                Cart
                {cart.length > 0 && (
                  <span className="ml-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 dark:bg-green-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>

            {/* User Menu */}
            {isLoggedIn ? (
              <li className="relative" ref={userDropdownRef}>
                <button 
                  className="inline-flex items-center gap-1 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300"
                  onClick={() => handleDropdownClick('user')}
                >
                  <FiUser className="w-4 h-4" />
                  {user?.name || 'User'}
                  <FiChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 transition-all duration-200 ${
                  isUserMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}>
                  <div className="text-sm">
                    <div className="px-3 py-2 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                      {user?.email}
                    </div>
                    {user?.role === 'farmer' && (
                      <Link to="/farmerdashboard" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" onClick={handleMenuClick}>
                        Dashboard
                      </Link>
                    )}
                    <Link to="/orders" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" onClick={handleMenuClick}>
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 flex items-center gap-2"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </li>
            ) : (
              <li>
                <Link to="/login" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-300" onClick={handleMenuClick}>
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Theme Toggle and Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <FiSun className="w-5 h-5 text-yellow-500" />
            ) : (
              <FiMoon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <FiX className="w-5 h-5" />
            ) : (
              <FiMenu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden animate-fade-in-up">
          <div className="px-4 py-2 space-y-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <Link to="/" className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300" onClick={handleMenuClick}>Home</Link>
            <Link to="/about" className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300" onClick={handleMenuClick}>About</Link>
            
            {/* Products expandable */}
            <button onClick={() => setIsProductsOpen(!isProductsOpen)} className="w-full text-left py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 inline-flex items-center justify-between">
              <span>Products</span>
              <FiChevronDown className={`w-4 h-4 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} />
            </button>
            {isProductsOpen && (
              <div className="ml-4 space-y-1">
                <Link to="/products#vegetables" className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={handleMenuClick}>Vegetables</Link>
                <Link to="/products#fruits" className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={handleMenuClick}>Fruits</Link>
                <Link to="/products#grains" className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={handleMenuClick}>Grains</Link>
                <Link to="/products#seeds" className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={handleMenuClick}>Seeds</Link>
                <Link to="/products#fertilizers" className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={handleMenuClick}>Fertilizers</Link>
                <Link to="/products#equipment" className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={handleMenuClick}>Equipment</Link>
                <Link to="/products" className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={handleMenuClick}>All Products</Link>
              </div>
            )}

            {/* More Options expandable */}
            <button onClick={() => setIsMoreOpen(!isMoreOpen)} className="w-full text-left py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 inline-flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FiMoreHorizontal className="w-4 h-4" />
                More Options
              </span>
              <FiChevronDown className={`w-4 h-4 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
            </button>
            {isMoreOpen && (
              <div className="ml-4 space-y-1">
                <Link to="/services" className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2" onClick={handleMenuClick}>
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Services
                </Link>
                <Link to="/prices" className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2" onClick={handleMenuClick}>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Prices
                </Link>
                <Link to="/weather" className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2" onClick={handleMenuClick}>
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Weather
                </Link>
                <Link to="/blog" className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2" onClick={handleMenuClick}>
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Blog
                </Link>
                <Link to="/gallery" className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2" onClick={handleMenuClick}>
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  Gallery
                </Link>
                <Link to="/contact" className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2" onClick={handleMenuClick}>
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Contact
                </Link>
              </div>
            )}

            <Link to="/marketplace" className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300" onClick={handleMenuClick}>Marketplace</Link>
            <Link to="/cart" className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 flex items-center" onClick={handleMenuClick}>
              <FiShoppingCart className="mr-2" /> Cart
              {cart.length > 0 && (
                <span className="ml-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
            
            {isLoggedIn ? (
              <>
                {user?.role === 'farmer' && (
                  <Link to="/farmerdashboard" className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300" onClick={handleMenuClick}>Dashboard</Link>
                )}
                <Link to="/orders" className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300" onClick={handleMenuClick}>My Orders</Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 text-red-600 dark:text-red-400 flex items-center gap-2"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block py-2 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all duration-300" onClick={handleMenuClick}>Login</Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header