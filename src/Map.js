import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix marker icons issue in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const defaultCenter = [10.8231, 106.6297];
const defaultZoom = 5;

function Map() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [cities, setCities] = useState([]);
  const [inputCountry, setInputCountry] = useState('');
  const [inputTemp, setInputTemp] = useState('');
  const [error, setError] = useState('');

  const fetchCitiesWeather = async (countryName, inputTemperature) => {
    try {
      const response = await fetch(`http://api.geonames.org/searchJSON?q=${countryName}&maxRows=19&username=tunglv&featureClass=P`);
      const data = await response.json();

      if (!data.geonames || data.geonames.length === 0) {
        setError('Không tìm thấy địa điểm phù hợp.');
        return;
      }

      const cityWeatherData = data.geonames.map(async (city) => {
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=1779ca818b59557aa48558aec376d6db`);
        const weatherData = await weatherResponse.json();
        return {
          name: city.name,
          temp: weatherData.main.temp,
          weather: weatherData.weather[0].description,
          humidity: weatherData.main.humidity,
          windSpeed: weatherData.wind.speed,
          pressure: weatherData.main.pressure,
          rain: weatherData.rain ? weatherData.rain['1h'] : 0
        };
      });

      const allCities = await Promise.all(cityWeatherData);
      const filteredCities = allCities.filter(city => {
        const cityTempCelsius = city.temp - 273.15;
        const inputTempCelsius = parseFloat(inputTemperature);
        return Math.abs(cityTempCelsius - inputTempCelsius) <= 3;
      });

      setCities(filteredCities);
      if (filteredCities.length === 0) {
        setError('Không tìm thấy thành phố nào với nhiệt độ trong khoảng yêu cầu.');
      } else {
        setError('');
      }
    } catch (error) {
      setError('Có lỗi xảy ra trong quá trình tìm kiếm. Vui lòng thử lại.');
      console.error('Error fetching city weather data:', error);
    }
  };

  const fetchCountryCoordinates = async (countryName) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?country=${countryName}&format=json&limit=1`);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setSelectedCountry({ name: countryName, lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        setError('Không tìm thấy quốc gia.');
      }
    } catch (error) {
      setError('Có lỗi xảy ra trong quá trình tìm kiếm tọa độ quốc gia. Vui lòng thử lại.');
      console.error('Error fetching country coordinates:', error);
    }
  };

  const handleInputChange = (event) => {
    setInputCountry(event.target.value);
  };

  const handleTempChange = (event) => {
    setInputTemp(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetchCitiesWeather(inputCountry, inputTemp);
    await fetchCountryCoordinates(inputCountry);
  };

  return (
    <div>
      <MapContainer style={{ width: '100%', height: '500px' }} center={defaultCenter} zoom={defaultZoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {selectedCountry && (
          <Marker position={[selectedCountry.lat, selectedCountry.lng]}>
            <Popup>
              <h3>{selectedCountry.name}</h3>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      <form onSubmit={handleSubmit} className="mt-4 container flex items-center justify-center">
        <input type="text" value={inputCountry} onChange={handleInputChange} placeholder="Nhập tên quốc gia" className='border border-gray p-4 m-4' />
        <input type="number" value={inputTemp} onChange={handleTempChange} placeholder="Nhập nhiệt độ (°C)" className='border border-gray p-4 m-4' />
        <button type="submit">Tìm kiếm</button>
      </form>

      {error && (
        <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>
          {error}
        </div>
      )}

      {cities.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3 className='flex items-center justify-center'>Danh sách các thành phố</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Tên thành phố</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Nhiệt độ (°C)</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Thời tiết</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Độ ẩm (%)</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Tốc độ gió (m/s)</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Áp suất (hPa)</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Lượng mưa (mm)</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{city.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{Math.round(city.temp - 273.15)}°C</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{city.weather}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{city.humidity}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{city.windSpeed}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{city.pressure}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{city.rain}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Map;
