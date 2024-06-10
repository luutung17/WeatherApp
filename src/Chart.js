import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    VictoryChart,
    VictoryLine,
    VictoryBar,
    VictoryTheme,
    VictoryAxis,
    VictoryScatter,
    VictoryArea,
    VictoryStack,
} from 'victory';


const WeatherChart = () => {
    const [chartData, setChartData] = useState([]);
    const [city, setCity] = useState('');
    const [inputCity, setInputCity] = useState('');
    const [error, setError] = useState(null);
    const [chartType, setChartType] = useState('line'); 

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                if (!city) return;
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=1779ca818b59557aa48558aec376d6db`
                );
                const weatherData = response.data.list.map(item => ({
                    x: new Date(item.dt * 1000).toLocaleTimeString(),
                    y: item.main.temp,
                }));
                setChartData(weatherData);
                setError(null); 
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setError('Tên thành phố không hợp lệ'); 
                } else {
                    setError(error.message);
                }
            }
        };

        fetchWeatherData();
    }, [city]);

    const handleSubmit = e => {
        e.preventDefault();
        setCity(inputCity);
    };

    const handleChartTypeChange = newType => {
        setChartType(newType);
    };

    return (
        <div className="weather-chart-container p-6 bg-gray-100 rounded-lg shadow-lg max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Weather Forecast</h2>
            <form className="weather-form mb-6 flex items-center space-x-4" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter city name"
                    value={inputCity}
                    onChange={e => setInputCity(e.target.value)}
                    className="p-3 border rounded-lg w-full"
                />
                <button
                    type="submit"
                    className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    Get Weather
                </button>
            </form>
            {error && <p className="error-text text-red-500 mb-6">{error}</p>}
            <div className="chart-type-buttons mb-6 flex flex-wrap space-x-4 justify-center">
                <button
                    className={`p-3 rounded-lg ${chartType === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                    onClick={() => handleChartTypeChange('line')}
                >
                    Line Chart
                </button>
                <button
                    className={`p-3 rounded-lg ${chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                    onClick={() => handleChartTypeChange('bar')}
                >
                    Bar Chart
                </button>
                <button
                    className={`p-3 rounded-lg ${chartType === 'scatter' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                    onClick={() => handleChartTypeChange('scatter')}
                >
                    Scatter Plot
                </button>
                <button
                    className={`p-3 rounded-lg ${chartType === 'area' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                    onClick={() => handleChartTypeChange('area')}
                >
                    Area Chart
                </button>
                <button
                    className={`p-3 rounded-lg ${chartType === 'stack' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                    onClick={() => handleChartTypeChange('stack')}
                >
                    Stacked Bar Chart
                </button>
            </div>
            <VictoryChart
                theme={VictoryTheme.material}
                width={800}
                height={500}
                domainPadding={30}
            >
                <VictoryAxis
                    dependentAxis
                    label="Temperature (°C)"
                    style={{ axisLabel: { padding: 40 }, tickLabels: { fontSize: 12 } }}
                />
                <VictoryAxis label="Time" style={{ axisLabel: { padding: 40 }, tickLabels: { fontSize: 12 } }} />
                {chartType === 'line' ? (
                    <VictoryLine
                        data={chartData}
                        style={{
                            data: { stroke: "#c43a31" },
                        }}
                    />
                ) : chartType === 'bar' ? (
                    <VictoryBar
                        data={chartData}
                        style={{
                            data: { fill: "#c43a31" },
                        }}
                    />
                ) : chartType === 'scatter' ? (
                    <VictoryScatter
                        data={chartData}
                        style={{
                            data: { fill: "#c43a31" },
                        }}
                    />
                ) : chartType === 'area' ? (
                    <VictoryArea
                        data={chartData}
                        style={{
                            data: { fill: "#c43a31" },
                        }}
                    />
                ) : (
                    <VictoryStack colorScale={"qualitative"}>
                        <VictoryBar
                            data={chartData}
                            style={{
                                data: { fill: "#c43a31" },
                            }}
                        />
                    </VictoryStack>
                )}
            </VictoryChart>
        </div>
    );
};

export default WeatherChart;
