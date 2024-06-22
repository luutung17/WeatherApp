import React, { useState } from 'react';
import UVIndex from './component/UVIndex';
import AirQualityIndex from './component/AirQualityIndex';

const UV = () => {
  const [city, setCity] = useState('Hanoi');
  const [inputCity, setInputCity] = useState('Hanoi');
  const [showUVIndex, setShowUVIndex] = useState(true);
  const [showInfoPage, setShowInfoPage] = useState(1); // State để quản lý trang giới thiệu

  const handleCityChange = (event) => {
    setInputCity(event.target.value);
  };

  const handleSearch = () => {
    setCity(inputCity);
  };

  const toggleView = () => {
    setShowUVIndex(!showUVIndex);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 font-sans">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Ứng dụng Dự báo Thời tiết</h1>

      {showInfoPage === 1 ? (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mb-6 text-left">
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Tia UV là gì?</h2>
          <p className="text-base text-gray-700 leading-relaxed mb-4">
            Tia UV (Ultraviolet) là một loại bức xạ điện từ có bước sóng ngắn hơn ánh sáng khả kiến nhưng dài hơn tia X. Tia UV đến từ mặt trời và cũng có thể được tạo ra bởi một số nguồn nhân tạo.
          </p>
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Tác hại của tia UV</h2>
          <p className="text-base text-gray-700 leading-relaxed mb-4">
            Tia UV có thể gây ra một số tác hại cho sức khỏe nếu tiếp xúc quá nhiều, bao gồm:
            <ul className="list-disc list-inside">
              <li>Gây cháy nắng</li>
              <li>Làm lão hóa da</li>
              <li>Tăng nguy cơ ung thư da</li>
              <li>Gây tổn thương mắt, như đục thủy tinh thể</li>
            </ul>
            Do đó, việc bảo vệ bản thân khỏi tia UV là rất quan trọng, đặc biệt là trong những ngày chỉ số UV cao.
          </p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mb-6 text-left">
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Chỉ số Chất lượng Không khí (AQI) là gì?</h2>
          <p className="text-base text-gray-700 leading-relaxed mb-4">
            Chỉ số Chất lượng Không khí (AQI) là một hệ thống chỉ số dùng để đánh giá và thông báo chất lượng không khí hàng ngày cho công chúng. AQI được tính dựa trên nồng độ của các chất gây ô nhiễm trong không khí, bao gồm:
            <ul className="list-disc list-inside">
              <li>Ôzôn mặt đất (O3)</li>
              <li>Hạt bụi mịn (PM2.5 và PM10)</li>
              <li>Carbon monoxide (CO)</li>
              <li>Lưu huỳnh dioxide (SO2)</li>
              <li>Ni-tơ dioxide (NO2)</li>
            </ul>
            Mỗi chất gây ô nhiễm có một thang điểm riêng, và chỉ số AQI được tính toán dựa trên nồng độ cao nhất của các chất này. Chỉ số AQI có thể từ 0 đến 500, với các mức độ tương ứng từ tốt đến nguy hiểm.
          </p>
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Tác hại của Ô nhiễm không khí</h2>
          <p className="text-base text-gray-700 leading-relaxed mb-4">
            Ô nhiễm không khí có thể gây ra nhiều vấn đề sức khỏe nghiêm trọng, bao gồm:
            <ul className="list-disc list-inside">
              <li>Kích ứng mắt, mũi, và họng</li>
              <li>Khó thở và các vấn đề về hô hấp</li>
              <li>Gia tăng nguy cơ mắc bệnh tim mạch và phổi</li>
              <li>Ảnh hưởng xấu đến hệ thần kinh và các chức năng sinh sản</li>
            </ul>
            Do đó, việc theo dõi chỉ số AQI hàng ngày và có biện pháp bảo vệ sức khỏe khi chỉ số AQI cao là rất quan trọng.
          </p>
        </div>
      )}

      <div className="flex space-x-4 mb-4">
        <button className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600" onClick={() => setShowInfoPage(1)}>1</button>
        <button className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600" onClick={() => setShowInfoPage(2)}>2</button>
      </div>
      <hr className="w-full border-t mb-6"></hr>

      <div className="flex mb-4">
        <input
          type="text"
          value={inputCity}
          onChange={handleCityChange}
          placeholder="Nhập tên thành phố"
          className="px-4 py-2 border border-gray-300 rounded-md mr-2 w-64"
        />
        <button className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600" onClick={handleSearch}>Tìm kiếm</button>
      </div>

      <button className="px-4 py-2 mb-6 text-white bg-blue-500 rounded-md hover:bg-blue-600" onClick={toggleView}>
        {showUVIndex ? 'Xem Chỉ số Chất lượng Không khí' : 'Xem Chỉ số UV'}
      </button>

      {showUVIndex ? <UVIndex city={city} /> : <AirQualityIndex city={city} />}
    </div>
  );
};

export default UV;
