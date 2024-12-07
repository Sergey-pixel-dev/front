// common.js

// Глобальный массив для хранения экземпляров графиков
window.chartInstances = [];

function registerChart(chart) {
  window.chartInstances.push(chart);
}

document.addEventListener("DOMContentLoaded", function () {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  } else {
    document.body.classList.remove("light-theme");
  }

  // Инъекция Navbar
  const navbarPlaceholder = document.getElementById("navbar-placeholder");
  navbarPlaceholder.innerHTML = `
    <nav id="sidebar">
      <div id="close-btn">&#10006;</div>
      <ul>
        <li><a href="index.html" id="home-link">Главная</a></li>
        <li><a href="graphs.html" id="graphs-link">Графики</a></li>
        <li id="my-account-link" style="display: none;"><a href="account.html">Мой аккаунт</a></li>
        <li><a href="#">Обратная связь</a></li>
      </ul>
    </nav>
    
    <div id="navbar">
      <button id="menu-btn">&#9776;</button>
      <h1>Погода в Оренбурге</h1>
      <p id="time">${new Date().toLocaleString("ru-RU", {
        dateStyle: "long",
        timeStyle: "short",
      })}</p>
      <div>
        <button id="theme-toggle">🌙</button>
        <button id="auth-btn" class="auth-btn">Войти</button>
      </div>
    </div>
  `;

  // Обновление времени каждую минуту
  setInterval(() => {
    const timeElement = document.getElementById("time");
    if (timeElement) {
      timeElement.textContent = new Date().toLocaleString("ru-RU", {
        dateStyle: "long",
        timeStyle: "short",
      });
    }
  }, 60000);

  const themeToggleBtn = document.getElementById("theme-toggle");
  if (savedTheme === "light") {
    themeToggleBtn.textContent = "dark";
  } else {
    document.body.classList.remove("light-theme");
    themeToggleBtn.textContent = "light";
  }

  // Открытие и закрытие сайдбара
  const menuBtn = document.getElementById("menu-btn");
  const sidebar = document.getElementById("sidebar");
  const closeBtn = document.getElementById("close-btn");

  menuBtn.addEventListener("click", () => {
    sidebar.style.left = "0";
  });

  closeBtn.addEventListener("click", () => {
    sidebar.style.left = "-250px";
  });

  // Закрытие сайдбара при клике вне его
  window.addEventListener("click", function (event) {
    if (
      !sidebar.contains(event.target) &&
      event.target !== menuBtn &&
      sidebar.style.left === "0px"
    ) {
      sidebar.style.left = "-250px";
    }
  });

  // Переключение темы

  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    const isLight = document.body.classList.contains("light-theme");
    const icon = themeToggleBtn;
    icon.textContent = isLight ? "dark" : "light";

    // Сохранение текущей темы в localStorage
    localStorage.setItem("theme", isLight ? "light" : "dark");

    updateFlatpickrTheme();
    updateChartsTheme();
    updateModalTheme();
    updateSidebar();
  });

  // Обновление темы для Flatpickr
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

  // Обновление темы графиков
  function updateChartsTheme() {
    if (window.chartInstances && window.chartInstances.length > 0) {
      window.chartInstances.forEach((chart) => {
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
        chart.options.scales.y.title.color = document.body.classList.contains(
          "light-theme"
        )
          ? "#333"
          : "#fff";
        chart.options.plugins.legend.labels.color =
          document.body.classList.contains("light-theme") ? "#333" : "#fff";
        chart.update();
      });
    }
  }

  // Обновление темы модальных окон
  function updateModalTheme() {
    const modalContent = document.querySelectorAll(".modal-content");
    modalContent.forEach((content) => {
      if (document.body.classList.contains("light-theme")) {
        content.classList.remove("dark");
        content.classList.add("light");
      } else {
        content.classList.remove("light");
        content.classList.add("dark");
      }
    });
  }

  // Обновление темы для sidebar links (например, "Мой аккаунт")
  function updateSidebar() {
    const accountLink = document.getElementById("my-account-link");
    if (document.body.classList.contains("light-theme")) {
      accountLink.style.color = "#333";
    } else {
      accountLink.style.color = "#fff";
    }
  }

  // Создание модальных окон для аутентификации
  const modalHTML = `
    <div id="auth-modal" class="modal">
      <div class="modal-content">
        <span class="close" id="close-auth-modal">&times;</span>
        <h2>Войти в аккаунт</h2>
        <form id="login-form">
          <label for="email">Почта:</label>
          <input type="email" id="email" name="email" required />
          <label for="password">Пароль:</label>
          <input type="password" id="password" name="password" required />
          <button type="submit">Войти</button>
        </form>
        <div class="register-link">
          <p>Нет аккаунта? <a href="#" id="show-register">Зарегистрироваться</a></p>
        </div>
      </div>
    </div>

    <div id="register-modal" class="modal">
      <div class="modal-content">
        <span class="close" id="close-register-modal">&times;</span>
        <h2>Регистрация</h2>
        <form id="register-form">
          <label for="reg-email">Почта:</label>
          <input type="email" id="reg-email" name="reg-email" required />
          <label for="reg-password">Пароль:</label>
          <input type="password" id="reg-password" name="reg-password" required />
          <button type="submit">Зарегистрироваться</button>
        </form>
        <div class="register-link">
          <p>Уже есть аккаунт? <a href="#" id="show-login">Войти</a></p>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Получение элементов модальных окон
  const authModal = document.getElementById("auth-modal");
  const registerModal = document.getElementById("register-modal");

  // Получение кнопки для открытия модального окна
  const authBtn = document.getElementById("auth-btn");

  // Получение элементов для закрытия модальных окон
  const closeAuthModal = document.getElementById("close-auth-modal");
  const closeRegisterModal = document.getElementById("close-register-modal");

  // Функции для показа и скрытия модальных окон
  function showAuthModal() {
    authModal.style.display = "flex";
  }

  function showRegisterModal() {
    registerModal.style.display = "flex";
  }

  function hideAuthModal() {
    authModal.style.display = "none";
  }

  function hideRegisterModal() {
    registerModal.style.display = "none";
  }

  // Добавление обработчиков событий для открытия модальных окон
  authBtn.addEventListener("click", () => {
    const isLoggedIn = localStorage.getItem("accessToken") !== null;
    if (isLoggedIn) {
      logout();
    } else {
      showAuthModal();
    }
  });

  // Добавление обработчиков событий для закрытия модальных окон
  closeAuthModal.addEventListener("click", hideAuthModal);
  closeRegisterModal.addEventListener("click", hideRegisterModal);

  // Закрытие модальных окон при клике вне их
  window.addEventListener("click", function (event) {
    if (event.target === authModal) {
      hideAuthModal();
    }
    if (event.target === registerModal) {
      hideRegisterModal();
    }
  });

  // Переключение между модалями
  const showRegisterLink = document.getElementById("show-register");
  const showLoginLink = document.getElementById("show-login");

  if (showRegisterLink) {
    showRegisterLink.addEventListener("click", function (e) {
      e.preventDefault();
      hideAuthModal();
      showRegisterModal();
    });
  }

  if (showLoginLink) {
    showLoginLink.addEventListener("click", function (e) {
      e.preventDefault();
      hideRegisterModal();
      showAuthModal();
    });
  }

  // Обработка формы входа
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (email && password) {
        try {
          const response = await fetch("http://localhost:8081/user/login/", {
            method: "POST",
            credentials: "include", // Включает передачу куки для refresh token
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              password: password,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const accessToken = data.access_token;
            if (accessToken) {
              // Сохранение access token
              localStorage.setItem("accessToken", accessToken);
              // Сохранение email пользователя
              localStorage.setItem("userEmail", email);
              // Обновление интерфейса
              updateAuthButtons();
              // Скрытие модального окна
              hideAuthModal();
              // Очистка формы
              loginForm.reset();
            } else {
              alert("Ошибка при получении токена доступа.");
            }
          } else {
            const errorData = await response.json();
            alert(`Ошибка входа: ${errorData.error}`);
          }
        } catch (error) {
          console.error("Ошибка при отправке запроса на вход:", error);
          alert("Произошла ошибка при попытке входа.");
        }
      } else {
        alert("Пожалуйста, заполните все поля.");
      }
    });
  }

  // Обработка формы регистрации
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const regEmail = document.getElementById("reg-email").value;
      const regPassword = document.getElementById("reg-password").value;

      if (regEmail && regPassword) {
        try {
          const response = await fetch("http://localhost:8081/user/register/", {
            method: "POST",
            credentials: "include", // Включает передачу куки для refresh token
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: regEmail,
              password: regPassword,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const accessToken = data.access_token;
            if (accessToken) {
              // Сохранение access token
              localStorage.setItem("accessToken", accessToken);
              // Сохранение email пользователя
              localStorage.setItem("userEmail", regEmail);
              // Обновление интерфейса
              updateAuthButtons();
              // Скрытие модального окна
              hideRegisterModal();
              // Очистка формы
              registerForm.reset();
            } else {
              alert("Ошибка при получении токена доступа.");
            }
          } else {
            const errorData = await response.json();
            alert(`Ошибка регистрации: ${errorData.error}`);
          }
        } catch (error) {
          console.error("Ошибка при отправке запроса на регистрацию:", error);
          alert("Произошла ошибка при попытке регистрации.");
        }
      } else {
        alert("Пожалуйста, заполните все поля.");
      }
    });
  }

  // Обновление состояния кнопок аутентификации и отображение "Мой аккаунт"
  function updateAuthButtons() {
    const accessToken = localStorage.getItem("accessToken");
    const isLoggedIn = accessToken !== null;

    if (isLoggedIn) {
      authBtn.textContent = "Выйти";
      document.getElementById("my-account-link").style.display = "block";
    } else {
      authBtn.textContent = "Войти";
      document.getElementById("my-account-link").style.display = "none";
    }
  }

  // Функция выхода из аккаунта
  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userEmail");
    // Дополнительно можно удалить refresh token, отправив запрос на logout, если предусмотрено сервером
    updateAuthButtons();
    alert("Вы успешно вышли из аккаунта.");
  }

  // Инициализация состояния кнопок аутентификации при загрузке страницы
  updateAuthButtons();
});
