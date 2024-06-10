import React, { useState, useEffect } from 'react';
import moment from "moment";

function TimeDisplay({ weatherData }) {
  const [time, setTime] = useState(new Date());
  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (weatherData?.city?.sunrise && weatherData?.city?.sunset) {
      setSunrise(weatherData.city.sunrise * 1000);
      setSunset(weatherData.city.sunset * 1000);
    }
  }, [weatherData]);

  const formattedTime = time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <div className="text-center p-4">
      <div className="p-2">
        <div className="text-6xl" id="time">
          {formattedTime} <span id="am-pm">{time.getHours() < 12}</span>
        </div>
        <div className="text-2xl mt-2" id="date">
          {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
        <div className="mt-4 bg-gray-800 rounded-lg shadow-lg bg-opacity-50 p-4 border border-white " id="current-weather-items">
          <p>Độ ẩm : {weatherData?.list?.[0]?.main?.humidity ?? 'N/A'} %</p>
          <p>Áp suất : {weatherData?.list?.[0]?.main?.pressure ?? 'N/A'} hPa</p>
          <p>Tốc độ gió : {weatherData?.list?.[0]?.wind?.speed ?? 'N/A'} m/s</p>
          {sunrise && <p>Bình Minh : {moment(sunrise).format('HH:mm A')}</p>}
          {sunset && <p>Hoàng Hôn : {moment(sunset).format('HH:mm A')}</p>}
          <p>Mực Nước Biển : {weatherData?.list?.[0]?.main?.sea_level ?? 'N/A'} hPa</p>
        </div>
      </div>
    </div>
  );
}

export default TimeDisplay;
