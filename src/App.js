import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Weather from './Login';
import WeatherMap from './Map';
import WeatherChart from './Chart';





const App = () => {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
         
          <Route path='/' element={<Weather/>}/>
          <Route path='/map' element={<WeatherMap/>}/>
          <Route path='/chart' element={<WeatherChart/>}/>
          
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
