// index.js

// Объект для хранения текущих данных
const CurrentData = {};

// Получаем ссылки на HTML элементы
const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const min_max = document.getElementById("min-max");

// Функция для форматирования даты (например, отображение только времени)
function formatDate(dateString) {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Функция для общих опций графиков
function getChartOptions() {
  return {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: document.body.classList.contains("light-theme")
            ? "#333"
            : "#fff",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: document.body.classList.contains("light-theme")
            ? "#333"
            : "#fff",
        },
        grid: {
          color: document.body.classList.contains("light-theme")
            ? "#ccc"
            : "#555",
        },
      },
      y: {
        ticks: {
          color: document.body.classList.contains("light-theme")
            ? "#333"
            : "#fff",
        },
        grid: {
          color: document.body.classList.contains("light-theme")
            ? "#ccc"
            : "#555",
        },
      },
    },
  };
}

let temperatureChart;
let humidityChart;

window.addEventListener("load", function () {
  // Инициализируем график температуры
  const ctxTemp = document.getElementById("temperature-graph").getContext("2d");
  temperatureChart = new Chart(ctxTemp, {
    type: "line",
    data: {
      labels: [], // Пустые метки
      datasets: [
        {
          label: "Температура (°C)",
          data: [],
          borderColor: "red",
          backgroundColor: "rgba(255, 0, 0, 0.1)",
          fill: false,
        },
      ],
    },
    options: getChartOptions(),
  });

  // Инициализируем график влажности
  const ctxHum = document.getElementById("humidity-graph").getContext("2d");
  humidityChart = new Chart(ctxHum, {
    type: "line",
    data: {
      labels: [], // Пустые метки
      datasets: [
        {
          label: "Влажность (%)",
          data: [],
          borderColor: "blue",
          backgroundColor: "rgba(0, 0, 255, 0.1)",
          fill: false,
        },
      ],
    },
    options: getChartOptions(),
  });

  // Регистрируем графики, если у вас есть такая функция
  if (typeof registerChart === "function") {
    registerChart(temperatureChart);
    registerChart(humidityChart);
  }

  // Получаем и отображаем данные
  fetchCurrentData(); // Первоначальный запрос текущих данных
  fetchHistoricalData(); // Первоначальный запрос исторических данных

  // Устанавливаем периодическое обновление данных каждые 60 секунд (60000 миллисекунд)
  setInterval(fetchCurrentData, 60000);
  setInterval(fetchHistoricalData, 60000);
});

// Функция для получения и обновления текущих данных
async function fetchCurrentData() {
  // Отображаем сообщение «Загрузка» перед началом запроса
  temp.textContent = "Загрузка...";
  humidity.textContent = "Загрузка...";
  min_max.textContent = "Загрузка...";

  try {
    const response = await fetch("http://localhost:8081/data/current/");
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    const data = await response.json();

    // Обновляем объект CurrentData
    CurrentData.lastDate = data.last_date;
    CurrentData.temperature = {
      current: data.main.temp,
      min: data.main.temp_min,
      max: data.main.temp_max,
    };
    CurrentData.pressure = data.main.pressure;
    CurrentData.humidity = data.main.humidity;

    console.log("Сохраненные данные:", CurrentData);

    // Обновляем содержимое элементов на странице
    temp.textContent = `${CurrentData.temperature.current}°C`;
    humidity.textContent = `${CurrentData.humidity}%`;
    min_max.textContent = `Мин: ${CurrentData.temperature.min}°C, Макс: ${CurrentData.temperature.max}°C`;
  } catch (error) {
    console.error("Ошибка получения текущих данных:", error);
    temp.textContent = "Ошибка загрузки";
    humidity.textContent = "Ошибка загрузки";
    min_max.textContent = "Ошибка загрузки";
  }
}

// Функция для получения и обновления исторических данных
async function fetchHistoricalData() {
  try {
    const response = await fetch("http://localhost:8081/data/currentday/");
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    const data = await response.json();

    // Проверяем, что 'data' является массивом
    if (!Array.isArray(data.data)) {
      throw new Error("Неверный формат данных: 'data' должно быть массивом.");
    }

    const historicalData = data.data;

    // Сортируем данные по дате (от старых к новым)
    historicalData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Ограничиваем количество точек на графике, например, последние 20
    const MAX_POINTS = 20;
    const limitedData = historicalData.slice(-MAX_POINTS);

    // Извлекаем даты, температуры и влажность
    const labels = limitedData.map((entry) => formatDate(entry.date));
    const temperatures = limitedData.map((entry) => entry.temp);
    const humidities = limitedData.map((entry) => entry.humidity);

    // Обновляем график температуры
    temperatureChart.data.labels = labels;
    temperatureChart.data.datasets[0].data = temperatures;
    temperatureChart.update();

    // Обновляем график влажности
    humidityChart.data.labels = labels;
    humidityChart.data.datasets[0].data = humidities;
    humidityChart.update();
  } catch (error) {
    console.error("Ошибка получения исторических данных:", error);
    // Опционально: можно отображать сообщение об ошибке на графиках
  }
}
