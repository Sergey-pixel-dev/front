import React, { useEffect, useState } from "react";
import "../styles/WeatherStats.css";
import { fetchWeatherStats } from "../services/api"; // Импорт функции для API-запроса

const WeatherStats = () => {
  const [stats, setStats] = useState(null); // Состояние для хранения статистики
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(null); // Состояние ошибки

  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchWeatherStats("Moscow");
      setStats({
        max_temperature: data.daily[0].temp.max,
        min_temperature: data.daily[0].temp.min,
        average_humidity: data.daily[0].humidity,
        pressure: data.daily[0].pressure,
      });
    };
    loadStats();
  }, []);

  if (isLoading) return <div className="weather-stats">Загрузка...</div>;
  if (error) return <div className="weather-stats">{error}</div>;

  return (
    <div className="weather-stats">
      <h2>Погодная статистика</h2>
      <div className="stats-grid">
        <div className="stat-item">
          <h3>Макс. температура</h3>
          <p>{stats.max_temperature}°C</p>
        </div>
        <div className="stat-item">
          <h3>Мин. температура</h3>
          <p>{stats.min_temperature}°C</p>
        </div>
        <div className="stat-item">
          <h3>Средняя влажность</h3>
          <p>{stats.average_humidity}%</p>
        </div>
        <div className="stat-item">
          <h3>Давление</h3>
          <p>{stats.pressure} мм рт. ст.</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherStats;
