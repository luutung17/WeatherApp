import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Weather from './Weather';
import WeatherMap from './Map';
import WeatherChart from './Chart';
import UV from './UV';
import History from './SearchHistory';





const App = () => {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
         
          <Route path='/' element={<Weather/>}/>
          <Route path='/map' element={<WeatherMap/>}/>
          <Route path='/chart' element={<WeatherChart/>}/>
          <Route path='/check-uv' element={<UV/>}/>
          <Route path='/history' element={<History/>}/>
          
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
