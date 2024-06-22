import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AirQualityIndex = ({ city }) => {
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAQI = async () => {
      const apiKey = '1779ca818b59557aa48558aec376d6db'; // Thay bằng API key của bạn

      // Đặt lại trạng thái trước khi bắt đầu tìm kiếm mới
      setLoading(true);
      setError(null);

      try {
        // Lấy tọa độ địa lý từ tên thành phố
        const cityResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
        const { lat, lon } = cityResponse.data.coord;

        // Lấy chỉ số AQI từ tọa độ địa lý
        const aqiResponse = await axios.get(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        const { aqi } = aqiResponse.data.list[0].main;
        setAqi(aqi);
      } catch (error) {
        setError('Không thể lấy thông tin chất lượng không khí.');
      }

      setLoading(false);
    };

    fetchAQI();
  }, [city]);

  const getAQIColor = (aqi) => {
    switch (aqi) {
      case 1:
        return 'text-green-600';
      case 2:
        return 'text-yellow-500';
      case 3:
        return 'text-orange-600';
      case 4:
        return 'text-red-600';
      case 5:
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getWarningMessage = (aqi) => {
    switch (aqi) {
      case 1:
        return 'Chất lượng không khí tốt. Không cần lo lắng.';
      case 2:
        return 'Chất lượng không khí trung bình. Người nhạy cảm nên hạn chế ra ngoài.';
      case 3:
        return 'Chất lượng không khí kém. Hạn chế ra ngoài, đặc biệt là người nhạy cảm.';
      case 4:
        return 'Chất lượng không khí xấu. Tránh ra ngoài nếu có thể.';
      case 5:
        return 'Chất lượng không khí nguy hiểm. Tránh ra ngoài và bảo vệ sức khỏe của bạn.';
      default:
        return '';
    }
  };

  const getWarningColor = (aqi) => {
    switch (aqi) {
      case 1:
        return 'text-green-600';
      case 2:
        return 'text-yellow-500';
      case 3:
        return 'text-orange-600';
      case 4:
        return 'text-red-600';
      case 5:
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 border border-gray-300 rounded-lg max-w-lg mx-auto mt-6 text-center bg-gray-100 shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Chỉ số Chất lượng Không khí</h2>
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className={`text-6xl font-bold ${getAQIColor(aqi)} my-4`}>{aqi}</div>
          {getWarningMessage(aqi) && (
            <div className={`font-bold mt-2 ${getWarningColor(aqi)}`}>{getWarningMessage(aqi)}</div>
          )}
        </>
      )}
    </div>
  );
};

export default AirQualityIndex;
