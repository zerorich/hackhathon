import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // Загружаем продукты при запуске
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const productsData = await apiService.getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback к статичным данным если API недоступен
        setProducts([
          {
            _id: 1,
            title: "Apple MacBook Air",
            description: "13.6 inch M2 chip, 8GB, 256GB SSD, Space Gray",
            price: 15999000,
            img: "https://macbro.uz/cdn/shop/files/6_0bf35ddf-43dd-4cf3-b110-8d7a719e36f4.png?v=1704996220"
          },
          {
            _id: 2,
            title: "ASUS ZenBook Pro",
            description: "15.6 inch OLED, 16GB RAM, 512GB SSD",
            price: 18500000,
            img: "https://macbro.uz/cdn/shop/files/6_0bf35ddf-43dd-4cf3-b110-8d7a719e36f4.png?v=1704996220"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const value = {
    products,
    loading,
    favorites,
    toggleFavorite,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
