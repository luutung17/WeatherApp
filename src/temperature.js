import React, { useEffect, useState } from 'react';

function Temperature({ weatherData }) {
    const [temperature, setTemperature] = useState('');
    const [icon, setIcon] = useState('');
    const [description, setDescription] = useState('');
    const [tempMin,setTempMin]= useState('')
    const [tempMax,setTempMax]= useState('')

    useEffect(() => {
        if (weatherData && weatherData.list && weatherData.list[0] && weatherData.list[0].main && weatherData.list[0].weather && weatherData.list[0].weather[0]) {
            setTemperature(Math.floor(weatherData.list[0].main.temp - 273.15));
            setIcon(weatherData.list[0].weather[0].icon);
            setDescription(weatherData.list[0].weather[0].description);
            setTempMin(Math.floor(weatherData.list[0].main.temp_min - 273.15));
            setTempMax(Math.floor(weatherData.list[0].main.temp_max - 273.15));
        }
    }, [weatherData]);

    if (!weatherData || !weatherData.list || !weatherData.list[0] || !weatherData.list[0].main || !weatherData.list[0].weather || !weatherData.list[0].weather[0]) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 w-full max-w-md mx-auto">
            <div className="temp flex items-center justify-center text-4xl font-bold">
                <div className="text-8xl">{temperature}</div>
                <div className="textdoc">°C</div>
            </div>
            <div className="iconstemp flex justify-center mt-2">
                <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} alt="Weather icon" />
            </div>
            <div className="description text-center ">
                <div className="contentdes text-lg">{description}</div>
            </div>
            <div class="flex justify-center mt-2">
                Nhiệt độ cao nhất : {tempMax}°C  -  Nhiệt độ thấp nhất :{tempMin}°C
            </div>
        </div>
    );
}




export default Temperature;
