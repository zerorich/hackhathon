import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Calendar, ArrowLeft, Plus } from "lucide-react";

const YoqotilganlarPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    location: "",
    date: "",
    contact: "",
  });

  const fetchItems = async () => {
    try {
      const res = await fetch("https://productsback-production.up.railway.app/api/yoqotilganlar");
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://productsback-production.up.railway.app/api/yoqotilganlar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => [...prev, data.data]);
        setShowForm(false);
        setFormData({ title: "", description: "", image: "", location: "", date: "", contact: "" });
      } else {
        alert("Xatolik: " + (data.message || "Yaratib bo‘lmadi"));
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
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to="/" className="mr-4 p-2 hover:bg-gray-100 rounded">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Yo‘qotilganlar</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          <Plus className="w-5 h-5" /> Create
        </button>
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
            <input
              type="text"
              placeholder="Image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
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
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="border p-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="Contact"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
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

      {items.length === 0 ? (
        <p className="text-gray-600">Hozircha yo‘qotilgan buyumlar yo‘q.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-red-200 transition-all overflow-hidden block"
            >
              <img
                src={item.image || "https://via.placeholder.com/200x150?text=Yoqotilgan"}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {item.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    {item.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {item.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-red-600" />
                    <span className="text-red-600 font-medium">{item.contact}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default YoqotilganlarPage;
