import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiUserPlus, FiUser } from 'react-icons/fi';
import { authService } from '../api';
import { toast } from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Consumer');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [lang, setLang] = useState('en');

  const applyGoogleTranslate = (lng) => {
    const cookieVal = `/auto/${lng}`;
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    document.cookie = `googtrans=${cookieVal}; domain=${window.location.hostname}; path=/;`;
    const combo = document.querySelector('select.goog-te-combo');
    if (combo) {
      combo.value = lng;
      combo.dispatchEvent(new Event('change'));
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');

    if (user && token) {
      // User is already logged in, go to main home
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    if (role !== 'Admin') {
      if (!password) {
        newErrors.password = 'Password is required';
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    setIsLoading(true);
    try {
      // Call real authentication API
      const response = await authService.login({
        email,
        password,
        role
      });

      if (response.success) {
        // Store real user data and token
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);

        toast.success(response.message || `Welcome back, ${response.user.name}!`);

        // Navigate to home
        setTimeout(() => {
          navigate('/home');
        }, 500);
      } else {
        toast.error(response.message || 'Login failed');
      }

    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Invalid credentials. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 dark:bg-dark-bg flex flex-col transition-all duration-300">
      <main className="container mx-auto px-4 py-12 flex-grow flex items-center justify-center">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-stretch">
          {/* Left Image Panel - shown on md+ */}
          <div
            className="hidden md:block rounded-2xl shadow-xl overflow-hidden"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1500937381541-dcb5f0b865a0?q=80&w=1600&auto=format&fit=crop')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '28rem'
            }}
          >
            <div className="h-full w-full bg-gradient-to-tr from-primary-900/40 to-black/20" />
          </div>
          {/* End Left Image Panel */}
          <div className="w-full max-w-md mx-auto">
            {/* Logo and Title */}
            <div className="text-center mb-8 animate-fade-in-up">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-12 h-12 bg-primary-600 dark:bg-primary-500 rounded-xl flex items-center justify-center animate-bounce-slow">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                  Farmer Buddy
                </h1>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Welcome Back</h2>
              <p className="text-gray-600 dark:text-gray-300">Sign in to your account</p>
            </div>

            {/* Login Form */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl animate-slide-in-left">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1 animate-fade-in-up">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                      ) : (
                        <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1 animate-fade-in-up">{errors.password}</p>}
                </div>

                {/* Role Selection */}
                <div>
                  <label htmlFor="role" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                    I am a
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all duration-300 appearance-none"
                    >
                      <option value="Consumer">Consumer</option>
                      <option value="Farmer">Farmer</option>
                      <option value="Admin">Admin</option>
                      <option value="Restaurant">Restaurant</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Language Selection (dropdown) */}
                <div>
                  <label htmlFor="login-language" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                    Choose language
                  </label>
                  <select
                    id="login-language"
                    value={lang}
                    onChange={(e) => { setLang(e.target.value); applyGoogleTranslate(e.target.value); }}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="gu">Gujarati</option>
                    <option value="ta">Tamil</option>
                    <option value="te">Telugu</option>
                    <option value="kn">Kannada</option>
                    <option value="ml">Malayalam</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full group bg-primary-600 text-white px-6 py-4 rounded-xl hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <span className="text-lg font-semibold">Signing In...</span>
                  ) : (
                    <>
                      <span className="text-lg font-semibold">Sign In</span>
                      <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>

                {/* Register Link */}
                <div className="text-center space-y-3">
                  <p className="text-gray-600 dark:text-gray-300">
                    Don't have an account?
                  </p>
                  <Link
                    to="/register"
                    className="w-full group bg-white border border-gray-200 text-gray-900 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
                  >
                    <FiUserPlus className="w-5 h-5" />
                    <span className="text-lg font-semibold">Create Account First</span>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
