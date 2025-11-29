'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('price-inquiry-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('price-inquiry-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (catalogue, variant = null) => {
    const itemId = variant 
      ? `${catalogue._id}-${variant.combinationId}`
      : `catalogue-${catalogue._id}`;

    // Check if item already exists in cart
    const existingItem = cartItems.find(item => item.id === itemId);
    
    if (existingItem) {
      // Item already in cart, update it
      setCartItems(cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      // Add new item to cart
      setCartItems([
        ...cartItems,
        {
          id: itemId,
          catalogueId: catalogue._id,
          catalogue: catalogue,
          variant: variant,
          quantity: 1,
          addedAt: new Date().toISOString()
        }
      ]);
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}




