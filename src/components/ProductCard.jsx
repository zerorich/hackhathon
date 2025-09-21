import React from 'react';
import { Heart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, favorites, onToggleFavorite }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="relative mb-3">
        <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center overflow-hidden">
          <img 
            src={product.img} 
            alt={product.title}
            className="w-full h-full object-contain"
          />
        </div>
        <button 
          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          onClick={() => onToggleFavorite(product._id)}
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              favorites.includes(product._id) 
                ? 'text-red-500 fill-red-500' 
                : 'text-gray-400'
            }`} 
          />
        </button>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
          {product.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex flex-col space-y-1">
          <span className="font-bold text-sm text-gray-900">
            {product.price?.toLocaleString()} so'm
          </span>
        </div>
        
        <button 
          className="w-full bg-blue-500 text-white py-2 px-3 rounded text-xs font-medium hover:bg-blue-600 transition-colors"
          onClick={() => onAddToCart(product)}
        >
          Sotib olish
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
