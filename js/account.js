// account.js

document.addEventListener("DOMContentLoaded", async function () {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    // Если нет access token, перенаправляем на главную страницу или показываем сообщение
    showNotification("Пожалуйста, войдите в систему.", "error");
    window.location.href = "index.html";
    return;
  }

  // Функция для получения информации о пользователе
  async function getUserInfo() {
    try {
      const response = await fetch("http://localhost:8081/user/account/", {
        method: "GET",
        credentials: "include", // Включает передачу куки для refresh token
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Заполнение данных пользователя
        document.getElementById("user-email").value = data.email;
        document.getElementById("api-key").value = data.api_key;
      } else {
        const errorData = await response.json();
        if (
          errorData.error === "invalid or incorrect token" ||
          errorData.error === "invalid token"
        ) {
          // Пытаемся обновить токен
          const refreshSuccessful = await refreshToken();
          if (refreshSuccessful) {
            // Повторяем запрос информации о пользователе
            await getUserInfo();
          } else {
            // Перенаправляем пользователя на модальное окно авторизации и закрываем account.html
            localStorage.removeItem("accessToken");
            showNotification("Пожалуйста, выполните вход в систему.", "error");
            updateAuthButtons();
            showAuthModal();
            window.location.href = "index.html";
          }
        } else {
          showNotification(`Ошибка: ${errorData.error}`, "error");
        }
      }
    } catch (error) {
      console.error("Ошибка при получении информации о пользователе:", error);
      showNotification(
        "Произошла ошибка при получении информации о пользователе.",
        "error"
      );
    }
  }

  // Функция для обновления access token
  async function refreshToken() {
    try {
      const response = await fetch(
        "http://localhost:8081/user/login/refresh/",
        {
          method: "POST",
          credentials: "include", // Включает передачу куки с refresh token
        }
      );

      if (response.ok) {
        const data = await response.json();
        const newAccessToken = data.access_token;
        if (newAccessToken) {
          // Сохраняем новый access token
          localStorage.setItem("accessToken", newAccessToken);
          return true;
        } else {
          return false;
        }
      } else {
        const errorData = await response.json();
        showNotification(
          `Ошибка обновления токена: ${errorData.error}`,
          "error"
        );
        return false;
      }
    } catch (error) {
      console.error("Ошибка при обновлении токена:", error);
      return false;
    }
  }

  // Получаем информацию о пользователе
  await getUserInfo();

  // Копирование API ключа
  const copyApiKeyBtn = document.getElementById("copy-api-key-btn");
  copyApiKeyBtn.addEventListener("click", function () {
    const apiKeyInput = document.getElementById("api-key");
    apiKeyInput.select();
    apiKeyInput.setSelectionRange(0, 99999); // Для мобильных устройств

    try {
      document.execCommand("copy");
      showNotification("API ключ скопирован в буфер обмена.", "success");
    } catch (err) {
      console.error("Ошибка при копировании API ключа:", err);
      showNotification("Не удалось скопировать API ключ.", "error");
    }
  });

  // Обработка формы смены пароля
  const changePasswordForm = document.getElementById("change-password-form");
  changePasswordForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (newPassword !== confirmPassword) {
      showNotification("Новый пароль и подтверждение не совпадают.", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/user/changepass/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          old_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (response.ok) {
        showNotification("Пароль успешно изменен.", "success");
        changePasswordForm.reset();
      } else {
        const errorData = await response.json();
        if (
          errorData.error === "invalid or incorrect token" ||
          errorData.error === "invalid token"
        ) {
          // Пытаемся обновить токен
          const refreshSuccessful = await refreshToken();
          if (refreshSuccessful) {
            // Повторяем запрос
            changePasswordForm.dispatchEvent(new Event("submit"));
          } else {
            // Перенаправляем пользователя на модальное окно авторизации и закрываем account.html
            localStorage.removeItem("accessToken");
            showNotification("Пожалуйста, выполните вход в систему.", "error");
            updateAuthButtons();
            showAuthModal();
            window.location.href = "index.html";
          }
        } else {
          showNotification(`Ошибка смены пароля: ${errorData.error}`, "error");
        }
      }
    } catch (error) {
      console.error("Ошибка при смене пароля:", error);
      showNotification("Произошла ошибка при смене пароля.", "error");
    }
  });

  // Функция обновления кнопок аутентификации
  function updateAuthButtons() {
    const accessToken = localStorage.getItem("accessToken");
    const isLoggedIn = accessToken !== null;
    const authBtn = document.getElementById("auth-btn");

    if (isLoggedIn) {
      authBtn.textContent = "Выйти";
      document.getElementById("my-account-link").style.display = "block";
    } else {
      authBtn.textContent = "Войти";
      document.getElementById("my-account-link").style.display = "none";
    }
  }
});
