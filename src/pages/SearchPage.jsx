import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const SearchPage = ({ 
  searchQuery, 
  searchResults, 
  loading,
  handleAddToCart, 
  favorites, 
  toggleFavorite 
}) => {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/" className="mr-4 p-2 hover:bg-gray-100 rounded">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">
          Qidiruv natijalari: "{searchQuery}"
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600">Поиск...</span>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Hech narsa topilmadi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {searchResults.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product}
              onAddToCart={handleAddToCart}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default SearchPage;
