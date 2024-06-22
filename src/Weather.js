import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import TimeDisplay from "./Time";
import Temperature from "./temperature";
import { Link, useNavigate } from "react-router-dom";

const API_KEY = "1779ca818b59557aa48558aec376d6db";

function Weather() {
    const [showPopup, setShowPopup] = useState(false);
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState("Đang xác định vị trí...");
    const [tempMin, setTempMin] = useState('');
    const [tempMax, setTempMax] = useState('');
    const [error, setError] = useState(null);
    const [weatherCondition, setWeatherCondition] = useState("clear");
    const [searchHistory, setSearchHistory] = useState(JSON.parse(localStorage.getItem('searchHistory')) || []);
    const history = useNavigate();

    const handleNavigateToMap = () => {
        history('/map');
    };
    const handleNavigateToChart = () => {
        history('/chart');
    };

    useEffect(() => {
        getLocationByIP();
    }, []);

    const fetchWeatherData = (city) => {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&lang=vi&appid=${API_KEY}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found');
                }
                return response.json();
            })
            .then(data => {
                setWeatherData(data);
                setCity(data.city.name);
                setWeatherCondition(data.list[0].weather[0].main);
                setError(null);
                updateSearchHistory(data.city.name);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                setError('Không thể xác định vị trí hiện tại');
                setWeatherData(null);
            });
    };

    const getLocationByIP = () => {
        fetch('https://api.ipify.org/?format=json')
            .then(response => response.json())
            .then(data => {
                const ip = data.ip;
                return fetch(`http://ip-api.com/json/${ip}?lang=vi`);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Unable to get location');
                }
                return response.json();
            })
            .then(data => {
                const city = data.city;
                setCity(city);
                fetchWeatherData(city);
            })
            .catch(error => {
                console.error('Error getting location by IP:', error);
                setError('Không thể xác định vị trí hiện tại');
            });
    };

    useEffect(() => {
        if (weatherData && weatherData.list && weatherData.list[0] && weatherData.list[0].main && weatherData.list[0].weather && weatherData.list[0].weather[0]) {
            setTempMin(Math.floor(weatherData.list[0].main.temp_min - 273.15));
            setTempMax(Math.floor(weatherData.list[0].main.temp_max - 273.15));
        }
    }, [weatherData]);

    const handleOpenPopup = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleSearch = () => {
        fetchWeatherData(city);
    };

    const updateSearchHistory = (city) => {
        const newHistory = [...searchHistory, city];
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    };

    const handleHistoryClick = (city) => {
        fetchWeatherData(city);
    };

    function getDayName(index) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const dayIndex = (today.getDay() + index) % 7;
        return days[dayIndex];
    }

    return (
        <div
            className={`h-screen bg-cover bg-no-repeat text-white ${
                weatherCondition === "Clouds"
                    ? "bg-[url('./imgbackground/cloud.jpg')]"
                    : weatherCondition === "Rain"
                    ? "bg-[url('./imgbackground/rain.jpg')]"
                    : "bg-[url('./imgbackground/quandang.jpg')]"
            }`}
        >
            <div className="flex flex-col md:flex-row justify-around items-start md:items-center px-4 gap-4">
                <div className="flex-1 p-4 rounded-lg mt-14 items-center">
                    <div className="p-4 rounded-lg bg-gray-400 bg-opacity-50 border border-white inline-block">
                        <p className="texticon flex items-center ml-4">
                            <i className="mr-2"></i>
                            <h2 className="font-semibold text-2xl">Vị Trí Hiện Tại</h2>
                        </p>
                        <div id="country" className="country text-lg font-semibold mt-1 ml-14">{city}</div>
                        <button
                            id="btnxemchitiet"
                            type="button"
                            className="bg-gray-600 text-yellow-400 mt-3 px-4 py-2 rounded shadow-lg"
                            data-toggle="modal"
                            data-target="#exampleModalCenter"
                            onClick={handleOpenPopup}
                        >
                            <span className="chitiet">Chi tiết dự báo hôm nay</span>
                        </button>
                        <div className="mt-2">
                            <Link to={'/check-uv'} className="text-yellow-400 underline inline-block  ml-6">Tia UV và chất lượng</Link>
                            
                        </div>
                        <Link to={'/history'} className="text-yellow-400 underline inline-block  ml-10">Lịch sử tìm kiếm</Link>
                    </div>
                </div>

                <div className="flex-1 bg-opacity-50 p-4 rounded-lg">
                    <div className="container px-4 flex justify-between items-center">
                        <div className="flex w-4/5 items-center" id="search">
                            <div className="w-full">
                                <input
                                    autoComplete="off"
                                    id="input_city_name"
                                    type="text"
                                    className="form-control basicAutoComplete p-2 w-full border rounded bg-gray-700 text-white placeholder-gray-400"
                                    placeholder="Thành Phố . . ."
                                    aria-label="Recipient's username"
                                    aria-describedby="basic-addon2"
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            <button
                                type="button"
                                className="bg-gray-600 text-white p-2 rounded shadow-lg"
                                onClick={handleSearch}
                            >
                                Tìm
                            </button>
                        </div>
                        <div id="match-list" className="match-list list-group mt-3"></div>
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>

                <div className="flex-1 flex flex-row bg-opacity-50 p-4 rounded-lg">
                    <div className="flex flex-col w-1/2">
                        <button
                            type="button"
                            className="bg-gray-600 text-white p-2 rounded shadow-lg"
                            onClick={handleNavigateToMap}
                        >
                            Tìm kiếm địa điểm du lịch
                        </button>
                    </div>
                    <div className="flex flex-col w-1/2">
                        <button
                            type="button"
                            className="bg-gray-600 text-white p-2 rounded shadow-lg inline-block ml-4"
                            onClick={handleNavigateToChart}
                        >
                            Biểu đồ hình
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-row gap-4 mt-10 p-4">
                <div className="flex flex-col w-full md:w-1/4 p-2 rounded-lg shadow-lg">
                    <TimeDisplay weatherData={weatherData} />
                </div>
                <div className="text-center p-2 flex flex-col w-full md:w-3/4 rounded-lg shadow-lg">
                    <Temperature weatherData={weatherData} />
                </div>
            </div>
            <div className="flex flex-row container mx-auto mt-6 text-white fixed bottom-2 right-2">
                {weatherData && weatherData.list && (
                    <div className="today flex flex-col w-1/3 items-center space-x-4 bg-gray-800 bg-opacity-50 p-4 rounded shadow-lg mr-8">
                        <div className="day text-xl">{getDayName(0)}</div>
                        <img src={`https://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}@2x.png`}
                            alt="weather icon"
                            className="w-16" />
                        <div className="other">
                            <div className="temp">Nhiệt độ cao nhất - {tempMax}°C</div>
                            <div className="temp">Nhiệt độ thấp nhất - {tempMin}°C</div>
                        </div>
                    </div>
                )}
                <div className="weather-forecast flex flex-row flex-wrap w-3/4 items-center space-x-4" id="weather-forecast">
                    {weatherData && weatherData.list && weatherData.list.slice(1, 7).map((forecast, index) => (
                        <div className="weather-forecast-item bg-gray-800 bg-opacity-50 p-4 rounded text-center shadow-lg" key={index}>
                            <div className="day text-lg">{getDayName(index + 1)}</div>
                            <img src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                                alt="weather icon"
                                className="w-16 mx-auto" />
                            <div className="desc">{forecast.weather[0].description}</div>
                            <div className="temp">{Math.floor(forecast.main.temp - 273.15)}°C</div>
                        </div>
                    ))}
                </div>
            </div>

           

            <Modal
                title="Dự báo thời tiết hôm nay"
                open={showPopup}
                onCancel={handleClosePopup}
                footer={null}
                className="horizontal-modal"
                bodyStyle={{ display: 'flex', flexDirection: 'row' }}
                wrapClassName="w-screen-2/3"
            >
                <div className="bg-white rounded-lg p-4 overflow-x-auto flex flex-row gap-4">
                    {weatherData && weatherData.list && weatherData.list.slice(0, 12).map((forecast, index) => (
                        <div className="nav-item bg-gray-100 rounded p-2 flex-1" key={index}>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title text-xl">{new Date(forecast.dt_txt).getHours()}:00</h5>
                                    <img className="card-img-top w-16 mx-auto" src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`} alt="Weather icon" />
                                    <p className="card-text">{forecast.weather[0].description}<br />{Math.round(forecast.main.temp - 273)}°C</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
}

export default Weather;
