// Открытие и закрытие меню
document.getElementById("menu-btn").onclick = function () {
  document.getElementById("sidebar").style.left = "0";
};

document.getElementById("close-btn").onclick = function () {
  document.getElementById("sidebar").style.left = "-250px";
};

window.onclick = function (event) {
  if (!event.target.matches("#menu-btn") && !event.target.matches("#sidebar")) {
    document.getElementById("sidebar").style.left = "-250px";
  }
};

// Переключение темы
document.getElementById("theme-toggle").onclick = function () {
  document.body.classList.toggle("light-theme");
  const icon = document.getElementById("theme-toggle");
  icon.textContent = document.body.classList.contains("light-theme")
    ? "🌙"
    : "🌞";
};

// Графики
window.onload = function () {
  const ctxTemp = document.getElementById("temperature-graph").getContext("2d");
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
  });

  const ctxHum = document.getElementById("humidity-graph").getContext("2d");
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
  });
};
// Инициализация Flatpickr для календаря
document.getElementById("custom-time-btn").onclick = function () {
  const calendarInput = document.getElementById("calendar-input");
  calendarInput.style.display =
    calendarInput.style.display === "none" ? "inline-block" : "none";

  if (calendarInput.style.display === "inline-block") {
    flatpickr(calendarInput, {
      dateFormat: "Y-m-d", // Формат даты
      onChange: function (selectedDates, dateStr, instance) {
        // Когда пользователь выбирает дату, можно выполнить дополнительные действия
        console.log(`Вы выбрали: ${dateStr}`);
      },
    });
  }
};

// Остальные кнопки, например "Сегодня" и "Последние сутки"
document.getElementById("today-btn").onclick = function () {
  // Ваш код для "Сегодня"
};

document.getElementById("last-24-hours-btn").onclick = function () {
  // Ваш код для "Последние сутки"
};
