import React, { useState, useEffect } from "react";
import "./styles/App.css";
import Header from "./components/Header";
import CurrentWeather from "./components/CurrentWeather";
import WeatherStats from "./components/WeatherStats";
import WeatherChart from "./components/WeatherChart";

function App() {
  const [theme, setTheme] = useState("dark"); // Тема: светлая или темная

  // Переключение темы
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Сохраняем тему в localStorage
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
  }, []);

  return (
    <div className={`app ${theme}`}>
      <Header onToggleTheme={toggleTheme} />
      <div className="main-content">
        <CurrentWeather />
        <WeatherStats />
        <WeatherChart />
      </div>
    </div>
  );
}

export default App;
