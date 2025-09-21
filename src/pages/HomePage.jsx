import React from 'react';
import ProductCard from '../components/ProductCard';
import YandexMap from '../components/YandexMap';

const HomePage = ({ products, loading, handleAddToCart, favorites, toggleFavorite }) => {
  console.log('HomePage products:', products);
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Eng ommabob</h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600">Загрузка товаров...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {products.slice(0, 5).map((product) => (
              <ProductCard 
                key={product._id} 
                product={product}
                onAddToCart={handleAddToCart}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>

          {products.length > 5 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
              {products.slice(5, 10).map((product) => (
                <ProductCard 
                  key={`row2-${product._id}`} 
                  product={product}
                  onAddToCart={handleAddToCart}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </>
      )}

      <div className="flex justify-center mb-12">
        <div className="text-sm text-gray-600">Keyingi sahifa</div>
      </div>

      {/* Яндекс карта Ташкента */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Потерянные вещи в Ташкенте</h2>
        <YandexMap 
          width="100%" 
          height="500px" 
          className="border border-gray-200"
          products={products}
        />
      </div>


      
    </main>
  );
};

export default HomePage;
