import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Calendar, ArrowLeft, Plus, X } from "lucide-react";

const API_BASE = "https://productsback-production.up.railway.app/api/yoqotilganlar";

const formatDate = (iso) => {
  try {
    return iso ? new Date(iso).toLocaleDateString("uz-UZ") : "";
  } catch {
    return iso || "";
  }
};

const YoqotilganlarPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const initialForm = {
    title: "",
    description: "",
    images: [],        // final array
    imageInput: "",    // temp field for adding a single image URL
    lastKnownLocation: "",
    country: "",
    viloyat: "",
    date: "",
    coordinates: { lat: "", lng: "" },
    contactInfo: { phone: "", email: "" },
    category: "electronics",
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE);
      const data = await res.json();
      if (data?.success && Array.isArray(data.data)) {
        setItems(data.data);
      } else if (Array.isArray(data)) { // fallback if API returns array directly
        setItems(data);
      } else {
        setError("Ma'lumotlarni olishda xatolik yuz berdi!");
      }
    } catch (err) {
      console.error("Fetch items error:", err);
      setError("Server bilan bog'lanishda muammo yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddImage = () => {
    const url = formData.imageInput?.trim();
    if (!url) return;
    setFormData((prev) => ({ ...prev, images: [...prev.images, url], imageInput: "" }));
  };

  const handleRemoveImage = (idx) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // build payload exactly as backend expects
    const payload = {
      title: formData.title,
      description: formData.description,
      images:
        formData.images.length > 0
          ? formData.images
          : formData.imageInput
          ? [formData.imageInput.trim()]
          : [],
      lastKnownLocation: formData.lastKnownLocation || "",
      country: formData.country || "",
      viloyat: formData.viloyat || "",
      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      coordinates: {
        lat: parseFloat(formData.coordinates.lat) || 0,
        lng: parseFloat(formData.coordinates.lng) || 0,
      },
      contactInfo: {
        phone: formData.contactInfo.phone || "",
        email: formData.contactInfo.email || "",
      },
      category: formData.category || "electronics",
    };

    // basic validation
    if (!payload.title || !payload.description) {
      alert("Iltimos: title va description to'ldiring.");
      return;
    }

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data?.success && data.data) {
        // prepend or append — здесь добавляем в начало
        setItems((prev) => [data.data, ...prev]);
        setShowForm(false);
        setFormData(initialForm);
      } else {
        console.error("Create error response:", data);
        alert("Xatolik: " + (data.message || "Yaratib bo‘lmadi"));
      }
    } catch (err) {
      console.error("Create request failed:", err);
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
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          <Plus className="w-5 h-5" /> Create
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
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
              placeholder="Category (electronics, other...)"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="border p-2 rounded-lg"
            />

            <input
              type="text"
              placeholder="Last known location"
              value={formData.lastKnownLocation}
              onChange={(e) => setFormData({ ...formData, lastKnownLocation: e.target.value })}
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

            {/* Coordinates */}
            <input
              type="number"
              step="any"
              placeholder="Latitude"
              value={formData.coordinates.lat}
              onChange={(e) => setFormData({ ...formData, coordinates: { ...formData.coordinates, lat: e.target.value } })}
              className="border p-2 rounded-lg"
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude"
              value={formData.coordinates.lng}
              onChange={(e) => setFormData({ ...formData, coordinates: { ...formData.coordinates, lng: e.target.value } })}
              className="border p-2 rounded-lg"
            />

            {/* Images input + add */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Image URL"
                value={formData.imageInput}
                onChange={(e) => setFormData({ ...formData, imageInput: e.target.value })}
                className="border p-2 rounded-lg flex-1"
              />
              <button type="button" onClick={handleAddImage} className="bg-gray-200 px-3 rounded-lg">Add</button>
            </div>

            {/* Contact fields */}
            <input
              type="text"
              placeholder="Phone"
              value={formData.contactInfo.phone}
              onChange={(e) => setFormData({ ...formData, contactInfo: { ...formData.contactInfo, phone: e.target.value } })}
              className="border p-2 rounded-lg"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.contactInfo.email}
              onChange={(e) => setFormData({ ...formData, contactInfo: { ...formData.contactInfo, email: e.target.value } })}
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

          {/* Images preview */}
          {formData.images.length > 0 && (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {formData.images.map((url, idx) => (
                <div key={idx} className="relative w-28 h-20 rounded overflow-hidden border">
                  <img src={url} alt={`img-${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            Yaratish
          </button>
        </form>
      )}

      {items.length === 0 ? (
        <p className="text-gray-600">Hozircha yo‘qotilgan buyumlar yo‘q.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Link
              key={item._id}
              to={`/yoqotilganlar/${item._id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-red-200 transition-all overflow-hidden block"
            >
              <img
                src={item.images?.[0] || "https://via.placeholder.com/200x150?text=Yoqotilgan"}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{item.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    {item.lastKnownLocation || item.location || "-"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(item.date)}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-red-600" />
                    <span className="text-red-600 font-medium">{item.contactInfo?.phone || item.contact || "-"}</span>
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

export default YoqotilganlarPage;
