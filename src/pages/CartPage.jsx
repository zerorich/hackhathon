import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, X } from 'lucide-react';

const CartPage = ({ 
  cartItems, 
  handleRemoveFromCart, 
  handleUpdateQuantity 
}) => {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/" className="mr-4 p-2 hover:bg-gray-100 rounded">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Savat</h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Savat bo'sh</p>
          <Link 
            to="/"
            className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Xarid qilish
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img src={item.img} alt={item.title} className="w-16 h-16 object-contain" />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-sm font-bold">{item.price?.toLocaleString()} so'm</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleUpdateQuantity(item._id, (item.quantity || 1) - 1)}
                    className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity || 1}</span>
                  <button 
                    onClick={() => handleUpdateQuantity(item._id, (item.quantity || 1) + 1)}
                    className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={() => handleRemoveFromCart(item._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Jami:</span>
              <span className="text-lg font-bold">
                {cartItems.reduce((total, item) => {
                  const price = item.price || 0;
                  const quantity = item.quantity || 1;
                  return total + (price * quantity);
                }, 0).toLocaleString()} so'm
              </span>
            </div>
            <button className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-semibold">
              Buyurtma berish
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default CartPage;
