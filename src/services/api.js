const API_KEY = "5f6c7e16fd98efa05784a756b0014f31"; // Вставьте свой API-ключ
const BASE_URL = "https://api.openweathermap.org/data/2.5"; // Базовый URL OpenWeather

// Функция для получения текущей погоды
export const fetchCurrentWeather = async (city = "Moscow") => {
  const url = `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}&lang=ru`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Ошибка загрузки текущей погоды");
  }
  return await response.json();
};

// Функция для получения статистики погоды
export const fetchWeatherStats = async (city = "Moscow") => {
  const url = `${BASE_URL}/onecall?lat=55.7558&lon=37.6173&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}&lang=ru`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Ошибка загрузки погодной статистики");
  }
  return await response.json();
};

// Функция для получения данных для графиков
export const fetchWeatherChart = async (city = "Moscow") => {
  const url = `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}&lang=ru`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Ошибка загрузки данных для графиков");
  }
  return await response.json();
};

/* const BASE_URL = "http://localhost:5000"; // Базовый URL сервера Golang

// Получение текущей погоды
export const fetchCurrentWeather = async () => {
  const response = await fetch(`${BASE_URL}/current`);
  if (!response.ok) {
    throw new Error("Ошибка загрузки данных о текущей погоде");
  }
  return await response.json();
};

// Получение статистики погоды (макс/мин температура, влажность, давление)
export const fetchWeatherStats = async () => {
  const response = await fetch(`${BASE_URL}/stats`);
  if (!response.ok) {
    throw new Error("Ошибка загрузки статистики");
  }
  return await response.json();
};

// Получение данных для графиков (температура, влажность, скорость ветра)
export const fetchWeatherChart = async () => {
  const response = await fetch(`${BASE_URL}/chart-data`);
  if (!response.ok) {
    throw new Error("Ошибка загрузки данных для графиков");
  }
  return await response.json();
};
 */
