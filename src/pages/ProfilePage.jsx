import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';

const ProfilePage = ({ user, favorites }) => {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/" className="mr-4 p-2 hover:bg-gray-100 rounded">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Profil</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{user?.name} {user?.surname}</h3>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Buyurtmalarim</h4>
            <p className="text-gray-600">Sizda hozircha buyurtmalar yo'q</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Sevimlilar</h4>
            <p className="text-gray-600">{favorites.length} ta mahsulot sevimlilarda</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
