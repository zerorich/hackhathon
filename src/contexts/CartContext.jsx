import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const loadUserCart = React.useCallback(async () => {
    if (!user?._id) return;
    
    setLoading(true);
    try {
      const cartData = await apiService.getUserCart(user._id);
      setCartItems(cartData || []);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  // Загружаем корзину пользователя при авторизации
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, user, loadUserCart]);

  const addToCart = async (product) => {
    if (!isAuthenticated || !user?._id) {
      alert('Пожалуйста, войдите в систему для добавления товаров в корзину');
      return;
    }

    setLoading(true);
    try {
      await apiService.addToCart(user._id, product._id);
      
      // Обновляем локальное состояние
      setCartItems(prev => {
        const existing = prev.find(item => item._id === product._id);
        if (existing) {
          return prev.map(item => 
            item._id === product._id 
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          );
        } else {
          return [...prev, { ...product, quantity: 1 }];
        }
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Ошибка при добавлении товара в корзину');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated || !user?._id) return;

    setLoading(true);
    try {
      await apiService.removeFromCart(user._id, productId);
      
      // Обновляем локальное состояние
      setCartItems(prev => prev.filter(item => item._id !== productId));
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Ошибка при удалении товара из корзины');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity === 0) {
      await removeFromCart(productId);
    } else {
      // Для простоты, удаляем и добавляем заново с нужным количеством
      // В реальном приложении лучше иметь отдельный API для обновления количества
      setCartItems(prev => prev.map(item => 
        item._id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    loadUserCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
