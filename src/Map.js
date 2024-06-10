
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const defaultCenter = {
  lat: 10.8231,
  lng: 106.6297
};

function Map() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);
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

  const handleInputChange = (event) => {
    setInputCountry(event.target.value);
  };

  const handleTempChange = (event) => {
    setInputTemp(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetchCitiesWeather(inputCountry, inputTemp);
  };

  return (
    <div>
      <LoadScript googleMapsApiKey="AIzaSyD55258OJ4jmwW_4S7XhaM-nPrnlsMc1J4">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={5}
        >
          {selectedCountry && (
            <Marker
              position={{ lat: selectedCountry.lat, lng: selectedCountry.lng }}
              onClick={() => setSelectedCountry(null)}
            >
              <InfoWindow onCloseClick={() => setSelectedCountry(null)}>
                <div>
                  <h3>{selectedCountry.name}</h3>
                  {weather && (
                    <div>
                      <p>Temperature: {Math.round(weather.main.temp - 273.15)}°C</p>
                      <p>Weather: {weather.weather[0].description}</p>
                    </div>
                  )}
                </div>
              </InfoWindow>
            </Marker>
          )}
        </GoogleMap>
      </LoadScript>
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

