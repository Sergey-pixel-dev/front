// graphs.js

window.addEventListener("load", function () {
  // Инициализация графиков
  const ctxTemp = document.getElementById("temperature-graph").getContext("2d");
  const temperatureChart = new Chart(ctxTemp, {
    type: "line",
    data: {
      labels: ["05:00", "06:00", "07:00", "08:00", "09:00"],
      datasets: [
        {
          label: "Температура",
          data: [-3, -2, -1, 0, 1],
          borderColor: "red",
          backgroundColor: "rgba(255, 0, 0, 0.1)",
          fill: false,
        },
      ],
    },
    options: getChartOptions(),
  });
  registerChart(temperatureChart);

  const ctxWind = document.getElementById("wind-speed-graph").getContext("2d");
  const windSpeedChart = new Chart(ctxWind, {
    type: "line",
    data: {
      labels: ["05:00", "06:00", "07:00", "08:00", "09:00"],
      datasets: [
        {
          label: "Скорость ветра",
          data: [5, 7, 6, 8, 7],
          borderColor: "green",
          backgroundColor: "rgba(0, 255, 0, 0.1)",
          fill: false,
        },
      ],
    },
    options: getChartOptions(),
  });
  registerChart(windSpeedChart);

  // Инициализация Flatpickr
  const customTimeBtn = document.querySelector('.time-btn[data-mode="custom"]');
  const calendarInput = document.getElementById("calendar-input");
  let fp = null;

  customTimeBtn.addEventListener("click", function () {
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
  });

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
        case "lastWeek":
          // Ваш код для "Последняя неделя"
          console.log("Выбрано: Последняя неделя");
          break;
        case "lastMonth":
          // Ваш код для "Последний месяц"
          console.log("Выбрано: Последний месяц");
          break;
        case "custom":
          // Уже обработано выше
          break;
        default:
          break;
      }
    });
  });
});

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
