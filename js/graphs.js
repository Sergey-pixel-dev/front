// graphs.js

window.addEventListener("load", function () {
  const graphCanvas = document.getElementById("graph").getContext("2d");
  let weatherChart = null;

  // Проверка наличия ChartZoom плагина
  if (typeof ChartZoom === "undefined") {
    console.error(
      "Chart.js Zoom Plugin не найден. Проверьте подключение скрипта."
    );
    return;
  }

  // Регистрация Chart.js Zoom Plugin
  Chart.register(ChartZoom);

  // Функция для создания или обновления графика
  function renderChart(labels, tempData, pressureData, humidityData) {
    if (weatherChart) {
      weatherChart.data.labels = labels;
      weatherChart.data.datasets[0].data = tempData;
      weatherChart.data.datasets[1].data = pressureData;
      weatherChart.data.datasets[2].data = humidityData;
      weatherChart.update();
    } else {
      weatherChart = new Chart(graphCanvas, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Температура (°C)",
              data: tempData,
              borderColor: "red",
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              fill: false,
              yAxisID: "y",
            },
            {
              label: "Давление (мм рт. ст.)",
              data: pressureData,
              borderColor: "blue",
              backgroundColor: "rgba(0, 0, 255, 0.1)",
              fill: false,
              yAxisID: "y1",
            },
            {
              label: "Влажность (%)",
              data: humidityData,
              borderColor: "green",
              backgroundColor: "rgba(0, 255, 0, 0.1)",
              fill: false,
              yAxisID: "y",
            },
          ],
        },
        options: getChartOptions(),
        // Плагин уже зарегистрирован глобально, дополнительная регистрация не требуется
      });
    }
  }

  // Функция для получения данных и обновления графика
  function fetchData(mode, firstDate = null, lastDate = null) {
    let url = "http://127.0.0.1:8081";
    if (mode === "today") {
      url += "/data/currentday/";
    } else {
      // Для остальных режимов
      const params = new URLSearchParams();
      if (firstDate && lastDate) {
        params.append("first_date", firstDate);
        params.append("last_date", lastDate);
      }
      url += `/data/statistics?${params.toString()}`;
    }

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const labels = data.data
          .map((entry) => new Date(entry.date).toLocaleString())
          .reverse(); // Предполагается, что данные в обратном хронологическом порядке

        const tempData = data.data.map((entry) => entry.temp).reverse();
        const pressureData = data.data.map((entry) => entry.pressure).reverse();
        const humidityData = data.data.map((entry) => entry.humidity).reverse();

        renderChart(labels, tempData, pressureData, humidityData);
      })
      .catch((error) => {
        console.error("Ошибка при получении данных:", error);
      });
  }

  // Инициализация графика по умолчанию (Сегодня)
  fetchData("today");

  // Инициализация Flatpickr
  const customTimeBtn = document.querySelector('.time-btn[data-mode="custom"]');
  const calendarInput = document.getElementById("calendar-input");
  let fp = null;

  customTimeBtn.addEventListener("click", function () {
    calendarInput.style.display =
      calendarInput.style.display === "none" ? "inline-block" : "none";

    if (calendarInput.style.display === "inline-block" && !fp) {
      fp = flatpickr(calendarInput, {
        mode: "range", // Позволяет выбирать диапазон дат
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
          if (selectedDates.length === 2) {
            const firstDate = formatDateTime(selectedDates[0]);
            const lastDate = formatDateTime(selectedDates[1]);
            fetchDataCustom(firstDate, lastDate);
          }
          // Если выбрана только одна дата, ничего не делаем
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
          fetchData("today");
          break;
        case "last24":
          const last24End = new Date();
          const last24Start = new Date(
            last24End.getTime() - 24 * 60 * 60 * 1000
          );
          fetchData(
            "statistics",
            formatDateTime(last24Start),
            formatDateTime(last24End)
          );
          break;
        case "lastWeek":
          const lastWeekEnd = new Date();
          const lastWeekStart = new Date(
            lastWeekEnd.getTime() - 7 * 24 * 60 * 60 * 1000
          );
          fetchData(
            "statistics",
            formatDateTime(lastWeekStart),
            formatDateTime(lastWeekEnd)
          );
          break;
        case "lastMonth":
          const lastMonthEnd = new Date();
          const lastMonthStart = new Date();
          lastMonthStart.setMonth(lastMonthEnd.getMonth() - 1);
          fetchData(
            "statistics",
            formatDateTime(lastMonthStart),
            formatDateTime(lastMonthEnd)
          );
          break;
        case "custom":
          // Уже обработано выше
          break;
        default:
          break;
      }
    });
  });

  // Функция для обработки пользовательского выбора даты
  function fetchDataCustom(firstDate, lastDate) {
    fetchData("statistics", firstDate, lastDate);
  }

  // Функция для форматирования даты в "YYYY-MM-DD HH:MM:SS"
  function formatDateTime(date) {
    const pad = (n) => (n < 10 ? "0" + n : n);
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      " " +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      ":" +
      pad(date.getSeconds())
    );
  }

  // Обработка кнопки сброса зума
  const resetZoomBtn = document.getElementById("reset-zoom");
  resetZoomBtn.addEventListener("click", function () {
    if (weatherChart) {
      weatherChart.resetZoom();
    }
  });
  const onPanZoomStart = () => {
    weatherChart.stop();
  };
  // Функция для общих опций графиков
  function getChartOptions() {
    let zoomOptions = {
      limits: {
        x: {
          min: 0,
          max: 6000,
          minRange: 5,
        },
      },
      pan: {
        enabled: true,
        mode: "x",
        onPanStart: onPanZoomStart,
      },
      zoom: {
        mode: "x",
        pinch: {
          enabled: true,
        },
        wheel: {
          enabled: true,
        },
        onZoomStart: onPanZoomStart,
      },
    };
    return {
      responsive: true,
      interaction: {
        mode: "index",
        intersect: false,
      },
      stacked: false,
      plugins: {
        legend: {
          labels: {
            color: document.body.classList.contains("light-theme")
              ? "#333"
              : "#fff",
          },
        },
        tooltip: {
          position: "nearest",
          enabled: true,
          mode: "index", // Отображает все точки на x-оси при наведении
          intersect: false, // Tooltip отображается, когда курсор близко к данным
          backgroundColor: "rgba(0, 0, 0, 0.7)", // Фон Tooltip
          titleColor: "#fff", // Цвет заголовка
          bodyColor: "#fff", // Цвет тела Tooltip
          borderColor: "#fff", // Цвет границы Tooltip
          borderWidth: 1, // Ширина границы Tooltip
          cornerRadius: 4, // Радиус скругления углов Tooltip
          padding: 10, // Внутренний отступ Tooltip
          callbacks: {
            // Настройка содержимого Tooltip
            title: function (context) {
              let title = context[0].label;
              return `Дата: ${title}`;
            },
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.parsed.y !== null) {
                // Форматируем число как валюту
                label += new Intl.NumberFormat("ru-RU", {
                  style: "currency",
                  currency: "USD",
                }).format(context.parsed.y);
              }
              return label;
            },
          },
        },
        // Настройки для зума и панорамирования
        zoom: zoomOptions,
      },
      animation: {
        duration: 400,
        easing: "linear",
        y: {
          fn: (from, to, factor) => to,
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
          type: "linear",
          display: true,
          position: "left",
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
          title: {
            display: true,
            text: "Температура / Влажность",
            color: document.body.classList.contains("light-theme")
              ? "#333"
              : "#fff",
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          grid: {
            drawOnChartArea: false, // Не рисовать сетку для y1
          },
          ticks: {
            color: "blue",
          },
          title: {
            display: true,
            text: "Давление",
            color: "blue",
          },
        },
      },
    };
  }
});
