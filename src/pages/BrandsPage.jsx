import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BrandsPage = () => {
  const brands = ['Apple', 'Samsung', 'Dell', 'HP', 'Asus', 'Lenovo', 'Acer', 'MSI', 'Razer', 'Alienware', 'Xiaomi', 'Huawei'];

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/" className="mr-4 p-2 hover:bg-gray-100 rounded">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Brendlar</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {brands.map((brand) => (
          <div key={brand} className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer text-center">
            <h3 className="font-semibold">{brand}</h3>
          </div>
        ))}
      </div>
    </main>
  );
};

export default BrandsPage;
