import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Calendar, Mail } from "lucide-react";

const API_BASE = "https://productsback-production.up.railway.app/api/yoqotilganlar";

const YoqotilganDetailPage = () => {
  const { id } = useParams();
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const mapInstanceRef = useRef(null);

  // --- Fetch one item ---
  const fetchItem = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/${id}`);
      const data = await response.json();

      if (data.success) {
        setItem(data.data);
      } else {
        setError("Ma'lumot topilmadi");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Server bilan bog'lanishda muammo yuz berdi");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchItem();
  }, [id, fetchItem]);

  // --- Map ---
  const initMap = React.useCallback(() => {
    if (!item || !item.coordinates || !window.ymaps) return;

    const coordinates = [item.coordinates.lat || 0, item.coordinates.lng || 0];

    try {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }

      mapInstanceRef.current = new window.ymaps.Map(mapRef.current, {
        center: coordinates,
        zoom: 16,
        controls: ["zoomControl", "fullscreenControl", "routeButtonControl"],
      });

      const placemark = new window.ymaps.Placemark(
        coordinates,
        {
          balloonContentHeader: `<strong>${item.title}</strong>`,
          balloonContentBody: `
            <div style="max-width: 300px;">
              <img src="${
                item.images?.[0] || "https://via.placeholder.com/300x200"
              }"
                   alt="${item.title}"
                   style="width:100%;height:160px;object-fit:cover;border-radius:8px;margin-bottom:12px;">
              <p>${item.description || ""}</p>
              <p><strong>📍 Joy:</strong> ${item.lastKnownLocation || "-"}</p>
              <p><strong>📞 Tel:</strong> ${item.contactInfo?.phone || "-"}</p>
              <p><strong>📧 Email:</strong> ${item.contactInfo?.email || "-"}</p>
            </div>
          `,
        },
        {
          preset: "islands#redIcon",
          iconColor: "#dc2626",
        }
      );

      mapInstanceRef.current.geoObjects.add(placemark);
      setMapLoaded(true);
      setTimeout(() => placemark.balloon.open(), 800);
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapLoaded(true);
    }
  }, [item]);

  // --- Load Yandex Maps script ---
  useEffect(() => {
    if (!item) return;
    if (!window.ymaps) {
      const script = document.createElement("script");
      script.src = "https://api-maps.yandex.ru/2.1/?lang=uz_UZ";
      script.async = true;
      script.onload = () => window.ymaps.ready(initMap);
      document.head.appendChild(script);
    } else {
      window.ymaps.ready(initMap);
    }
  }, [item, initMap]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // --- Loading ---
  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Yuklanmoqda...</p>
      </main>
    );
  }

  // --- Error ---
  if (error || !item) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600">{error || "Topilmadi"}</p>
        <Link to="/yoqotilganlar" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Orqaga qaytish
        </Link>
      </main>
    );
  }

  // --- Main ---
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Back button */}
      <div className="flex items-center mb-8">
        <Link
          to="/yoqotilganlar"
          className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h2 className="text-3xl font-bold text-gray-900">Yo‘qotilgan buyum tafsilotlari</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Info */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <img
            src={item.images?.[0] || "https://via.placeholder.com/500x300?text=Yoqotilgan"}
            alt={item.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />

          <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {item.description}
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>{item.lastKnownLocation || item.location || "Joy ko‘rsatilmagan"}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar className="w-5 h-5 text-green-600" />
              <span>
                {item.date
                  ? new Date(item.date).toLocaleDateString("uz-UZ")
                  : "Sana yo‘q"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Phone className="w-5 h-5 text-red-600" />
              <a
                href={`tel:${item.contactInfo?.phone || ""}`}
                className="text-red-600 font-medium hover:underline"
              >
                {item.contactInfo?.phone || "Bog‘lanish uchun raqam yo‘q"}
              </a>
            </div>
            {item.contactInfo?.email && (
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-indigo-600" />
                <a
                  href={`mailto:${item.contactInfo.email}`}
                  className="text-indigo-600 hover:underline"
                >
                  {item.contactInfo.email}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" />
            Taxminiy joylashuv
          </h4>

          <div className="relative bg-gray-100 rounded-xl overflow-hidden">
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                <p className="text-gray-600 text-sm">Xarita yuklanmoqda...</p>
              </div>
            )}
            <div ref={mapRef} className="w-full h-96" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default YoqotilganDetailPage;
