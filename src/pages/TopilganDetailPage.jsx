import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Calendar } from "lucide-react";

const TopilganDetailPage = () => {
  const { id } = useParams();
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const mapInstanceRef = useRef(null);

  // --- Загрузка одного объекта с бэка ---
  const fetchItem = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://productsback-production.up.railway.app/api/topilganlar/${id}`
      );
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
    if (id) {
      fetchItem();
    }
  }, [id, fetchItem]);

  // --- Инициализация карты ---
  const initMap = React.useCallback(() => {
    if (!item || !item.coordinates || !window.ymaps || !window.ymaps.Map) {
      return;
    }

    // ✅ правильный порядок: [lat, lng]
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
              <img src="${item.img || "https://via.placeholder.com/300x200"}" 
                   alt="${item.title}" 
                   style="width:100%;height:160px;object-fit:cover;border-radius:8px;margin-bottom:12px;">
              <p>${item.description}</p>
              <p><strong>📍 Joy:</strong> ${item.location}</p>
              <p><strong>📞 Tel:</strong> ${item.contactInfo?.phone || "-"}</p>
            </div>
          `,
          hintContent: `${item.title} - ${item.location}`,
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

  // --- Подключаем Yandex Maps API ---
  useEffect(() => {
    if (!item) return;

    if (!window.ymaps) {
      const existingScript = document.querySelector(
        'script[src*="api-maps.yandex.ru"]'
      );
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://api-maps.yandex.ru/2.1/?lang=uz_UZ";
        script.async = true;
        script.onload = () => window.ymaps.ready(initMap);
        document.head.appendChild(script);
      } else {
        existingScript.onload = () => window.ymaps.ready(initMap);
      }
    } else {
      window.ymaps.ready(initMap);
    }
  }, [item, initMap]);

  // --- Очистка карты при размонтировании ---
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // --- LOADING ---
  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </main>
    );
  }

  // --- ERROR ---
  if (error || !item) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-center text-red-600">
          {error || "Topilgan buyum topilmadi."}
        </p>
        <div className="text-center mt-4">
          <Link
            to="/topilganlar"
            className="text-blue-600 hover:underline font-medium"
          >
            ← Orqaga qaytish
          </Link>
        </div>
      </main>
    );
  }

  // --- MAIN RENDER ---
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Back button */}
      <div className="flex items-center mb-8">
        <Link
          to="/topilganlar"
          className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h2 className="text-3xl font-bold text-gray-900">Buyum tafsilotlari</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <img
              src={
                item.img || "https://via.placeholder.com/500x300?text=Topilgan"
              }
              alt={item.title}
              className="w-full h-64 object-cover rounded-lg mb-6 shadow-sm"
            />

            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {item.title}
            </h3>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              {item.description}
            </p>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">
                    Topilgan joyi
                  </span>
                </div>
                <p className="text-gray-700 ml-8">
                  {item.location}, {item.country}, {item.viloyat}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-gray-900">
                    Topilgan sanasi
                  </span>
                </div>
                <p className="text-gray-700 ml-8">
                  {new Date(item.date).toLocaleDateString("uz-UZ")}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">Bog'lanish</span>
                </div>
                <div className="ml-8">
                  <a
                    href={`tel:${item.contactInfo?.phone || ""}`}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-lg hover:underline"
                  >
                    {item.contactInfo?.phone || "Raqam ko'rsatilmagan"}
                  </a>
                  <p className="text-gray-600 text-sm mt-1">
                    Telefon qilish uchun raqamni bosing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              Topilgan joy xaritada
            </h4>

            <div className="relative bg-gray-100 rounded-xl overflow-hidden">
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                    <p className="text-gray-600 text-sm">Xarita yuklanmoqda...</p>
                  </div>
                </div>
              )}
              <div ref={mapRef} className="w-full h-96" />
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm">
                <strong>Maslahat:</strong> Xaritadagi qizil belgini bosing —
                batafsil ma'lumot ko'rish uchun. "Marshrutlar" tugmasini bosib,
                bu joyga yo'l yo'riqnomasini olishingiz mumkin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TopilganDetailPage;
