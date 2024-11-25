import React from "react";
import ReactDOM from "react-dom/client"; // Импортируем createRoot
import App from "./App"; // Главный компонент приложения
import "./styles/App.css"; // Общие стили приложения

// Создаем корневой элемент
const root = ReactDOM.createRoot(document.getElementById("root"));

// Рендерим приложение
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
