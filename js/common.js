// Общие скрипты

// Открытие и закрытие меню
document.getElementById("menu-btn").onclick = function () {
  document.getElementById("sidebar").style.left = "0";
};

document.getElementById("close-btn").onclick = function () {
  document.getElementById("sidebar").style.left = "-250px";
};

// Закрытие сайдбара при клике вне его
window.addEventListener("click", function (event) {
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menu-btn");
  if (
    !sidebar.contains(event.target) &&
    event.target !== menuBtn &&
    sidebar.style.left === "0px"
  ) {
    sidebar.style.left = "-250px";
  }
});

// Переключение темы
document.getElementById("theme-toggle").onclick = function () {
  document.body.classList.toggle("light-theme");
  const icon = document.getElementById("theme-toggle");
  icon.textContent = document.body.classList.contains("light-theme")
    ? "🌞"
    : "🌙";
  updateFlatpickrTheme();
  updateChartsTheme();
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

// Функция для обновления темы графиков
let chartInstances = [];

function registerChart(chart) {
  chartInstances.push(chart);
}

function updateChartsTheme() {
  chartInstances.forEach((chart) => {
    chart.options.scales.x.ticks.color = document.body.classList.contains(
      "light-theme"
    )
      ? "#333"
      : "#fff";
    chart.options.scales.y.ticks.color = document.body.classList.contains(
      "light-theme"
    )
      ? "#333"
      : "#fff";
    chart.options.scales.x.grid.color = document.body.classList.contains(
      "light-theme"
    )
      ? "#ccc"
      : "#555";
    chart.options.scales.y.grid.color = document.body.classList.contains(
      "light-theme"
    )
      ? "#ccc"
      : "#555";
    chart.options.plugins.legend.labels.color =
      document.body.classList.contains("light-theme") ? "#333" : "#fff";
    chart.update();
  });
}
