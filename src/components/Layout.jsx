import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import AuthModal from './AuthModal';
import logo from '../assets/image.png';

const Layout = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const Header = () => (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/"
              className="text-2xl font-bold text-gray-900 cursor-pointer"
            >
<img className='w-full h-[63px]' src={logo} alt="" />
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link 
                to="/topilganlar"
                className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                Topilganlar
              </Link>
              <Link 
                to="/yoqotilganlar"
                className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                Yoqotilganlar
              </Link>
              
            </nav>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Mahsulotlarni qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Salom, {user?.name}!
                </span>
                <Link 
                  to="/profile"
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <User className="w-6 h-6" />
                </Link>
                <button 
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  onClick={logout}
                  title="Chiqish"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </div>
            ) : (
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                onClick={() => setShowAuthModal(true)}
              >
                Kirish
              </button>
            )}
            
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600 cursor-pointer hover:text-blue-600">O'Z</span>
              <span className="text-gray-600 cursor-pointer hover:text-blue-600">RU</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );

  const Footer = () => (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Kompaniya</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600">Biz haqimizda</a></li>
              <li><a href="#" className="hover:text-blue-600">Ish o'rinlari</a></li>
              <li><a href="#" className="hover:text-blue-600">Yangiliklar</a></li>
              <li><a href="#" className="hover:text-blue-600">Hamkorlik</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Servis</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600">Yetkazib berish</a></li>
              <li><a href="#" className="hover:text-blue-600">To'lov usullari</a></li>
              <li><a href="#" className="hover:text-blue-600">Kafolat</a></li>
              <li><a href="#" className="hover:text-blue-600">Qaytarish</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Maqolalar bo'limi</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600">Texnologiyalar</a></li>
              <li><a href="#" className="hover:text-blue-600">Maslahatlar</a></li>
              <li><a href="#" className="hover:text-blue-600">Sharhlar</a></li>
              <li><a href="#" className="hover:text-blue-600">Yangiliklar</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Aloqani ma'lumot</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>+998 71 200 05 05</li>
              <li>info@next.uz</li>
              <li>+998 90 123 45 67</li>
              <li>Toshkent, O'zbekiston</li>
            </ul>
            
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-blue-600 hover:text-blue-700">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </a>
              <a href="#" className="text-pink-600 hover:text-pink-700">
                <div className="w-6 h-6 bg-pink-600 rounded"></div>
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-500">
                <div className="w-6 h-6 bg-blue-400 rounded"></div>
              </a>
              <a href="#" className="text-gray-800 hover:text-gray-900">
                <div className="w-6 h-6 bg-gray-800 rounded"></div>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex justify-between items-center text-sm text-gray-600">
          <span>2024 NEXT.UZ barcha huquqlar himoyalangan</span>
          <span>Powered by AI</span>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {children}
      <Footer />
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default Layout;
