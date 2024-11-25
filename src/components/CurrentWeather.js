import React, { useEffect, useState } from "react";
import "../styles/CurrentWeather.css";
import { fetchCurrentWeather } from "../services/api"; // Импорт функции для API-запроса

const CurrentWeather = () => {
  const [weather, setWeather] = useState(null); // Состояние для данных о погоде
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(null); // Состояние ошибки

  // Загрузка данных о текущей погоде
  useEffect(() => {
    const loadWeather = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCurrentWeather();
        setWeather(data);
        setIsLoading(false);
      } catch (err) {
        setError("Не удалось загрузить данные о погоде.");
        setIsLoading(false);
      }
    };

    loadWeather();
  }, []);

  if (isLoading) return <div className="current-weather">Загрузка...</div>;
  if (error) return <div className="current-weather">{error}</div>;

  return (
    <div className="current-weather">
      <div className="weather-main">
        <h1 className="temperature">{weather.temperature}°C</h1>
        <p className="description">{weather.description}</p>
      </div>
      <div className="weather-details">
        <div className="detail">
          <span className="label">Ветер:</span>
          <span>{weather.wind_speed} м/с</span>
        </div>
        <div className="detail">
          <span className="label">Влажность:</span>
          <span>{weather.humidity}%</span>
        </div>
        <div className="detail">
          <span className="label">Давление:</span>
          <span>{weather.pressure} мм рт. ст.</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
