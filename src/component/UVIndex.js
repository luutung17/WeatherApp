import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UVIndex = ({ city }) => {
  const [uvIndex, setUvIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUVIndex = async () => {
      const apiKey = '1779ca818b59557aa48558aec376d6db'; // Thay bằng API key của bạn

      // Đặt lại trạng thái trước khi bắt đầu tìm kiếm mới
      setLoading(true);
      setError(null);

      try {
        // Lấy tọa độ địa lý từ tên thành phố
        const cityResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
        const { lat, lon } = cityResponse.data.coord;

        // Lấy chỉ số UV từ tọa độ địa lý
        const uvResponse = await axios.get(`http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        setUvIndex(uvResponse.data.value);
      } catch (error) {
        setError('Lỗi khi lấy dữ liệu: ' + error.message);
        console.error('Lỗi khi lấy dữ liệu:', error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUVIndex();
  }, [city]);

  const getColorForUV = (index) => {
    if (index <= 2) return 'text-green-600';
    if (index <= 5) return 'text-yellow-500';
    if (index <= 7) return 'text-orange-600';
    if (index <= 10) return 'text-red-600';
    return 'text-purple-600';
  };

  const getWarningForUV = (index) => {
    if (index <= 2) return 'Chỉ số UV thấp. Không cần lo lắng.';
    if (index <= 5) return 'Chỉ số UV trung bình. Nên đeo kính râm và sử dụng kem chống nắng.';
    if (index <= 7) return 'Chỉ số UV cao. Hãy sử dụng kem chống nắng và hạn chế tiếp xúc với ánh nắng.';
    if (index <= 10) return 'Chỉ số UV rất cao. Tránh ra ngoài trời nếu có thể.';
    return 'Chỉ số UV cực kỳ cao. Tránh ra ngoài trời và bảo vệ da kỹ lưỡng.';
  };

  return (
    <div className="p-6 border border-gray-300 rounded-lg max-w-lg mx-auto mt-6 text-center bg-gray-100 shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Chỉ số UV hôm nay tại {city}</h2>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className={`text-6xl font-bold ${getColorForUV(uvIndex)} my-4`}>{uvIndex}</div>
          <div className="text-red-600 font-bold mt-2">{getWarningForUV(uvIndex)}</div>
        </>
      )}
    </div>
  );
};

export default UVIndex;
