import React, { useEffect, useRef } from 'react';

const YandexMap = ({ width = '100%', height = '400px', className = '', products = [] }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Проверяем, не загружен ли уже скрипт
    if (!window.ymaps) {
      const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
        script.async = true;
        script.onload = () => {
          window.ymaps.ready(initializeMap);
        };
        document.head.appendChild(script);
      } else {
        existingScript.onload = () => {
          window.ymaps.ready(initializeMap);
        };
      }
    } else {
      initializeMap();
    }

    function initializeMap() {
      if (mapRef.current && !mapInstanceRef.current && window.ymaps) {
        // Убеждаемся, что карта еще не создана
        if (mapRef.current.children.length === 0) {
          mapInstanceRef.current = new window.ymaps.Map(mapRef.current, {
            center: [41.2995, 69.2401], // Центр на Ташкенте
            zoom: 10, // Детальный масштаб для города Ташкент
            controls: ['zoomControl', 'fullscreenControl', 'typeSelector', 'searchControl', 'trafficControl']
          });

          // Добавляем маркеры для районов Ташкента
          const districts = [
            { name: 'Шайхантахурский район', coords: [41.3200, 69.2000] },
            { name: 'Юнусабадский район', coords: [41.3500, 69.2800] },
            { name: 'Алмазарский район', coords: [41.2800, 69.2500] },
            { name: 'Учтепинский район', coords: [41.3000, 69.1500] },
            { name: 'Чиланзарский район', coords: [41.2500, 69.2000] },
            { name: 'Яшнабадский район', coords: [41.3200, 69.3200] },
            { name: 'Сергелийский район', coords: [41.2000, 69.2500] }
          ];

          districts.forEach(district => {
            const placemark = new window.ymaps.Placemark(district.coords, {
              balloonContent: district.name
            }, {
              preset: 'islands#blueDotIcon'
            });
            mapInstanceRef.current.geoObjects.add(placemark);
          });

          // Добавляем маркеры для важных объектов Ташкента
          const landmarks = [
            { name: 'Ташкентская телебашня', coords: [41.3500, 69.2800], icon: 'islands#greenStarIcon' },
            { name: 'Аэропорт Ташкент', coords: [41.2500, 69.2500], icon: 'islands#airportIcon' },
            { name: 'Центральный вокзал', coords: [41.3000, 69.2000], icon: 'islands#railwayIcon' },
            { name: 'Южный вокзал', coords: [41.2500, 69.2000], icon: 'islands#railwayIcon' },
            { name: 'Площадь Независимости', coords: [41.3100, 69.2400], icon: 'islands#redStarIcon' },
            { name: 'Метро Ташкента', coords: [41.3000, 69.2500], icon: 'islands#metroIcon' }
          ];

          landmarks.forEach(landmark => {
            const placemark = new window.ymaps.Placemark(landmark.coords, {
              balloonContent: landmark.name
            }, {
              preset: landmark.icon
            });
            mapInstanceRef.current.geoObjects.add(placemark);
          });

          // Добавляем маркеры для близлежащих городов
          const nearbyCities = [
            { name: 'Келес', coords: [40.8000, 69.2000] },
            { name: 'Салар', coords: [41.4000, 69.4000] },
            { name: 'Дурмень', coords: [41.1000, 69.1000] },
            { name: 'Каттасу', coords: [41.5000, 69.5000] },
            { name: 'Рамадан', coords: [41.2000, 69.1000] },
            { name: 'Шамсиабад', coords: [41.1500, 69.1500] }
          ];

          nearbyCities.forEach(city => {
            const placemark = new window.ymaps.Placemark(city.coords, {
              balloonContent: city.name
            }, {
              preset: 'islands#orangeDotIcon'
            });
            mapInstanceRef.current.geoObjects.add(placemark);
          });


          // Добавляем маркеры потерянных вещей
          console.log('Products in map:', products);
          
          // Если продуктов нет, используем тестовые данные
          const productsToShow = products && products.length > 0 ? products : [
            {
              _id: 1,
              title: "Apple MacBook Air",
              description: "13.6 inch M2 chip, 8GB, 256GB SSD, Space Gray",
              price: 15999000,
              img: "https://macbro.uz/cdn/shop/files/6_0bf35ddf-43dd-4cf3-b110-8d7a719e36f4.png?v=1704996220"
            },
            {
              _id: 2,
              title: "ASUS ZenBook Pro",
              description: "15.6 inch OLED, 16GB RAM, 512GB SSD",
              price: 18500000,
              img: "https://macbro.uz/cdn/shop/files/6_0bf35ddf-43dd-4cf3-b110-8d7a719e36f4.png?v=1704996220"
            },
            {
              _id: 3,
              title: "iPhone 15 Pro",
              description: "6.1 inch Super Retina XDR, 128GB, Natural Titanium",
              price: 12500000,
              img: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009279823"
            },
            {
              _id: 4,
              title: "Samsung Galaxy S24",
              description: "6.2 inch Dynamic AMOLED 2X, 256GB, Phantom Black",
              price: 9800000,
              img: "https://images.samsung.com/is/image/samsung/p6pim/uz/2401/gallery/uz-galaxy-s24-s921-467179-sm-s921bzkgeuz-539590001?$650_519_PNG$"
            },
            {
              _id: 5,
              title: "AirPods Pro 2",
              description: "Active Noise Cancellation, Spatial Audio, USB-C",
              price: 3200000,
              img: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361"
            }
          ];
          
          if (productsToShow && productsToShow.length > 0) {
            // Фиксированные координаты для демонстрации
            const fixedCoordinates = [
              [41.3200, 69.2000], // Шайхантахурский район
              [41.3500, 69.2800], // Юнусабадский район
              [41.2800, 69.2500], // Алмазарский район
              [41.3000, 69.1500], // Учтепинский район
              [41.2500, 69.2000], // Чиланзарский район
              [41.3200, 69.3200], // Яшнабадский район
              [41.2000, 69.2500], // Сергелийский район
              [41.3100, 69.2400]  // Центр города
            ];
            

            productsToShow.slice(0, 5).forEach((product, index) => {
                // Используем фиксированные координаты
                const coords = fixedCoordinates[index] || [41.2995, 69.2401];
                const lat = coords[0];
                const lon = coords[1];
                
                console.log(`Adding marker for ${product.title} at [${lat}, ${lon}]`);
                
                // Создаем кастомный HTML для маркера
                const customIcon = new window.ymaps.Placemark([lat, lon], {
                  balloonContentHeader: product.title,
                  balloonContentBody: `
                    <div style="padding: 10px;">
                      <img src="${product.img}" alt="${product.title}" style="width: 100px; height: 80px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">
                      <p style="margin: 5px 0;"><strong>Описание:</strong> ${product.description}</p>
                      <p style="margin: 5px 0;"><strong>Цена:</strong> ${product.price.toLocaleString()} сум</p>
                      <p style="margin: 5px 0; color: #e74c3c;"><strong>Статус:</strong> Потеряно</p>
                      <p style="margin: 5px 0; font-size: 12px; color: #666;">Найдено в районе Ташкента</p>
                    </div>
                  `,
                  balloonContentFooter: `<div style="text-align: center; margin-top: 10px;">
                    <button onclick="alert('Связаться с нами: +998 90 123 45 67')" style="background: #3498db; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px;">
                      Связаться
                    </button>
                    <button onclick="window.hideBalloon = function() { if (window.currentBalloon) { window.currentBalloon.close(); } }; window.hideBalloon();" style="background: #e74c3c; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                      Скрыть
                    </button>
                  </div>`
                }, {
                  // Используем кастомную иконку
                  iconLayout: 'default#image',
                  iconImageHref: 'data:image/svg+xml;base64,' + btoa(`
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" fill="#e74c3c" stroke="#fff" stroke-width="2"/>
                      <circle cx="12" cy="12" r="4" fill="#fff"/>
                    </svg>
                  `),
                  iconImageSize: [24, 24],
                  iconImageOffset: [-12, -12],
                  // Настройки для показа balloon при наведении
                  balloonCloseButton: false,
                  balloonAutoPan: true
                });
  
                // Добавляем обработчики событий для показа при наведении
                customIcon.events.add('mouseenter', function () {
                  console.log('Mouse enter on marker');
                  customIcon.balloon.open();
                });
  
                customIcon.events.add('mouseleave', function () {
                  console.log('Mouse leave on marker');
                  customIcon.balloon.close();
                });
  
                // Также добавляем обработчик клика как fallback
                customIcon.events.add('click', function () {
                  console.log('Click on marker');
                  customIcon.balloon.open();
                });
                
                mapInstanceRef.current.geoObjects.add(customIcon);
              });
              console.log(`Added ${productsToShow.slice(0, 5).length} product markers to map`);
            } else {
              console.log('No products to show on map');
            }
          }
        }
      }
  
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.destroy();
          mapInstanceRef.current = null;
        }
      };
    }, [products]);
  
    return (
      <div className={`yandex-map-container ${className}`}>
        <div 
          ref={mapRef} 
          style={{ width, height }}
          className="rounded-lg shadow-lg"
        />
      </div>
    );
  };


  export default YandexMap;
  