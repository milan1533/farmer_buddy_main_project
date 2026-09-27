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
    <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-earth-200 dark:border-white/10 shadow-soft">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group" onClick={handleMenuClick}>
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-all duration-300">
            <span className="text-white font-display font-bold text-xl">F</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-display font-bold text-gray-900 dark:text-white leading-none tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              Farmer Buddy
            </h1>
            <span className="text-[10px] uppercase tracking-widest text-earth-600 dark:text-earth-400 font-semibold">
              Premium Agri-Tech
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link to="/" className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all" onClick={handleMenuClick}>
            Home
          </Link>
          <Link to="/marketplace" className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all" onClick={handleMenuClick}>
            Marketplace
          </Link>
          <Link to="/services" className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all" onClick={handleMenuClick}>
            Services
          </Link>

          {/* More Dropdown */}
          <div className="relative group" ref={moreDropdownRef}>
            <button
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all"
              onClick={() => handleDropdownClick('more')}
            >
              More
              <FiChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMoreOpen ? 'rotate-180 text-primary-600' : ''}`} />
            </button>
            <div className={`absolute top-full right-0 mt-2 w-80 p-2 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 transform transition-all duration-200 origin-top-right z-50 ${isMoreOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
              <div className="grid grid-cols-2 gap-1">
                <Link to="/products" className="flex flex-col items-center p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-white/5 transition-colors group/item" onClick={handleMenuClick}>
                  <span className="text-2xl mb-1 group-hover/item:scale-110 transition-transform">🌾</span>
                  <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">Products</span>
                </Link>
                <Link to="/farming-calendar" className="flex flex-col items-center p-3 rounded-xl hover:bg-lime-50 dark:hover:bg-white/5 transition-colors group/item" onClick={handleMenuClick}>
                  <span className="text-2xl mb-1 group-hover/item:scale-110 transition-transform">📅</span>
                  <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">Calendar</span>
                </Link>
                <Link to="/weather" className="flex flex-col items-center p-3 rounded-xl hover:bg-sky-50 dark:hover:bg-white/5 transition-colors group/item" onClick={handleMenuClick}>
                  <span className="text-2xl mb-1 group-hover/item:scale-110 transition-transform">🌤️</span>
                  <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">Weather</span>
                </Link>
                <Link to="/smart-crop-planning" className="flex flex-col items-center p-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-white/5 transition-colors group/item" onClick={handleMenuClick}>
                  <span className="text-2xl mb-1 group-hover/item:scale-110 transition-transform">🌱</span>
                  <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">AI Plan</span>
                </Link>
                <Link to="/ai-farming-chatbot" className="flex flex-col items-center p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-white/5 transition-colors group/item" onClick={handleMenuClick}>
                  <span className="text-2xl mb-1 group-hover/item:scale-110 transition-transform">🤖</span>
                  <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">Chatbot</span>
                </Link>
                <Link to="/ar-product-scanner" className="flex flex-col items-center p-3 rounded-xl hover:bg-purple-50 dark:hover:bg-white/5 transition-colors group/item" onClick={handleMenuClick}>
                  <span className="text-2xl mb-1 group-hover/item:scale-110 transition-transform">📱</span>
                  <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">AR Scan</span>
                </Link>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-100 dark:border-white/10 grid grid-cols-2 gap-1">
                <Link to="/community-impact-tracker" className="flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 text-xs font-medium text-gray-600 dark:text-gray-400" onClick={handleMenuClick}>
                  🌍 Impact
                </Link>
                <Link to="/contact" className="flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 text-xs font-medium text-gray-600 dark:text-gray-400" onClick={handleMenuClick}>
                  📞 Contact
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-white/5 transition-all">
            {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>

          {isLoggedIn ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => handleDropdownClick('user')}
                className="flex items-center gap-3 pl-1 pr-3 py-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full hover:shadow-md transition-all shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold text-sm">
                  {user?.name?.[0] || <FiUser />}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">{user?.name?.split(' ')[0]}</span>
                <FiChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-2 transform transition-all duration-200 origin-top-right z-50 ${isUserMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                <div className="px-3 py-2 border-b border-gray-100 dark:border-white/10 mb-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
                {user?.role === 'farmer' && (
                  <Link to="/farmerdashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm text-gray-700 dark:text-gray-200 transition-colors" onClick={handleMenuClick}>
                    <FiGrid className="w-4 h-4" /> Dashboard
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm text-gray-700 dark:text-gray-200 transition-colors" onClick={handleMenuClick}>
                    <FiGrid className="w-4 h-4" /> Admin Panel
                  </Link>
                )}
                <Link to="/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm text-gray-700 dark:text-gray-200 transition-colors" onClick={handleMenuClick}>
                  <FiShoppingBag className="w-4 h-4" /> My Orders
                </Link>
                <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm text-gray-700 dark:text-gray-200 transition-colors" onClick={handleMenuClick}>
                  <FiSettings className="w-4 h-4" /> Settings
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-red-600 dark:text-red-400 transition-colors mt-1">
                  <FiLogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="px-6 py-2.5 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium shadow-lg hover:shadow-glow transition-all transform hover:-translate-y-0.5">
              Sign In
            </Link>
          )}

          <button onClick={toggleMobileMenu} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-40 bg-white dark:bg-dark-bg transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} pt-24 px-6`}>
        <div className="flex flex-col space-y-4">
          <Link to="/" onClick={handleMenuClick} className="block w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-xl font-medium text-gray-900 dark:text-white">Home</Link>
          <Link to="/marketplace" onClick={handleMenuClick} className="block w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-xl font-medium text-gray-900 dark:text-white">Marketplace</Link>
          <Link to="/services" onClick={handleMenuClick} className="block w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-xl font-medium text-gray-900 dark:text-white">Services</Link>
          <div className="h-px bg-gray-100 dark:bg-gray-800 my-2" />
          <Link to="/smart-crop-planning" onClick={handleMenuClick} className="block w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-lg text-gray-700 dark:text-gray-200">Smart Crop Plan</Link>
          <Link to="/ai-farming-chatbot" onClick={handleMenuClick} className="block w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-lg text-gray-700 dark:text-gray-200">AI Chatbot</Link>
          <Link to="/products" onClick={handleMenuClick} className="block w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-lg text-gray-700 dark:text-gray-200">Products</Link>
        </div>
      </div>
    </header>
  )
}

export default Header