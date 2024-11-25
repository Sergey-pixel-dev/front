import React, { useEffect, useState } from "react";
import "../styles/Header.css";

const Header = ({ onToggleTheme }) => {
  const [currentTime, setCurrentTime] = useState("");
  const [location, setLocation] = useState("Загрузка...");

  // Функция для получения текущего времени
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const formattedDate = now.toLocaleDateString("ru-RU", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      setCurrentTime(`${formattedDate}, ${formattedTime}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Получение данных о местоположении
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // В реальном приложении данные о городе можно получить от сервера Golang
        //const response = await fetch("http://localhost:5000/location"); // Пример API
        //const data = await response.json();
        //setLocation(data.city || "Неизвестное местоположение");
      } catch (error) {
        setLocation("Ошибка загрузки города");
      }
    };

    fetchLocation();
  }, []);

  return (
    <header className="header">
      <div className="time-location">
        <div className="time">{currentTime}</div>
        <div className="location">Погода в {location}</div>
      </div>
      <div className="theme-toggle">
        <button onClick={onToggleTheme} className="theme-button">
          Переключить тему
        </button>
      </div>
    </header>
  );
};

export default Header;
