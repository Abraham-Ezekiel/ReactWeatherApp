import React, {useState} from "react";
import "./WeatherApp.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSearch, faCloudSun, faCloud, faCloudShowersHeavy, faTint, faWind } from "@fortawesome/free-solid-svg-icons";


const WeatherApp = () => {

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () =>{
    const apikey = import.meta.env.VITE_WEATHER_API_KEY;

    const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;

    try{
      const response = await  fetch(url);
      const data = await response.json();

      if (response.ok) {
        setWeather(data);
        setError('');// clear errors if successful
      } else {
        setWeather(null);
        setError('City not found. Please try again');
      }
    } 
    catch (err){
      setError('Error fetching weather data. Please try again.');
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() === ""){
      setError("Please enter a city");
      return;
    }

    fetchWeather();
  };

  // Function to determine the icon based on weather condition
  const getWeatherIcon = () => {
    if (!weather || !weather.weather || !weather.weather[0])
      return faCloudSun; // default icon if no weather data is available

    const condition = weather.weather[0].main.toLowerCase(); // get the main weather condition

    switch(condition){
      case 'clear':
        return faCloud;
      case 'clouds':
        return faCloudSun;
      case 'rain':
      case 'drizzle':
      case 'thunderstorm':
        return faCloudShowersHeavy;
      default:
        return faCloudSun; // default to a cloud icon for unhandled conditions
    }
  };

  return (
    <div className="container">

      <h4>Weather App</h4>

      {/* Search Input*/}

      <form className="input" onSubmit={handleSubmit}>
        <input 
          type="text" 
          className="city-input" 
          placeholder="search location" 
          value={city} 
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit" className="search-icon">
          <FontAwesomeIcon icon={faSearch}/>
        </button>
      </form>

      {/* weather info */}

      {error && <p className="error-message" style={{color:'white', textAlign:'center'}}>{error}</p>}
      {weather && (
        <div className="weather-info">

         {/*City and Cloud Condition */}
         <div className="sub-weather-info1">
           <FontAwesomeIcon icon={getWeatherIcon()}/>
           <p style={{fontSize:'1.5rem', fontWeight:'bold', color:'yellow'}}>{weather.main.temp}°C</p>
           <p style={{fontSize:'1rem', fontWeight:'bold', color:'yellow', textAlign:'center'}}>{weather.name}</p>
         </div>
        
         {/*Humidity and Wind */}
         <div className="sub-weather-info2">

           <div className="humidity">
             <FontAwesomeIcon icon={faTint}/>
             <div className="humidity-info">
               <p style={{color:'yellow'}}>{weather.main.humidity}%</p>
               <p style={{color:'yellow'}}>Humidity</p>
             </div>
           </div>
 
           <div className="wind">
             <FontAwesomeIcon icon={faWind}/>
             <div className="wind-info">
               <p style={{color:'yellow'}}>{weather.wind.speed} km/h</p>
               <p style={{color:'yellow'}}>Wind Speed</p>
             </div>
           </div>

         </div>
         
        </div> 
      )}
      
    </div>
  );
};
export default WeatherApp;
