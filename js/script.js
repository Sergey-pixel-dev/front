document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.getElementById("menu-icon");
  const sidebar = document.getElementById("sidebar");
  const closeBtn = document.getElementById("closebtn");

  // Открыть сайдбар при нажатии на иконку меню
  menuIcon.addEventListener("click", function () {
    sidebar.style.width = "250px";
  });

  // Закрыть сайдбар при нажатии на крестик
  closeBtn.addEventListener("click", function () {
    sidebar.style.width = "0";
  });

  // Закрыть сайдбар при клике вне его
  window.addEventListener("click", function (event) {
    if (event.target === sidebar) {
      sidebar.style.width = "0";
    }
  });
});
