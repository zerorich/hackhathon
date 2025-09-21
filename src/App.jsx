import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { AppProvider, useApp } from './contexts/AppContext';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/TopilganlarPage';
import PromotionsPage from './pages/PromotionsPage';
import BrandsPage from './pages/BrandsPage';
import CartPage from './pages/CartPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';

// ✅ yangi sahifalar
import TopilganlarPage from './pages/TopilganlarPage';
import TopilganDetailPage from './pages/TopilganDetailPage';

// 🔍 Search Wrapper
const SearchWrapper = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { products, favorites, toggleFavorite } = useApp();
  const { addToCart } = useCart();

  const performSearch = React.useCallback(async (query) => {
    setLoading(true);
    try {
      const results = products.filter(product => 
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [products]);

  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery);
    }
  }, [searchQuery, performSearch]);

  return (
    <SearchPage 
      searchQuery={searchQuery}
      searchResults={searchResults}
      loading={loading}
      handleAddToCart={addToCart}
      favorites={favorites}
      toggleFavorite={toggleFavorite}
    />
  );
};

// AppContent
const AppContent = () => {
  const { addToCart, removeFromCart, updateQuantity, cartItems } = useCart();
  const { user } = useAuth();
  const { products, loading, favorites, toggleFavorite } = useApp();

  const handleAddToCart = (product) => addToCart(product);
  const handleRemoveFromCart = (productId) => removeFromCart(productId);
  const handleUpdateQuantity = (productId, newQuantity) => updateQuantity(productId, newQuantity);

  return (
    <Layout>
      <Routes>
        {/* 🏠 Home */}
        <Route 
          path="/" 
          element={
            <HomePage 
              products={products}
              loading={loading}
              handleAddToCart={handleAddToCart}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          } 
        />

        {/* 🛒 Oddiy pages */}
        <Route path="/katalog" element={<CatalogPage />} />
        <Route path="/yoqotilganlar" element={<PromotionsPage />} />
        <Route path="/brands" element={<BrandsPage />} />

        {/* 🛍 Cart */}
        <Route 
          path="/cart" 
          element={
            <CartPage 
              cartItems={cartItems}
              handleRemoveFromCart={handleRemoveFromCart}
              handleUpdateQuantity={handleUpdateQuantity}
            />
          } 
        />

        {/* 🔍 Search */}
        <Route path="/search" element={<SearchWrapper />} />

        {/* 👤 Profile */}
        <Route 
          path="/profile" 
          element={
            <ProfilePage 
              user={user}
              favorites={favorites}
            />
          } 
        />

        {/* 🟢 Topilganlar + Detal */}
        <Route path="/topilganlar" element={<TopilganlarPage />} />
        <Route path="/topilganlar/:id" element={<TopilganDetailPage />} />

      </Routes>
    </Layout>
  );
};

// Root
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
