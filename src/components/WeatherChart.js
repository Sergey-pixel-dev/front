import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { fetchWeatherChart } from "../services/api"; // API-запрос для получения данных
import "../styles/WeatherChart.css";

const WeatherChart = () => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadChartData = async () => {
      const data = await fetchWeatherChart("Moscow");
      setChartData({
        labels: data.list.map((item) => item.dt_txt),
        datasets: [
          {
            label: "Температура",
            data: data.list.map((item) => item.main.temp),
          },
        ],
      });
    };
    loadChartData();
  }, []);

  const formatChartData = (data) => {
    return {
      labels: data.hours, // Часы (например: ["12:00", "13:00", ...])
      datasets: [
        {
          label: "Температура (°C)",
          data: data.temperature, // Массив значений температуры
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Влажность (%)",
          data: data.humidity, // Массив значений влажности
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Скорость ветра (м/с)",
          data: data.wind_speed, // Массив значений скорости ветра
          borderColor: "rgba(255, 159, 64, 1)",
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  if (isLoading) return <div className="weather-chart">Загрузка...</div>;
  if (error) return <div className="weather-chart">{error}</div>;

  return (
    <div className="weather-chart">
      <h2>Погодные графики</h2>
      <Line data={chartData} />
    </div>
  );
};

export default WeatherChart;
