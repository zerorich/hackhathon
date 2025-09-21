import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Calendar, Plus, Filter } from "lucide-react";

// Predefined categories
const CATEGORIES = [
  { value: "all", label: "Barchasi" },
  { value: "electronics", label: "Elektronika" },
  { value: "documents", label: "Hujjatlar" },
  { value: "jewelry", label: "Zargarlik" },
  { value: "clothing", label: "Kiyim" },
  { value: "bags", label: "Sumka" },
  { value: "keys", label: "Kalitlar" },
  { value: "other", label: "Boshqa" },
];

const formatDate = (iso) => {
  try {
    return iso ? new Date(iso).toLocaleDateString("uz-UZ") : "";
  } catch {
    return iso || "";
  }
};

const TopilganlarPage = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    img: "",
    location: "",
    country: "",
    viloyat: "",
    date: "",
    category: "electronics", // Add category field
    contactInfo: {
      phone: "",
      email: ""
    },
    coordinates: { lat: 0, lng: 0 }
  });

  const fetchItems = async () => {
    try {
      const res = await fetch("https://productsback-production.up.railway.app/api/topilganlar");
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
        setFilteredItems(data.data);
      } else {
        setError("Ma'lumotlarni olishda xatolik yuz berdi!");
      }
    } catch (err) {
      setError("Server bilan bog'lanishda muammo yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Filter items by category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.category === selectedCategory));
    }
  }, [items, selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      coordinates: {
        lat: formData.coordinates.lat || 0,
        lng: formData.coordinates.lng || 0
      },
      category: formData.category || "electronics"
    };

    try {
      const res = await fetch("https://productsback-production.up.railway.app/api/topilganlar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => [data.data, ...prev]);
        setShowForm(false);
        setFormData({
          title: "",
          description: "",
          img: "",
          location: "",
          country: "",
          viloyat: "",
          date: "",
          category: "electronics",
          contactInfo: { phone: "", email: "" },
          coordinates: { lat: 0, lng: 0 }
        });
      } else {
        alert("Xatolik: " + (data.message || "yaratib bo'lmadi"));
      }
    } catch (err) {
      alert("Serverga ulanishda xatolik!");
    }
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-600">Yuklanmoqda...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Topilganlar</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" /> Create
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700 font-medium">Kategoriya bo'yicha filtrlash:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.value}
              onClick={() => handleCategoryChange(category.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category.value
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="border p-2 rounded-lg"
              required
            />

            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="border p-2 rounded-lg"
            >
              {CATEGORIES.slice(1).map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Image URL"
              value={formData.img}
              onChange={(e) => setFormData({ ...formData, img: e.target.value })}
              className="border p-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="border p-2 rounded-lg"
            />
            <input
              type="number"
              step="any"
              placeholder="Latitude"
              value={formData.coordinates.lat}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  coordinates: { ...formData.coordinates, lat: parseFloat(e.target.value) }
                })
              }
              className="border p-2 rounded-lg"
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude"
              value={formData.coordinates.lng}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  coordinates: { ...formData.coordinates, lng: parseFloat(e.target.value) }
                })
              }
              className="border p-2 rounded-lg"
            />

            <input
              type="text"
              placeholder="Country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="border p-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="Viloyat"
              value={formData.viloyat}
              onChange={(e) => setFormData({ ...formData, viloyat: e.target.value })}
              className="border p-2 rounded-lg"
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="border p-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="Phone"
              value={formData.contactInfo.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contactInfo: { ...formData.contactInfo, phone: e.target.value },
                })
              }
              className="border p-2 rounded-lg"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.contactInfo.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contactInfo: { ...formData.contactInfo, email: e.target.value },
                })
              }
              className="border p-2 rounded-lg"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="border p-2 rounded-lg md:col-span-2"
              rows="3"
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Yaratish
          </button>
        </form>
      )}

      {/* Results counter */}
      <div className="mb-4 text-sm text-gray-600">
        {selectedCategory === "all" 
          ? `Jami: ${filteredItems.length} ta buyum` 
          : `${CATEGORIES.find(c => c.value === selectedCategory)?.label}: ${filteredItems.length} ta buyum`
        }
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-gray-600">
          {selectedCategory === "all" 
            ? "Hozircha topilgan buyumlar yo'q." 
            : "Bu kategoriyada topilgan buyumlar yo'q."
          }
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Link
              key={item._id}
              to={`/topilganlar/${item._id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all overflow-hidden block"
            >
              <img
                src={item.img || "https://via.placeholder.com/200x150?text=Topilgan"}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {CATEGORIES.find(c => c.value === item.category)?.label || item.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{item.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    {item.location}, {item.country}, {item.viloyat}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(item.date)}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-600 font-medium">
                      {item.contactInfo?.phone}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
};

export default TopilganlarPage;