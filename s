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

  const ctxHum = document.getElementById("humidity-graph").getContext("2d");
  const humidityChart = new Chart(ctxHum, {
    type: "line",
    data: {
      labels: ["05:00", "06:00", "07:00", "08:00", "09:00"],
      datasets: [
        {
          label: "Влажность",
          data: [85, 90, 92, 93, 94],
          borderColor: "blue",
          backgroundColor: "rgba(0, 0, 255, 0.1)",
          fill: false,
        },
      ],
    },
    options: getChartOptions(),
  });
  registerChart(humidityChart);
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
