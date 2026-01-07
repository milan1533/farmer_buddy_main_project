import React from 'react'
import { Link } from 'react-router-dom'
import { UseTheme } from '../../context/ThemeContext'
import { FiSun, FiMoon, FiMenu, FiX, FiChevronDown, FiShoppingCart, FiUser, FiLogOut, FiMoreHorizontal, FiHome, FiShoppingBag, FiSettings, FiGrid } from 'react-icons/fi'
import { useState, useEffect, useRef } from 'react'

function Header() {
  const { isDarkMode, toggleTheme } = UseTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  // Refs for dropdown menus
  const moreDropdownRef = useRef(null)
  const userDropdownRef = useRef(null)

  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const isLoggedIn = !!user
  const isAdmin = user?.role === 'Admin' || user?.role === 'admin'

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
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
    if (dropdownType !== 'more') setIsMoreOpen(false)
    if (dropdownType !== 'user') setIsUserMenuOpen(false)
    
    // Toggle the clicked dropdown
    switch (dropdownType) {
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
    setIsMoreOpen(false)
    setIsUserMenuOpen(false)
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="bg-white/95 dark:bg-gray-900/90 backdrop-blur text-gray-800 dark:text-white py-2 shadow-md dark:shadow-gray-800/20 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 flex items-center gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2" onClick={handleMenuClick}>
          <div className="w-6 h-6 bg-green-600 dark:bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">F</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
            Farmer Buddy
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block ml-auto">
          <ul className="flex gap-4 text-sm lg:text-base items-center">
            {/* Home */}
            <li>
              <Link to="/" className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 group min-w-[80px]" onClick={handleMenuClick}>
                <FiHome className="w-7 h-7 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Home</span>
              </Link>
            </li>

            {/* Marketplace */}
            <li>
              <Link to="/marketplace" className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 group min-w-[80px]" onClick={handleMenuClick}>
                <FiShoppingBag className="w-7 h-7 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Market</span>
              </Link>
            </li>

            {/* Services */}
            <li>
              <Link to="/services" className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 group min-w-[80px]" onClick={handleMenuClick}>
                <FiSettings className="w-7 h-7 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Services</span>
              </Link>
            </li>

            {/* More Options with submenu */}
            <li className="relative" ref={moreDropdownRef}>
              <button 
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 group min-w-[80px]"
                onClick={() => handleDropdownClick('more')}
              >
                <FiGrid className="w-7 h-7 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">More</span>
                <FiChevronDown className={`w-3 h-3 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className={`absolute left-0 mt-3 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-green-200 dark:border-green-800 p-4 transition-all duration-200 max-h-[80vh] overflow-y-auto ${
                isMoreOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}>
                <div className="grid grid-cols-3 gap-3">
                  <Link to="/products" className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all border-2 border-transparent hover:border-orange-300 dark:hover:border-orange-700" onClick={handleMenuClick}>
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🌾</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">Product</span>
                  </Link>
                  <Link to="/farming-calendar" className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-lime-50 dark:hover:bg-lime-900/20 transition-all border-2 border-transparent hover:border-lime-300 dark:hover:border-lime-700" onClick={handleMenuClick}>
                    <div className="w-12 h-12 bg-lime-100 dark:bg-lime-900/30 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📅</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">Farming Calendar</span>
                  </Link>
                  <Link to="/prices" className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all border-2 border-transparent hover:border-green-300 dark:hover:border-green-700" onClick={handleMenuClick}>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">Prices</span>
                  </Link>
                  <Link to="/weather" className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all border-2 border-transparent hover:border-yellow-300 dark:hover:border-yellow-700" onClick={handleMenuClick}>
                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                      <span className="text-2xl">☀️</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">Weather</span>
                  </Link>
                  <Link to="/blog" className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-700" onClick={handleMenuClick}>
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📝</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">Blog</span>
                  </Link>
                  <Link to="/gallery" className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all border-2 border-transparent hover:border-pink-300 dark:hover:border-pink-700" onClick={handleMenuClick}>
                    <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🖼️</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">Gallery</span>
                  </Link>
                  <Link to="/contact" className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-700" onClick={handleMenuClick}>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📞</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">Contact</span>
                  </Link>
                  <Link to="/smart-crop-planning" className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all border-2 border-transparent hover:border-emerald-300 dark:hover:border-emerald-700" onClick={handleMenuClick}>
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🌱</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">Crop Plan</span>
                  </Link>
                  <Link to="/ai-farming-chatbot" className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all border-2 border-transparent hover:border-cyan-300 dark:hover:border-cyan-700" onClick={handleMenuClick}>
                    <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">AI Chat</span>
                  </Link>
                  <Link to="/ar-product-scanner" className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all border-2 border-transparent hover:border-indigo-300 dark:hover:border-indigo-700" onClick={handleMenuClick}>
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📱</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">AR Scan</span>
                  </Link>
                  <Link to="/community-impact-tracker" className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all border-2 border-transparent hover:border-teal-300 dark:hover:border-teal-700" onClick={handleMenuClick}>
                    <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🌍</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">Impact</span>
                  </Link>
                </div>
              </div>
            </li>

            {/* User Menu */}
            {isLoggedIn ? (
              <li className="relative" ref={userDropdownRef}>
                <button 
                  className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 group min-w-[80px]"
                  onClick={() => handleDropdownClick('user')}
                >
                  <FiUser className="w-7 h-7 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[60px]">{user?.name?.split(' ')[0] || 'User'}</span>
                  <FiChevronDown className={`w-3 h-3 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
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
                    {isAdmin && (
                      <Link to="/admin" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" onClick={handleMenuClick}>
                        Admin Panel
                      </Link>
                    )}
                    <Link to="/settings" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" onClick={handleMenuClick}>
                      Settings
                    </Link>
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
                <Link to="/login" className="flex flex-col items-center gap-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl min-w-[100px]" onClick={handleMenuClick}>
                  <FiUser className="w-6 h-6" />
                  <span className="text-xs font-bold">Login</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Theme Toggle and Mobile Menu Button */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <FiSun className="w-4 h-4 text-yellow-500" />
            ) : (
              <FiMoon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
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
          <div className="px-4 py-4 space-y-3 bg-white dark:bg-gray-900 border-t-2 border-green-200 dark:border-green-800">
            <Link to="/" className="flex items-center gap-4 py-4 px-4 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 border-2 border-transparent hover:border-green-300" onClick={handleMenuClick}>
              <FiHome className="w-8 h-8 text-green-600 dark:text-green-400" />
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Home</span>
            </Link>
            <Link to="/marketplace" className="flex items-center gap-4 py-4 px-4 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 border-2 border-transparent hover:border-green-300" onClick={handleMenuClick}>
              <FiShoppingBag className="w-8 h-8 text-green-600 dark:text-green-400" />
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Marketplace</span>
            </Link>
            <Link to="/services" className="flex items-center gap-4 py-4 px-4 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 border-2 border-transparent hover:border-green-300" onClick={handleMenuClick}>
              <FiSettings className="w-8 h-8 text-green-600 dark:text-green-400" />
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Services</span>
            </Link>

            {/* More Options expandable */}
            <button onClick={() => setIsMoreOpen(!isMoreOpen)} className="w-full flex items-center justify-between py-4 px-4 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 border-2 border-transparent hover:border-green-300">
              <div className="flex items-center gap-4">
                <FiGrid className="w-8 h-8 text-green-600 dark:text-green-400" />
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">More</span>
              </div>
              <FiChevronDown className={`w-6 h-6 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
            </button>
            {isMoreOpen && (
              <div className="ml-4 space-y-2 grid grid-cols-2 gap-2">
                <Link to="/products" className="flex flex-col items-center gap-2 py-3 px-3 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 border-2 border-transparent hover:border-orange-300" onClick={handleMenuClick}>
                  <span className="text-3xl">🌾</span>
                  <span className="text-xs font-semibold text-center">Product</span>
                </Link>
                <Link to="/farming-calendar" className="flex flex-col items-center gap-2 py-3 px-3 rounded-xl hover:bg-lime-50 dark:hover:bg-lime-900/20 border-2 border-transparent hover:border-lime-300" onClick={handleMenuClick}>
                  <span className="text-3xl">📅</span>
                  <span className="text-xs font-semibold text-center">Farming Calendar</span>
                </Link>
                <Link to="/prices" className="flex flex-col items-center gap-2 py-3 px-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 border-2 border-transparent hover:border-green-300" onClick={handleMenuClick}>
                  <span className="text-3xl">💰</span>
                  <span className="text-xs font-semibold text-center">Prices</span>
                </Link>
                <Link to="/weather" className="flex flex-col items-center gap-2 py-3 px-3 rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-900/20 border-2 border-transparent hover:border-yellow-300" onClick={handleMenuClick}>
                  <span className="text-3xl">☀️</span>
                  <span className="text-xs font-semibold text-center">Weather</span>
                </Link>
                <Link to="/blog" className="flex flex-col items-center gap-2 py-3 px-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 border-2 border-transparent hover:border-purple-300" onClick={handleMenuClick}>
                  <span className="text-3xl">📝</span>
                  <span className="text-xs font-semibold text-center">Blog</span>
                </Link>
                <Link to="/gallery" className="flex flex-col items-center gap-2 py-3 px-3 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/20 border-2 border-transparent hover:border-pink-300" onClick={handleMenuClick}>
                  <span className="text-3xl">🖼️</span>
                  <span className="text-xs font-semibold text-center">Gallery</span>
                </Link>
                <Link to="/contact" className="flex flex-col items-center gap-2 py-3 px-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 border-2 border-transparent hover:border-blue-300" onClick={handleMenuClick}>
                  <span className="text-3xl">📞</span>
                  <span className="text-xs font-semibold text-center">Contact</span>
                </Link>
                <Link to="/smart-crop-planning" className="flex flex-col items-center gap-2 py-3 px-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-2 border-transparent hover:border-emerald-300" onClick={handleMenuClick}>
                  <span className="text-3xl">🌱</span>
                  <span className="text-xs font-semibold text-center">Crop Plan</span>
                </Link>
                <Link to="/ai-farming-chatbot" className="flex flex-col items-center gap-2 py-3 px-3 rounded-xl hover:bg-cyan-50 dark:hover:bg-cyan-900/20 border-2 border-transparent hover:border-cyan-300" onClick={handleMenuClick}>
                  <span className="text-3xl">🤖</span>
                  <span className="text-xs font-semibold text-center">AI Chat</span>
                </Link>
                <Link to="/ar-product-scanner" className="flex flex-col items-center gap-2 py-3 px-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border-2 border-transparent hover:border-indigo-300" onClick={handleMenuClick}>
                  <span className="text-3xl">📱</span>
                  <span className="text-xs font-semibold text-center">AR Scan</span>
                </Link>
                <Link to="/community-impact-tracker" className="flex flex-col items-center gap-2 py-3 px-3 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20 border-2 border-transparent hover:border-teal-300" onClick={handleMenuClick}>
                  <span className="text-3xl">🌍</span>
                  <span className="text-xs font-semibold text-center">Impact</span>
                </Link>
              </div>
            )}
            
            {isLoggedIn ? (
              <>
                {user?.role === 'farmer' && (
                  <Link to="/farmerdashboard" className="flex items-center gap-4 py-4 px-4 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 border-2 border-transparent hover:border-green-300" onClick={handleMenuClick}>
                    <span className="text-2xl">📊</span>
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Dashboard</span>
                  </Link>
                )}
                {isLoggedIn && isAdmin && (
                  <Link to="/admin" className="flex items-center gap-4 py-4 px-4 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 border-2 border-transparent hover:border-green-300" onClick={handleMenuClick}>
                    <span className="text-2xl">🛠️</span>
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Admin Panel</span>
                  </Link>
                )}
                <Link to="/orders" className="flex items-center gap-4 py-4 px-4 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 border-2 border-transparent hover:border-green-300" onClick={handleMenuClick}>
                  <span className="text-2xl">📦</span>
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">My Orders</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 py-4 px-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 text-red-600 dark:text-red-400 border-2 border-transparent hover:border-red-300"
                >
                  <FiLogOut className="w-8 h-8" />
                  <span className="text-lg font-semibold">Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-green-600 hover:bg-green-700 text-white transition-all duration-300 shadow-lg" onClick={handleMenuClick}>
                <FiUser className="w-8 h-8" />
                <span className="text-lg font-bold">Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header