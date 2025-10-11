import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setCart([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    if (!product || !product._id) {
      console.error('Invalid product data:', product);
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prevCart,
        {
          product: product._id,
          quantity: 1,
          priceAtPurchase: product.price_per_unit || product.price || 0,
          name: product.name || 'Unknown Product',
          image: product.image || null
        }
      ];
    });
  };

  const removeFromCart = (productId) => {
    if (!productId) {
      console.error('Invalid product ID:', productId);
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product === productId);
      
      if (existingItem && existingItem.quantity > 1) {
        // Reduce quantity if more than 1
        return prevCart.map(item =>
          item.product === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        // Remove item completely if quantity is 1
        return prevCart.filter(item => item.product !== productId);
      }
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (!productId || quantity < 0) {
      console.error('Invalid product ID or quantity:', { productId, quantity });
      return;
    }

    setCart(prevCart => {
      if (quantity === 0) {
        return prevCart.filter(item => item.product !== productId);
      }
      return prevCart.map(item =>
        item.product === productId
          ? { ...item, quantity }
          : item
      );
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.priceAtPurchase * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      clearCart, 
      getCartTotal,
      getCartItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
