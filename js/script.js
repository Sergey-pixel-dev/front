// Открытие и закрытие меню
document.getElementById("menu-btn").onclick = function () {
  document.getElementById("sidebar").style.left = "0";
};

document.getElementById("close-btn").onclick = function () {
  document.getElementById("sidebar").style.left = "-250px";
};

// Закрытие сайдбара при клике вне его
window.onclick = function (event) {
  if (!event.target.matches("#menu-btn") && !event.target.closest("#sidebar")) {
    document.getElementById("sidebar").style.left = "-250px";
  }
};

// Переключение темы
document.getElementById("theme-toggle").onclick = function () {
  document.body.classList.toggle("light-theme");
  const icon = document.getElementById("theme-toggle");
  icon.textContent = document.body.classList.contains("light-theme")
    ? "🌞"
    : "🌙";
  updateFlatpickrTheme();
};

// Функция обновления темы Flatpickr
function updateFlatpickrTheme() {
  const calendars = document.querySelectorAll(".flatpickr-calendar");
  calendars.forEach((calendar) => {
    if (document.body.classList.contains("light-theme")) {
      calendar.classList.remove("dark");
      calendar.classList.add("light");
    } else {
      calendar.classList.remove("light");
      calendar.classList.add("dark");
    }
  });
}

// Графики на главной странице
window.onload = function () {
  // Проверка, на какой странице мы находимся
  const temperatureGraph = document.getElementById("temperature-graph");
  if (temperatureGraph) {
    const ctxTemp = temperatureGraph.getContext("2d");
    new Chart(ctxTemp, {
      type: "line",
      data: {
        labels: ["05:00", "06:00", "07:00", "08:00", "09:00"],
        datasets: [
          {
            label: "Температура",
            data: [-3, -2, -1, 0, 1],
            borderColor: "red",
            fill: false,
          },
        ],
      },
      options: getChartOptions(),
    });
  }

  const humidityGraph = document.getElementById("humidity-graph");
  if (humidityGraph) {
    const ctxHum = humidityGraph.getContext("2d");
    new Chart(ctxHum, {
      type: "line",
      data: {
        labels: ["05:00", "06:00", "07:00", "08:00", "09:00"],
        datasets: [
          {
            label: "Влажность",
            data: [85, 90, 92, 93, 94],
            borderColor: "blue",
            fill: false,
          },
        ],
      },
      options: getChartOptions(),
    });
  }

  const windSpeedGraph = document.getElementById("wind-speed-graph");
  if (windSpeedGraph) {
    const ctxWind = windSpeedGraph.getContext("2d");
    new Chart(ctxWind, {
      type: "line",
      data: {
        labels: ["05:00", "06:00", "07:00", "08:00", "09:00"],
        datasets: [
          {
            label: "Скорость ветра",
            data: [5, 7, 6, 8, 7],
            borderColor: "green",
            fill: false,
          },
        ],
      },
      options: getChartOptions(),
    });
  }
};

// Общие опции для графиков
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

// Инициализация Flatpickr для календаря на странице графиков
const customTimeBtn = document.getElementById("custom-time-btn");
const calendarInput = document.getElementById("calendar-input");

if (customTimeBtn && calendarInput) {
  let fp = null;

  customTimeBtn.onclick = function () {
    calendarInput.style.display =
      calendarInput.style.display === "none" ? "inline-block" : "none";

    if (calendarInput.style.display === "inline-block" && !fp) {
      fp = flatpickr(calendarInput, {
        mode: "range", // Позволяет выбирать одну дату или диапазон
        dateFormat: "Y-m-d",
        onOpen: function () {
          // Применение темы при открытии календаря
          if (document.body.classList.contains("light-theme")) {
            fp.calendarContainer.classList.remove("dark");
            fp.calendarContainer.classList.add("light");
          } else {
            fp.calendarContainer.classList.remove("light");
            fp.calendarContainer.classList.add("dark");
          }
        },
        onChange: function (selectedDates, dateStr, instance) {
          console.log(`Вы выбрали: ${dateStr}`);
          // Дополнительные действия при выборе даты или диапазона
        },
      });
    }
  };
}

// Обработка кнопок выбора времени
const timeButtons = document.querySelectorAll(".time-btn");

timeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.getAttribute("data-mode");
    switch (mode) {
      case "today":
        // Ваш код для "Сегодня"
        console.log("Выбрано: Сегодня");
        break;
      case "last24":
        // Ваш код для "Последние сутки"
        console.log("Выбрано: Последние сутки");
        break;
      case "custom":
        // Уже обработано выше
        break;
      default:
        break;
    }
  });
});
